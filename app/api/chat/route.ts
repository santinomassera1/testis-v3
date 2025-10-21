// app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { generateText, streamText } from 'ai';
import { z } from 'zod';
import { getSiuClient } from '@/lib/siu';

export const runtime = 'edge';
export const maxDuration = 30; // Reducido para respuestas más rápidas

/** 1) Schema del "plan" */
const Plan = z.object({
  intent: z.enum(['get_absences', 'get_grades', 'get_materias', 'inscribir_materia', 'help', 'other']),
  legajo: z.string().nullable().optional(),
  materiaId: z.string().nullable().optional(),
  turno: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
});
type Plan = z.infer<typeof Plan>;

/** 2) Prompt del planificador (salida SOLO JSON minificado) */
const PLANNER_SYS = `Sos un planificador de acciones para un asistente universitario de la USAL.
Tu salida debe ser SOLO JSON MINIFICADO (sin texto extra) y seguir este schema:
{"intent":"get_absences|get_grades|get_materias|inscribir_materia|help|other","legajo":string|null,"materiaId":string|null,"turno":string|null,"topic":string|null}

Intents disponibles:
- "get_absences": el usuario pide inasistencias/faltas/asistencia
- "get_grades": el usuario pide notas/calificaciones/resultados
- "get_materias": el usuario pide ver materias disponibles para inscribirse
- "inscribir_materia": el usuario quiere inscribirse a una materia (necesita materiaId y turno)
- "help": el usuario pide ayuda sobre cómo usar el SIU Guaraní o hacer trámites
- "other": cualquier otra cosa (saludos, charla general, etc)

Parámetros:
- "legajo": si el usuario lo menciona, extraelo; si no, usa null
- "materiaId": código de materia (ej: "ALG2", "FIS1") si el usuario lo menciona
- "turno": turno de cursada (ej: "Mañana", "Tarde", "Noche") si el usuario lo menciona
- "topic": para intent "help", el tema sobre el que pide ayuda (ej: "inscripción", "notas", "exámenes")

Ejemplos:
- "¿Cuántas inasistencias tengo?" → {"intent":"get_absences","legajo":null}
- "Ver mis notas, legajo 12345" → {"intent":"get_grades","legajo":"12345"}
- "Quiero inscribirme a Álgebra II turno mañana" → {"intent":"inscribir_materia","materiaId":"ALG2","turno":"Mañana","legajo":null}
- "¿Cómo me inscribo a materias?" → {"intent":"help","topic":"inscripción"}
- "Hola" → {"intent":"other"}`;

