// lib/academic-data/queries.ts
import { getAcademicData } from './loader';
import type {
  ExamDate,
  Correlativa,
  CalendarEvent,
  Schedule,
  ExamFilter,
  ScheduleFilter,
  ExamSearchResult,
} from './types';

/**
 * Normaliza texto para búsqueda (minúsculas, sin tildes, sin espacios extras)
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Busca fechas de finales con filtros opcionales.
 * Si no hay filtros, devuelve todo.
 */
export function searchExams(filter: ExamFilter = {}): ExamSearchResult[] {
  const data = getAcademicData();
  let results = data.exams;

  // Filtrar por código
  if (filter.codigo !== undefined) {
    results = results.filter((e) => e.codigo === filter.codigo);
  }

  // Filtrar por nombre de materia (parcial, case-insensitive)
  if (filter.materia) {
    const search = normalize(filter.materia);
    results = results.filter((e) => normalize(e.materia).includes(search));
  }

  // Filtrar por sede
  if (filter.sede) {
    results = results.filter((e) => e.sede === filter.sede);
  }

  // Filtrar por turno
  if (filter.turno) {
    results = results.filter((e) => e.turno === filter.turno);
  }

  // Adjuntar información de correlativas si existe
  return results.map((exam) => {
    const correlativa = data.correlativas.find((c) => c.codigo === exam.codigo);
    return { exam, correlativa };
  });
}

/**
 * Busca correlativas por código de materia.
 */
export function findCorrelativas(codigo: number): Correlativa | undefined {
  const data = getAcademicData();
  return data.correlativas.find((c) => c.codigo === codigo);
}

/**
 * Busca correlativas por nombre de materia (parcial, case-insensitive).
 */
export function findCorrelativasByName(materia: string): Correlativa[] {
  const data = getAcademicData();
  const search = normalize(materia);
  return data.correlativas.filter((c) => normalize(c.nombre).includes(search));
}

/**
 * Verifica si un estudiante puede cursar una materia dada una lista de materias aprobadas.
 */
export function canEnroll(
  codigo: number,
  approvedCodes: number[]
): { canEnroll: boolean; missing: number[] } {
  const corr = findCorrelativas(codigo);
  if (!corr || corr.requisitos.length === 0) {
    return { canEnroll: true, missing: [] };
  }

  const missing = corr.requisitos.filter((req) => !approvedCodes.includes(req));
  return {
    canEnroll: missing.length === 0,
    missing,
  };
}

/**
 * Busca eventos del calendario académico.
 * Opcionalmente filtra por rango de fechas o texto del evento.
 */
export function searchCalendar(query?: {
  date?: string; // ISO date
  eventText?: string;
}): CalendarEvent[] {
  const data = getAcademicData();
  let results = data.calendar;

  if (query?.eventText) {
    const search = normalize(query.eventText);
    results = results.filter((e) => normalize(e.evento).includes(search));
  }

  if (query?.date) {
    const targetDate = new Date(query.date);
    results = results.filter((e) => {
      if (e.fecha) {
        return e.fecha === query.date;
      }
      if (e.fecha_inicio && e.fecha_fin) {
        const start = new Date(e.fecha_inicio);
        const end = new Date(e.fecha_fin);
        return targetDate >= start && targetDate <= end;
      }
      return false;
    });
  }

  return results;
}

/**
 * Busca horarios con filtros opcionales.
 */
export function searchSchedules(filter: ScheduleFilter = {}): Schedule[] {
  const data = getAcademicData();
  let results = data.schedules;

  if (filter.codigo !== undefined) {
    results = results.filter((s) => s.codigo === filter.codigo);
  }

  if (filter.materia) {
    const search = normalize(filter.materia);
    results = results.filter((s) => normalize(s.materia).includes(search));
  }

  if (filter.turno) {
    results = results.filter((s) => s.turno === filter.turno);
  }

  if (filter.dia) {
    const search = normalize(filter.dia);
    results = results.filter((s) => normalize(s.dia).includes(search));
  }

  return results;
}

/**
 * Formatea una fecha ISO a formato legible.
 * Ejemplo: "2025-11-26" → "26 de noviembre de 2025"
 */
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} de ${month} de ${year}`;
  } catch {
    return isoDate;
  }
}

/**
 * Genera un string con el origen de los datos (para citar en respuestas).
 */
export function getCitation(type: 'finales' | 'correlativas' | 'calendario' | 'horarios'): string {
  const citations = {
    finales: 'Origen: Finales Nov/Dic 2025 — Feb 2026 (datos demo, fuente: PDF interno USAL)',
    correlativas: 'Origen: Plan de Estudios — Plan 11, Ingeniería en Informática (fuente: PDF interno USAL)',
    calendario: 'Origen: Calendario Académico 2025 (PDF interno USAL)',
    horarios: 'Origen: Horarios 2025 - ejemplos (datos internos)',
  };
  return citations[type];
}

