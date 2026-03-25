'use client';

import { useEffect, useState } from 'react';

// Mapeo de intent a nombre legible
const INTENT_LABELS: Record<string, string> = {
  query_finales: '📅 Fechas de finales',
  query_correlativas: '🔗 Correlativas',
  inscribir_materia: '📝 Inscripción a materias',
  other: '💬 Consulta general',
};

const ERROR_LABELS: Record<string, string> = {
  CORRELATIVA_PENDIENTE: 'Correlativa pendiente',
  CUPO_AGOTADO: 'Cupo agotado',
  MATERIA_NO_ENCONTRADA: 'Materia no encontrada',
  MISSING_PARAMS: 'Faltan parámetros',
  UNKNOWN: 'Sin datos / fuera de alcance',
};

interface Summary {
  total: number;
  todayCount: number;
  weekCount: number;
  successRate: number;
  avgResponseMs: number;
  topIntents: { intent: string; count: number }[];
  topErrors: { code: string; count: number }[];
  dailyBreakdown: { date: string; count: number }[];
}

interface RecentLog {
  id: string;
  timestamp: string;
  sessionId: string;
  intent: string;
  query: string;
  success: boolean;
  errorCode?: string;
  responseTimeMs: number;
  legajo?: string;
}

interface AnalyticsData {
  range: string;
  generatedAt: string;
  summary: Summary;
  recentLogs: RecentLog[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Cargar datos
  const fetchData = async (r: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?range=${r}`);
      if (!res.ok) {
        if (res.status === 401) {
          setError('No tenés permiso para ver este panel. Iniciá sesión.');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch (err) {
      setError('No se pudo cargar la información. Intentá recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range);
  }, [range]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => fetchData(range), 30_000);
    return () => clearInterval(interval);
  }, [range]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando métricas…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No se pudo cargar</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => fetchData(range)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const s = data?.summary;
  const maxIntentCount = s?.topIntents[0]?.count ?? 1;
  const maxDayCount = Math.max(...(s?.dailyBreakdown.map((d) => d.count) ?? [1]));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Testis · Panel Institucional</h1>
              <p className="text-xs text-gray-500">
                Última actualización: {lastRefresh.toLocaleTimeString('es-AR')} · Auto-refresh 30s
              </p>
            </div>
          </div>

          {/* Range selector */}
          <div className="flex items-center gap-2">
            {(['1d', '7d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  range === r
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r === '1d' ? 'Hoy' : r === '7d' ? '7 días' : r === '30d' ? '30 días' : 'Todo'}
              </button>
            ))}
            <button
              onClick={() => fetchData(range)}
              className="ml-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-600"
              title="Recargar"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Consultas totales"
            value={s?.total ?? 0}
            sub={range === 'all' ? 'histórico' : `últimos ${range}`}
            icon="💬"
            color="green"
          />
          <KpiCard
            label="Consultas hoy"
            value={s?.todayCount ?? 0}
            sub="desde medianoche"
            icon="📅"
            color="blue"
          />
          <KpiCard
            label="Tasa de éxito"
            value={`${s?.successRate ?? 0}%`}
            sub="resueltas correctamente"
            icon="✅"
            color={((s?.successRate ?? 0) >= 80) ? 'green' : 'yellow'}
          />
          <KpiCard
            label="Tiempo de respuesta"
            value={`${((s?.avgResponseMs ?? 0) / 1000).toFixed(1)}s`}
            sub="promedio por consulta"
            icon="⚡"
            color="purple"
          />
        </div>

        {/* Segunda fila: Intents + Tendencia diaria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top intents */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">📊 Temas más consultados</h2>
            {s?.topIntents.length === 0 ? (
              <EmptyState message="Aún no hay consultas registradas" />
            ) : (
              <div className="space-y-3">
                {s?.topIntents.map(({ intent, count }) => (
                  <div key={intent}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">
                        {INTENT_LABELS[intent] ?? intent}
                      </span>
                      <span className="text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((count / maxIntentCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tendencia diaria */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">📈 Consultas por día</h2>
            {(s?.dailyBreakdown.length ?? 0) === 0 ? (
              <EmptyState message="Sin datos suficientes para el período" />
            ) : (
              <div>
                {/* Área de barras — altura fija, etiquetas fuera */}
                <div className="flex items-end gap-1.5 h-28 mb-1">
                  {s?.dailyBreakdown.map(({ date, count }) => {
                    const heightPct = Math.max(8, Math.round((count / maxDayCount) * 100));
                    return (
                      <div
                        key={date}
                        className="flex-1 flex flex-col items-center justify-end gap-0.5"
                        title={`${date}: ${count} consulta${count !== 1 ? 's' : ''}`}
                      >
                        <span className="text-xs text-gray-500 leading-none">{count}</span>
                        <div
                          className="w-full bg-green-500 rounded-t-md transition-all duration-500 hover:bg-green-400 cursor-default"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* Etiquetas de fecha — separadas del gráfico, sin rotación */}
                <div className="flex gap-1.5 border-t border-gray-100 pt-1">
                  {s?.dailyBreakdown.map(({ date }) => {
                    const d = new Date(date + 'T12:00:00');
                    return (
                      <div key={date} className="flex-1 text-center">
                        <span className="text-xs text-gray-400 leading-none">
                          {d.getDate()}/{d.getMonth() + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Errores más frecuentes */}
        {(s?.topErrors.length ?? 0) > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">⚠️ Errores más frecuentes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {s?.topErrors.map(({ code, count }) => (
                <div key={code} className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">{count}</p>
                  <p className="text-xs text-gray-600 mt-1">{ERROR_LABELS[code] ?? code}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feed de conversaciones recientes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">🕐 Conversaciones recientes</h2>
            <span className="text-xs text-gray-400">Hacé click en una fila para ver el detalle</span>
          </div>
          {(data?.recentLogs.length ?? 0) === 0 ? (
            <EmptyState message="No hay conversaciones en este período" />
          ) : (
            <div className="space-y-2">
              {data?.recentLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <div
                    key={log.id}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      log.success ? 'border-green-100' : 'border-red-100'
                    } ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}
                  >
                    {/* Fila resumen — siempre visible, clickeable */}
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                        log.success ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      <span className="text-lg shrink-0">{log.success ? '✅' : '❌'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                            {INTENT_LABELS[log.intent] ?? log.intent}
                          </span>
                          {log.errorCode && (
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                              {ERROR_LABELS[log.errorCode] ?? log.errorCode}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 truncate">{log.query}</p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-gray-400">{log.responseTimeMs}ms</p>
                      </div>
                      <span className="text-gray-400 text-sm shrink-0">{isExpanded ? '▲' : '▼'}</span>
                    </button>

                    {/* Panel expandido — detalle completo */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-white px-4 py-4 space-y-3">
                        {/* Consulta completa */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Consulta del alumno
                          </p>
                          <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed">
                            {log.query}
                          </p>
                        </div>

                        {/* Metadata en grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <MetaCell label="Intent detectado" value={INTENT_LABELS[log.intent] ?? log.intent} />
                          <MetaCell label="Resultado" value={log.success ? '✅ Exitoso' : '❌ Con error'} />
                          <MetaCell label="Tiempo de respuesta" value={`${log.responseTimeMs}ms`} />
                          <MetaCell
                            label="Fecha y hora"
                            value={new Date(log.timestamp).toLocaleString('es-AR', {
                              day: '2-digit', month: '2-digit', year: '2-digit',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          />
                          {log.errorCode && (
                            <MetaCell label="Código de error" value={ERROR_LABELS[log.errorCode] ?? log.errorCode} highlight="red" />
                          )}
                          {log.legajo && (
                            <MetaCell label="Legajo" value={log.legajo} />
                          )}
                          <MetaCell label="Session ID" value={log.sessionId.slice(0, 20) + '…'} mono />
                        </div>

                        <p className="text-xs text-gray-400 italic">
                          💡 La respuesta del asistente no se almacena para proteger la privacidad. Solo se registra la consulta y el resultado.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer institucional */}
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            Panel de métricas · Testis Universidad ·{' '}
            <span className="font-medium">Datos anonimizados</span>
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {data?.summary.total ?? 0} consultas registradas ·{' '}
            Generado: {data ? new Date(data.generatedAt).toLocaleString('es-AR') : '—'}
          </p>
        </div>
      </main>
    </div>
  );
}

// --- Sub-componentes ---

function KpiCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
  color: 'green' | 'blue' | 'yellow' | 'purple';
}) {
  const colors = {
    green: 'bg-green-50 border-green-100',
    blue: 'bg-blue-50 border-blue-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    purple: 'bg-purple-50 border-purple-100',
  };
  const textColors = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    yellow: 'text-yellow-700',
    purple: 'text-purple-700',
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${textColors[color]}`}>{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-4xl mb-3">📭</p>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}

function MetaCell({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: 'red';
  mono?: boolean;
}) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p
        className={`text-xs font-medium truncate ${
          highlight === 'red' ? 'text-red-600' : 'text-gray-700'
        } ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
