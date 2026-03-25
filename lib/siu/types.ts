// Tipos para la capa de abstracción SIU

export type SiuResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

export interface Inasistencia {
  materia: string;
  fecha: string;
  tipo: 'A' | 'J'; // Ausente o Justificada
}

export interface Nota {
  materia: string;
  instancia: 'Parcial' | 'Final' | 'TP';
  nota: number;
  fecha: string;
  estado: 'Aprobado' | 'Desaprobado' | 'Ausente';
}

export interface Materia {
  id: string;
  codigo?: number;
  nombre: string;
  anio?: number;
  turno: string;
  horario: string;
  cupo: number;
  inscriptos: number;
  correlativas: string[];
}

export interface MateriasData {
  sistemas: Materia[];
}

export interface ComprobanteInscripcion {
  comprobanteId: string;
  materia: string;
  turno: string;
  fecha: string;
}

export interface ISiuClient {
  getInasistencias(legajo: string): Promise<SiuResult<Inasistencia[]>>;
  getNotas(legajo: string): Promise<SiuResult<Nota[]>>;
  getMaterias(carrera: string): Promise<SiuResult<Materia[]>>;
  inscribirMateria(args: { 
    legajo: string; 
    materiaId: string; 
    turno: string 
  }): Promise<SiuResult<ComprobanteInscripcion>>;
}

