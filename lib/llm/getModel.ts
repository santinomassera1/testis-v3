// lib/llm/getModel.ts

/**
 * Obtiene el ID del modelo configurado para usar con Vercel AI Gateway
 * El AI SDK usa automáticamente AI_GATEWAY_API_KEY cuando pasas el modelo como string
 * NO crear providers custom - el Gateway se encarga de todo
 */
export function getModel(): string {
  // Leer el modelo desde env, por defecto Gemini 2.0 Flash
  const modelId = process.env.GATEWAY_MODEL_ID || 'google/gemini-2.5-pro';
  
  console.log(`✓ Usando modelo via AI Gateway: ${modelId}`);
  
  // Simplemente retornar el string - el AI SDK maneja el Gateway automáticamente
  return modelId;
}

/**
 * Helper para obtener info del modelo actual (útil para logging/debugging)
 */
export function getModelInfo() {
  const modelId = process.env.GATEWAY_MODEL_ID || 'google/gemini-2.5-pro';
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

