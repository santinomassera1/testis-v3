// app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { generateText, streamText } from 'ai';
import { z } from 'zod';
import { getSiuClient } from '@/lib/siu';
import { getModel } from '@/lib/llm/getModel';
import {
  searchExams,
  searchSchedules,
  searchCalendar,
  findCorrelativas,
  canEnroll,
  formatDate,
  getCitation,
  getAcademicData,
} from '@/lib/academic-data';
import { getAcademicHelpText } from '@/lib/skills/academicHelp';
import { sendEmail } from '@/lib/mail/sendEmail';

export const runtime = 'nodejs';
export const maxDuration = 8; // Optimizado para respuestas rápidas

/** 1) Schema del "plan" */
const Plan = z.object({
  intent: z.enum([
    'get_absences',
    'get_grades',
    'get_materias',
    'inscribir_materia',
    'help',
    'query_finales',
    'query_correlativas',
    'query_calendario',
    'query_horarios',
    'send_email',
    'other',
  ]),
  legajo: z.string().nullable().optional(),
  materiaId: z.string().nullable().optional(),
  turno: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  codigo: z.number().nullable().optional(),
  materia: z.string().nullable().optional(),
  sede: z.enum(['Centro', 'Pilar']).nullable().optional(),
  emailTo: z.string().nullable().optional(),
  emailSubject: z.string().nullable().optional(),
  emailBody: z.string().nullable().optional(),
});
type Plan = z.infer<typeof Plan>;

