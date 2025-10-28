// lib/academic-data/types.ts

/** Datos de finales por sede y turno */
export interface ExamDate {
  sede: 'Centro' | 'Pilar';
  turno: 'Mañana' | 'Tarde' | 'Noche' | '-';
  codigo: number;
  materia: string;
  nov_dic_1: string; // ISO date
  nov_dic_2: string; // ISO date
  feb_2026: string;  // ISO date
  correlativas: number[];
}

/** Correlativas del plan 11 */
export interface Correlativa {
  codigo: number;
  nombre: string;
  requisitos: number[]; // códigos de materias requeridas
}

/** Evento del calendario académico */
export interface CalendarEvent {
  fecha?: string; // ISO date para evento puntual
  fecha_inicio?: string; // ISO date para rango
  fecha_fin?: string; // ISO date para rango
  evento: string;
}

/** Horario ejemplo */
export interface Schedule {
  turno: 'Mañana' | 'Tarde' | 'Noche';
  anio: number;
  codigo: number;
  materia: string;
  dia: string;
  franja: string;
  docente: string;
}

/** Resultado de búsqueda de fechas de final */
export interface ExamSearchResult {
  exam: ExamDate;
  correlativa?: Correlativa;
}

/** Filtros para búsqueda de finales */
export interface ExamFilter {
  codigo?: number;
  materia?: string; // búsqueda parcial, case-insensitive
  sede?: 'Centro' | 'Pilar';
  turno?: 'Mañana' | 'Tarde' | 'Noche' | '-';
}

/** Filtros para búsqueda de horarios */
export interface ScheduleFilter {
  codigo?: number;
  materia?: string;
  turno?: 'Mañana' | 'Tarde' | 'Noche';
  dia?: string;
}

