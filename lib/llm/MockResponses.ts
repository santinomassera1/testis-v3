/**
 * MockResponses - Respuestas simuladas para el MockProvider
 * Separado en su propio archivo para mejor organización y mantenibilidad
 */

export interface StreamingConfig {
  baseDelay: number;
  variability: number;
  wordsPerChunk: number;
}

export const streamingConfigs: Record<string, StreamingConfig> = {
  fast: {
    baseDelay: 10,
    variability: 15,
    wordsPerChunk: 3
  },
  normal: {
    baseDelay: 30,
    variability: 40,
    wordsPerChunk: 2
  },
  slow: {
    baseDelay: 60,
    variability: 80,
    wordsPerChunk: 1
  }
};

export const mockResponses: Record<string, string[]> = {
  inscripcion: [
    `Para inscribirte a materias en el SIU Guaraní de la USAL, seguí estos pasos:

1. Ingresá al portal de la USAL (www.usal.edu.ar)
2. Hacé clic en "SIU Guaraní" en el menú principal
3. Iniciá sesión con tu usuario y contraseña
4. Seleccioná "Inscripción a Cursadas"
5. Elegí el período académico correspondiente
6. Revisá las materias disponibles y sus correlatividades
7. Seleccioná las materias que deseas cursar
8. Confirmá tu inscripción

¿Necesitás ayuda con algún paso en particular?`,
    `La inscripción a materias tiene algunos requisitos importantes:

- Verificá que cumplas con las correlatividades
- Revisá que haya cupos disponibles
- Respetá las fechas del calendario académico
- Elegí turnos que no se superpongan en tu horario

¿Querés que revise tus materias disponibles o te ayude con las correlatividades?`
  ],
  
  notas: [
    `Para consultar tus notas en el SIU Guaraní:

1. Ingresá al sistema
2. Andá a la sección "Mis Notas" o "Calificaciones"
3. Seleccioná el período académico
4. Ahí vas a ver todas tus notas y el estado de regularidad

También puedo consultarlas por vos si querés. ¿Te las muestro?`,
    `Las notas se publican según el cronograma de cada materia. Podés ver:
- Notas de parciales
- Notas de trabajos prácticos
- Notas de finales
- Estado de regularidad de cada materia

¿Querés que consulte tus notas actuales?`
  ],
  
  inasistencias: [
    `Respecto a las inasistencias:

- Para mantener la regularidad necesitás al menos 75% de asistencia
- Las inasistencias justificadas cuentan como presentes si presentás certificado
- Podés consultar tu estado de asistencia en la sección "Cursadas"

¿Querés que revise tu estado de asistencia actual?`,
    `Las inasistencias se registran por materia. Si tenés muchas inasistencias:
- Podés justificarlas con certificado médico u otro documento válido
- Consultá con tu profesor sobre trabajos compensatorios
- Revisá el régimen de regularidad de tu facultad

¿Te consulto el detalle de inasistencias?`
  ],
  
  horarios: [
    `Para ver los horarios de cursada:

1. Entrá al SIU Guaraní
2. Andá a "Horarios" o "Cursadas"
3. Seleccioná el período académico
4. Vas a ver los días, horarios, aulas y profesores

¿Necesitás ayuda con alguna materia en particular?`,
    `Los horarios pueden consultarse también en:
- Cartelera de la facultad
- Página web de tu carrera
- Sistema SIU Guaraní

Recordá que los horarios pueden cambiar al inicio del cuatrimestre.`
  ],
  
  examenes: [
    `Para consultar fechas de exámenes:

1. Ingresá al SIU
2. Buscá la sección "Exámenes"
3. Ahí vas a ver fechas, horarios y aulas

Recordá:
- Algunos exámenes requieren inscripción previa
- Llevá DNI y comprobante de inscripción
- Llegá 15 minutos antes

¿Querés que consulte los próximos exámenes?`,
    `Hay diferentes tipos de exámenes:
- Parciales: durante la cursada
- Finales: al terminar la cursada
- Recuperatorios: si desaprobaste un parcial

Cada uno tiene requisitos diferentes de regularidad.`
  ],
  
  certificados: [
    `Podés obtener varios certificados desde el SIU:

- Certificado de alumno regular
- Constancia de inscripción
- Analítico académico
- Programas de materias
- Constancia de título en trámite

La mayoría los podés descargar directamente en PDF desde el sistema.`,
    `Para obtener certificados:

1. Entrá al SIU Guaraní
2. Andá a "Certificados" o "Constancias"
3. Elegí el tipo de documento
4. Descargalo en PDF

Algunos certificados pueden tener costo o requerir trámite presencial.`
  ],
  
  ayuda_general: [
    `Soy Testis, tu asistente virtual de la USAL. Puedo ayudarte con:

📚 Consultas sobre materias e inscripciones
📊 Ver tus notas y estado académico
📅 Información sobre horarios y exámenes
📧 Redactar emails a profesores
🎓 Guías para usar el SIU Guaraní

¿En qué puedo ayudarte hoy?`,
    `Como asistente de la USAL, puedo ayudarte con muchas consultas:

- Inscripción a materias
- Consulta de notas e inasistencias
- Información sobre exámenes
- Guías del SIU Guaraní
- Trámites académicos

Solo preguntame lo que necesites.`
  ],
  
  saludo: [
    `¡Hola! Soy Testis, tu asistente virtual de la Universidad del Salvador (USAL). Estoy acá para ayudarte con consultas académicas y del SIU Guaraní. ¿En qué puedo ayudarte hoy?`,
    `¡Buen día! ¿Cómo estás? Soy Testis y puedo ayudarte con tus consultas de la USAL. Preguntame lo que necesites.`,
    `¡Hola! ¿Cómo va? Estoy para ayudarte con lo que necesites sobre materias, notas, inscripciones o cualquier consulta académica de la USAL.`
  ]
};

export const defaultResponse = `Entiendo tu consulta. Puedo ayudarte con:

- Inscripción a materias
- Consulta de notas
- Información de horarios y exámenes
- Trámites en el SIU Guaraní
- Redacción de emails a profesores

¿Podrías darme más detalles sobre lo que necesitás?`;

