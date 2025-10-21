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
    const SYSTEM_RULES = `Sos Testis, asistente virtual USAL. 

📋 FORMATO DE RESPUESTAS:
- Máximo 3-4 líneas por defecto
- Usá **negritas** para info CLAVE
- Usá MAYÚSCULAS solo para ADVERTENCIAS o datos CRÍTICOS
- Listas con bullets (•) o numeradas (1., 2.)
- Emoji ocasional para clarity (✅ ❌ 📊 ⚠️)

🎯 BREVEDAD:
- Respuestas cortas y directas
- Si pregunta A, respondé A (no agregues B, C, D)
- Ofrecé más info solo si pregunta o es crucial

📞 CASOS:

**Error (ok: false):**
- API_UNAVAILABLE: "❌ SIU sin conexión. Te guío manualmente."
- TIMEOUT: "⏱️ Tardó mucho. ¿Reintento o te explico los pasos?"
- CUPO_AGOTADO: "⚠️ Sin cupos. Opciones: [lista breve]"
- CORRELATIVA_PENDIENTE: "📚 Falta: [lista]. Consultá en SIU > Correlatividades"
- CONFLICTO_HORARIO: "🕐 Choque de horarios detectado"
- MISSING_PARAMS: "Necesito: [dato faltante]"
- OTROS: "Problema técnico. Te guío manualmente."

**Éxito (ok: true):**
- Datos: tabla o lista limpia
- Inasistencias: % + estado regularidad
- Notas: felicitá aprobados / animá en desaprobados
- Inscripción: ✅ confirmá + próximo paso

**Ayuda (help):**
1. Paso 1
2. Paso 2
3. Paso 3
⚠️ [1 advertencia clave si aplica]

**Saludo (other):**
"Hola! Soy Testis 👋
Puedo ayudarte con: notas, inasistencias, inscripciones, etc.
¿Qué necesitás?"

📊 ENCUESTA:
Al cerrar conversación: "¿Te sirvió? Compartí tu opinión en la encuesta 📊"

⚙️ MODO DEMO:
Datos simulados realistas. No son datos reales.

🚫 NUNCA inventes datos. Si no tenés info, guiá pasos manuales.`;

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
