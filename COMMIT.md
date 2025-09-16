# Historial de Commits – Proyecto Testis (Chatbot SIU Guaraní)

### Inicialización
- `init: estructura base con template neon-chatbot`
  Se clonó el template `neondatabase/neon-chatbot` y se adaptó para Next.js App Router sin backend.

### Integración del AI SDK 5
- `feat(ai): integración de AI SDK 5 con soporte para GPT-5 (modo mock por defecto)`
  Se creó `lib/llm/LLMProvider.ts` con `MockProvider` y `OpenAIProvider` deshabilitado.

### Componentes conversacionales
- `feat(chat): agregar componentes de interfaz conversacional`
  Se sumaron `ChatInput`, `ChatMessages` y `ChatContainer` con soporte de streaming simulado.

### Funcionalidades específicas SIU
- `feat(tools): crear skills de asistencia`
  - `makeMailTo.ts`: genera links `mailto:` para docentes/secretaría.
  - `readUserData.ts`: lectura/escritura en `localStorage` (notas, parciales, asistencia).
  - `siuHelp.ts`: respuestas estáticas de guía dentro del SIU.

### Datos de ejemplo
- `data: agregar dataset sintético`
  Se incorporaron archivos JSON de ejemplo con materias, parciales y asistencias para demo.

### Diseño y UX
- `style: interfaz inicial con Tailwind`
  Layout dividido en panel de chat y accesos rápidos a funciones comunes.

### Documentación
- `docs: agregar README con instrucciones de uso`
- `docs: crear COMMITS.md con historial de implementación`

### Integración del sistema de chat
- `feat(chat): crear hook personalizado useTestisChat`
  Se implementó un hook que integra MockProvider con el sistema de chat, reemplazando useChat de AI SDK.
- `feat(ui): crear componente TestisChat específico`
  Se desarrolló un componente de chat personalizado con bloques de acceso rápido para funcionalidades del SIU.
- `feat(ui): adaptar Hero para branding de Testis`
  Se actualizó el componente Hero con el nombre y descripción del proyecto, incluyendo enlaces a USAL y SIU Guaraní.
- `feat(integration): conectar chat con skills y tools`
  Se integró el sistema de tool calling con la interfaz de usuario, mostrando resultados de herramientas como correos y datos.
