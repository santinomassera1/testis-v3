/**
 * GET /api/analytics
 * Devuelve métricas de conversaciones para el dashboard institucional.
 * Protegido: solo accesible con sesión activa de NextAuth (admin).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary, getLogs } from '@/lib/db/logger';

export const runtime = 'nodejs';

// Endpoint abierto en modo prototipo — en producción proteger con NextAuth + rol admin
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const range = searchParams.get('range') ?? '7d'; // '1d' | '7d' | '30d' | 'all'

  let since: Date | undefined;
  const now = new Date();

  if (range === '1d') {
    since = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  } else if (range === '7d') {
    since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === '30d') {
    since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  // 'all' → since = undefined → trae todo

  const summary = getAnalyticsSummary(since);
  // Últimas 20 conversaciones para el feed en tiempo real
  const recentLogs = getLogs(since).slice(-20).reverse();

  return NextResponse.json({
    range,
    generatedAt: new Date().toISOString(),
    summary,
    recentLogs,
  });
}
