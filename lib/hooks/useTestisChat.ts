'use client';

import { useState, useCallback, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { MockProvider } from '../llm/MockProvider';

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
  const [error, setError] = useState<string | null>(null);

  // Determinar qué modo usar basado en la variable de entorno
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
  const mockProvider = useMock ? new MockProvider() : null;

  // Usar el hook useChat de AI SDK para el modo real (Gateway)
  const {
    messages: apiMessages,
    input: apiInput,
    handleInputChange: apiHandleInputChange,
    handleSubmit: apiHandleSubmit,
    isLoading: apiIsLoading,
    append: apiAppend,
    stop: apiStop,
    setMessages: apiSetMessages,
  } = useChat({
    api: '/api/chat',
    streamProtocol: 'data',
    onError: (err: Error) => {
      console.error('Error en chat:', err);
      setError('Error al procesar tu mensaje. Intenta nuevamente.');
    },
  });

  // Estado local para modo mock
  const [mockInput, setMockInput] = useState('');
  const [mockIsLoading, setMockIsLoading] = useState(false);
  const [mockMessages, setMockMessages] = useState<ChatMessage[]>([]);

  // Obtener chat actual
  const currentChat = chatSessions.find(chat => chat.id === currentChatId);
  
  // Helper para extraer texto de parts (v5)
  const partsToText = (parts: any[]): string => {
    if (!parts) return '';
    return parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');
  };

  // Convertir mensajes del API a nuestro formato
  const convertMessage = (m: any): ChatMessage => {
    return {
      id: m.id,
      role: m.role,
      content: m.content || partsToText(m.parts),
      toolCalls: m.toolInvocations?.map((ti: any) => ({
        name: ti.toolName,
        arguments: ti.args,
        result: ti.result
      }))
    };
  };

  // En modo real, convertir mensajes del API a nuestro formato
  const convertedApiMessages = apiMessages.map(convertMessage);
  const messages = useMock ? mockMessages : convertedApiMessages;

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

  // Sincronizar mensajes actuales con el chat session
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      updateCurrentChatMessages(messages);
    }
  }, [messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setMockInput('');
    setError(null);
    
    return newChatId;
  }, []);

  // Cambiar chat actual
  const switchToChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    setMockInput('');
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

  // Función para procesar mensajes en modo mock
  const processMockMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || mockIsLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent.trim()
    };

    const updatedMessages = [...mockMessages, userMessage];
    setMockMessages(updatedMessages);
    
    setMockIsLoading(true);
    setError(null);

    try {
      const response = await mockProvider!.generateWithTools(
        userMessage.content,
        {},
        {
          messages: mockMessages.map(msg => ({
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

      const finalMessages = [...updatedMessages, assistantMessage];
      setMockMessages(finalMessages);
    } catch (err) {
      console.error('Error generando respuesta mock:', err);
      setError('Error al generar respuesta. Intenta nuevamente.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.'
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMockMessages(finalMessages);
    } finally {
      setMockIsLoading(false);
    }
  }, [mockIsLoading, mockMessages, mockProvider]);

  // Handlers unificados
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (useMock) {
      setMockInput(e.target.value);
    } else {
      apiHandleInputChange(e);
    }
  }, [useMock, apiHandleInputChange]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (useMock) {
      if (!mockInput.trim()) return;
      const messageContent = mockInput.trim();
      setMockInput('');
      await processMockMessage(messageContent);
    } else {
      // Si no hay chat actual, crear uno nuevo
      if (!currentChatId) {
        createNewChat();
      }
      apiHandleSubmit(e as any);
    }
  }, [useMock, mockInput, processMockMessage, apiHandleSubmit, currentChatId, createNewChat]);

  const append = useCallback(async (message: Omit<ChatMessage, 'id'>) => {
    if (useMock) {
      if (message.role === 'user') {
        await processMockMessage(message.content);
      } else {
        const newMessage: ChatMessage = {
          ...message,
          id: Date.now().toString()
        };
        setMockMessages([...mockMessages, newMessage]);
      }
    } else {
      // En modo real, usar el append del API
      await apiAppend(message as any);
    }
  }, [useMock, processMockMessage, mockMessages, apiAppend]);

  const stop = useCallback(() => {
    if (useMock) {
      setMockIsLoading(false);
    } else {
      apiStop();
    }
  }, [useMock, apiStop]);

  const clearCurrentChat = useCallback(() => {
    if (useMock) {
      setMockMessages([]);
    } else {
      apiSetMessages([]);
    }
    if (currentChatId) {
      updateCurrentChatMessages([]);
    }
    setError(null);
  }, [useMock, apiSetMessages, currentChatId, updateCurrentChatMessages]);

  return {
    // Mensajes del chat actual
    messages,
    
    // Input y manejo básico
    input: useMock ? mockInput : apiInput,
    handleInputChange,
    handleSubmit,
    append,
    isLoading: useMock ? mockIsLoading : apiIsLoading,
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
