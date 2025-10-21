// lib/hooks/useTestisChat.ts
'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const textFrom = (m: any) =>
  typeof m?.content === 'string'
    ? m.content
    : Array.isArray(m?.parts)
      ? m.parts.filter((p: any) => p?.type === 'text').map((p: any) => p.text).join('')
      : '';

export function useTestisChat() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chatResult: any = useChat({
    // @ts-ignore
    api: '/api/chat',
    streamProtocol: 'text',
    keepLastMessageOnError: true,
    onError: (err: Error) => {
      console.error('Error en chat:', err);
      setError('Error al procesar tu mensaje. Intenta nuevamente.');
    },
  } as any);

  // @ts-ignore - propiedades existen en runtime
  const {
    messages: uiMessages,
    input,
    handleInputChange: sdkHandleInputChange,
    handleSubmit: sdkHandleSubmit,
    isLoading,
    append: sdkAppend,
    stop: sdkStop,
    setMessages: sdkSetMessages,
  } = chatResult;

  // Adaptamos al tipo que usa tu UI
  const messages: ChatMessage[] = (uiMessages || []).map((m: any) => ({
    id: m?.id ?? crypto.randomUUID(),
    role: m?.role === 'assistant' ? 'assistant' : 'user',
    content: textFrom(m),
  }));

  // Wrapper para handleSubmit que funciona tanto con eventos como sin ellos
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    // Llamar al handleSubmit del SDK
    if (sdkHandleSubmit) {
      sdkHandleSubmit(e as any);
    }
  }, [sdkHandleSubmit]);

  // Wrapper para handleInputChange
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (sdkHandleInputChange) {
      sdkHandleInputChange(e);
    }
  }, [sdkHandleInputChange]);

  // Wrapper para append
  const append = useCallback((message: { role: 'user' | 'assistant'; content: string }) => {
    if (sdkAppend) {
      return sdkAppend(message as any);
    }
    return Promise.resolve(null);
  }, [sdkAppend]);

  // Wrapper para stop
  const stop = useCallback(() => {
    if (sdkStop) {
      sdkStop();
    }
  }, [sdkStop]);

  // Wrapper para setMessages
  const setMessages = useCallback((messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    if (sdkSetMessages) {
      // Convertir de ChatMessage a UIMessage format
      const converted = typeof messages === 'function' ? messages : messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
      }));
      sdkSetMessages(converted as any);
    }
  }, [sdkSetMessages]);

  // Funciones de gestión de sesiones (stubs por ahora, pueden implementarse después)
  const createNewChat = useCallback(() => {
    const newId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: newId,
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChatSessions(prev => [...prev, newSession]);
    setCurrentChatId(newId);
    setMessages([]);
  }, [setMessages]);

  const switchToChat = useCallback((chatId: string) => {
    const session = chatSessions.find(s => s.id === chatId);
    if (session) {
      setCurrentChatId(chatId);
      setMessages(session.messages);
    }
  }, [chatSessions, setMessages]);

  const deleteChat = useCallback((chatId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  }, [currentChatId, setMessages]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    stop,
    setMessages,
    error,
    chatSessions,
    currentChatId,
    createNewChat,
    switchToChat,
    deleteChat,
  };
}
