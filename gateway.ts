import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { config } from 'dotenv';

// Cargar explícitamente el archivo .env.local
config({ path: '.env.local' });

// Configurar el provider global para Vercel AI Gateway
const vercel = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://gateway.vercel.com/v1/openai',
});

async function main() {
  console.log('Variables de entorno:');
  console.log('AI_GATEWAY_API_KEY:', process.env.AI_GATEWAY_API_KEY ? 'Configurado ✅' : 'No configurado ❌');
  
  try {
    const result = await streamText({
      model: vercel('gpt-4o'),
      prompt: 'Hola, responde en español: ¿Cómo estás?',
    });
    
    console.log('Streaming iniciado...');
    
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }

    console.log();
    console.log('Token usage:', await result.usage);
    console.log('Finish reason:', await result.finishReason);
    
  } catch (error) {
    console.error('Error detallado:', error);
  }
}

main().catch(console.error);
