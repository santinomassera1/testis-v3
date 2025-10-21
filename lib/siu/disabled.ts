import { ISiuClient, SiuResult, Inasistencia, Nota, Materia, ComprobanteInscripcion } from './types';

export class SiuDisabledClient implements ISiuClient {
  private err<T>(message: string = 'No hay conexión con SIU en este entorno.'): SiuResult<T> {
    return { 
      ok: false, 
      code: 'API_UNAVAILABLE', 
      message 
    };
  }

  async getInasistencias(_legajo: string): Promise<SiuResult<Inasistencia[]>> {
    return this.err('No se puede consultar inasistencias. El sistema SIU no está disponible en modo demo.');
  }

  async getNotas(_legajo: string): Promise<SiuResult<Nota[]>> {
    return this.err('No se puede consultar notas. El sistema SIU no está disponible en modo demo.');
  }

  async getMaterias(_carrera: string): Promise<SiuResult<Materia[]>> {
    return this.err('No se puede consultar materias. El sistema SIU no está disponible en modo demo.');
  }

  async inscribirMateria(_args: any): Promise<SiuResult<ComprobanteInscripcion>> {
    return this.err('No se puede realizar inscripciones. El sistema SIU no está disponible en modo demo.');
  }
}

