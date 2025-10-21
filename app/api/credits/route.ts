import { NextResponse } from 'next/server';

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

    // Consultar créditos del Gateway
    const response = await fetch('https://ai-gateway.vercel.sh/v1/credits', {
      headers: {
        'Authorization': `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: 'Error consultando créditos',
          status: response.status,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      credits: data
    });
  } catch (error) {
    console.error('Error consultando créditos:', error);
    return NextResponse.json(
      { 
        error: 'Error al consultar créditos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