export async function POST(req: NextRequest) {
  try {
    const { messages = [] } = await req.json();

    // Tomo último input de user como texto
    const lastUser = [...messages].reverse().find((m: any) => m?.role === 'user');
    const userText =
      typeof lastUser?.content === 'string'
        ? lastUser.content
        : Array.isArray(lastUser?.content)
          ? lastUser.content.map((p: any) => p?.text ?? '').join(' ')
          : '';

    if (!userText) {
      return new Response(
        JSON.stringify({ error: 'No se recibió mensaje del usuario' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    // Paso 1: PLAN (no stream)
    let plan: Plan = { intent: 'other', legajo: null };
    try {
      const planRes = await generateText({
        model: 'openai/gpt-5',
        system: PLANNER_SYS,
        prompt: userText,
      });
      const parsed = JSON.parse(planRes.text.trim());
      plan = Plan.parse(parsed);
    } catch (err) {
      console.log('Plan parsing failed, using default "other":', err);
      // Si falla, seguimos con 'other'
    }

    // Paso 2: Resolver con SIU (mock/disabled). Nunca throw.
    const siu = getSiuClient();
    let toolResult: any = null;

    try {
      if (plan.intent === 'get_absences') {
        toolResult = await withTimeout(
          () => siu.getInasistencias(plan.legajo ?? 'default'),
          8000
        );
      } else if (plan.intent === 'get_grades') {
        toolResult = await withTimeout(
          () => siu.getNotas(plan.legajo ?? 'default'),
          8000
        );
      } else if (plan.intent === 'get_materias') {
        toolResult = await withTimeout(
          () => siu.getMaterias('sistemas'),
          8000
        );
      } else if (plan.intent === 'inscribir_materia') {
        if (!plan.materiaId || !plan.turno) {
          toolResult = {
            ok: false,
            code: 'MISSING_PARAMS',
            message: 'Necesito el código de materia y el turno para inscribirte.',
          };
        } else {
          toolResult = await withTimeout(
            () => siu.inscribirMateria({
              legajo: plan.legajo ?? 'default',
              materiaId: plan.materiaId as string,
              turno: plan.turno as string,
            }),
            10000
          );
        }
      } else if (plan.intent === 'help') {
        // Para help, devolvemos un objeto simple que el LLM interpretará
        toolResult = {
          ok: true,
          type: 'help_request',
          topic: plan.topic ?? 'general',
        };
      }
    } catch (err) {
      console.error('Error ejecutando acción SIU:', err);
      toolResult = {
        ok: false,
        code: 'UNKNOWN_ERROR',
        message: 'Hubo un problema al procesar tu solicitud.',
      };
    }

    // Paso 3: Respuesta final STREAMEADA (texto) - Optimizada para velocidad
    const SYSTEM_RULES = `Eres Testis, un asistente virtual universitario para estudiantes de la Universidad del Salvador (USAL).

IMPORTANTE - Interpretación de resultados:

1. Si tool_result.ok === false:
   - API_UNAVAILABLE: "No tengo conexión con SIU ahora. Te guío paso a paso para hacerlo manualmente en el portal."
   - TIMEOUT: "El servicio está lento. ¿Querés que reintente o te explico cómo hacerlo directamente?"
   - CUPO_AGOTADO: Explica la situación y sugiere alternativas (otro turno, lista de espera)
   - CORRELATIVA_PENDIENTE: Muestra qué materias faltan y cómo consultarlo
   - CONFLICTO_HORARIO: Ayuda a resolver el choque de horarios
   - MISSING_PARAMS: Pide amablemente los datos que faltan
   - MOCK_ERROR / UNKNOWN_ERROR: "Estoy teniendo problemas técnicos. Te puedo guiar con los pasos manuales."

2. Si tool_result.ok === true:
   - Presenta los datos de forma clara y organizada
   - Si son inasistencias: menciona estado de regularidad (75% mínimo)
   - Si son notas: felicita por aprobados, da ánimo en desaprobados
   - Si es inscripción exitosa: confirma y da próximos pasos

3. Para intent "help":
   - Da guías paso a paso para usar el SIU Guaraní
   - Incluye consejos prácticos y advertencias importantes
   - Menciona que estás en modo demo si es relevante

4. Para intent "other":
   - Saluda amablemente
   - Explica brevemente qué puedes hacer
   - Invita a preguntar

Modo Demo:
- Actualmente estás en modo demo con datos simulados
- Los datos que muestres son ejemplos realistas pero no reales
- Si el estudiante pregunta, explica que estás en modo demostración

NUNCA inventes datos académicos. Si no hay datos, guía pasos manuales.
Sé breve, útil, amable y sin stacktraces técnicos.`;

    const safeTool = sanitize(toolResult ?? { ok: false, code: 'NO_DATA', message: 'Sin datos disponibles' });
    const safePlan = sanitize(plan);

    const final = streamText({
      model: 'openai/gpt-5',
      messages: [
        { role: 'system', content: SYSTEM_RULES },
        { role: 'user', content: userText },
        {
          role: 'system',
          content: `Contexto interno:
Plan detectado: ${JSON.stringify(safePlan)}
Resultado de la acción: ${JSON.stringify(safeTool)}

Usa esta información para dar una respuesta natural y útil al estudiante.`,
        },
      ],
      temperature: 0.7, // Balance entre creatividad y velocidad
    });

    return final.toTextStreamResponse(); // mantenemos text-stream
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return new Response(
      JSON.stringify({
        error: 'Error al procesar la solicitud',
        details: (error as Error).message,
      }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

/** Helpers */
function withTimeout<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, rej) =>
      setTimeout(() => rej(new Error('TIMEOUT')), ms)
    ),
  ]).catch((err) => {
    if (err.message === 'TIMEOUT') {
      return { ok: false, code: 'TIMEOUT', message: 'El servicio tardó demasiado.' } as any;
    }
    throw err;
  });
}

function sanitize<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}
