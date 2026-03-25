import { generateText, streamText } from 'ai';
import { z } from 'zod';
import { getSiuClient } from '@/lib/siu';
import { getModel } from '@/lib/llm/getModel';
import {
  searchExams,
  findCorrelativas,
  formatDate,
  getCitation,
  getAcademicData,
} from '@/lib/academic-data';
import { appendLog } from '@/lib/db/logger';
import materiasData from '@/data/siu/materias.json';
import type { Materia } from '@/lib/siu/types';

export const runtime = 'nodejs';
export const maxDuration = 10;

/** 1) Schema del plan — solo 3 intents core + other */
const Plan = z.object({
  intent: z.enum([
    'inscribir_materia',
    'query_finales',
    'query_correlativas',
    'other',
  ]),
  legajo: z.string().nullable().optional(),
  turno: z.string().nullable().optional(),
  codigo: z.number().nullable().optional(),
  materia: z.string().nullable().optional(),
  sede: z.enum(['Centro', 'Pilar']).nullable().optional(),
});
type Plan = z.infer<typeof Plan>;

const allMaterias: Materia[] = (materiasData as any)['sistemas'] || [];

/**
 * Resuelve nombre/código de materia a una entrada concreta de materias.json.
 * Retorna { materia, ambiguousTurnos } o null si no hay match.
 */
function resolveMateria(
  nombre?: string | null,
  codigo?: number | null,
  turno?: string | null
): { materia: Materia } | { ambiguousTurnos: string[]; nombre: string } | null {
  let matches: Materia[] = [];

  if (codigo) {
    matches = allMaterias.filter(m => m.codigo === codigo);
  }

  if (matches.length === 0 && nombre) {
    const q = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    matches = allMaterias.filter(m => {
      const n = m.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return n.includes(q) || q.includes(n);
    });
  }

  if (matches.length === 0) return null;

  if (turno) {
    const turnoNorm = turno.toLowerCase();
    const exact = matches.find(m => m.turno.toLowerCase() === turnoNorm);
    if (exact) return { materia: exact };
  }

  const uniqueNames = Array.from(new Set(matches.map(m => m.nombre)));
  if (uniqueNames.length === 1) {
    if (matches.length === 1) return { materia: matches[0] };
    const turnos = matches.map(m => m.turno);
    if (!turno) return { ambiguousTurnos: turnos, nombre: uniqueNames[0] };
    return { materia: matches[0] };
  }

  return { materia: matches[0] };
}

/** 2) Planner prompt — enfocado en los 3 flujos core */
const PLANNER_SYS = `Sos un planificador de acciones para un asistente universitario de la USAL (Ingeniería en Informática — Plan 11).
Tu salida debe ser SOLO JSON MINIFICADO (sin texto extra) siguiendo este schema:
{"intent":"...","legajo":string|null,"turno":string|null,"codigo":number|null,"materia":string|null,"sede":"Centro"|"Pilar"|null}

IMPORTANTE: Analiza el CONTEXTO COMPLETO de la conversación. Si el usuario menciona información parcial (como sede, turno o legajo) en un seguimiento, combínala con la consulta anterior.

Intents disponibles (SOLO estos 4):
- "query_finales": consulta sobre fechas de exámenes finales (nov/dic 2025, feb 2026)
- "query_correlativas": consulta sobre materias correlativas / requisitos / plan de estudios
- "inscribir_materia": el usuario quiere verificar si puede inscribirse a una materia, o directamente inscribirse
- "other": cualquier otra cosa (saludos, charla general, preguntas fuera de alcance)

Parámetros:
- "legajo": número o código de legajo del alumno. Extraelo si el usuario lo menciona (ej: "mi legajo es SEGUNDO", "soy 123456"). Si no lo dice, usa null
- "materia": nombre de la materia tal como lo dice el usuario (ej: "Estructura de Datos", "Programación I", "Álgebra"). Puede ser "Ingeniería en Informática" si pregunta por todas las materias de la carrera. NO necesitás saber el código interno — el backend resuelve el nombre
- "codigo": código numérico de materia (ej: 144, 152) SOLO si el usuario lo dice explícitamente. Si dice el nombre, dejá codigo en null y poné el nombre en "materia"
- "turno": turno (ej: "Mañana", "Tarde", "Noche") si el usuario lo menciona
- "sede": sede ("Centro" o "Pilar") si el usuario lo menciona

Ejemplos:
- "Quiero inscribirme a Estructura de Datos, turno Mañana. Mi legajo es SEGUNDO" → {"intent":"inscribir_materia","materia":"Estructura de Datos","turno":"Mañana","legajo":"SEGUNDO"}
- "¿Puedo cursar Paradigmas de Programación? Soy legajo SIN_MATERIAS" → {"intent":"inscribir_materia","materia":"Paradigmas de Programación","legajo":"SIN_MATERIAS"}
- "Inscribirme a Álgebra II turno Noche" → {"intent":"inscribir_materia","materia":"Álgebra II","turno":"Noche"}
- "¿Cuándo rindo 144 en Pilar turno Noche?" → {"intent":"query_finales","codigo":144,"sede":"Pilar","turno":"Noche"}
- "¿Qué correlativas tiene Paradigmas de Programación?" → {"intent":"query_correlativas","materia":"Paradigmas de Programación"}
- "¿Qué correlativas tiene 147?" → {"intent":"query_correlativas","codigo":147}
- "los finales de ingeniería en informática" → {"intent":"query_finales","materia":"Ingeniería en Informática"}
- "las correlativas de la carrera" → {"intent":"query_correlativas","materia":"Ingeniería en Informática"}
- "hola" → {"intent":"other"}

Ejemplos con CONTEXTO (seguimientos):
- Conversación: "Quiero inscribirme a Programación I" → Bot pregunta turno → Usuario: "mañana"
  → {"intent":"inscribir_materia","materia":"Programación I","turno":"Mañana"}
- Conversación: "¿finales de ingeniería?" → Bot pide sede → Usuario: "soy de pilar"
  → {"intent":"query_finales","materia":"Ingeniería en Informática","sede":"Pilar"}
- Conversación: "inscribirme a Bases de Datos" → Bot pregunta legajo → Usuario: "TERCERO"
  → {"intent":"inscribir_materia","materia":"Bases de Datos","legajo":"TERCERO"}

Si el mensaje actual es solo información complementaria (sede, turno, legajo) sin verbo de acción, INFIERE el intent del contexto anterior.`;

