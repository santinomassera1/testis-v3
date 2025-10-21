import { generateText, streamText, generateObject, gateway } from 'ai';
import { LLMProvider, ChatMessage, ToolCall, ToolResult } from './LLMProvider';
import { testisTools } from './LLMProvider';
import { makeMailTo } from '../skills/makeMailTo';
import { readUserData } from '../skills/readUserData';
import { siuHelp } from '../skills/siuHelp';
import { z } from 'zod';

export class OpenAIProvider implements LLMProvider {
  private model;
  
  constructor() {
    // Usar Vercel AI Gateway con GPT-5
    // La autenticación se maneja automáticamente con AI_GATEWAY_API_KEY
    this.model = gateway('openai/gpt-5');
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    const result = await generateText({
      model: this.model,
      prompt,
      ...options
    });

    return result.text;
  }

  async streamText(prompt: string, options?: any) {
    return await streamText({
      model: this.model,
      prompt,
      ...options
    });
  }

  async generateWithTools(prompt: string, tools: any, options?: any): Promise<any> {
    const result = await generateObject({
      model: this.model,
      prompt,
      schema: z.object({
        response: z.string().describe('Respuesta del asistente'),
        toolCalls: z.array(z.object({
          name: z.string(),
          arguments: z.record(z.any())
        })).optional().describe('Herramientas a ejecutar')
      }),
      ...options
    });

    const response = result.object as { response: string; toolCalls?: Array<{ name: string; arguments: Record<string, any> }> };
    const toolCalls = response.toolCalls || [];
    const toolResults: ToolResult[] = [];

    // Ejecutar herramientas
    for (const toolCall of toolCalls) {
      try {
        const toolResult = await this.executeTool(toolCall);
        toolResults.push({
          toolCallId: toolCall.name,
          result: toolResult
        });
      } catch (error) {
        console.error(`Error ejecutando herramienta ${toolCall.name}:`, error);
      }
    }

    return {
      text: response.response,
      toolCalls,
      toolResults
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
}

