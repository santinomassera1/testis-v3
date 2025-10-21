import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface SurveyData {
  rating: number;
  wasHelpful: boolean | null;
  comment: string;
  timestamp: string;
  sessionDuration: number;
  messagesCount: number;
  categoriesUsed: string[];
}

/**
 * POST /api/surveys
 * Recibe y guarda datos de encuestas de satisfacción
 */
export async function POST(req: NextRequest) {
  try {
    const data: SurveyData = await req.json();

    // Validar datos
    if (!data.timestamp || (data.rating < 0 || data.rating > 5)) {
      return NextResponse.json(
        { error: 'Datos de encuesta inválidos' },
        { status: 400 }
      );
    }

    // Log de la encuesta (en producción, guardar en DB)
    console.log('📊 Nueva encuesta recibida:', {
      rating: data.rating,
      wasHelpful: data.wasHelpful,
      hasComment: data.comment && data.comment !== 'SKIPPED',
      duration: data.sessionDuration,
      messages: data.messagesCount,
      categories: data.categoriesUsed.length,
    });

    // TODO: Guardar en base de datos
    // Ejemplo con Prisma:
    // await prisma.survey.create({ data })

    // TODO: Enviar a analytics (Google Analytics, Mixpanel, etc.)
    // analytics.track('Survey Submitted', data)

    // Por ahora, solo retornar éxito
    return NextResponse.json({
      success: true,
      message: 'Encuesta guardada exitosamente',
    });
  } catch (error) {
    console.error('Error guardando encuesta:', error);
    return NextResponse.json(
      { error: 'Error al guardar encuesta' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/surveys
 * Obtiene estadísticas de encuestas (solo para admin/desarrollo)
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Verificar permisos de admin aquí

    // En un entorno real, consultar la base de datos
    // Por ahora, retornar mock stats
    const stats = {
      totalSurveys: 0,
      averageRating: 0,
      helpfulPercentage: 0,
      mostUsedCategories: [],
      averageSessionDuration: 0,
    };

    return NextResponse.json({
      success: true,
      stats,
      message: 'Funcionalidad en desarrollo - conectar a BD',
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}

