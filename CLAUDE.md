# Testis — Memoria del Proyecto

## ¿Qué es este proyecto?

**Testis** es un asistente académico inteligente para universidades argentinas.
Resuelve consultas repetitivas que hoy saturan la secretaría: correlativas, inscripciones y fechas de finales.

Actualmente es un MVP enfocado conectado a **USAL — Ingeniería Informática (Plan 11)**.
El objetivo inmediato es demostrarlo con datos reales en reuniones con universidades y gente vinculada a SIU.

**Stack:** Next.js 14 (App Router), TypeScript, Vercel AI SDK, Gemini 2.5 Flash, Tailwind CSS, Framer Motion

---

## Foco del MVP — 3 flujos core

### 1. Consulta de correlativas
- Usuario pregunta qué necesita para inscribirse a una materia
- Sistema busca en datos del Plan 11 y devuelve requisitos con nombres completos
- Soporta consulta por código, nombre o carrera completa

### 2. Verificación de inscripción
- Usuario pregunta si puede inscribirse a una materia
- Sistema cruza correlativas contra historial académico del alumno (mock por legajo)
- Responde con éxito + comprobante, o explica qué materia falta
- Detecta cupo agotado y sugiere turno alternativo

### 3. Fechas de finales
- Usuario pregunta cuándo rinde una materia
- Sistema busca en datos de finales nov/dic 2025, feb 2026
- Filtra por código, nombre, sede y turno

**Todo lo demás fue removido del MVP** para mantener foco.

---

## Arquitectura técnica

### Flujo del chat (3 pasos)

```
[Usuario escribe] →
 Paso 1: LLM detecta INTENT (JSON) →
 Paso 2: Backend ejecuta acción (SIU mock / JSON local) →
 Paso 3: LLM genera respuesta streameada con los datos
```

**4 intents:** `inscribir_materia`, `query_finales`, `query_correlativas`, `other`

### Estructura del repositorio

```
app/
  api/
    chat/route.ts              # Endpoint principal del chat (planner + executor + responder)
    analytics/route.ts         # Endpoint de métricas (GET con filtro por rango)
    auth/[...nextauth]/route.ts # NextAuth (Google OAuth)
  admin/page.tsx               # Dashboard institucional
  page.tsx                     # Landing page
  layout.tsx                   # Layout global (Header + ConditionalChat + SessionProvider)
  presentacion/page.tsx        # Presentación de tesis (standalone)
  auth/signin/page.tsx         # Login page
  auth/error/page.tsx          # Error de auth

components/
  chat/TestisChat.tsx          # UI del chatbot (3 quick actions + banner simulación)
  ConditionalChat.tsx          # Wrapper: oculta chat en /presentacion
  Header.tsx                   # Header con logo USAL
  SessionProvider.tsx          # Provider de NextAuth
  hero.tsx                     # Hero de la landing
  sections/                    # 8 secciones de la landing (Stats, Features, Pricing, etc.)
  background-grids.tsx         # Efectos visuales de la landing
  ScrollEffects3D.tsx          # Idem
  FloatingElements3D.tsx       # Idem
  UniversalBackground.tsx      # Idem
  FallingStarsEffect.tsx       # Idem

lib/
  hooks/useTestisChat.ts       # Hook del chat con session ID persistente
  llm/getModel.ts              # Selector de modelo (Gemini 2.5 Flash via AI Gateway)
  siu/
    index.ts                   # Factory: devuelve mock o disabled según config
    mock.ts                    # Cliente SIU simulado con 7 perfiles de alumnos
    disabled.ts                # Fallback cuando SIU no está disponible
    types.ts                   # Tipos compartidos (ISiuClient, Materia, Nota, etc.)
  academic-data/
    index.ts                   # Re-exports
    loader.ts                  # Carga JSON de finales, correlativas, calendario, horarios
    queries.ts                 # Funciones de búsqueda (searchExams, findCorrelativas, etc.)
    types.ts                   # Tipos (ExamDate, Correlativa, etc.)
  db/logger.ts                 # Logger → data/conversations.json + getAnalyticsSummary()
  auth.ts                      # Configuración de NextAuth
  utils.ts                     # Utilidades compartidas (cn)

data/
  siu/materias.json            # 28 materias del Plan 11 con cupos, turnos y correlativas
  siu/notas.json               # Notas por legajo (importado por mock.ts, no consumido por route.ts)
  siu/inasistencias.json       # Inasistencias (idem — peso muerto transitivo)
  conversations.json           # Log de conversaciones (generado en runtime)

# Raíz del proyecto
finales_2025.json              # Fechas de finales nov/dic 2025, feb 2026
plan_correlativas.json         # 45 materias con correlativas del Plan 11
calendario_2025.json           # Calendario académico (cargado pero no consumido por intents)
horarios_2025_ejemplos.json    # Horarios de ejemplo (idem)
```