/** 2) Prompt del planificador (salida SOLO JSON minificado) */
const PLANNER_SYS = `Sos un planificador de acciones para un asistente universitario de la USAL.
Tu salida debe ser SOLO JSON MINIFICADO (sin texto extra) y seguir este schema:
Tu salida debe ser SOLO JSON MINIFICADO (sin texto extra) y seguir este schema:
{"intent":"...","legajo":string|null,"materiaId":string|null,"turno":string|null,"topic":string|null,"codigo":number|null,"materia":string|null,"sede":"Centro"|"Pilar"|null,"emailTo":string|null,"emailSubject":string|null,"emailBody":string|null}

IMPORTANTE: Analiza el CONTEXTO COMPLETO de la conversación. Si el usuario menciona información parcial (como sede o turno) en un seguimiento, combínala con la consulta anterior.

Intents disponibles:
- "get_absences": el usuario pide inasistencias/faltas/asistencia
- "get_grades": el usuario pide notas/calificaciones/resultados
- "get_materias": el usuario pide ver materias disponibles para inscribirse
- "inscribir_materia": el usuario quiere inscribirse a una materia (necesita materiaId y turno)
- "help": el usuario pide ayuda sobre cómo usar el SIU Guaraní o hacer trámites
- "query_finales": consulta sobre fechas de exámenes finales (nov/dic 2025, feb 2026)
- "query_correlativas": consulta sobre materias correlativas/requisitos
- "query_calendario": consulta sobre el calendario académico 2025
- "query_horarios": consulta sobre horarios de cursada
- "send_email": el usuario quiere enviar un correo electrónico
- "other": cualquier otra cosa (saludos, charla general, etc)

Parámetros:
- "legajo": si el usuario lo menciona, extraelo; si no, usa null
- "materiaId": código de materia (ej: "ALG2", "FIS1") para SIU
- "codigo": código numérico de materia (ej: 144, 152) para consultas académicas. Si el contexto menciona "Ingeniería en Informática" o "la carrera", usa null (no hay un código único)
- "materia": nombre de materia (ej: "Programación", "Álgebra") para búsquedas. Puede ser "Ingeniería en Informática" si pregunta por todas las materias de la carrera
- "turno": turno (ej: "Mañana", "Tarde", "Noche") si el usuario lo menciona
- "sede": sede ("Centro" o "Pilar") si el usuario lo menciona. Reconoce variantes: "cede", "sede", "campus"
- "topic": para intent "help", el tema sobre el que pide ayuda
- "emailTo": destinatario del email (ej: "profesor@usal.edu.ar"). Si no lo menciona, null.
- "emailSubject": asunto del email. Infiérelo si es necesario. Si el usuario no lo da, genera uno breve y claro.
- "emailBody": cuerpo del mensaje. CRÍTICO: Si el usuario pide "desarrollar" o da una idea general, REDACTA un mensaje completo y formal. 1) Intenta inferir el nombre del destinatario desde su email. 2) SIEMPRE firma como 'Santino Massera'. 3) Usa la FECHA ACTUAL provista en el prompt si es necesario.
- "attachments": array de objetos { filename, content, encoding } si hay archivos adjuntos disponibles en el contexto.

Ejemplos básicos:
- "¿Cuándo rindo 144 en Pilar turno Noche?" → {"intent":"query_finales","codigo":144,"sede":"Pilar","turno":"Noche"}
- "¿Qué fecha tiene Programación I en Centro?" → {"intent":"query_finales","materia":"Programación I","sede":"Centro"}
- "¿Qué correlativas tiene 147?" → {"intent":"query_correlativas","codigo":147}
- "los finales de ingeniería en informática" → {"intent":"query_finales","materia":"Ingeniería en Informática"}
- "las correlativas de la carrera ingeniería en informática" → {"intent":"query_correlativas","materia":"Ingeniería en Informática"}

Ejemplos con CONTEXTO (seguimientos):
- Conversación: "¿finales de ingeniería?" → Bot pide sede → Usuario: "soy de pilar"
  → {"intent":"query_finales","materia":"Ingeniería en Informática","sede":"Pilar"}
- Conversación: "fechas de 144" → Bot pide sede → Usuario: "centro"
  → {"intent":"query_finales","codigo":144,"sede":"Centro"}
- Conversación: "correlativas de programación" → Bot pide especificar → Usuario: "programación 1"
  → {"intent":"query_correlativas","materia":"Programación I"}

Si el mensaje actual es solo información complementaria (sede, turno, código) sin verbo de acción, INFIERE el intent del contexto anterior.`;

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.content;

    if (!userText) {
      return new Response(
        JSON.stringify({ error: 'No se recibió mensaje del usuario' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    // Construir contexto de conversación (últimos 10 mensajes para no saturar)
    const conversationContext = messages
      .slice(-10)
      .map((m: any) => `${m.role}: ${m.content}`)
      .join('\n');

    // Detectar adjuntos en 'data'
    const attachments = data?.attachments || [];
    const attachmentsContext = attachments.length > 0
      ? `\n[ARCHIVOS ADJUNTOS DISPONIBLES]: ${attachments.map((a: any) => a.filename).join(', ')}`
      : '';

    // Paso 1: PLAN (no stream) - AHORA CON CONTEXTO
    let plan: Plan = { intent: 'other', legajo: null };
    try {
      const planRes = await generateText({
        model: getModel(), // String del modelo - el AI SDK usa AI_GATEWAY_API_KEY automáticamente
        system: PLANNER_SYS,
        prompt: `Fecha actual: ${new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Historial de conversación reciente:
${conversationContext}
${attachmentsContext}

Mensaje actual del usuario: ${userText}

Analiza el contexto completo y genera el plan en JSON.`,
      });
      const parsed = JSON.parse(planRes.text.trim());
      plan = Plan.parse(parsed);
    } catch (err) {
      console.log('Plan parsing failed, using default "other":', err);
      // Si falla, seguimos con 'other'
    }

    // Paso 2: Resolver con SIU o datos académicos locales. Nunca throw.
    const siu = getSiuClient();
    let toolResult: any = null;

    try {
      // --- Intents de SIU (mock/disabled) ---
      if (plan.intent === 'get_absences') {
        toolResult = await withTimeout(
          () => siu.getInasistencias(plan.legajo ?? 'default'),
          3000
        );
      } else if (plan.intent === 'get_grades') {
        toolResult = await withTimeout(
          () => siu.getNotas(plan.legajo ?? 'default'),
          3000
        );
      } else if (plan.intent === 'get_materias') {
        toolResult = await withTimeout(
          () => siu.getMaterias('sistemas'),
          3000
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
            4000
          );
        }
      } else if (plan.intent === 'help') {
        const helpText = getAcademicHelpText(plan.topic ?? undefined);
        toolResult = {
          ok: true,
          type: 'help_request',
          topic: plan.topic ?? 'general',
          helpText,
        };
      }

      // --- Intents de datos académicos locales (JSON) ---
      else if (plan.intent === 'query_finales') {
        // Detectar si pregunta por toda la carrera
        const esCarreraCompleta = plan.materia && /ingeniería|informatica|carrera|todas|plan/i.test(plan.materia);

        let results;

        if (esCarreraCompleta) {
          // Si pregunta por la carrera, buscar SOLO por sede y turno (ignorar nombre de materia)
          if (!plan.sede || !plan.turno) {
            toolResult = {
              ok: false,
              type: 'finales',
              message: 'Para consultar los finales de la carrera completa, necesito que especifiques **sede** (Centro o Pilar) y **turno** (Mañana, Tarde o Noche).',
              citation: getCitation('finales'),
            };
          } else {
            // Buscar solo por sede y turno
            results = searchExams({
              sede: plan.sede,
              turno: (plan.turno as 'Mañana' | 'Tarde' | 'Noche' | '-' | undefined),
            });

            if (results.length === 0) {
              toolResult = {
                ok: false,
                type: 'finales',
                message: `No encontré fechas de finales para **${plan.sede}** turno **${plan.turno}**.`,
                citation: getCitation('finales'),
              };
            } else {
              // Formatear fechas legibles
              const formatted = results.map((r) => ({
                codigo: r.exam.codigo,
                materia: r.exam.materia,
                sede: r.exam.sede,
                turno: r.exam.turno,
                llamado_1: `${formatDate(r.exam.nov_dic_1)} (${r.exam.nov_dic_1})`,
                llamado_2: `${formatDate(r.exam.nov_dic_2)} (${r.exam.nov_dic_2})`,
                febrero_2026: `${formatDate(r.exam.feb_2026)} (${r.exam.feb_2026})`,
                correlativas: r.correlativa?.requisitos ?? [],
              }));

              toolResult = {
                ok: true,
                type: 'finales',
                count: results.length,
                data: formatted,
                sedeYTurno: `${plan.sede} - ${plan.turno}`,
                message: `Encontré ${results.length} finales para **Ingeniería en Informática** en sede **${plan.sede}**, turno **${plan.turno}**.`,
                citation: getCitation('finales'),
              };
            }
          }
        } else {
          // Búsqueda normal por materia específica
          results = searchExams({
            codigo: plan.codigo ?? undefined,
            materia: plan.materia ?? undefined,
            sede: plan.sede ?? undefined,
            turno: (plan.turno as 'Mañana' | 'Tarde' | 'Noche' | '-' | undefined) ?? undefined,
          });

          if (results.length === 0) {
            toolResult = {
              ok: false,
              type: 'finales',
              message: 'No encontré fechas para esos criterios. Probá con el **código** (ej: 144) o el **nombre exacto** de la materia (ej: "Análisis Matemático I").',
              citation: getCitation('finales'),
            };
          } else {
            // Formatear fechas legibles
            const formatted = results.map((r) => ({
              codigo: r.exam.codigo,
              materia: r.exam.materia,
              sede: r.exam.sede,
              turno: r.exam.turno,
              llamado_1: `${formatDate(r.exam.nov_dic_1)} (${r.exam.nov_dic_1})`,
              llamado_2: `${formatDate(r.exam.nov_dic_2)} (${r.exam.nov_dic_2})`,
              febrero_2026: `${formatDate(r.exam.feb_2026)} (${r.exam.feb_2026})`,
              correlativas: r.correlativa?.requisitos ?? [],
            }));

            toolResult = {
              ok: true,
              type: 'finales',
              count: results.length,
              data: formatted,
              citation: getCitation('finales'),
            };
          }
        }
      } else if (plan.intent === 'query_correlativas') {
        if (plan.codigo) {
          const corr = findCorrelativas(plan.codigo);
          if (!corr) {
            toolResult = {
              ok: false,
              type: 'correlativas',
              message: `No encontré correlativas para el código ${plan.codigo}.`,
              citation: getCitation('correlativas'),
            };
          } else {
            // Resolver nombres de las correlativas
            const todasCorrelativas = getAcademicData().correlativas;
            const requisitosConNombres = corr.requisitos.map(cod => {
              const materia = todasCorrelativas.find(c => c.codigo === cod);
              return materia ? { codigo: cod, nombre: materia.nombre } : { codigo: cod, nombre: 'Desconocida' };
            });

            toolResult = {
              ok: true,
              type: 'correlativas',
              codigo: corr.codigo,
              nombre: corr.nombre,
              requisitos: corr.requisitos,
              requisitosConNombres,
              citation: getCitation('correlativas'),
            };
          }
        } else if (plan.materia) {
          // Detectar si pregunta por toda la carrera
          const esCarreraCompleta = /ingeniería|informatica|carrera|todas|plan/i.test(plan.materia);

          if (esCarreraCompleta) {
            // Devolver resumen de correlativas de la carrera
            const todasCorrelativas = getAcademicData().correlativas;

            // Helper: resolver códigos a nombres
            const resolverNombres = (codigos: number[]) =>
              codigos.map(cod => {
                const materia = todasCorrelativas.find(c => c.codigo === cod);
                return materia ? { codigo: cod, nombre: materia.nombre } : { codigo: cod, nombre: '?' };
              });

            const resumen = {
              totalMaterias: todasCorrelativas.length,
              conRequisitos: todasCorrelativas.filter(c => c.requisitos.length > 0).length,
              sinRequisitos: todasCorrelativas.filter(c => c.requisitos.length === 0).length,
              ejemplos: todasCorrelativas
                .filter(c => c.requisitos.length > 0)
                .slice(0, 5)
                .map(c => ({
                  codigo: c.codigo,
                  nombre: c.nombre,
                  requisitos: c.requisitos,
                  requisitosConNombres: resolverNombres(c.requisitos),
                })),
            };
            toolResult = {
              ok: true,
              type: 'correlativas_resumen',
              resumen,
              message: 'Tengo todas las correlativas del Plan 11. Te muestro un resumen y ejemplos.',
              citation: getCitation('correlativas'),
            };
          } else {
            // Búsqueda por nombre específico
            const results = searchExams({ materia: plan.materia });
            if (results.length === 0) {
              toolResult = {
                ok: false,
                type: 'correlativas',
                message: `No encontré materias que coincidan con "${plan.materia}". Probá con el código numérico (ej: 144, 147) o el nombre completo de la materia.`,
                citation: getCitation('correlativas'),
              };
            } else {
              // Resolver nombres de las correlativas
              const todasCorrelativas = getAcademicData().correlativas;
              const formatted = results.map((r) => {
                const requisitosConNombres = (r.correlativa?.requisitos ?? []).map(cod => {
                  const materia = todasCorrelativas.find(c => c.codigo === cod);
                  return materia ? { codigo: cod, nombre: materia.nombre } : { codigo: cod, nombre: 'Desconocida' };
                });

                return {
                  codigo: r.exam.codigo,
                  materia: r.exam.materia,
                  requisitos: r.correlativa?.requisitos ?? [],
                  requisitosConNombres,
                };
              });

              toolResult = {
                ok: true,
                type: 'correlativas',
                count: results.length,
                data: formatted,
                citation: getCitation('correlativas'),
              };
            }
          }
        } else {
          toolResult = {
            ok: false,
            type: 'correlativas',
            message: 'Para consultar correlativas, indicame el **código** (ej: 144, 147) o el **nombre** de la materia (ej: "Programación I").',
            citation: getCitation('correlativas'),
          };
        }
      } else if (plan.intent === 'query_calendario') {
        const results = searchCalendar({
          eventText: plan.topic ?? undefined,
        });

        if (results.length === 0) {
          toolResult = {
            ok: false,
            type: 'calendario',
            message: 'No encontré eventos que coincidan con tu consulta.',
            citation: getCitation('calendario'),
          };
        } else {
          const formatted = results.map((ev) => {
            if (ev.fecha) {
              return {
                fecha: `${formatDate(ev.fecha)} (${ev.fecha})`,
                evento: ev.evento,
              };
            } else {
              return {
                fecha_inicio: `${formatDate(ev.fecha_inicio!)} (${ev.fecha_inicio})`,
                fecha_fin: `${formatDate(ev.fecha_fin!)} (${ev.fecha_fin})`,
                evento: ev.evento,
              };
            }
          });

          toolResult = {
            ok: true,
            type: 'calendario',
            count: results.length,
            data: formatted,
            citation: getCitation('calendario'),
          };
        }
      } else if (plan.intent === 'query_horarios') {
        const results = searchSchedules({
          codigo: plan.codigo ?? undefined,
          materia: plan.materia ?? undefined,
          turno: (plan.turno as 'Mañana' | 'Tarde' | 'Noche' | undefined) ?? undefined,
        });

        if (results.length === 0) {
          toolResult = {
            ok: false,
            type: 'horarios',
            message: 'No encontré horarios para esos criterios. Recordá que solo tenemos ejemplos disponibles.',
            citation: getCitation('horarios'),
          };
        } else {
          toolResult = {
            ok: true,
            type: 'horarios',
            count: results.length,
            data: results,
            citation: getCitation('horarios'),
          };
        }
      } else if (plan.intent === 'send_email') {
        if (!plan.emailTo || !plan.emailSubject || !plan.emailBody) {
          toolResult = {
            ok: false,
            type: 'send_email',
            message: 'Para enviar un correo necesito el **destinatario**, el **asunto** y el **mensaje**. Por favor, indicame esos datos.',
          };
        } else {
          const result = await sendEmail({
            to: plan.emailTo,
            subject: plan.emailSubject,
            text: plan.emailBody,
            html: plan.emailBody.replace(/\n/g, '<br>'),
            attachments: attachments.length > 0 ? attachments : undefined
          });

          if (result.success) {
            toolResult = {
              ok: true,
              type: 'send_email',
              message: `Correo enviado exitosamente a **${plan.emailTo}** con asunto "**${plan.emailSubject}**"${attachments.length > 0 ? ` y ${attachments.length} archivo(s) adjunto(s)` : ''}.`,
              details: result
            };
          } else {
            toolResult = {
              ok: false,
              type: 'send_email',
              message: 'Hubo un error al intentar enviar el correo. Verificá que la dirección sea correcta.',
              error: result.error
            };
          }
        }
      }
    } catch (err) {
      console.error('Error ejecutando acción:', err);
      toolResult = {
        ok: false,
        code: 'UNKNOWN_ERROR',
        message: 'Hubo un problema al procesar tu solicitud.',
      };
    }

    // Paso 3: Respuesta final STREAMEADA (optimizada para velocidad)
    const SYSTEM_RULES = `Sos Testis, asistente USAL. Sé breve pero completo, directo y claro.

FORMATO: Usá **negritas** para info clave, emojis ocasionales (✅❌📊⚠️📅🎓), bullets o listas numeradas.

CASOS ESPECIALES:
- Error: explica problema + sugerencia clara de qué hacer
- Éxito con datos: presenta de forma estructurada y legible
- Fechas: siempre mostrar formato legible + ISO entre paréntesis
- **Finales de toda la carrera**: Si toolResult tiene "count" > 20, menciona el total y muestra los primeros 5-8 ejemplos organizados por año, luego ofrece consultar por materia específica. Formato: "**[Código] Materia**: 1º llamado [fecha], 2º llamado [fecha], Febrero [fecha]"
- **Correlativas**: USA el campo "requisitosConNombres" si está disponible. Muestra el NOMBRE COMPLETO de cada materia correlativa, no solo el código. Ejemplo: "**Paradigmas de Programación:** Requiere **Introducción a la Programación (144)**"
- Correlativas de toda la carrera: menciona total, da ejemplos clave con nombres completos
- Múltiples resultados (3-10): muestra todos de forma compacta
- Muchos resultados (>10): muestra resumen + primeros ejemplos
- Saludo: "Hola! Soy Testis 👋 Puedo ayudarte con notas, inasistencias, inscripciones, fechas de finales, correlativas, calendario, horarios y **envío de correos con adjuntos**. ¿Qué necesitás?"
- Seguimientos: si el usuario da información parcial (como sede), úsala para completar su consulta anterior
- Citación: SIEMPRE incluir "📚 Origen: ..." al final si hay datos

IMPORTANTE:
- Si toolResult tiene "citation", mostralo al final con emoji 📚
- Si toolResult tiene "sedeYTurno", mencionalo al inicio de la respuesta
- Si toolResult tiene "message", inclúyelo en tu respuesta
- Si toolResult tiene "requisitosConNombres", úsalo en lugar de solo "requisitos" para mostrar nombres completos
- Si toolResult es "correlativas_resumen", explica que hay X materias en total y muestra ejemplos con nombres completos
- Si faltan filtros, pedí clarificación de forma amigable
- NUNCA inventes datos que no estén en toolResult
- Si el contexto muestra que es un seguimiento, reconocelo ("Perfecto, con esa info...")`;

    const safeTool = sanitize(toolResult ?? { ok: false, code: 'NO_DATA', message: 'Sin datos disponibles' });
    const safePlan = sanitize(plan);

    // Combinar system prompt con contexto interno (Gemini requiere system al principio solamente)
    const fullSystemPrompt = `${SYSTEM_RULES}

---
CONTEXTO INTERNO DE LA SOLICITUD:
Plan detectado: ${JSON.stringify(safePlan)}
Resultado de la acción: ${JSON.stringify(safeTool)}

Usa esta información para dar una respuesta natural y útil al estudiante.`;

    const final = streamText({
      model: getModel(), // String del modelo - el AI SDK usa AI_GATEWAY_API_KEY automáticamente
      system: fullSystemPrompt,
      prompt: userText,
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
