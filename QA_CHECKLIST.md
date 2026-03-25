# QA Checklist - Integración de Datos Académicos

## ✅ Datos Cargados

- [x] `finales_2025.json` - 1443 entradas (Centro + Pilar con turnos)
- [x] `plan_correlativas.json` - 46 materias del Plan 11
- [x] `calendario_2025.json` - 5 eventos clave de 2025
- [x] `horarios_2025_ejemplos.json` - 12 ejemplos de horarios

## ✅ Capa de Datos (`/lib/academic-data/`)

- [x] `types.ts` - Definiciones de tipos TypeScript
- [x] `loader.ts` - Singleton que carga JSONs en memoria
- [x] `queries.ts` - Funciones de búsqueda y filtrado
- [x] `index.ts` - Exportaciones públicas

## ✅ Integración con Chatbot (`/app/api/chat/route.ts`)

- [x] Nuevos intents agregados:
  - `query_finales` - Búsqueda de fechas de finales
  - `query_correlativas` - Consulta de correlativas
  - `query_calendario` - Eventos del calendario
  - `query_horarios` - Horarios de cursada
- [x] Sistema de planificación actualizado con ejemplos
- [x] Lógica de ejecución implementada para cada intent
- [x] Citación de fuentes incluida en respuestas

## ✅ Helpers y Skills

- [x] `/lib/skills/academicHelp.ts` - Textos de ayuda contextual
- [x] Integración con intent `help`

## ✅ Funcionalidades Core

### Búsqueda por Código

```
Usuario: "¿Cuándo rindo 144 en Pilar turno Noche?"
Esperado: Fechas de 1º llamado (26/11/2025), 2º llamado (10/12/2025), Febrero (11/02/2026)
          + Correlativas: [] (sin requisitos)
          + Citación: "Origen: Finales 2025 (PDF interno USAL)"
```

### Búsqueda por Nombre

```
Usuario: "¿Qué fecha tiene Programación I en Centro?"
Esperado: Código 148, fechas por turno (Centro solo tiene turno "-")
          + Correlativas: [144]
          + Citación
```

### Filtros de Sede y Turno

```
Usuario: "Fechas de 152"
Esperado: Si hay múltiples resultados (Centro + Pilar + turnos), 
          pedir que especifique sede y turno
```

### Consulta de Correlativas

```
Usuario: "¿Qué correlativas tiene 147?"
Esperado: Nombre: "Paradigmas De Programación"
          Requisitos: [144]
          + Citación: "Origen: Plan de Estudios (Plan 11, PDF interno)"
```

### Validación de Requisitos

```
Usuario: "¿Puedo cursar 172 si no aprobé 156?"
Esperado: Indicar que 172 requiere [156, 162]
          Si no tiene 156 aprobado, no puede cursar
```

### Calendario Académico

```
Usuario: "¿Cuándo empieza el 2º cuatrimestre?"
Esperado: "28 de julio de 2025 (2025-07-28)"
          + Citación: "Origen: Calendario Académico 2025 (PDF interno USAL)"
```

### Horarios

```
Usuario: "¿Qué día y hora tengo 144 en turno mañana?"
Esperado: Miércoles, 08:00-12:00, Docente: F. Martinez
          + Citación: "Origen: Horarios 2025 - ejemplos (datos internos)"
          + Nota: "Solo tenemos ejemplos disponibles"
```

## ✅ Formato de Respuestas

- [x] Fechas en formato ISO + texto legible (ej: "26 de noviembre de 2025")
- [x] Uso de negritas para información clave
- [x] Emojis relevantes (📅🎓📆🕐)
- [x] Listas numeradas o bullets cuando corresponde
- [x] Citación de origen al final de cada respuesta con datos

## ✅ Manejo de Errores

- [x] Sin datos encontrados → mensaje claro + sugerencias
- [x] Falta de filtros → pedir especificar sede/turno
- [x] Nombre ambiguo → listar opciones o pedir código
- [x] Datos incompletos → indicar "solo ejemplos disponibles"

## ✅ Accesibilidad

- [x] Textos con tamaño legible (≥18-20px en UI según diseño)
- [x] Alto contraste en respuestas
- [x] Sin textos minúsculos ni disclaimers crípticos

## ✅ Normalización de Texto

- [x] Búsquedas case-insensitive
- [x] Normalización de tildes (á → a)
- [x] Trim de espacios extras

## ✅ Performance

- [x] Datos cargados en memoria (singleton)
- [x] Sin consultas a BD para datos académicos
- [x] Respuestas rápidas (<1s típicamente)

## ✅ Documentación

- [x] README.md actualizado con:
  - Descripción del proyecto
  - Listado de features
  - Estructura del proyecto
  - Cómo funciona el chatbot
  - Ejemplos de consultas
  - Guía de desarrollo

## 🧪 Tests Manuales Recomendados

### Test 1: Búsqueda Exacta
```
Input: "fechas de 144 pilar noche"
Expected: 3 llamados + correlativas vacías + citación
```

### Test 2: Búsqueda por Nombre
```
Input: "cuando rindo estructura de datos en centro"
Expected: Código 152, fechas (turno "-"), correlativas: [144]
```

### Test 3: Ambigüedad
```
Input: "fechas de 144"
Expected: Múltiples opciones (Centro + Pilar Mañana/Tarde/Noche)
          Pedir especificar sede y turno
```

### Test 4: Correlativas
```
Input: "correlativas de paradigmas de programacion"
Expected: Código 147, requisitos: [144]
```

### Test 5: Calendario
```
Input: "cuando es el turno de febrero"
Expected: "10 de febrero de 2025 al 28 de febrero de 2025"
```

### Test 6: Horarios
```
Input: "horario de introduccion a la programacion turno mañana"
Expected: Miércoles 08:00-12:00, F. Martinez
```

### Test 7: Ayuda Contextual
```
Input: "ayuda con finales"
Expected: Guía sobre cómo consultar fechas de finales
```

### Test 8: Saludo
```
Input: "hola"
Expected: Mensaje de bienvenida listando capacidades (incluyendo datos académicos)
```

## ⚠️ Limitaciones Conocidas

1. **Horarios**: Solo ejemplos disponibles (12 entradas), no exhaustivo
2. **Datos históricos**: Solo 2025, no hay datos de años anteriores
3. **SIU Guaraní**: Modo demo/mock, no conecta con el sistema real
4. **Validación de cursada**: No valida si el estudiante ya aprobó las correlativas reales

## 🎯 Próximos Pasos (Opcional)

- [ ] Agregar más ejemplos de horarios (2025 completo)
- [ ] Incluir datos de 2026
- [ ] Integración real con SIU Guaraní (si es posible)
- [ ] Validación de correlativas con datos del estudiante
- [ ] Exportar fechas de finales a .ics (iCal)
- [ ] Notificaciones de fechas próximas

---

**Fecha de QA**: 28 de octubre de 2025  
**Estado**: ✅ Completado  
**Versión**: v3.0 - Integración de Datos Académicos

