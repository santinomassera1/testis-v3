// lib/skills/academicHelp.ts

/**
 * Respuestas rápidas para consultas académicas comunes
 */

export function getAcademicHelpText(topic?: string): string {
  const normalized = (topic ?? '').toLowerCase();

  // Fechas de finales
  if (
    normalized.includes('final') ||
    normalized.includes('examen') ||
    normalized.includes('fecha')
  ) {
    return `📅 **Fechas de Finales 2025**

Para consultar fechas de finales, podés preguntarme:
- "¿Cuándo rindo [código o nombre] en [sede] [turno]?"
- "Fechas de finales de Programación I"
- "¿Cuándo es el final de 144 en Pilar Noche?"

**Sedes disponibles:** Centro, Pilar
**Turnos:** Mañana, Tarde, Noche
**Llamados:** Noviembre/Diciembre 2025 (2 llamados) + Febrero 2026

💡 Si no especificás sede o turno, te muestro todas las opciones.`;
  }

  // Correlativas
  if (
    normalized.includes('correlativa') ||
    normalized.includes('requisito') ||
    normalized.includes('necesit')
  ) {
    return `🎓 **Correlativas (Plan 11)**

Para consultar correlativas:
- "¿Qué correlativas tiene [código o nombre]?"
- "¿Puedo cursar 172?"
- "Requisitos de Programación Avanzada"

Te diré qué materias necesitás tener aprobadas para cursar.
Si preguntás si podés cursar algo, decime qué materias ya aprobaste.`;
  }

  // Calendario
  if (
    normalized.includes('calendario') ||
    normalized.includes('cuatrimestre') ||
    normalized.includes('inicio') ||
    normalized.includes('clases')
  ) {
    return `📆 **Calendario Académico 2025**

Eventos clave:
- Turno Febrero: 10/02 al 28/02
- Inicio de clases: 10/03
- Inicio 2º cuatrimestre: 28/07
- Turno Nov/Dic: 25/11 al 20/12

Preguntame: "¿Cuándo empieza el segundo cuatri?", "¿Cuándo es el turno de febrero?", etc.`;
  }

  // Horarios
  if (
    normalized.includes('horario') ||
    normalized.includes('cursada') ||
    normalized.includes('clase')
  ) {
    return `🕐 **Horarios de Cursada**

Para consultar horarios (ejemplos disponibles):
- "¿Qué horario tiene [código o nombre] en turno [Mañana/Tarde/Noche]?"
- "Horario de 144 en turno mañana"
- "¿Qué día curso Estructura de Datos?"

⚠️ Solo tengo ejemplos de horarios. Para info completa, consultá el SIU Guaraní.`;
  }

  // Ayuda general
  return `🎓 **Puedo ayudarte con:**

📅 **Fechas de finales** (nov/dic 2025, feb 2026)
   → "¿Cuándo rindo 144 en Pilar Noche?"

🔗 **Correlativas** (Plan 11)
   → "¿Qué correlativas tiene 147?"

📆 **Calendario académico 2025**
   → "¿Cuándo empieza el 2º cuatri?"

🕐 **Horarios de cursada** (ejemplos)
   → "Horario de 152 turno noche"

📊 **Notas, inasistencias e inscripciones** (SIU Guaraní - demo)
   → "Ver mis notas", "¿Cuántas faltas tengo?"

💡 Podés consultar por **código** (ej: 144) o **nombre** (ej: "Programación I")
📍 Especificá **sede** (Centro/Pilar) y **turno** (Mañana/Tarde/Noche) para resultados precisos.`;
}

