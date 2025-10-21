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
    baseDelay: 5,
    variability: 10,
    wordsPerChunk: 4
  },
  normal: {
    baseDelay: 15,
    variability: 20,
    wordsPerChunk: 3
  },
  slow: {
    baseDelay: 40,
    variability: 60,
    wordsPerChunk: 2
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

📚 **Académico:**
- Consultar notas e inasistencias
- Inscripción a materias
- Horarios y exámenes
- Certificados y constancias

💰 **Pagos y Administración:**
- Ver estado de cuotas
- Descargar comprobantes de pago
- Info sobre métodos de pago y becas

📧 **Comunicación:**
- Buscar emails de profesores
- Contactos de secretaría
- Ayuda para redactar emails profesionales

🎓 **Guías SIU Guaraní:**
- Cómo usar el portal
- Paso a paso para trámites
- Solución de problemas comunes

¿En qué puedo ayudarte hoy?`,
    `Como asistente de la USAL, puedo ayudarte con:

**Consultas Rápidas:**
- "¿Cuánto debo de cuota?"
- "Ver mis notas"
- "Email de mi profesor de Álgebra"
- "Comprobante del último pago"
- "¿Cómo me inscribo a materias?"

**Redacción de Emails:**
- Justificar ausencias
- Consultar sobre notas
- Solicitar certificados

**Y mucho más!** Solo preguntame lo que necesites.`
  ],
  
  saludo: [
    `¡Hola! Soy Testis, tu asistente virtual de la Universidad del Salvador (USAL). Estoy acá para ayudarte con consultas académicas y del SIU Guaraní. ¿En qué puedo ayudarte hoy?`,
    `¡Buen día! ¿Cómo estás? Soy Testis y puedo ayudarte con tus consultas de la USAL. Preguntame lo que necesites.`,
    `¡Hola! ¿Cómo va? Estoy para ayudarte con lo que necesites sobre materias, notas, inscripciones o cualquier consulta académica de la USAL.`
  ],

  cuotas: [
    `📊 **Estado de Cuotas - USAL**

Tu resumen de cuotas para el período 2024-2:

✅ **Pagadas**: Octubre, Septiembre, Agosto
⏰ **Próximo vencimiento**: 10/11/2024
💰 **Monto**: $45.800

**Medios de pago disponibles:**
- Transferencia bancaria
- Mercado Pago
- Rapipago / Pago Fácil
- Tarjeta de crédito (hasta 3 cuotas)

¿Querés ver el comprobante de algún pago o necesitás ayuda con algo más?`,
    `Podés consultar el estado de tus cuotas en:

1. SIU Guaraní → Sección "Pagos"
2. Portal USAL → "Mi Estado de Cuenta"
3. App USAL (próximamente)

**Formas de pago:**
- Débito automático (10% descuento)
- Pago anticipado del cuatrimestre (15% descuento)
- Becas y planes de pago disponibles

¿Necesitás información sobre becas o planes de pago?`
  ],

  comprobantes: [
    `📄 **Comprobantes Disponibles**

Tenés los siguientes comprobantes:

**Pagos recientes:**
- ✅ Cuota Oct 2024 - $45.800 (Pagado 05/10/2024)
- ✅ Cuota Sep 2024 - $45.800 (Pagado 05/09/2024)
- ✅ Cuota Ago 2024 - $42.500 (Pagado 07/08/2024)

**Otros comprobantes:**
- 📋 Inscripción 2024-2
- 📋 Certificado de alumno regular
- 📋 Constancia de cuota al día

¿Querés que te envíe algún comprobante por email o lo descargamos en PDF?`,
    `Para descargar comprobantes de pago:

1. Entrá al SIU Guaraní
2. Sección "Pagos" → "Mis Comprobantes"
3. Seleccioná el período
4. Descargá en PDF

También podés solicitar comprobantes en la administración de tu sede si necesitás una versión firmada y sellada.`
  ],

  emails_profesores: [
    `📧 **Emails de Profesores**

Acá están los contactos de tus profesores actuales:

**Álgebra II**
- Prof. Dr. Juan Pérez
- Email: juan.perez@usal.edu.ar
- Horario de consulta: Martes 14-16hs

**Física I**
- Prof. Dra. María González
- Email: maria.gonzalez@usal.edu.ar
- Horario de consulta: Miércoles 10-12hs

**Programación I**
- Prof. Ing. Carlos Rodríguez
- Email: carlos.rodriguez@usal.edu.ar
- Horario de consulta: Jueves 16-18hs

¿Querés que te ayude a redactar un email a alguno de ellos?`,
    `Para encontrar el email de un profesor:

1. SIU Guaraní → "Mis Cursadas" → Ver detalle de materia
2. Portal USAL → Directorio de profesores
3. Preguntame directamente y te lo busco

También podés contactar a la secretaría académica:
📧 secretaria.sistemas@usal.edu.ar
📞 (011) 4813-1408`
  ],

  email_secretaria: [
    `📧 **Contactos de Secretaría Académica**

**Secretaría de Sistemas**
- Email: secretaria.sistemas@usal.edu.ar
- Teléfono: (011) 4813-1408
- Horario: Lunes a Viernes 9-17hs

**Otros contactos útiles:**
- 📋 Alumnos: alumnos@usal.edu.ar
- 💰 Administración: administracion@usal.edu.ar
- 📚 Biblioteca: biblioteca@usal.edu.ar
- 🎓 Títulos: titulos@usal.edu.ar

¿Necesitás ayuda para redactar un email a la secretaría?`,
    `La secretaría académica puede ayudarte con:

- Certificados y constancias
- Trámites administrativos
- Equivalencias y pases de universidad
- Consultas sobre planes de estudio
- Problemas con inscripciones

Horario de atención: Lunes a Viernes 9 a 17hs
Sede Pilar: (0230) 4498-5000
Sede Centro: (011) 4813-0400

¿Querés que te ayude con algún trámite específico?`
  ],

  redactar_email: [
    `📝 **Ayuda para Redactar Email**

Puedo ayudarte a escribir emails profesionales para:

- ✉️ Justificar una ausencia
- ✉️ Consultar sobre una nota o examen
- ✉️ Solicitar material de clase
- ✉️ Pedir una reunión de consulta
- ✉️ Solicitar certificados o trámites

Decime:
1. ¿A quién le querés escribir? (profesor, secretaría, etc.)
2. ¿Cuál es el motivo del email?
3. ¿Hay algún detalle específico que quieras incluir?

Y yo te genero un email profesional listo para enviar!`
  ]
};

export const defaultResponse = `Entiendo tu consulta. Puedo ayudarte con:

📚 **Académico:**
- Inscripción a materias
- Consulta de notas e inasistencias
- Horarios y exámenes

💰 **Administrativo:**
- Estado de cuotas y pagos
- Comprobantes de pago
- Certificados y constancias

📧 **Comunicación:**
- Emails de profesores y secretaría
- Redacción de emails profesionales

¿Podrías darme más detalles sobre lo que necesitás?`;

