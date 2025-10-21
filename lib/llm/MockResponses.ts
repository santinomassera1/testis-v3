import { ToolCall } from './LLMProvider';

export interface ResponsePattern {
  pattern: RegExp;
  response: string;
  tools?: ToolCall[];
  priority: number;
  category?: string;
}

export const mockResponses: ResponsePattern[] = [
  {
    category: 'inscripciones',
    pattern: /(?:inscripcion|inscribir|inscribo|materia|como me inscribo)/i,
    priority: 10,
    response: `Para inscribirte en las materias del SIU Guaraní, sigue estos pasos:

1. **Accede al SIU Guaraní** desde el portal de la USAL
2. **Inicia sesión** con tu usuario y contraseña
3. Ve a la sección **"Inscripción a Cursadas"**
4. Selecciona el período académico correspondiente
5. Elige las materias que deseas cursar
6. Verifica las correlatividades (si las hay)
7. Confirma tu inscripción

¿Necesitas ayuda con algún paso específico? También puedo ayudarte a verificar tus correlatividades o generar un correo para consultar con Secretaría.`
  },
  {
    category: 'horarios',
    pattern: /(?:horario|horarios|cursada|clase|ver mis horarios)/i,
    priority: 9,
    response: `Para consultar tus horarios en el SIU Guaraní:

1. **Ingresa al SIU** con tus credenciales
2. Busca la sección **"Horarios"** o **"Cursadas"**
3. Selecciona el período académico
4. Verás el listado de materias con sus horarios y aulas

También puedes:
- Descargar el horario en PDF
- Sincronizar con tu calendario personal
- Ver los horarios de exámenes

¿Te gustaría que revise tus horarios actuales o necesitas ayuda con algo específico?`
  },
  {
    category: 'notas',
    pattern: /(?:nota|notas|calificacion|calificaciones|consultar mis calificaciones)/i,
    priority: 8,
    response: `Para consultar tus notas en el SIU Guaraní:

1. **Accede al SIU** y ve a **"Mis Notas"**
2. Selecciona el período académico
3. Verás el listado de materias con sus calificaciones

También puedes ver:
- Notas de parciales y trabajos prácticos
- Promedio por materia
- Estado de regularidad

¿Quieres que revise tus notas actuales? Puedo mostrarte un resumen de tu rendimiento académico.`,
    tools: [{
      name: 'readUserData',
      arguments: { dataType: 'grades' }
    }]
  },
  {
    category: 'examenes',
    pattern: /(?:parcial|parciales|examen|examenes|proximo|ver proximos examenes)/i,
    priority: 7,
    response: `Para consultar información sobre parciales:

1. **Ve a la sección "Exámenes"** en el SIU
2. Selecciona el período académico
3. Verás las fechas, horarios y aulas de tus exámenes

También puedes:
- Ver el cronograma completo de exámenes
- Consultar las condiciones de regularidad
- Acceder a las actas de examen

¿Necesitas ver tus próximos parciales o tienes alguna consulta específica sobre exámenes?`,
    tools: [{
      name: 'readUserData',
      arguments: { dataType: 'exams' }
    }]
  },
  {
    category: 'certificados',
    pattern: /(?:certificado|certificados|constancia|constancias|generar constancias y certificados)/i,
    priority: 6,
    response: `Para obtener certificados y constancias:

1. **Accede al SIU** y busca **"Certificados"**
2. Selecciona el tipo de certificado que necesitas:
   - Constancia de alumno regular
   - Certificado analítico
   - Constancia de materias aprobadas
3. Completa los datos requeridos
4. Descarga el documento en PDF

Los certificados suelen estar disponibles inmediatamente y son válidos con firma digital.

¿Qué tipo de certificado necesitas? Puedo ayudarte a generarlo.`
  },
  {
    category: 'comunicacion',
    pattern: /(?:correo|mail|email|docente|enviar|enviar mail a docentes)/i,
    priority: 5,
    response: `Puedo ayudarte a generar correos para contactar con:

- **Docentes de cátedra**: Para consultas sobre materias específicas
- **Secretaría Académica**: Para trámites administrativos
- **Coordinación de carrera**: Para asuntos de plan de estudios

Solo dime qué necesitas consultar y a quién te quieres dirigir, y generaré el correo con el asunto y contenido apropiados.

¿A quién necesitas escribir y sobre qué tema?`,
    tools: [{
      name: 'makeMailTo',
      arguments: {
        to: 'docente@usal.edu.ar',
        subject: 'Consulta académica',
        body: 'Estimado/a docente,\n\nLe escribo para consultar sobre...',
        type: 'mailto'
      }
    }]
  },
  {
    category: 'soporte',
    pattern: /(?:error|problema|no funciona)/i,
    priority: 4,
    response: `Si tienes problemas con el SIU Guaraní, aquí tienes algunas soluciones comunes:

**Sesión expirada:**
- Cierra el navegador completamente
- Borra las cookies del sitio
- Vuelve a ingresar con tus credenciales

**Ventana cerrada inesperadamente:**
- Verifica tu conexión a internet
- Intenta con otro navegador
- Desactiva extensiones que puedan interferir

**No puedo ver mis materias:**
- Verifica que estés en el período correcto
- Confirma que tu inscripción esté activa
- Contacta a Secretaría si persiste el problema

¿Qué error específico estás viendo? Puedo darte una solución más detallada.`,
    tools: [{
      name: 'siuHelp',
      arguments: { topic: 'error_troubleshooting' }
    }]
  },
  // Patrones adicionales que podrían ser útiles
  {
    category: 'asistencia',
    pattern: /(?:asistencia|faltas|presente|ausente)/i,
    priority: 3,
    response: `Para consultar tu asistencia:

1. **Ingresa al SIU** y busca **"Asistencia"**
2. Selecciona la materia
3. Verás el registro de presentes y ausentes

Recuerda que la asistencia mínima requerida es del 75% para mantener la regularidad.

¿Quieres que revise tu asistencia actual?`,
    tools: [{
      name: 'readUserData',
      arguments: { dataType: 'attendance' }
    }]
  },
  {
    category: 'ayuda',
    pattern: /(?:ayuda|help|como usar|tutorial)/i,
    priority: 2,
    response: `¡Te ayudo a usar el SIU Guaraní! 

Puedes preguntarme sobre:
- 📝 **Inscripciones**: "¿Cómo me inscribo a materias?"
- 📊 **Notas**: "Quiero ver mis notas"
- 📅 **Horarios**: "¿Cuáles son mis horarios?"
- 📋 **Exámenes**: "¿Cuándo son mis parciales?"
- 📄 **Certificados**: "Necesito una constancia"
- 📧 **Correos**: "Quiero escribir a un docente"
- ❗ **Problemas**: "El SIU no funciona"

Solo escribe tu consulta de forma natural y yo te guiaré paso a paso.`,
    tools: [{
      name: 'siuHelp',
      arguments: { topic: 'general_help' }
    }]
  }
];

export const defaultResponse = `¡Hola! Soy Testis, tu asistente para el SIU Guaraní de la USAL. 

Puedo ayudarte con:
- 📚 **Inscripciones** a materias
- 🕐 **Horarios** de cursada
- 📊 **Notas** y calificaciones
- 📝 **Parciales** y exámenes
- 📄 **Certificados** y constancias
- 📧 **Correos** a docentes y secretaría
- ❓ **Errores** comunes del SIU

¿En qué puedo ayudarte hoy?`;

// Configuraciones adicionales
export const streamingConfigs = {
  fast: { baseDelay: 15, variability: 25, wordsPerChunk: 2 },
  normal: { baseDelay: 30, variability: 50, wordsPerChunk: 1 },
  slow: { baseDelay: 60, variability: 100, wordsPerChunk: 1 }
} as const;
