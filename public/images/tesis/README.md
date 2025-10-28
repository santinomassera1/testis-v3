# Imágenes para Presentación de Tesis

Este directorio contiene las imágenes utilizadas en la presentación de tesis de Testis.

## 📸 Capturas Requeridas (TODO)

Para completar la **Slide 7** de la presentación, necesitamos agregar las siguientes capturas del chatbot en acción:

### 1. `captura-inscripcion.png`
**Descripción:** Inscripción guiada con validación de correlativas
- Mostrar conversación donde el chatbot:
  - Pregunta al estudiante qué materia quiere inscribir
  - Valida correlativas previas
  - Explica si puede o no inscribirse (con razón)
  - Proporciona el deep-link correcto a SIU

**Dimensiones sugeridas:** 1200x800px (ratio 3:2)

---

### 2. `captura-email.png`
**Descripción:** Generación automática de email institucional
- Mostrar conversación donde el chatbot:
  - Genera un borrador de email
  - Incluye asunto, destinatario correcto (secretaría/área)
  - Redacta el cuerpo del mensaje de forma institucional
  - Ofrece el mailto: link para abrir en cliente de correo

**Dimensiones sugeridas:** 1200x800px (ratio 3:2)

---

### 3. `captura-correlativas.png`
**Descripción:** Consulta de correlativas con explicación y cita
- Mostrar conversación donde el chatbot:
  - Responde a consulta sobre correlativas de una materia
  - Explica claramente cuáles son y por qué
  - Cita la fuente oficial (reglamento académico, plan de estudios)
  - Incluye enlaces útiles

**Dimensiones sugeridas:** 1200x800px (ratio 3:2)

---

## 🎨 Guidelines de Captura

### Formato
- **Formato:** PNG con transparencia o fondo blanco
- **Calidad:** Alta resolución (mínimo 1200px de ancho)
- **Ratio:** 3:2 (horizontal) para mejor visualización en slides

### Contenido
- Capturas de pantalla reales del chatbot funcionando
- Conversaciones auténticas que muestren el valor del producto
- Texto legible (zoom apropiado)
- Sin datos personales reales (usar datos demo/simulados)

### Privacidad
- ❌ No incluir datos personales identificables (PII)
- ✅ Usar nombres ficticios (ej: "Juan Estudiante")
- ✅ Usar números de legajo simulados
- ✅ Usar emails genéricos (@ejemplo.com)

---

## 🚀 Cómo Agregar las Capturas

1. **Tomar las capturas:**
   - Abrí el chatbot en la home (/)
   - Iniciá las conversaciones de prueba correspondientes
   - Capturá la pantalla cuando la conversación muestre el punto clave

2. **Procesá las imágenes:**
   - Recortá solo la parte relevante (ventana del chat)
   - Redimensioná a 1200px de ancho manteniendo proporciones
   - Optimizá el tamaño del archivo (idealmente < 500KB por imagen)

3. **Nombrá los archivos:**
   - `captura-inscripcion.png`
   - `captura-email.png`
   - `captura-correlativas.png`

4. **Guardá en este directorio:**
   ```
   /public/images/tesis/
   ```

5. **Verificá en la presentación:**
   - Navegá a `/presentacion`
   - Andá a la Slide 7
   - Las imágenes deberían verse automáticamente

---

## 📦 Placeholder Actual

Mientras las capturas no estén disponibles, la presentación muestra un **placeholder visual** con:
- Gradiente de color según la temática
- Emoji representativo
- Mensaje "Captura pendiente"

Esto permite que la presentación funcione incluso sin las imágenes finales.

---

## 🔄 Actualización Futura

Una vez agregadas las capturas reales:
1. Las imágenes se cargarán automáticamente
2. Los placeholders desaparecerán
3. La nota "TODO: captura real" se puede eliminar del JSON

---

**Última actualización:** 2025-01-21  
**Responsable:** Santino Massera  
**Proyecto:** Testis v3 — Asistente conversacional para SIU Guaraní USAL
