import { LLMProvider, ChatMessage, ToolCall, ToolResult } from './LLMProvider';
import { makeMailTo } from '../skills/makeMailTo';
import { readUserData } from '../skills/readUserData';
import { siuHelp } from '../skills/siuHelp';

export class MockProvider implements LLMProvider {
  private async simulateStreaming(text: string, onUpdate: (text: string) => void) {
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      onUpdate(currentText);
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    return this.generateMockResponse(prompt);
  }

  async streamText(prompt: string, options?: any) {
    const response = this.generateMockResponse(prompt);
    
    return {
      textStream: {
        [Symbol.asyncIterator]: async function* () {
          const words = response.split(' ');
          let currentText = '';
          
          for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            yield currentText;
            await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
          }
        }
      },
      toolCalls: [],
      finishReason: 'stop'
    };
  }

  async generateWithTools(prompt: string, tools: any, options?: any): Promise<any> {
    const response = this.generateMockResponse(prompt);
    const toolCalls = this.detectToolCalls(prompt, response);
    
    // Ejecutar herramientas si es necesario
    const toolResults: ToolResult[] = [];
    for (const toolCall of toolCalls) {
      try {
        const result = await this.executeTool(toolCall);
        toolResults.push({
          toolCallId: toolCall.name,
          result
        });
      } catch (error) {
        console.error(`Error ejecutando herramienta ${toolCall.name}:`, error);
      }
    }

    return {
      text: response,
      toolCalls,
      toolResults
    };
  }

  private generateMockResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    // Respuestas específicas para Testis
    if (lowerPrompt.includes('inscripción') || lowerPrompt.includes('inscribir')) {
      return `Para inscribirte en las materias del SIU Guaraní, sigue estos pasos:

1. **Accede al SIU Guaraní** desde el portal de la USAL
2. **Inicia sesión** con tu usuario y contraseña
3. Ve a la sección **"Inscripción a Cursadas"**
4. Selecciona el período académico correspondiente
5. Elige las materias que deseas cursar
6. Verifica las correlatividades (si las hay)
7. Confirma tu inscripción

¿Necesitas ayuda con algún paso específico? También puedo ayudarte a verificar tus correlatividades o generar un correo para consultar con Secretaría.`;
    }

    if (lowerPrompt.includes('horario') || lowerPrompt.includes('horarios')) {
      return `Para consultar tus horarios en el SIU Guaraní:

1. **Ingresa al SIU** con tus credenciales
2. Busca la sección **"Horarios"** o **"Cursadas"**
3. Selecciona el período académico
4. Verás el listado de materias con sus horarios y aulas

También puedes:
- Descargar el horario en PDF
- Sincronizar con tu calendario personal
- Ver los horarios de exámenes

¿Te gustaría que revise tus horarios actuales o necesitas ayuda con algo específico?`;
    }

    if (lowerPrompt.includes('nota') || lowerPrompt.includes('calificación')) {
      return `Para consultar tus notas en el SIU Guaraní:

1. **Accede al SIU** y ve a **"Mis Notas"**
2. Selecciona el período académico
3. Verás el listado de materias con sus calificaciones

También puedes ver:
- Notas de parciales y trabajos prácticos
- Promedio por materia
- Estado de regularidad

¿Quieres que revise tus notas actuales? Puedo mostrarte un resumen de tu rendimiento académico.`;
    }

    if (lowerPrompt.includes('parcial') || lowerPrompt.includes('examen')) {
      return `Para consultar información sobre parciales:

1. **Ve a la sección "Exámenes"** en el SIU
2. Selecciona el período académico
3. Verás las fechas, horarios y aulas de tus exámenes

También puedes:
- Ver el cronograma completo de exámenes
- Consultar las condiciones de regularidad
- Acceder a las actas de examen

¿Necesitas ver tus próximos parciales o tienes alguna consulta específica sobre exámenes?`;
    }

    if (lowerPrompt.includes('certificado') || lowerPrompt.includes('constancia')) {
      return `Para obtener certificados y constancias:

1. **Accede al SIU** y busca **"Certificados"**
2. Selecciona el tipo de certificado que necesitas:
   - Constancia de alumno regular
   - Certificado analítico
   - Constancia de materias aprobadas
3. Completa los datos requeridos
4. Descarga el documento en PDF

Los certificados suelen estar disponibles inmediatamente y son válidos con firma digital.

¿Qué tipo de certificado necesitas? Puedo ayudarte a generarlo.`;
    }

    if (lowerPrompt.includes('correo') || lowerPrompt.includes('mail') || lowerPrompt.includes('email')) {
      return `Puedo ayudarte a generar correos para contactar con:

- **Docentes de cátedra**: Para consultas sobre materias específicas
- **Secretaría Académica**: Para trámites administrativos
- **Coordinación de carrera**: Para asuntos de plan de estudios

Solo dime qué necesitas consultar y a quién te quieres dirigir, y generaré el correo con el asunto y contenido apropiados.

¿A quién necesitas escribir y sobre qué tema?`;
    }

    if (lowerPrompt.includes('error') || lowerPrompt.includes('problema') || lowerPrompt.includes('no funciona')) {
      return `Si tienes problemas con el SIU Guaraní, aquí tienes algunas soluciones comunes:

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

¿Qué error específico estás viendo? Puedo darte una solución más detallada.`;
    }

    // Respuesta genérica
    return `¡Hola! Soy Testis, tu asistente para el SIU Guaraní de la USAL. 

Puedo ayudarte con:
- 📚 **Inscripciones** a materias
- 🕐 **Horarios** de cursada
- 📊 **Notas** y calificaciones
- 📝 **Parciales** y exámenes
- 📄 **Certificados** y constancias
- 📧 **Correos** a docentes y secretaría
- ❓ **Errores** comunes del SIU

¿En qué puedo ayudarte hoy?`;
  }

  private detectToolCalls(prompt: string, response: string): ToolCall[] {
    const toolCalls: ToolCall[] = [];
    const lowerPrompt = prompt.toLowerCase();
    const lowerResponse = response.toLowerCase();

    // Detectar si necesita generar un correo
    if (lowerPrompt.includes('correo') || lowerPrompt.includes('mail') || 
        lowerResponse.includes('generar correo') || lowerResponse.includes('mailto')) {
      toolCalls.push({
        name: 'makeMailTo',
        arguments: {
          to: 'docente@usal.edu.ar',
          subject: 'Consulta académica',
          body: 'Estimado/a docente,\n\nLe escribo para consultar sobre...',
          type: 'mailto'
        }
      });
    }

    // Detectar si necesita leer datos del usuario
    if (lowerPrompt.includes('mis notas') || lowerPrompt.includes('ver notas') ||
        lowerPrompt.includes('mis parciales') || lowerPrompt.includes('ver parciales') ||
        lowerPrompt.includes('mi asistencia') || lowerPrompt.includes('ver asistencia')) {
      let dataType = 'grades';
      if (lowerPrompt.includes('parcial') || lowerPrompt.includes('examen')) dataType = 'exams';
      if (lowerPrompt.includes('asistencia')) dataType = 'attendance';
      if (lowerPrompt.includes('horario')) dataType = 'schedule';

      toolCalls.push({
        name: 'readUserData',
        arguments: {
          dataType
        }
      });
    }

    // Detectar si necesita ayuda específica del SIU
    if (lowerPrompt.includes('ayuda') || lowerPrompt.includes('cómo') ||
        lowerPrompt.includes('dónde') || lowerPrompt.includes('pasos')) {
      toolCalls.push({
        name: 'siuHelp',
        arguments: {
          topic: prompt
        }
      });
    }

    return toolCalls;
  }

  private async executeTool(toolCall: ToolCall): Promise<any> {
    switch (toolCall.name) {
      case 'makeMailTo':
        return await makeMailTo(toolCall.arguments as any);
      case 'readUserData':
        return await readUserData(toolCall.arguments as any);
      case 'siuHelp':
        return await siuHelp(toolCall.arguments as any);
      default:
        throw new Error(`Herramienta desconocida: ${toolCall.name}`);
    }
  }
}
