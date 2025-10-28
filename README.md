# Testis - Asistente Universitario USAL

Un asistente inteligente para estudiantes de la Universidad del Salvador (USAL), especializado en Ingeniería Informática. Construido con Next.js, AI SDK, y datos académicos locales.

## Features

- 🤖 Respuestas en tiempo real con streaming (GPT-4 vía AI Gateway)
- 📅 Consulta de fechas de finales (nov/dic 2025, feb 2026)
- 🔗 Información de correlativas (Plan 11)
- 📆 Calendario académico 2025
- 🕐 Horarios de cursada (ejemplos)
- 📊 Integración con SIU Guaraní (modo demo)
- ✨ UI moderna y accesible con Aceternity UI
- 🎨 Diseño responsivo con Tailwind CSS
- ⚡ Built on Next.js 14 con App Router y Edge Runtime

## Prerequisites

- Node.js 18+ 
- Una cuenta de [AI Gateway](https://ai.cloudflare.com/) o API key de OpenAI
- (Opcional) Una base de datos [Neon](https://neon.tech/) para persistir historial de chat

## Getting Started

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env.local` con las siguientes variables:
```bash
# AI Gateway / OpenAI
AI_GATEWAY_API_KEY="tu-api-key"
AI_GATEWAY_URL="https://gateway.ai.cloudflare.com/v1/..."

# NextAuth (para autenticación)
NEXTAUTH_SECRET="tu-secret-aleatorio"
NEXTAUTH_URL="http://localhost:3000"

# (Opcional) Base de datos Neon
DATABASE_URL="tu-neon-database-url"
```

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Datos Académicos

Los datos académicos se encuentran en archivos JSON en la raíz del proyecto:

- `finales_2025.json` - Fechas de finales (nov/dic 2025, feb 2026) por sede y turno
- `plan_correlativas.json` - Correlativas del Plan 11
- `calendario_2025.json` - Calendario académico 2025
- `horarios_2025_ejemplos.json` - Ejemplos de horarios de cursada

Estos archivos se cargan en memoria al iniciar y se sirven a través de la capa de datos en `/lib/academic-data/`.

## Estructura del Proyecto

- `/app` - Next.js 14 app directory con rutas y layouts
  - `/api/chat` - Endpoint del chatbot con planificación de intents
  - `/api/auth` - Autenticación con NextAuth
  - `/dashboard` - Panel de estudiante
  - `/presentacion` - Presentación de tesis
- `/components` - Componentes UI reutilizables
  - `/chat` - Componente del chatbot (TestisChat)
  - `/sections` - Secciones de la landing page
  - `/presentation` - Slides de la presentación
- `/lib` - Utilidades y código compartido
  - `/academic-data` - Capa de datos académicos (JSON)
  - `/llm` - Proveedores de LLM (OpenAI, AI Gateway, Mock)
  - `/siu` - Cliente del SIU Guaraní (mock)
  - `/skills` - Helpers para el chatbot
- `/public` - Assets estáticos (imágenes de tesis)
- `*.json` (raíz) - Datos académicos (finales, correlativas, calendario, horarios)

## Tecnologías Clave

- [Next.js 14](https://nextjs.org/) - Framework React con App Router
- [Vercel AI SDK](https://sdk.vercel.ai/) - SDK para integración con LLMs
- [OpenAI GPT-4](https://openai.com/) - Modelo de lenguaje (vía AI Gateway)
- [NextAuth.js](https://next-auth.js.org/) - Autenticación
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Framer Motion](https://www.framer.com/motion/) - Librería de animaciones
- [Aceternity UI](https://ui.aceternity.com/) - Componentes UI modernos
- [Zod](https://zod.dev/) - Validación de esquemas TypeScript

## Cómo Funciona el Chatbot

El chatbot utiliza un sistema de **planificación de intents** de dos pasos:

1. **Paso 1 - Planificación**: Un LLM analiza el mensaje del usuario y genera un "plan" en JSON con:
   - `intent`: tipo de acción (ej: `query_finales`, `query_correlativas`, `help`)
   - Parámetros relevantes (código de materia, sede, turno, etc.)

2. **Paso 2 - Ejecución**: El sistema ejecuta el intent:
   - Para intents académicos: consulta los datos locales (JSON)
   - Para intents del SIU: llama al cliente mock del SIU Guaraní
   - Para ayuda: devuelve texto guía estructurado

3. **Paso 3 - Respuesta**: Un LLM genera una respuesta natural en streaming basada en:
   - El plan detectado
   - Los datos obtenidos
   - Reglas de formato (negritas, emojis, citación de fuentes)

### Intents Disponibles

- `query_finales` - Fechas de exámenes finales
- `query_correlativas` - Correlativas y requisitos
- `query_calendario` - Eventos del calendario académico
- `query_horarios` - Horarios de cursada
- `get_grades` - Notas del SIU (demo)
- `get_absences` - Inasistencias del SIU (demo)
- `get_materias` - Materias disponibles (demo)
- `inscribir_materia` - Inscripción a materia (demo)
- `help` - Ayuda sobre el sistema
- `other` - Charla general

## Ejemplos de Consultas

```
Usuario: "¿Cuándo rindo 144 en Pilar turno Noche?"
→ Intent: query_finales (codigo=144, sede=Pilar, turno=Noche)
→ Respuesta: Fechas de los 3 llamados + correlativas + citación

Usuario: "¿Qué correlativas tiene Programación Avanzada?"
→ Intent: query_correlativas (materia="Programación Avanzada")
→ Respuesta: Código 165, requisitos: [156] + citación

Usuario: "¿Cuándo empieza el segundo cuatrimestre?"
→ Intent: query_calendario (topic="segundo cuatrimestre")
→ Respuesta: 28 de julio de 2025 + citación

Usuario: "Ver mis notas"
→ Intent: get_grades
→ Respuesta: Tabla con notas (datos mock)
```

## Deployment

La forma más fácil de desplegar es usar [Vercel](https://vercel.com/new):

1. Push del código a GitHub
2. Importar repositorio en Vercel
3. Configurar variables de entorno
4. Deploy!

## Desarrollo

### Agregar Nuevos Datos Académicos

1. Editar los archivos JSON en la raíz (`finales_2025.json`, etc.)
2. La capa de datos en `/lib/academic-data/` se recarga automáticamente
3. Las respuestas del bot reflejarán los nuevos datos inmediatamente

### Agregar Nuevos Intents

1. Actualizar el schema `Plan` en `/app/api/chat/route.ts`
2. Agregar ejemplos al `PLANNER_SYS` prompt
3. Implementar la lógica de ejecución en el paso 2
4. (Opcional) Agregar ayuda en `/lib/skills/academicHelp.ts`

## Créditos

- Proyecto de tesis de Ingeniería Informática - USAL
- [Vercel AI SDK](https://sdk.vercel.ai/) - SDK de IA
- [Aceternity UI](https://ui.aceternity.com/) - Componentes UI
- [Neon.tech](https://neon.tech/) - Base de datos serverless
