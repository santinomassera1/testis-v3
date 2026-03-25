/**
 * logger.ts — Persistencia de conversaciones para métricas institucionales
 *
 * Usa un archivo JSON local para desarrollo y demos.
 * Diseñado para ser reemplazado por Neon/Postgres en producción:
 * solo cambiar las funciones `appendLog` y `getLogs` por queries SQL.
 */

import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'data', 'conversations.json');

export interface ConversationLog {
  id: string;
  timestamp: string;          // ISO 8601
  sessionId: string;
  intent: string;
  query: string;              // Primeros 200 chars del mensaje del usuario
  success: boolean;
  errorCode?: string;
  responseTimeMs: number;
  legajo?: string;            // Anónimo o "no informado"
}

// --- Lectura segura del archivo de logs ---
function readLogs(): ConversationLog[] {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    const raw = fs.readFileSync(LOG_FILE, 'utf-8');
    return JSON.parse(raw) as ConversationLog[];
  } catch {
    return [];
  }
}

// --- Escritura atómica al archivo ---
function writeLogs(logs: ConversationLog[]): void {
  try {
    // Conservar solo los últimos 2000 registros para no crecer indefinidamente
    const trimmed = logs.slice(-2000);
    fs.writeFileSync(LOG_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (err) {
    console.error('[logger] Error al escribir logs:', err);
  }
}

/**
 * Registra una interacción del chat.
 * Llamar al final de cada request (no bloquea el stream principal).
 */
export function appendLog(entry: Omit<ConversationLog, 'id' | 'timestamp'>): void {
  try {
    const logs = readLogs();
    const newEntry: ConversationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    logs.push(newEntry);
    writeLogs(logs);
  } catch (err) {
    console.error('[logger] Error al guardar log:', err);
  }
}

// --- Helpers de analytics (usados por /api/analytics) ---

export function getLogs(since?: Date): ConversationLog[] {
  const all = readLogs();
  if (!since) return all;
  return all.filter((l) => new Date(l.timestamp) >= since);
}

export function getAnalyticsSummary(since?: Date) {
  const logs = getLogs(since);
  const total = logs.length;
  if (total === 0) return emptyAnalytics();

  // Tasa de éxito
  const successful = logs.filter((l) => l.success).length;
  const successRate = Math.round((successful / total) * 100);

  // Intents más frecuentes
  const intentCounts: Record<string, number> = {};
  for (const l of logs) {
    intentCounts[l.intent] = (intentCounts[l.intent] || 0) + 1;
  }
  const topIntents = Object.entries(intentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([intent, count]) => ({ intent, count }));

  // Tiempo de respuesta promedio
  const avgResponseMs = Math.round(
    logs.reduce((acc, l) => acc + l.responseTimeMs, 0) / total
  );

  // Errores más frecuentes
  const errorCounts: Record<string, number> = {};
  for (const l of logs.filter((l) => !l.success && l.errorCode)) {
    const key = l.errorCode!;
    errorCounts[key] = (errorCounts[key] || 0) + 1;
  }
  const topErrors = Object.entries(errorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, count]) => ({ code, count }));

  // Consultas por día (últimos 7 días)
  const byDay: Record<string, number> = {};
  for (const l of logs) {
    const day = l.timestamp.slice(0, 10);
    byDay[day] = (byDay[day] || 0) + 1;
  }
  const dailyBreakdown = Object.entries(byDay)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([date, count]) => ({ date, count }));

  // Consultas de hoy
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = logs.filter((l) => l.timestamp.startsWith(today)).length;

  // Consultas esta semana (últimos 7 días)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekCount = logs.filter((l) => new Date(l.timestamp) >= weekAgo).length;

  return {
    total,
    todayCount,
    weekCount,
    successRate,
    avgResponseMs,
    topIntents,
    topErrors,
    dailyBreakdown,
  };
}

function emptyAnalytics() {
  return {
    total: 0,
    todayCount: 0,
    weekCount: 0,
    successRate: 0,
    avgResponseMs: 0,
    topIntents: [],
    topErrors: [],
    dailyBreakdown: [],
  };
}
