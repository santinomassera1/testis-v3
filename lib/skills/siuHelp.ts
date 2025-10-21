import { getSiuClient } from '@/lib/siu';

interface SiuHelpOptions {
  topic: string;
  action?: 'help' | 'inscribir' | 'consultar_materias';
  legajo?: string;
  materiaId?: string;
  turno?: string;
}

interface HelpResponse {
  ok: boolean;
  title?: string;
  steps?: string[];
  tips?: string[];
  warnings?: string[];
  relatedTopics?: string[];
  data?: any;
  code?: string;
  message?: string;
}

// Helper con timeout
function withTimeout<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('TIMEOUT')), ms)
    ),
  ]);
}

export async function siuHelp(options: SiuHelpOptions): Promise<HelpResponse> {
  const { topic, action = 'help', legajo, materiaId, turno } = options;
  
  // Acciones que requieren llamada al SIU
  if (action === 'inscribir' && legajo && materiaId && turno) {
    try {
      const siuClient = getSiuClient();
      const result = await withTimeout(
        () => siuClient.inscribirMateria({ legajo, materiaId, turno }),
        10000
      );
      
      if (!result.ok) {
        return {
          ok: false,
          code: result.code,
          message: result.message
        };
      }
      
      return {
        ok: true,
        title: 'Inscripción Exitosa',
        data: result.data,
        steps: [
          'Descarga tu comprobante de inscripción',
          'Verifica el horario de cursada',
          'Guarda el comprobante para futuras consultas'
        ]
      };
    } catch (error: any) {
      if (error.message === 'TIMEOUT') {
        return {
          ok: false,
          code: 'TIMEOUT',
          message: 'El sistema está tardando demasiado. Intenta nuevamente o realiza la inscripción manualmente.'
        };
      }
      
      return {
        ok: false,
        code: 'UNKNOWN_ERROR',
        message: 'Hubo un problema al procesar la inscripción. Intenta nuevamente.'
      };
    }
  }
  
  if (action === 'consultar_materias') {
    try {
      const siuClient = getSiuClient();
      const result = await withTimeout(
        () => siuClient.getMaterias('sistemas'),
        8000
      );
      
      if (!result.ok) {
        return {
          ok: false,
          code: result.code,
          message: result.message
        };
      }
      
      return {
        ok: true,
        data: result.data
      };
    } catch (error: any) {
      if (error.message === 'TIMEOUT') {
        return {
          ok: false,
          code: 'TIMEOUT',
          message: 'No se pudo obtener la lista de materias en este momento.'
        };
      }
      
      return {
        ok: false,
        code: 'UNKNOWN_ERROR',
        message: 'Error al consultar materias disponibles.'
      };
    }
  }
  
  // Ayuda contextual (no requiere llamadas a SIU)
  const lowerTopic = topic.toLowerCase();
  
  // Guías específicas para diferentes temas del SIU
  if (lowerTopic.includes('inscripción') || lowerTopic.includes('inscribir')) {
    return {
      ok: true,
      title: 'Guía de Inscripción a Materias',
      steps: [
        'Accede al portal de la USAL (www.usal.edu.ar)',
        'Haz clic en "SIU Guaraní" en el menú principal',
        'Inicia sesión con tu usuario y contraseña',
        'Selecciona "Inscripción a Cursadas"',
        'Elige el período académico correspondiente',
        'Revisa las materias disponibles y sus correlatividades',
        'Selecciona las materias que deseas cursar',
        'Verifica que cumples con los requisitos',
        'Confirma tu inscripción',
        'Descarga el comprobante de inscripción'
      ],
      tips: [
        'Verifica las fechas de inscripción en el calendario académico',
        'Revisa las correlatividades antes de inscribirte',
        'Guarda el comprobante de inscripción',
        'Si tienes dudas, consulta con tu coordinador de carrera'
      ],
      warnings: [
        'La inscripción tiene fechas límite estrictas',
        'No podrás inscribirte si no cumples las correlatividades',
        'Algunas materias tienen cupos limitados'
      ],
      relatedTopics: ['Correlatividades', 'Calendario Académico', 'Horarios']
    };
  }
  
  if (lowerTopic.includes('horario') || lowerTopic.includes('horarios')) {
    return {
      ok: true,
      title: 'Cómo Consultar Horarios',
      steps: [
        'Ingresa al SIU Guaraní',
        'Ve a la sección "Horarios" o "Cursadas"',
        'Selecciona el período académico',
        'Filtra por materia si es necesario',
        'Revisa los horarios, aulas y profesores',
        'Descarga el horario en PDF si lo necesitas'
      ],
      tips: [
        'Los horarios pueden cambiar, verifica regularmente',
        'Puedes sincronizar con tu calendario personal',
        'Algunas materias tienen horarios especiales o intensivos'
      ],
      relatedTopics: ['Inscripción', 'Aulas', 'Profesores']
    };
  }
  
  if (lowerTopic.includes('nota') || lowerTopic.includes('calificación')) {
    return {
      ok: true,
      title: 'Consulta de Notas y Calificaciones',
      steps: [
        'Accede al SIU Guaraní',
        'Ve a "Mis Notas" o "Calificaciones"',
        'Selecciona el período académico',
        'Revisa las notas por materia',
        'Verifica el estado de regularidad',
        'Descarga el boletín de calificaciones si es necesario'
      ],
      tips: [
        'Las notas se publican según el cronograma de cada materia',
        'Puedes ver el detalle de cada evaluación',
        'El estado de regularidad se actualiza automáticamente'
      ],
      relatedTopics: ['Parciales', 'Regularidad', 'Promedio']
    };
  }
  
  if (lowerTopic.includes('parcial') || lowerTopic.includes('examen')) {
    return {
      ok: true,
      title: 'Información sobre Exámenes',
      steps: [
        'Ve a la sección "Exámenes" en el SIU',
        'Selecciona el período académico',
        'Revisa las fechas y horarios',
        'Verifica el aula asignada',
        'Confirma el tipo de examen (parcial, final, recuperatorio)',
        'Prepara los materiales necesarios'
      ],
      tips: [
        'Llega 15 minutos antes del examen',
        'Trae DNI y comprobante de inscripción',
        'Revisa las condiciones de regularidad',
        'Algunos exámenes requieren inscripción previa'
      ],
      warnings: [
        'No se permiten consultas durante el examen',
        'El uso de dispositivos electrónicos está prohibido',
        'La ausencia sin justificación implica desaprobado'
      ],
      relatedTopics: ['Inscripción a Exámenes', 'Regularidad', 'Recuperatorios']
    };
  }
  
  if (lowerTopic.includes('certificado') || lowerTopic.includes('constancia')) {
    return {
      ok: true,
      title: 'Obtención de Certificados y Constancias',
      steps: [
        'Accede al SIU Guaraní',
        'Ve a "Certificados" o "Constancias"',
        'Selecciona el tipo de documento que necesitas',
        'Completa los datos requeridos',
        'Verifica la información',
        'Descarga el documento en PDF',
        'Imprime si es necesario'
      ],
      tips: [
        'Los certificados tienen validez oficial',
        'Puedes descargar múltiples copias',
        'Algunos certificados requieren firma digital',
        'Guarda una copia digital como respaldo'
      ],
      relatedTopics: ['Analítico', 'Constancia de Regularidad', 'Programa de Materias']
    };
  }
  
  if (lowerTopic.includes('error') || lowerTopic.includes('problema')) {
    return {
      ok: true,
      title: 'Solución de Problemas Comunes',
      steps: [
        'Identifica el tipo de error que estás viendo',
        'Verifica tu conexión a internet',
        'Limpia la caché del navegador',
        'Intenta con otro navegador',
        'Revisa que estés en el período correcto',
        'Contacta a soporte técnico si persiste'
      ],
      tips: [
        'Usa Chrome o Firefox para mejor compatibilidad',
        'Desactiva extensiones que puedan interferir',
        'Verifica que JavaScript esté habilitado',
        'Revisa la configuración de cookies'
      ],
      warnings: [
        'No compartas tus credenciales con terceros',
        'Cierra sesión cuando termines de usar el sistema',
        'Reporta cualquier comportamiento extraño'
      ],
      relatedTopics: ['Credenciales', 'Navegadores', 'Soporte Técnico']
    };
  }
  
  // Respuesta genérica
  return {
    ok: true,
    title: 'Ayuda General del SIU Guaraní',
    steps: [
      'Accede al portal de la USAL',
      'Inicia sesión en SIU Guaraní',
      'Navega por las diferentes secciones',
      'Consulta la documentación disponible',
      'Contacta a soporte si necesitas ayuda'
    ],
    tips: [
      'Mantén tus datos actualizados',
      'Revisa regularmente las notificaciones',
      'Guarda los comprobantes importantes',
      'No dudes en consultar con tu coordinador'
    ],
    relatedTopics: ['Inscripción', 'Horarios', 'Notas', 'Exámenes', 'Certificados']
  };
}
