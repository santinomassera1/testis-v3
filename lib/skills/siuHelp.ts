interface SiuHelpOptions {
  topic: string;
}

interface HelpResponse {
  title: string;
  steps: string[];
  tips?: string[];
  warnings?: string[];
  relatedTopics?: string[];
}

export async function siuHelp(options: SiuHelpOptions): Promise<HelpResponse> {
  const { topic } = options;
  const lowerTopic = topic.toLowerCase();
  
  // Guías específicas para diferentes temas del SIU
  if (lowerTopic.includes('inscripción') || lowerTopic.includes('inscribir')) {
    return {
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