export async function POST(req: Request) {
  const startTime = Date.now();
  const sessionId = req.headers.get('x-session-id') ?? `sess-${Date.now()}`;

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.content;

    if (!userText) {
      return new Response(
        JSON.stringify({ error: 'No se recibió mensaje del usuario' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const conversationContext = messages
      .slice(-10)
      .map((m: any) => `${m.role}: ${m.content}`)
      .join('\n');

    // Paso 1: PLAN
    let plan: Plan = { intent: 'other', legajo: null };
    try {
      const planRes = await generateText({
        model: getModel(),
        system: PLANNER_SYS,
        prompt: `Fecha actual: ${new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Historial de conversación reciente:
${conversationContext}

Mensaje actual del usuario: ${userText}

Analiza el contexto completo y genera el plan en JSON.`,
      });
      const parsed = JSON.parse(planRes.text.trim());
      plan = Plan.parse(parsed);
    } catch (err) {
      console.log('Plan parsing failed, using default "other":', err);
    }

    // Paso 2: Ejecutar acción según intent
    const siu = getSiuClient();
    let toolResult: any = null;

    try {
      if (plan.intent === 'inscribir_materia') {
        if (!plan.materia && !plan.codigo) {
          toolResult = {
            ok: false,
            code: 'MISSING_PARAMS',
            message: '¿A qué materia querés inscribirte? Decime el nombre, por ejemplo: "Quiero inscribirme a Programación I, turno Mañana".',
          };
        } else {
          const resolved = resolveMateria(plan.materia, plan.codigo, plan.turno);

          if (!resolved) {
            toolResult = {
              ok: false,
              code: 'MATERIA_NO_ENCONTRADA',
              message: `No encontré una materia que coincida con "${plan.materia || plan.codigo}". Probá con el nombre completo, por ejemplo: "Estructura de Datos y Algoritmos" o "Programación I".`,
            };
          } else if ('ambiguousTurnos' in resolved) {
            toolResult = {
              ok: false,
              code: 'TURNO_REQUERIDO',
              message: `Encontré **${resolved.nombre}**. Está disponible en turno **${resolved.ambiguousTurnos.join('** y **')}**. ¿En cuál querés inscribirte?`,
            };
          } else {
            toolResult = await withTimeout(
              () => siu.inscribirMateria({
                legajo: plan.legajo ?? 'default',
                materiaId: resolved.materia.id,
                turno: resolved.materia.turno,
              }),
              4000
            );
          }
        }
      } else if (plan.intent === 'query_finales') {
        const esCarreraCompleta = plan.materia && /ingeniería|informatica|carrera|todas|plan/i.test(plan.materia);

        let results;

        if (esCarreraCompleta) {
          if (!plan.sede || !plan.turno) {
            toolResult = {
              ok: false,
              type: 'finales',
              message: 'Para consultar los finales de la carrera completa, necesito que especifiques **sede** (Centro o Pilar) y **turno** (Mañana, Tarde o Noche).',
              citation: getCitation('finales'),
            };
          } else {
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
          const esCarreraCompleta = /ingeniería|informatica|carrera|todas|plan/i.test(plan.materia);

          if (esCarreraCompleta) {
            const todasCorrelativas = getAcademicData().correlativas;

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
            const results = searchExams({ materia: plan.materia });
            if (results.length === 0) {
              toolResult = {
                ok: false,
                type: 'correlativas',
                message: `No encontré materias que coincidan con "${plan.materia}". Probá con el código numérico (ej: 144, 147) o el nombre completo de la materia.`,
                citation: getCitation('correlativas'),
              };
            } else {
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
      }
    } catch (err) {
      console.error('Error ejecutando acción:', err);
      toolResult = {
        ok: false,
        code: 'UNKNOWN_ERROR',
        message: 'Hubo un problema al procesar tu solicitud.',
      };
    }

    // Logging no bloqueante
    setImmediate(() => {
      appendLog({
        sessionId,
        intent: plan.intent,
        query: String(userText).slice(0, 200),
        success: toolResult?.ok !== false,
        errorCode: toolResult?.ok === false ? (toolResult.code ?? 'UNKNOWN') : undefined,
        responseTimeMs: Date.now() - startTime,
        legajo: plan.legajo ?? undefined,
      });
    });

    // Paso 3: Respuesta streameada
    const SYSTEM_RULES = `Sos Testis, el asistente académico de USAL para la carrera de Ingeniería en Informática (Plan 11).

CONTEXTO IMPORTANTE: Este es un prototipo funcional que opera con datos académicos reales del Plan 11 (correlativas, fechas de finales, materias). La verificación de inscripción usa perfiles de ejemplo para demostrar la lógica que se aplicaría con datos reales del SIU Guaraní. Siempre respondé con naturalidad — no hace falta aclarar esto en cada mensaje, solo si el usuario pregunta explícitamente.

TU ALCANCE (solo estos 3 flujos):
1. **Consulta de correlativas** — qué materias necesita aprobar para inscribirse a otra
2. **Verificación de inscripción** — si puede inscribirse a una materia según su historial
3. **Fechas de finales** — cuándo rinde una materia (nov/dic 2025, feb 2026)

FORMATO: Sé breve pero completo. Usá **negritas** para info clave, emojis puntuales (✅❌📅🔗📝), bullets o listas numeradas.

REGLAS DE RESPUESTA:
- Error: explica el problema + sugerencia clara de qué hacer
- Éxito con datos: presentá de forma estructurada y legible
- Fechas: siempre formato legible + ISO entre paréntesis
- **Finales**: Los datos corresponden al período **Nov/Dic 2025 — Febrero 2026** (dataset de demostración). Si el usuario pregunta por otros períodos, aclará que solo tenés ese rango cargado.
- **Finales de toda la carrera**: Si hay muchos resultados (>10), mencioná el total y mostrá los primeros 5-8 organizados por año. Formato: "**[Código] Materia**: 1º llamado [fecha], 2º llamado [fecha], Febrero [fecha]"
- **Correlativas**: Usá siempre el campo "requisitosConNombres" si está disponible. Mostrá NOMBRE COMPLETO de cada materia, no solo código.
- **Inscripción — TURNO_REQUERIDO**: La materia existe pero hay varios turnos. Preguntá cuál prefiere de forma natural.
- **Inscripción — CORRELATIVA_PENDIENTE**: Explicá qué materia falta: "Para inscribirte a [X] primero necesitás aprobar [Y]. ¿Querés que te cuente las correlativas de [Y]?"
- **Inscripción — CUPO_AGOTADO**: Si hay turno alternativo, mencionalo: "No hay cupos en [turno], pero [alternativa] tiene lugar."
- **Inscripción — éxito**: Confirmá con el comprobante.
- **Inscripción — MISSING_PARAMS**: Pedí la info que falta de forma conversacional, sin jerga técnica.
- Seguimientos: si el usuario da info parcial (sede, turno), úsala para completar la consulta anterior
- Citación: SIEMPRE incluir "📚 Origen: ..." al final si hay datos

SALUDO: "¡Hola! Soy Testis 👋 Puedo ayudarte con tres cosas:\n• 📅 **Fechas de finales** — ej: '¿Cuándo rindo Programación I?'\n• 🔗 **Correlativas** — ej: '¿Qué necesito para Bases de Datos?'\n• 📝 **Inscripción** — ej: '¿Puedo inscribirme a Álgebra II?'\n¿Qué necesitás?"

FUERA DE ALCANCE (intent "other" sin datos): No digas "no entendí". Decí: "Eso está fuera de lo que puedo hacer por ahora, pero puedo ayudarte con:\n• 📅 **Fechas de finales**\n• 🔗 **Correlativas y requisitos**\n• 📝 **Verificar inscripción a materias**\n¿Alguna de estas te sirve?"

IMPORTANTE:
- Si toolResult tiene "citation", mostralo al final con emoji 📚
- Si toolResult tiene "sedeYTurno", mencionalo al inicio
- Si toolResult tiene "requisitosConNombres", usalo para nombres completos
- NUNCA inventes datos que no estén en toolResult
- Si faltan filtros, pedí clarificación de forma amigable`;

    const safeTool = sanitize(toolResult ?? { ok: false, code: 'NO_DATA', message: 'Sin datos disponibles' });
    const safePlan = sanitize(plan);

    const fullSystemPrompt = `${SYSTEM_RULES}

---
CONTEXTO INTERNO DE LA SOLICITUD:
Plan detectado: ${JSON.stringify(safePlan)}
Resultado de la acción: ${JSON.stringify(safeTool)}

Usa esta información para dar una respuesta natural y útil al estudiante.`;

    const final = streamText({
      model: getModel(),
      system: fullSystemPrompt,
      prompt: userText,
      temperature: 0.7,
    });

    return final.toTextStreamResponse();
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
