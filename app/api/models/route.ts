import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function GET() {
  try {
    // Verificar que tenemos la API key
    if (!process.env.AI_GATEWAY_API_KEY) {
      return NextResponse.json(
        { error: 'AI_GATEWAY_API_KEY no configurada' },
        { status: 500 }
      );
    }

    // Crear cliente OpenAI apuntando al Gateway
    const client = new OpenAI({
      apiKey: process.env.AI_GATEWAY_API_KEY,
      baseURL: 'https://ai-gateway.vercel.sh/v1',
    });

    const models = await client.models.list();
    
    return NextResponse.json({
      success: true,
      models: models.data,
      count: models.data.length
    });
  } catch (error) {
    console.error('Error listando modelos:', error);
    return NextResponse.json(
      { 
        error: 'Error al listar modelos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

