// lib/llm/getModel.ts

/**
 * Obtiene el ID del modelo configurado para usar con Vercel AI Gateway
 * El AI SDK usa automáticamente AI_GATEWAY_API_KEY cuando pasas el modelo como string
 * NO crear providers custom - el Gateway se encarga de todo
 */
export function getModel(): string {
  // Leer el modelo desde env, por defecto Gemini 1.5 Flash (más rápido)
  // Forzamos Gemini 2.5 Flash (versión actual estable y rápida)
  const modelId = 'google/gemini-2.5-flash'; // process.env.GATEWAY_MODEL_ID || ...

  console.log(`✓ Usando modelo via AI Gateway: ${modelId}`);

  // Simplemente retornar el string - el AI SDK maneja el Gateway automáticamente
  return modelId;
}

/**
 * Helper para obtener info del modelo actual (útil para logging/debugging)
 */
export function getModelInfo() {
  const modelId = process.env.GATEWAY_MODEL_ID || 'google/gemini-2.5-flash';
  const parts = modelId.split('/');
  const provider = parts.length > 1 ? parts[0] : 'google';
  const modelName = parts.length > 1 ? parts.slice(1).join('/') : modelId;

  return {
    modelId,
    provider,
    modelName,
    isGemini: provider === 'google',
    isOpenAI: provider === 'openai',
    usingGateway: !!process.env.AI_GATEWAY_API_KEY,
  };
}

