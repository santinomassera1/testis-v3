import { ISiuClient, SiuResult, Inasistencia, Nota, Materia, ComprobanteInscripcion } from './types';
import notasData from '@/data/siu/notas.json';
import inasistenciasData from '@/data/siu/inasistencias.json';
import materiasData from '@/data/siu/materias.json';

// Helper para simular latencia realista de red
const delayJitter = () => new Promise(r => setTimeout(r, 300 + Math.random() * 500));

// Helper para verificar correlativas (simplificado)
const tieneCorrelativa = (legajo: string, requiredMateria: string): boolean => {
  // En un sistema real, buscarías en el historial del alumno
  // Por ahora, simulamos que algunos legajos tienen ciertas materias aprobadas
  const materiasAprobadas: Record<string, string[]> = {
    '123456': ['ALG1', 'MAT1', 'PROG1', 'PROG2'],
    'default': ['ALG1', 'MAT1']
  };
  
  const aprobadas = materiasAprobadas[legajo] || materiasAprobadas['default'];
  return aprobadas.includes(requiredMateria);
};

export class SiuMockClient implements ISiuClient {
  async getInasistencias(legajo: string): Promise<SiuResult<Inasistencia[]>> {
    await delayJitter();
    
    // Simular error ocasional (5% de chance)
    if (Math.random() < 0.05) {
      return { 
        ok: false, 
        code: 'TIMEOUT', 
        message: 'El servicio de SIU está tardando demasiado.' 
      };
    }
    
    const data = (inasistenciasData as any)[legajo] || (inasistenciasData as any)['default'] || [];
    return { ok: true, data };
  }

  async getNotas(legajo: string): Promise<SiuResult<Nota[]>> {
    await delayJitter();
    
    // Simular error ocasional (5% de chance)
    if (Math.random() < 0.05) {
      return { 
        ok: false, 
        code: 'API_UNAVAILABLE', 
        message: 'No se pudo conectar con el sistema SIU Guaraní.' 
      };
    }
    
    const data = (notasData as any)[legajo] || (notasData as any)['default'] || [];
    return { ok: true, data };
  }

  async getMaterias(carrera: string): Promise<SiuResult<Materia[]>> {
    await delayJitter();
    
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
    await delayJitter();
    
    // Buscar la materia
    const todasMaterias = (materiasData as any)['sistemas'] || [];
    const materia = todasMaterias.find((m: Materia) => m.id === materiaId);
    
    if (!materia) {
      return { 
        ok: false, 
        code: 'MATERIA_NO_ENCONTRADA', 
        message: 'La materia solicitada no existe o no está disponible.' 
      };
    }
    
    // Verificar cupo
    if (materia.inscriptos >= materia.cupo) {
      return { 
        ok: false, 
        code: 'CUPO_AGOTADO', 
        message: `Sin cupos disponibles para ${materia.nombre} en turno ${turno}.` 
      };
    }
    
    // Verificar correlativas
    for (const correlativa of materia.correlativas) {
      if (!tieneCorrelativa(legajo, correlativa)) {
        return { 
          ok: false, 
          code: 'CORRELATIVA_PENDIENTE', 
          message: `Debés tener aprobada ${correlativa} antes de inscribirte a ${materia.nombre}.` 
        };
      }
    }
    
    // Simular conflicto de horario (20% de chance si es turno Mañana)
    if (turno === 'Mañana' && Math.random() < 0.2) {
      return { 
        ok: false, 
        code: 'CONFLICTO_HORARIO', 
        message: 'Esta materia se superpone con otra en tu horario actual.' 
      };
    }
    
    // Todo OK - generar comprobante
    const comprobante: ComprobanteInscripcion = {
      comprobanteId: `CMP-${Date.now()}-${legajo}`,
      materia: materia.nombre,
      turno: turno,
      fecha: new Date().toISOString().split('T')[0]
    };
    
    return { ok: true, data: comprobante };
  }
}

