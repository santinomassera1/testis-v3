// lib/academic-data/loader.ts
import type { ExamDate, Correlativa, CalendarEvent, Schedule } from './types';

// Importar JSON estáticos en memoria (Next.js soporta JSON imports)
import finalesData from '@/finales_2025.json';
import correlativasData from '@/plan_correlativas.json';
import calendarioData from '@/calendario_2025.json';
import horariosData from '@/horarios_2025_ejemplos.json';

/**
 * Store en memoria con los datos académicos.
 * Se carga una vez al inicio y se cachea.
 */
export class AcademicDataStore {
  private static instance: AcademicDataStore;
  
  public readonly exams: ExamDate[];
  public readonly correlativas: Correlativa[];
  public readonly calendar: CalendarEvent[];
  public readonly schedules: Schedule[];

  private constructor() {
    this.exams = finalesData as ExamDate[];
    this.correlativas = correlativasData as Correlativa[];
    this.calendar = calendarioData as CalendarEvent[];
    this.schedules = horariosData as Schedule[];
  }

  public static getInstance(): AcademicDataStore {
    if (!AcademicDataStore.instance) {
      AcademicDataStore.instance = new AcademicDataStore();
    }
    return AcademicDataStore.instance;
  }
}

/**
 * Obtener el store de datos académicos (singleton)
 */
export function getAcademicData(): AcademicDataStore {
  return AcademicDataStore.getInstance();
}

