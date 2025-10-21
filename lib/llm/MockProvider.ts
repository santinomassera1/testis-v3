import { LLMProvider, ChatMessage, ToolCall, ToolResult } from './LLMProvider';
import { mockResponses, defaultResponse, streamingConfigs } from './MockResponses';
import { makeMailTo } from '../skills/makeMailTo';
import { readUserData } from '../skills/readUserData';
import { siuHelp } from '../skills/siuHelp';

interface StreamingConfig {
  baseDelay: number;
  variability: number;
  wordsPerChunk: number;
}

export class MockProvider implements LLMProvider {
  private textCache = new Map<string, string>();
  private normalizedCache = new Map<string, string>();
  private streamingConfig: StreamingConfig = streamingConfigs.normal;

  private normalizeText(text: string): string {
    if (this.normalizedCache.has(text)) {
      return this.normalizedCache.get(text)!;
    }

    const normalized = text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿¡]/g, '');
    
    this.normalizedCache.set(text, normalized);
    return normalized;
  }

  private extractEmailRequest(prompt: string): { response: string; tools: ToolCall[] } | null {
    // Patrones para detectar solicitudes de email
    const emailPatterns = [
      // Patrón principal: "enviar mail a X con asunto Y texto Z"
      /(?:quiero\s+)?(?:enviar|mandar)(?:le)?\s+(?:un\s+)?mail\s+al?\s+(?:profesor\s+)?(.+?)\s*,?\s*con\s+(?:el\s+)?asunto:?\s*(.+?)\s*,?\s*(?:con\s+)?(?:el\s+)?texto:?\s*(.+)/i,
      
      // Patrón alternativo: "mail para X asunto Y mensaje Z"
      /mail\s+para\s+(.+?)\s*,?\s*asunto:?\s*(.+?)\s*,?\s*(?:mensaje|texto):?\s*(.+)/i,
      
      // Patrón simple: "escribir a X sobre Y"
      /(?:escribir|contactar)\s+a\s+(.+?)\s+sobre\s+(.+)/i
    ];

    for (const pattern of emailPatterns) {
      const match = prompt.match(pattern);
      if (match) {
        let to = '';
        let subject = '';
        let bodyContent = '';

        if (pattern.source.includes('sobre')) {
          // Patrón simple: "escribir a X sobre Y"
          const recipient = match[1].trim();
          const topic = match[2].trim();
          
          to = this.extractEmail(recipient) || `${recipient.toLowerCase().replace(/\s+/g, '.')}@usal.edu.ar`;
          subject = `Consulta sobre ${topic}`;
          bodyContent = this.generateEmailBody(topic, 'consulta');
        } else {
          // Patrones completos con asunto y texto
          const recipient = match[1].trim();
          subject = match[2].trim();
          bodyContent = match[3] ? match[3].trim() : '';
          
          to = this.extractEmail(recipient) || `${recipient.toLowerCase().replace(/\s+/g, '.')}@usal.edu.ar`;
          
          // Generar cuerpo profesional basado en el contenido
          bodyContent = this.generateEmailBody(bodyContent, this.detectEmailType(subject, bodyContent));
        }

        const response = `He generado un correo profesional para enviar. El mensaje incluye:

📧 **Destinatario**: ${to}
📝 **Asunto**: ${subject}
✍️ **Mensaje**: Redactado de forma profesional y cortés

Puedes hacer clic en "Abrir Gmail" para enviar el correo o en "Abrir Correo" para usar tu cliente de correo predeterminado.`;

        return {
          response,
          tools: [{
            name: 'makeMailTo',
            arguments: {
              to,
              subject,
              body: bodyContent,
              type: 'gmail'
            }
          }]
        };
      }
    }

    return null;
  }

  private extractEmail(recipient: string): string | null {
    // Buscar email explícito en el texto
    const emailMatch = recipient.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    return emailMatch ? emailMatch[1] : null;
  }

  private detectEmailType(subject: string, content: string): 'ausencia' | 'consulta' | 'tramite' | 'general' {
    const lowerSubject = subject.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    if (lowerSubject.includes('ausencia') || lowerContent.includes('fiebre') || lowerContent.includes('enferm') || lowerContent.includes('faltar')) {
      return 'ausencia';
    }
    if (lowerSubject.includes('consulta') || lowerContent.includes('pregunta') || lowerContent.includes('duda')) {
      return 'consulta';
    }
    if (lowerSubject.includes('tramite') || lowerContent.includes('certificado') || lowerContent.includes('constancia')) {
      return 'tramite';
    }
    
    return 'general';
  }

  private generateEmailBody(content: string, type: 'ausencia' | 'consulta' | 'tramite' | 'general'): string {
    const templates = {
      ausencia: (reason: string) => `Estimado/a Profesor/a,

Espero que se encuentre bien. Le escribo para informarle que no podré asistir a la clase de hoy debido a que ${reason.toLowerCase().includes('fiebre') ? 'me encuentro con fiebre' : reason.toLowerCase()}.

Quisiera saber si hay algún material o actividad que deba revisar para ponerme al día con el contenido de la clase perdida.

Agradezco su comprensión y quedo atento/a a su respuesta.

Saludos cordiales,
[Su nombre]
[Legajo]`,

      consulta: (topic: string) => `Estimado/a Profesor/a,

Espero que se encuentre bien. Le escribo para realizar una consulta sobre ${topic.toLowerCase()}.

Me gustaría solicitar su orientación al respecto, ya que considero importante aclarar este punto para mi mejor comprensión de la materia.

¿Sería posible acordar un momento para conversar sobre este tema, ya sea en horario de consulta o por este medio?

Desde ya, muchas gracias por su tiempo y atención.

Saludos cordiales,
[Su nombre]
[Legajo]`,

      tramite: (topic: string) => `Estimados/as,

Me dirijo a ustedes para consultar sobre ${topic.toLowerCase()}.

Agradecería que me informen sobre los pasos a seguir y la documentación necesaria para completar este trámite.

Quedo a la espera de su respuesta y desde ya agradezco su atención.

Saludos cordiales,
[Su nombre]
[Legajo]`,

      general: (topic: string) => `Estimado/a,

Espero que se encuentre bien. Le escribo en relación a ${topic.toLowerCase()}.

Agradecería mucho su orientación al respecto.

Muchas gracias por su tiempo.

Saludos cordiales,
[Su nombre]
[Legajo]`
    };

    return templates[type](content);
  }

  private findBestMatch(prompt: string): { response: string; tools?: ToolCall[] } {
    const cacheKey = `response_${prompt}`;
    if (this.textCache.has(cacheKey)) {
      return JSON.parse(this.textCache.get(cacheKey)!);
    }

    const normalizedPrompt = this.normalizeText(prompt);
    
    // Primero verificar si es una solicitud de email específica
    const emailMatch = this.extractEmailRequest(prompt);
    if (emailMatch) {
      console.log(`✅ Mock Provider - Email inteligente detectado`);
      const result = {
        response: emailMatch.response,
        tools: emailMatch.tools
      };
      this.textCache.set(cacheKey, JSON.stringify(result));
      return result;
    }
    
    // Buscar patrones ordenados por prioridad
    const sortedPatterns = [...mockResponses].sort((a, b) => b.priority - a.priority);
    
    for (const pattern of sortedPatterns) {
      if (pattern.pattern.test(normalizedPrompt)) {
        console.log(`✅ Mock Provider - Patrón activado: ${pattern.pattern.source}`);
        const result = { 
          response: pattern.response, 
          tools: pattern.tools || []
        };
        this.textCache.set(cacheKey, JSON.stringify(result));
        return result;
      }
    }

    console.log('⚠️  Mock Provider - Respuesta genérica');
    const result = { response: defaultResponse, tools: [] };
    this.textCache.set(cacheKey, JSON.stringify(result));
    return result;
  }

  private async simulateStreaming(text: string, onUpdate: (text: string) => void): Promise<void> {
    const words = text.split(' ');
    const chunks = [];
    
    // Agrupar palabras en chunks para streaming más eficiente
    for (let i = 0; i < words.length; i += this.streamingConfig.wordsPerChunk) {
      chunks.push(words.slice(i, i + this.streamingConfig.wordsPerChunk).join(' '));
    }

    let currentText = '';
    for (let i = 0; i < chunks.length; i++) {
      currentText += (i > 0 ? ' ' : '') + chunks[i];
      onUpdate(currentText);
      
      const delay = this.streamingConfig.baseDelay + 
                   Math.random() * this.streamingConfig.variability;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    // Cache check
    const cacheKey = `generate_${prompt}`;
    if (this.textCache.has(cacheKey)) {
      // Simular delay mínimo para realismo
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.textCache.get(cacheKey)!;
    }

    // Simular delay de red
    await new Promise(resolve => 
      setTimeout(resolve, 300 + Math.random() * 500)
    );
    
    const { response } = this.findBestMatch(prompt);
    this.textCache.set(cacheKey, response);
    return response;
  }

  async streamText(prompt: string, options?: any) {
    const { response } = this.findBestMatch(prompt);
    
    return {
      textStream: {
        [Symbol.asyncIterator]: async function* (this: MockProvider) {
          const words = response.split(' ');
          const chunks = [];
          
          for (let i = 0; i < words.length; i += this.streamingConfig.wordsPerChunk) {
            chunks.push(words.slice(i, i + this.streamingConfig.wordsPerChunk).join(' '));
          }

          let currentText = '';
          for (let i = 0; i < chunks.length; i++) {
            currentText += (i > 0 ? ' ' : '') + chunks[i];
            yield currentText;
            
            const delay = this.streamingConfig.baseDelay + 
                         Math.random() * this.streamingConfig.variability;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }.bind(this)
      },
      toolCalls: [],
      finishReason: 'stop'
    };
  }

  async generateWithTools(prompt: string, tools: any, options?: any): Promise<any> {
    const match = this.findBestMatch(prompt);
    const toolCalls = match.tools || [];
    
    // Ejecutar herramientas de forma paralela para mejor rendimiento
    const toolPromises = toolCalls.map(async (toolCall) => {
      try {
        const result = await this.executeTool(toolCall);
        return {
          toolCallId: toolCall.name,
          result
        };
      } catch (error) {
        console.error(`Error ejecutando herramienta ${toolCall.name}:`, error);
        return {
          toolCallId: toolCall.name,
          result: null,
          error: error instanceof Error ? error.message : 'Error desconocido'
        };
      }
    });

    const toolResults = await Promise.all(toolPromises);

    return {
      text: match.response,
      toolCalls,
      toolResults: toolResults.filter(result => result.result !== null)
    };
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

  // Métodos de utilidad para configuración
  public setStreamingConfig(config: Partial<StreamingConfig>): void {
    this.streamingConfig = { ...this.streamingConfig, ...config };
  }

  public setStreamingPreset(preset: keyof typeof streamingConfigs): void {
    this.streamingConfig = streamingConfigs[preset];
  }

  public clearCache(): void {
    this.textCache.clear();
    this.normalizedCache.clear();
  }

  public getCacheStats(): { textCache: number; normalizedCache: number } {
    return {
      textCache: this.textCache.size,
      normalizedCache: this.normalizedCache.size
    };
  }

  public getAvailableCategories(): string[] {
    return Array.from(new Set(mockResponses
      .map(r => r.category)
      .filter(c => c !== undefined)
    )) as string[];
  }
}