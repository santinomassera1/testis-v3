import { useState, useCallback } from 'react';
import { MockProvider } from '../llm/MockProvider';
import { OpenAIProvider } from '../llm/OpenAIProvider';
import { LLMProvider } from '../llm/LLMProvider';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result?: any;
  }>;
}

export function useTestisChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determinar qué provider usar basado en la variable de entorno
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
  const provider: LLMProvider = useMock ? new MockProvider() : new OpenAIProvider();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Generar respuesta usando el provider
      const response = await provider.generateWithTools(
        userMessage.content,
        {}, // tools se manejan internamente en el provider
        {
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        toolCalls: response.toolCalls?.map((tc: any) => ({
          name: tc.name,
          arguments: tc.arguments,
          result: response.toolResults?.find((tr: any) => tr.toolCallId === tc.name)?.result
        }))
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error generando respuesta:', err);
      setError('Error al generar respuesta. Intenta nuevamente.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, provider]);

  const append = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const stop = useCallback(() => {
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    stop,
    setMessages: clearMessages,
    error
  };
}
