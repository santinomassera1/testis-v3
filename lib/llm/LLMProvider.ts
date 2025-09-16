import { generateText, streamText } from 'ai';
import { z } from 'zod';

export interface LLMProvider {
  generateText(prompt: string, options?: any): Promise<string>;
  streamText(prompt: string, options?: any): any;
  generateWithTools(prompt: string, tools: any, options?: any): Promise<any>;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  result: any;
}

// Tool schemas para las funcionalidades de Testis
export const testisTools = {
  makeMailTo: {
    description: 'Genera enlaces mailto para enviar correos a docentes o secretaría',
    parameters: z.object({
      to: z.string().describe('Email del destinatario'),
      subject: z.string().describe('Asunto del correo'),
      body: z.string().describe('Cuerpo del mensaje'),
      type: z.enum(['mailto', 'gmail']).describe('Tipo de enlace: mailto o gmail')
    })
  },
  readUserData: {
    description: 'Lee datos del usuario desde localStorage (notas, parciales, asistencia)',
    parameters: z.object({
      dataType: z.enum(['grades', 'exams', 'attendance', 'schedule']).describe('Tipo de datos a leer')
    })
  },
  siuHelp: {
    description: 'Proporciona ayuda específica sobre el SIU Guaraní',
    parameters: z.object({
      topic: z.string().describe('Tema sobre el que se necesita ayuda')
    })
  }
};
