"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconPlayerStopFilled,
  IconPlus,
  IconX,
  IconMaximize,
  IconMail,
  IconBook,
  IconCalendar,
  IconCertificate,
  IconSchool,
  IconRobot,
  IconHistory,
  IconTrash,
  IconMessageDots,
  IconChevronLeft,
  IconChevronRight,
  IconStarFilled,
  IconPaperclip,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  animate,
} from "framer-motion";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useTestisChat, ChatMessage as TestisChatMessage } from "@/lib/hooks/useTestisChat";
import { openMailTo } from "@/lib/skills/makeMailTo";
import { loadDemoData } from "@/lib/skills/readUserData";
import { useSession } from "next-auth/react";
import { useSatisfactionSurvey } from "@/lib/hooks/useSatisfactionSurvey";
import { SatisfactionSurvey } from "../SatisfactionSurvey";

export const TestisChat = () => {
  const [open, setOpen] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const messageHistoryRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: session } = useSession();
  const [attachment, setAttachment] = useState<{ name: string; content: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    stop,
    setMessages,
    error,
    chatSessions,
    currentChatId,
    createNewChat,
    switchToChat,
    deleteChat,
  } = useTestisChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hook de encuesta de satisfacción
  const survey = useSatisfactionSurvey();

  // Bloques de acceso rápido específicos para Testis con colores USAL
  const quickAccessBlocks = [
    {
      icon: <IconBook className="h-6 w-6 text-usal-green-600" />,
      title: "Inscripción",
      content: "¿Cómo me inscribo a las materias?",
      color: "bg-usal-green-50 hover:bg-usal-green-100 border border-usal-green-200"
    },
    {
      icon: <IconCalendar className="h-6 w-6 text-usal-red-600" />,
      title: "Horarios",
      content: "Ver mis horarios de cursada",
      color: "bg-usal-red-50 hover:bg-usal-red-100 border border-usal-red-200"
    },
    {
      icon: <IconSchool className="h-6 w-6 text-usal-gold-600" />,
      title: "Notas",
      content: "Consultar mis calificaciones",
      color: "bg-usal-gold-50 hover:bg-usal-gold-100 border border-usal-gold-200"
    },
    {
      icon: <IconCalendar className="h-6 w-6 text-usal-navy-600" />,
      title: "Parciales",
      content: "Ver próximos exámenes",
      color: "bg-usal-navy-50 hover:bg-usal-navy-100 border border-usal-navy-200"
    },
    {
      icon: <IconCertificate className="h-6 w-6 text-usal-green-700" />,
      title: "Certificados",
      content: "Generar constancias y certificados",
      color: "bg-usal-green-50 hover:bg-usal-green-100 border border-usal-green-200"
    },
    {
      icon: <IconMail className="h-6 w-6 text-usal-red-700" />,
      title: "Correos",
      content: "Enviar mail a docentes",
      color: "bg-usal-red-50 hover:bg-usal-red-100 border border-usal-red-200"
    }
  ];

  const handleBlockClick = (content: string) => {
    append({
      role: "user",
      content: content,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollIntoView = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollButton(false);
      setIsUserScrolledUp(false);
      setAutoScroll(true);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setAttachment({
          name: file.name,
          content: content, // Data URL complete (e.g. data:application/pdf;base64,...)
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Prepare data payload with attachment if exists
    const options = attachment ? {
      data: {
        attachments: [{
          filename: attachment.name,
          content: attachment.content.split(',')[1], // Remove data: prefix for nodemailer
          encoding: 'base64',
          contentType: attachment.type
        }]
      }
    } : undefined;

    handleSubmit(e, options);
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Cargar datos de ejemplo al montar el componente
  useEffect(() => {
    loadDemoData();
  }, []);

  // Sincronizar contador de mensajes con la encuesta
  useEffect(() => {
    survey.setMessageCount(messages.length);

    // Intentar mostrar encuesta si corresponde
    if (messages.length > 0) {
      survey.checkAndShowSurvey();
    }
  }, [messages.length, survey]);

  // Efectos para el scroll
  useEffect(() => {
    const handleUserScroll = () => {
      if (messageHistoryRef.current) {
        const isAtBottom =
          messageHistoryRef.current.scrollHeight -
          messageHistoryRef.current.scrollTop ===
          messageHistoryRef.current.clientHeight;
        setIsUserScrolledUp(!isAtBottom);
      }
    };

    messageHistoryRef.current?.addEventListener("scroll", handleUserScroll);
    return () => {
      messageHistoryRef.current?.removeEventListener("scroll", handleUserScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setTimeout(() => {
        setShowScrollButton(!entry.isIntersecting);
      }, 100);
    });

    if (messagesEndRef.current) {
      const currentRef = messagesEndRef.current;
      observer.observe(currentRef);
      return () => {
        observer.unobserve(currentRef);
      };
    }
  }, [messages]);

  useEffect(() => {
    if (!isUserScrolledUp && messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isUserScrolledUp]);

  useEffect(() => {
    if (autoScroll && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  return (
    <div className={cn(
      "fixed bottom-10 right-10 flex flex-col items-end z-50 bubble-container",
      isExpanded && "bottom-0 right-0 w-screen h-screen bg-black/30 backdrop-blur-sm flex items-center justify-center"
    )}>
      <motion.div
        initial={false}
        animate={isExpanded ? {
          opacity: [0, 0, 1],
          scale: [1, 0.98, 1],
          y: [0, 10, 0],
          rotateX: [0, 5, 0]
        } : {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0
        }}
        transition={{
          duration: 0.3,
          times: [0, 0.4, 1]
        }}
        className={cn(
          "fixed md:relative inset-0 z-20",
          isExpanded && "w-[80%] h-[80%] relative"
        )}
      >
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="fixed md:hidden top-2 right-2 z-40"
          >
            <IconX />
          </button>
        )}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 20, rotateX: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mb-4 h-screen md:h-[46vh] min-h-[76vh] w-full md:w-[30rem] bg-gradient-to-br from-usal-green-50 to-white rounded-lg flex flex-col justify-between overflow-hidden border border-usal-green-200 relative",
                isExpanded && "w-full h-full md:h-full md:w-full min-h-0 mb-0"
              )}
              style={{
                backgroundImage: 'url(/usal-logo.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: isExpanded ? 'auto 35%' : 'auto 30%',
                backgroundAttachment: 'fixed',
              }}
            >
              {/* Overlay único para todo el chat */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-usal-green-50/80 pointer-events-none" />
              {/* Header */}
              <div className="h-10 w-full bg-gradient-to-r from-usal-green-600 via-usal-green-500 to-usal-green-700 rounded-tr-lg rounded-tl-lg flex justify-between px-10 md:px-6 py-2 relative z-20">
                <div className="font-medium text-sm flex items-center gap-2 text-white">
                  <button
                    onClick={() => {
                      setIsExpanded(!isExpanded);
                    }}
                    className="hover:bg-white/20 p-1 rounded-full transition-colors"
                  >
                    <IconMaximize className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    className="hover:bg-white/20 p-1 rounded-full transition-colors"
                    title="Historial de chats"
                  >
                    <IconHistory className="h-4 w-4 text-white" />
                  </button>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-usal-gold-400 rounded-full"></div>
                    Testis{session ? ` - ${session.user?.name?.split(' ')[0] || 'Usuario'}` : ' - Asistente SIU'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Botón de Encuesta de Satisfacción */}
                  <button
                    onClick={() => {
                      console.log('🌟 Botón de encuesta clickeado!');
                      survey.triggerSurvey();
                    }}
                    className="rounded-full bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 transition-colors shadow-lg"
                    title="Compartir feedback"
                  >
                    <IconStarFilled className="h-4 w-4" />
                  </button>

                  <motion.button
                    className="rounded-full bg-white/20 text-white px-2 py-0.5 text-sm flex items-center justify-center gap-1 overflow-hidden"
                    onClick={() => createNewChat()}
                    whileHover="hover"
                    initial="initial"
                    animate="initial"
                    variants={{
                      initial: { width: "4rem" },
                      hover: { width: "4rem" },
                    }}
                  >
                    <motion.div
                      variants={{
                        initial: { opacity: 0, width: 0 },
                        hover: { opacity: 1, width: "3.5rem" },
                      }}
                    >
                      <IconPlus className="h-4 w-4 flex-shrink-0" />
                    </motion.div>
                    <motion.span>New</motion.span>
                  </motion.button>
                </div>
              </div>

              {/* Chat History Sidebar */}
              <AnimatePresence>
                {showChatHistory && (
                  <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-10 left-0 w-80 h-[calc(100%-2.5rem)] bg-white border-r border-usal-green-200 z-30 flex flex-col"
                  >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-usal-green-200 flex items-center justify-between">
                      <h3 className="font-semibold text-usal-navy-900 flex items-center gap-2">
                        <IconHistory className="h-4 w-4" />
                        Historial
                      </h3>
                      <button
                        onClick={() => setShowChatHistory(false)}
                        className="p-1 hover:bg-usal-green-100 rounded transition-colors"
                      >
                        <IconChevronLeft className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto">
                      {chatSessions.length === 0 ? (
                        <div className="p-4 text-center text-usal-navy-500">
                          <IconMessageDots className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No hay conversaciones aún</p>
                        </div>
                      ) : (
                        <div className="p-2 space-y-1">
                          {chatSessions.map((chat) => (
                            <motion.button
                              key={chat.id}
                              onClick={() => {
                                switchToChat(chat.id);
                                setShowChatHistory(false);
                              }}
                              className={cn(
                                "w-full text-left p-3 rounded-lg transition-colors group relative",
                                currentChatId === chat.id
                                  ? "bg-usal-green-100 border border-usal-green-200"
                                  : "hover:bg-usal-green-50"
                              )}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-usal-navy-900 truncate">
                                    {chat.title}
                                  </h4>
                                  <p className="text-xs text-usal-navy-500 mt-1">
                                    {chat.messages.length} mensajes
                                  </p>
                                  <p className="text-xs text-usal-navy-400 mt-0.5">
                                    {new Intl.DateTimeFormat('es-AR', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }).format(new Date(chat.updatedAt))}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (chatSessions.length > 1) {
                                      deleteChat(chat.id);
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                                  disabled={chatSessions.length <= 1}
                                >
                                  <IconTrash className="h-3 w-3 text-red-500" />
                                </button>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-usal-green-200">
                      <button
                        onClick={() => {
                          createNewChat();
                          setShowChatHistory(false);
                        }}
                        className="w-full bg-usal-green-500 hover:bg-usal-green-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <IconPlus className="h-4 w-4" />
                        Nueva conversación
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Access Blocks */}
              {!messages.length && (
                <div className="px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto relative z-10">
                  {quickAccessBlocks.map((block, index) => (
                    <motion.button
                      key={block.title}
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.3, delay: 0.2 * index }}
                      onClick={() => handleBlockClick(block.content)}
                      className={cn(
                        "p-4 flex flex-col text-left justify-between rounded-2xl h-32 md:h-40 w-full transition-colors",
                        block.color
                      )}
                    >
                      {block.icon}
                      <div>
                        <div className="text-base font-bold text-gray-800">
                          {block.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {block.content}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div
                ref={messageHistoryRef}
                className="p-2 flex flex-1 overflow-y-auto relative z-10"
              >
                <div className="flex flex-1 flex-col">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.role === "user" ? (
                        <UserMessage content={message.content} />
                      ) : (
                        <AIMessage
                          content={message.content}
                        />
                      )}
                    </div>
                  ))}
                  <div className="pb-10" ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleFormSubmit}
                className="max-h-[15vh] py-1 px-5 relative z-20"
              >
                {/* File Preview */}
                {attachment && (
                  <div className="absolute -top-12 left-5 bg-white border border-usal-green-200 rounded-lg p-2 flex items-center gap-2 shadow-sm">
                    <IconPaperclip className="h-4 w-4 text-usal-green-600" />
                    <span className="text-xs text-usal-navy-700 max-w-[150px] truncate">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachment(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="hover:bg-red-50 rounded-full p-0.5"
                    >
                      <IconX className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {showScrollButton && (
                  <button
                    onClick={scrollIntoView}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-usal-green-600 text-white flex items-center justify-center shadow-lg hover:bg-usal-green-700 transition-colors"
                  >
                    <IconArrowNarrowDown className="h-5 w-5" />
                  </button>
                )}
                <AnimatePresence>
                  {isLoading ? (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={stop}
                      className="absolute top-1/2 right-8 group -translate-y-1/2 bg-red-500 h-8 w-8 rounded-full flex items-center justify-center"
                    >
                      <IconPlayerStopFilled className="h-5 w-5 text-white group-hover:rotate-12 transition duration-200" />
                    </motion.button>
                  ) : (
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="group bg-gray-100 hover:bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                        title="Adjuntar archivo"
                      >
                        <IconPaperclip className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition duration-200" />
                      </button>
                      <button
                        type="submit"
                        className="group bg-usal-green-100 hover:bg-usal-green-200 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
                      >
                        <IconArrowNarrowUp className="h-5 w-5 text-usal-green-600 group-hover:text-usal-green-700 group-hover:-translate-y-0.5 group-hover:rotate-12 transition duration-200" />
                      </button>
                    </div>
                  )}
                </AnimatePresence>
                <textarea
                  ref={inputRef}
                  disabled={isLoading}
                  className="px-4 w-full pr-10 rounded-lg border-usal-green-200 text-usal-navy-800 border py-[1rem] bg-white text-sm [box-sizing:border-box] overflow-x-auto inline-block focus:outline-none focus:border-usal-green-400 focus:ring-2 focus:ring-usal-green-100 transition duration-100"
                  placeholder={session
                    ? `Hola ${session.user?.name?.split(' ')[0]}, ¿cómo puedo ayudarte con el SIU Guaraní?`
                    : "Pregúntame sobre el SIU Guaraní..."
                  }
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleFormSubmit();
                    }
                  }}
                  style={{ resize: "none" }}
                  rows={1}
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Toggle Button 3D */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={cn(
          "h-14 w-14 relative z-10 group bg-gradient-to-r from-usal-green-600 to-usal-green-500 flex hover:from-usal-green-700 hover:to-usal-green-600 cursor-pointer items-center justify-center rounded-full shadow-xl transition duration-200",
          open ? "z-10" : "z-50",
          isExpanded && "hidden"
        )}
        style={{
          transform: 'perspective(1000px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
        animate={{
          rotateY: [0, 15, -15, 0],
          rotateX: [0, -5, 5, 0],
          z: [0, 20, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.1,
          rotateY: 25,
          rotateX: -10,
          z: 30,
          boxShadow: '0 35px 60px -12px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          transition: { duration: 0.2 }
        }}
        whileTap={{
          scale: 0.95,
          rotateY: -15,
          rotateX: 10,
          transition: { duration: 0.1 }
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-usal-green-400 to-usal-green-300 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            filter: 'blur(8px)',
            transform: 'scale(1.2)',
          }}
        />

        {/* Inner glow */}
        <div
          className="absolute inset-1 rounded-full bg-gradient-to-r from-white/20 to-white/10"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
          }}
        />

        <motion.div
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <IconRobot className="h-6 w-6 text-white relative z-10 drop-shadow-sm" />
        </motion.div>

        {/* Floating particles around button */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-usal-green-300 rounded-full opacity-60"
            style={{
              top: `${20 + i * 15}%`,
              left: `${15 + i * 20}%`,
            }}
            animate={{
              y: [-5, 5, -5],
              x: [-3, 3, -3],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + i * 0.5,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.button>

      {/* Encuesta de Satisfacción */}
      <SatisfactionSurvey
        isOpen={survey.showSurvey}
        onClose={survey.closeSurvey}
        onSubmit={survey.submitSurvey}
        messagesCount={messages.length}
        sessionDuration={survey.metrics.sessionDuration}
        categoriesUsed={survey.metrics.categoriesUsed}
      />

      {/* DEBUG: Indicador visual */}
      {survey.showSurvey && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]">
          ⚠️ Encuesta abierta!
        </div>
      )}
    </div>
  );
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="p-2 rounded-lg flex gap-2 items-start justify-end">
      <div className="text-sm px-4 py-2 rounded-lg shadow-md w-fit bg-gradient-to-br from-usal-green-500 to-usal-green-600 text-white">
        {content}
      </div>
    </div>
  );
};

const AIMessage = ({
  content
}: {
  content: string;
}) => {
  return (
    <div className="p-2 rounded-lg flex gap-2 items-start">
      <div className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-usal-gold-500 to-usal-gold-600">
        <IconRobot className="h-4 w-4 text-white" />
      </div>
      <div className="text-sm px-3 py-2 rounded-lg shadow-md w-fit bg-white text-usal-navy-800 border border-usal-green-100">
        <Markdown>{useAnimatedText(content)}</Markdown>
      </div>
    </div>
  );
};

// ToolCallResult ya no es necesario porque el nuevo sistema de chat
// resuelve todo en el servidor (2-step flow sin tool calls visibles)

let delimiter = "";

export function useAnimatedText(text: string) {
  const [cursor, setCursor] = useState(0);
  const [startingCursor, setStartingCursor] = useState(0);
  const [prevText, setPrevText] = useState(text);

  if (prevText !== text) {
    setPrevText(text);
    setStartingCursor(text.startsWith(prevText) ? cursor : 0);
  }

  useEffect(() => {
    const controls = animate(startingCursor, text.split(delimiter).length, {
      duration: 2,
      ease: "easeOut",
      onUpdate(latest) {
        setCursor(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [startingCursor, text]);

  return text.split(delimiter).slice(0, cursor).join(delimiter);
}
