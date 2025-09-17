import { useState, useCallback, useEffect } from 'react';
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

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export function useTestisChat() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determinar qué provider usar basado en la variable de entorno
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
  const provider: LLMProvider = useMock ? new MockProvider() : new OpenAIProvider();

  // Obtener chat actual
  const currentChat = chatSessions.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  // Persistir en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('testis-chat-sessions');
    if (saved) {
      try {
        const sessions = JSON.parse(saved).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
        }));
        setChatSessions(sessions);
        // Si no hay chat actual pero hay sesiones, usar la primera
        if (!currentChatId && sessions.length > 0) {
          setCurrentChatId(sessions[0].id);
        }
      } catch (e) {
        console.error('Error cargando chats:', e);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('testis-chat-sessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Generar título automático del chat basado en el primer mensaje
  const generateChatTitle = (firstMessage: string): string => {
    if (firstMessage.length <= 30) return firstMessage;
    return firstMessage.substring(0, 27) + '...';
  };

  // Crear nuevo chat
  const createNewChat = useCallback(() => {
    const newChatId = Date.now().toString();
    const newChat: ChatSession = {
      id: newChatId,
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setInput('');
    setError(null);
    
    return newChatId;
  }, []);

  // Cambiar chat actual
  const switchToChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    setInput('');
    setError(null);
  }, []);

  // Eliminar chat
  const deleteChat = useCallback((chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remaining = chatSessions.filter(chat => chat.id !== chatId);
      if (remaining.length > 0) {
        setCurrentChatId(remaining[0].id);
      } else {
        setCurrentChatId(null);
      }
    }
  }, [currentChatId, chatSessions]);

  // Actualizar mensajes del chat actual
  const updateCurrentChatMessages = useCallback((newMessages: ChatMessage[]) => {
    if (!currentChatId) return;
    
    setChatSessions(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        // Actualizar título si es el primer mensaje del usuario
        let title = chat.title;
        if (chat.title === 'Nueva conversación' && newMessages.length > 0) {
          const firstUserMessage = newMessages.find(m => m.role === 'user');
          if (firstUserMessage) {
            title = generateChatTitle(firstUserMessage.content);
          }
        }
        
        return {
          ...chat,
          title,
          messages: newMessages,
          updatedAt: new Date(),
        };
      }
      return chat;
    }));
  }, [currentChatId]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  // Función interna para procesar mensajes y generar respuestas
  const processMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;
    
    // Si no hay chat actual, crear uno nuevo
    let chatId = currentChatId;
    if (!chatId) {
      chatId = createNewChat();
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent.trim()
    };

    // Agregar mensaje del usuario
    const updatedMessages = [...messages, userMessage];
    updateCurrentChatMessages(updatedMessages);
    
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

      // Agregar respuesta del asistente
      const finalMessages = [...updatedMessages, assistantMessage];
      updateCurrentChatMessages(finalMessages);
    } catch (err) {
      console.error('Error generando respuesta:', err);
      setError('Error al generar respuesta. Intenta nuevamente.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.'
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      updateCurrentChatMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, provider, currentChatId, createNewChat, updateCurrentChatMessages]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const messageContent = input.trim();
    setInput('');
    await processMessage(messageContent);
  }, [input, processMessage]);

  // Nueva función append que también genera respuesta automática
  const append = useCallback(async (message: Omit<ChatMessage, 'id'>) => {
    if (message.role === 'user') {
      // Para mensajes de usuario, procesarlos automáticamente para generar respuesta
      await processMessage(message.content);
    } else {
      // Para mensajes del asistente, solo agregarlos
      const newMessage: ChatMessage = {
        ...message,
        id: Date.now().toString()
      };
      const updatedMessages = [...messages, newMessage];
      updateCurrentChatMessages(updatedMessages);
    }
  }, [messages, processMessage, updateCurrentChatMessages]);

  const stop = useCallback(() => {
    setIsLoading(false);
  }, []);

  const clearCurrentChat = useCallback(() => {
    if (currentChatId) {
      updateCurrentChatMessages([]);
    }
    setError(null);
  }, [currentChatId, updateCurrentChatMessages]);

  return {
    // Mensajes del chat actual
    messages,
    
    // Input y manejo básico
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    stop,
    error,
    
    // Funciones de historial de chats (para compatibilidad con componente actual)
    setMessages: clearCurrentChat,
    
    // Nuevas funciones para manejo de múltiples chats
    chatSessions,
    currentChatId,
    currentChat,
    createNewChat,
    switchToChat,
    deleteChat,
  };
}
