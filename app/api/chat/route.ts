import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { testisTools } from '@/lib/llm/LLMProvider';
import { makeMailTo } from '@/lib/skills/makeMailTo';
import { readUserData } from '@/lib/skills/readUserData';
import { siuHelp } from '@/lib/skills/siuHelp';

export const runtime = 'edge';

// Nota: AI SDK v5 usa Vercel AI Gateway automáticamente con AI_GATEWAY_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // System prompt para Testis
    const systemMessage = {
      role: 'system' as const,
      content: `Eres Testis, un asistente virtual universitario para estudiantes de la Universidad del Salvador (USAL).
Tu objetivo es ayudar a los estudiantes con consultas académicas, información del SIU Guaraní, y orientación general.
Sé amable, conciso y útil. Si no sabes algo, admítelo en lugar de inventar información.`
    };

    const allMessages = [systemMessage, ...messages];

    // Configurar herramientas (v5 usa inputSchema)
    const tools = {
      makeMailTo: {
        description: testisTools.makeMailTo.description,
        inputSchema: testisTools.makeMailTo.parameters,
        execute: async (args: any) => {
          return await makeMailTo(args);
        }
      },
      readUserData: {
        description: testisTools.readUserData.description,
        inputSchema: testisTools.readUserData.parameters,
        execute: async (args: any) => {
          return await readUserData(args);
        }
      },
      siuHelp: {
        description: testisTools.siuHelp.description,
        inputSchema: testisTools.siuHelp.parameters,
        execute: async (args: any) => {
          return await siuHelp(args);
        }
      }
    };

    const result = streamText({
      model: 'openai/gpt-5', // Gateway se usa automáticamente con AI_GATEWAY_API_KEY
      messages: allMessages,
      tools,
    });

    // IMPORTANTE: text stream (SSE) para streamProtocol: 'text' en el cliente
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