### Datos mockeados — perfiles de alumnos

| Legajo | Perfil | Materias aprobadas |
|--------|--------|--------------------|
| `SIN_MATERIAS` | 1er año sin nada | Ninguna |
| `SEGUNDO` | 2do año | Todo 1er año (8 materias) |
| `TERCERO` | 3er año | Todo 1er y 2do año (15 materias) |
| `AVANZADO` | 4to/5to | Hasta 3er año (22 materias) |
| `CON_DEUDA` | Con deuda académica | Solo 3 de 1er año |
| `123456` | Demo original | Hasta 2do año |
| `default` | Sin especificar | Solo ALG I + Análisis I |

### IDs de materias

Los IDs en `materias.json` coinciden con los **códigos numéricos del Plan 11** (ej: `"144"` = Introducción a la Programación, `"152"` = Estructura de Datos).

---

## Principios de diseño

1. **Predecible**: Sin errores aleatorios simulados. Cada flujo funciona siempre igual.
2. **Honesto**: Banner de "Modo demostración" visible. La lógica es real, los datos son de ejemplo.
3. **Enfocado**: Solo 3 flujos. No hay funcionalidades "a medio hacer".
4. **Demo-ready**: Los quick actions disparan los 3 flujos core con datos que siempre funcionan.

---

## Comandos

```bash
npm run dev        # Desarrollo en localhost:3000
npm run build      # Build de producción
npm run start      # Servir build

# Variables de entorno (.env.local)
AI_GATEWAY_API_KEY=    # Clave para Vercel AI Gateway (Gemini 2.5 Flash)
NEXTAUTH_SECRET=       # Secret para NextAuth
NEXTAUTH_URL=          # URL base
```

---

## Estado actual

### Implementado y funcionando
- Chat con 3 intents core + other y arquitectura de 3 pasos
- 28 materias del Plan 11 con cupos, turnos y correlativas reales
- 7 perfiles de alumnos para demos predecibles
- Validación de correlativas con mensajes descriptivos (nombre completo)
- Detección de turno alternativo cuando hay cupo agotado
- Logger de conversaciones
- Dashboard institucional `/admin` con KPIs, top intents, tendencia diaria
- Banner de "Modo demostración" en el chat
- Quick actions alineados a los 3 flujos core
- Session ID por pestaña del navegador
- Landing page con secciones de producto

### Peso muerto conocido (no afecta funcionalidad)
- `data/siu/notas.json` y `data/siu/inasistencias.json` son importados por `mock.ts` pero las funciones que los usan (`getNotas`, `getInasistencias`) nunca se llaman desde `route.ts`. Eliminarlos requiere refactorear `mock.ts`.
- `calendario_2025.json` y `horarios_2025_ejemplos.json` se cargan en `loader.ts` pero no hay intents que los consuman.

### Limitaciones conocidas
- SIU sin integración real (todo es mock)
- Logger usa archivo JSON local (no apto para producción multi-instancia)
- Datos de finales son nov/dic 2025 y feb 2026

---

## Guía de estilo de código

- **TypeScript estricto** — no usar `any` salvo donde el AI SDK lo requiere
- **Colores USAL**: `usal-green-600`, `usal-red-600`, `usal-gold-600`, `usal-navy-600`
- **Animaciones**: Framer Motion para transiciones del chat
- **Error handling**: Nunca throw dentro del handler — siempre retornar `{ ok: false, code, message }`
- **Prompts**: Los cambios al planner o system rules en `route.ts` son sensibles — testear con los 3 flujos core

---

## Roadmap

### Fase actual — MVP enfocado (completada)
- [x] 3 intents core funcionando
- [x] Demos predecibles sin errores aleatorios
- [x] Banner de modo simulación
- [x] Dashboard institucional
- [x] Quick actions alineados
- [x] Limpieza de código muerto (skills, providers LLM legacy, email, encuestas, endpoints y páginas sin uso)

### Fase siguiente — Validación con usuarios
- [ ] Deploy en Vercel con URL pública
- [ ] 10-15 alumnos de USAL lo usan durante 1 semana
- [ ] Documentar: qué preguntan, qué falla, % resuelto
- [ ] Exportar métricas para reunión con la universidad

### Fase posterior — Conversación institucional
- [ ] Reunión con USAL: demo + datos del piloto
- [ ] Proponer piloto formal
- [ ] Contacto con SIU para feedback

---

## Contexto de negocio

- **Fundador:** Santino Massera
- **Ventaja competitiva:** Prototipo funcionando + velocidad de iteración con IA
- **Riesgo principal:** Depender de que SIU abra su API — el plan es demostrar valor sin esa integración
- **Posicionamiento:** "Asistente académico para USAL — Plan 11 de Ingeniería en Informática"
- **No es:** un chatbot genérico, un reemplazo del SIU, ni un producto para múltiples universidades (todavía)
