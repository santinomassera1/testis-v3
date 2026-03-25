import { ISiuClient, SiuResult, Inasistencia, Nota, Materia, ComprobanteInscripcion } from './types';
import notasData from '@/data/siu/notas.json';
import inasistenciasData from '@/data/siu/inasistencias.json';
import materiasData from '@/data/siu/materias.json';

// Latencia fija y predecible para demos (sin jitter aleatorio)
const delay = () => new Promise(r => setTimeout(r, 400));

// Helper para verificar correlativas
// Los IDs de correlativas coinciden con los códigos del Plan 11 (e.g., "144", "146", "152")
const tieneCorrelativa = (legajo: string, requiredMateria: string): boolean => {
  // Perfiles de alumnos tipo para demo realista
  const materiasAprobadas: Record<string, string[]> = {
    // Alumno de 1° año — sin nada aprobado
    'SIN_MATERIAS': [],

    // Alumno de 2° año — aprobó todo 1° año
    'SEGUNDO': ['144', '146', '142', '150', '145', '153', '149', '168'],

    // Alumno de 3° año — aprobó 1° y 2° año
    'TERCERO': [
      '144', '146', '142', '150', '145', '153', '149', '168',
      '148', '152', '154', '158', '147', '160', '151'
    ],

    // Alumno avanzado (4°/5° año) — aprobó hasta 3° año
    'AVANZADO': [
      '144', '146', '142', '150', '145', '153', '149', '168',
      '148', '152', '154', '158', '147', '160', '151',
      '161', '163', '162', '166', '164', '155', '169'
    ],

    // Alumno con deuda — aprobó algunas de 1° pero no todas
    'CON_DEUDA': ['144', '142', '149'],

    // Legajo de demo original (mantener compatibilidad)
    '123456': [
      '144', '146', '142', '150', '145', '153',
      '148', '152', '154', '158', '147'
    ],

    // Legajo default — alumno de 1° año con pocas materias
    'default': ['144', '146']
  };

  const aprobadas = materiasAprobadas[legajo] || materiasAprobadas['default'];
  return aprobadas.includes(requiredMateria);
};

export class SiuMockClient implements ISiuClient {
  async getInasistencias(legajo: string): Promise<SiuResult<Inasistencia[]>> {
    await delay();
    const data = (inasistenciasData as any)[legajo] || (inasistenciasData as any)['default'] || [];
    return { ok: true, data };
  }

  async getNotas(legajo: string): Promise<SiuResult<Nota[]>> {
    await delay();
    const data = (notasData as any)[legajo] || (notasData as any)['default'] || [];
    return { ok: true, data };
  }

  async getMaterias(carrera: string): Promise<SiuResult<Materia[]>> {
    await delay();
    const data = (materiasData as any)[carrera] || (materiasData as any)['sistemas'] || [];
    return { ok: true, data };
  }

  async inscribirMateria({
    legajo,
    materiaId,
    turno
  }: {
    legajo: string;
    materiaId: string;
    turno: string
  }): Promise<SiuResult<ComprobanteInscripcion>> {
    await delay();

    const todasMaterias: Materia[] = (materiasData as any)['sistemas'] || [];

    // Buscar la materia por id exacto o por código + turno aproximado
    let materia = todasMaterias.find((m) => m.id === materiaId);

    // Si no la encuentra por ID exacto, intenta por código numérico o nombre parcial
    if (!materia) {
      const codigoNum = parseInt(materiaId);
      if (!isNaN(codigoNum)) {
        materia = todasMaterias.find((m) => m.codigo === codigoNum);
      }
    }

    if (!materia) {
      return {
        ok: false,
        code: 'MATERIA_NO_ENCONTRADA',
        message: 'La materia solicitada no existe o no está disponible para inscripción.'
      };
    }

    // Verificar cupo
    if (materia.inscriptos >= materia.cupo) {
      // Buscar turno alternativo del mismo código que tenga cupo
      const alternativa = todasMaterias.find(
        (m) => m.codigo === materia!.codigo && m.id !== materia!.id && m.inscriptos < m.cupo
      );
      return {
        ok: false,
        code: 'CUPO_AGOTADO',
        message: `Sin cupos disponibles para **${materia.nombre}** en turno ${materia.turno}.${
          alternativa
            ? ` Hay cupos disponibles en el turno **${alternativa.turno}** (${alternativa.inscriptos}/${alternativa.cupo} inscriptos).`
            : ' No hay turnos alternativos con cupo disponible.'
        }`
      };
    }

    // Verificar correlativas con nombre descriptivo
    const nombrePorId: Record<string, string> = {};
    todasMaterias.forEach((m) => { nombrePorId[m.id] = m.nombre; });

    for (const correlativaId of materia.correlativas) {
      if (!tieneCorrelativa(legajo, correlativaId)) {
        const nombreCorrelativa = nombrePorId[correlativaId] || `materia ${correlativaId}`;
        return {
          ok: false,
          code: 'CORRELATIVA_PENDIENTE',
          message: `Para inscribirte a **${materia.nombre}** necesitás tener aprobada **${nombreCorrelativa}** (código ${correlativaId}). Verificá tu historial académico en el SIU Guaraní.`
        };
      }
    }

    // Todo OK — generar comprobante
    const comprobante: ComprobanteInscripcion = {
      comprobanteId: `CMP-${Date.now()}-${legajo}`,
      materia: materia.nombre,
      turno: materia.turno,
      fecha: new Date().toISOString().split('T')[0]
    };

    return { ok: true, data: comprobante };
  }
}

