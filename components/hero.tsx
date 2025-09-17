"use client";
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import FloatingElements3D from './FloatingElements3D';
import FallingStarsEffect from './FallingStarsEffect';
import { ThesisPresentationSection } from './sections/ThesisPresentationSection';
import { 
  IconBook, 
  IconCalendar, 
  IconMail, 
  IconCertificate,
  IconPencil,
  IconCalculator,
  IconBulb,
  IconClipboardList,
  IconBookmark,
  IconFlask,
  IconAtom,
  IconSchool,
  IconNotebook,
  IconEdit,
  IconMath,
  IconClipboard
} from "@tabler/icons-react";

export function Hero() {
  const parentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={parentRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 md:px-8 md:py-32"
    >
      <BackgroundGrids />
      <FloatingElements3D />
      <FallingStarsEffect />
      <FloatingAcademicIcons />
      <AnimatedBeams containerRef={containerRef} parentRef={parentRef} />

      {/* Logo USAL */}
      <div className="relative z-30 mx-auto mb-6 flex justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-usal-green-200">
          <img 
            src="/usal-logo.jpg" 
            alt="Universidad del Salvador" 
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>

      <h2 className="text-balance relative z-30 mx-auto mb-4 mt-4 max-w-4xl text-center text-3xl font-semibold tracking-tight text-usal-navy-800 md:text-7xl">
        <Balancer>
          <span className="bg-gradient-to-r from-usal-green-600 to-usal-green-500 bg-clip-text text-transparent">
            Testis
          </span>{" "}
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(34,197,94,0.2))]">
            <div className="text-usal-navy-900 [text-shadow:0_0_rgba(34,197,94,0.1)]">
              <span className="">Asistente SIU Guaraní</span>
            </div>
          </div>
        </Balancer>
      </h2>
      <p className="relative z-30 mx-auto mt-4 max-w-xl px-4 text-center text-base/6 text-usal-navy-600">
        Tu compañero virtual para navegar el SIU Guaraní de la USAL. 
        Inscripciones, horarios, notas, parciales y más, todo en un solo lugar.
      </p>
      <div className="mb-10 mt-8 flex w-full flex-col items-center justify-center gap-4 px-8 sm:flex-row md:mb-20">
        <Link
          href="https://www.usal.edu.ar"
          className="group relative z-20 flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-usal-green-600 to-usal-green-500 p-px px-4 py-2 text-center text-sm font-semibold leading-6 text-white no-underline transition duration-200 hover:from-usal-green-700 hover:to-usal-green-600 sm:w-52"
        >
          Portal USAL
        </Link>
        <Link
          href="https://autogestion.usal.edu.ar/autogestion/acceso/login?ref=https://autogestion.usal.edu.ar/autogestion/inicio_alumno"
          className="group relative z-20 flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-white p-px px-4 py-2 text-sm font-semibold leading-6 text-usal-navy-800 no-underline shadow-input transition duration-200 hover:-translate-y-0.5 hover:bg-usal-gold-50 sm:w-52"
        >
          SIU Guaraní
        </Link>
      </div>
      
      {/* Demo Container - Now with two sections side by side */}
      <div
        ref={containerRef}
        className="relative z-30 mx-auto mt-16 max-w-7xl space-y-8 lg:space-y-0"
      >
        {/* Two columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Testis Demo Section */}
          <div 
            data-demo-container
            className="rounded-[32px] border border-usal-green-200/50 bg-gradient-to-br from-usal-green-50/90 to-white/90 p-2 backdrop-blur-lg md:p-4 shadow-xl"
      >
        <div className="rounded-[24px] border border-usal-green-200 bg-white p-4">
          <ChatbotDemo />
            </div>
          </div>

          {/* Thesis Presentation Section */}
          <div 
            data-demo-container
            className="rounded-[32px] border border-usal-navy-200/50 bg-gradient-to-br from-usal-navy-50/90 to-white/90 p-2 backdrop-blur-lg md:p-4 shadow-xl"
          >
            <div className="rounded-[24px] border border-usal-navy-200 bg-white p-4">
              <ThesisPresentationSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BackgroundGrids = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 grid h-full w-full -rotate-45 transform select-none grid-cols-2 gap-10 md:grid-cols-4">
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full bg-gradient-to-b from-transparent via-neutral-100 to-transparent">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
    </div>
  );
};

// Componente de iconos flotantes académicos
const FloatingAcademicIcons = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const icons = [
    // Elementos básicos de estudio
    { Icon: IconBook, color: "text-usal-green-500", size: "h-8 w-8", delay: 0 },
    { Icon: IconPencil, color: "text-usal-red-500", size: "h-6 w-6", delay: 0.5 },
    { Icon: IconNotebook, color: "text-usal-gold-500", size: "h-7 w-7", delay: 1 },
    { Icon: IconEdit, color: "text-usal-navy-500", size: "h-6 w-6", delay: 1.5 },
    
    // Elementos académicos
    { Icon: IconSchool, color: "text-usal-green-600", size: "h-9 w-9", delay: 2 },
    { Icon: IconCertificate, color: "text-usal-red-600", size: "h-8 w-8", delay: 2.5 },
    { Icon: IconClipboardList, color: "text-usal-gold-600", size: "h-7 w-7", delay: 3 },
    { Icon: IconBookmark, color: "text-usal-navy-600", size: "h-6 w-6", delay: 3.5 },
    
    // Elementos de ciencias
    { Icon: IconCalculator, color: "text-usal-green-400", size: "h-7 w-7", delay: 4 },
    { Icon: IconFlask, color: "text-usal-red-400", size: "h-8 w-8", delay: 4.5 },
    { Icon: IconAtom, color: "text-usal-gold-400", size: "h-8 w-8", delay: 5 },
    { Icon: IconMath, color: "text-usal-navy-400", size: "h-7 w-7", delay: 5.5 },
    
    // Elementos de comunicación
    { Icon: IconMail, color: "text-usal-green-700", size: "h-6 w-6", delay: 6 },
    { Icon: IconCalendar, color: "text-usal-red-700", size: "h-7 w-7", delay: 6.5 },
    
    // Elementos de inspiración
    { Icon: IconBulb, color: "text-usal-gold-300", size: "h-8 w-8", delay: 7 },
    { Icon: IconClipboard, color: "text-usal-navy-300", size: "h-6 w-6", delay: 7.5 },
    
    // Más libros y elementos de estudio (duplicados con diferentes posiciones)
    { Icon: IconBook, color: "text-usal-green-300", size: "h-6 w-6", delay: 8 },
    { Icon: IconNotebook, color: "text-usal-red-300", size: "h-8 w-8", delay: 8.5 },
    { Icon: IconPencil, color: "text-usal-gold-700", size: "h-5 w-5", delay: 9 },
    { Icon: IconBook, color: "text-usal-navy-700", size: "h-7 w-7", delay: 9.5 },
    
    // Elementos adicionales de estudio
    { Icon: IconSchool, color: "text-usal-green-200", size: "h-6 w-6", delay: 10 },
    { Icon: IconCalculator, color: "text-usal-red-200", size: "h-5 w-5", delay: 10.5 },
    { Icon: IconFlask, color: "text-usal-gold-200", size: "h-7 w-7", delay: 11 },
    { Icon: IconEdit, color: "text-usal-navy-200", size: "h-6 w-6", delay: 11.5 },
  ];

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => {
        // Generar posiciones completamente aleatorias
        const leftPosition = Math.random() * 85 + 5; // Entre 5% y 90%
        const topPosition = Math.random() * 70 + 10; // Entre 10% y 80%
        const animationDuration = 12 + Math.random() * 8; // Entre 12 y 20 segundos
        
        // Movimientos aleatorios para cada icono
        const randomMoveX = Math.random() * 40 - 20; // Entre -20 y 20
        const randomMoveY = Math.random() * 60 - 30; // Entre -30 y 30
        
        return (
          <motion.div
            key={index}
            className={`absolute ${item.color} opacity-15 hover:opacity-30 transition-opacity duration-500`}
            initial={{ 
              x: Math.random() * 50 - 25,
              y: Math.random() * 50 - 25,
              scale: 0,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: [0, randomMoveY, 0, randomMoveY * 0.5, 0],
              x: [0, randomMoveX, 0, randomMoveX * -0.3, 0],
              scale: [0, 1, 0.9, 1.1, 1],
              rotate: [null, 360 + Math.random() * 180],
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              delay: item.delay + Math.random() * 2, // Añade variación al delay
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
            style={{
              left: `${leftPosition}%`,
              top: `${topPosition}%`,
            }}
          >
            <item.Icon className={item.size} />
          </motion.div>
        );
      })}
      
      {/* Elementos adicionales que aparecen y desaparecen */}
      {Array.from({ length: 8 }, (_, index) => {
        const randomLeft = Math.random() * 80 + 10; // Entre 10% y 90%
        const randomTop = Math.random() * 60 + 15; // Entre 15% y 75%
        
        return (
          <motion.div
            key={`extra-${index}`}
            className="absolute text-usal-green-200 opacity-10"
            initial={{ 
              scale: 0,
              rotate: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.2, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 8, // Entre 10 y 18 segundos
              repeat: Infinity,
              delay: 8 + Math.random() * 6, // Delay aleatorio entre 8 y 14 segundos
              ease: "easeInOut"
            }}
            style={{
              left: `${randomLeft}%`,
              top: `${randomTop}%`,
            }}
          >
            <IconBook className="h-5 w-5" />
          </motion.div>
        );
      })}
    </div>
  );
};

// Componente de rayos animados
const AnimatedBeams = ({ containerRef, parentRef }: { 
  containerRef: React.RefObject<HTMLDivElement>;
  parentRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <>
      <BeamEffect
        containerRef={containerRef}
        parentRef={parentRef}
        className="left-1/4 top-20"
        color="from-usal-green-500 via-usal-green-400 to-transparent"
        duration={8}
        delay={0}
      />
      <BeamEffect
        containerRef={containerRef}
        parentRef={parentRef}
        className="right-1/4 top-32"
        color="from-usal-red-500 via-usal-red-400 to-transparent"
        duration={6}
        delay={2}
      />
      <BeamEffect
        containerRef={containerRef}
        parentRef={parentRef}
        className="left-1/3 top-16"
        color="from-usal-gold-500 via-usal-gold-400 to-transparent"
        duration={7}
        delay={4}
      />
    </>
  );
};

// Efecto de rayo individual
const BeamEffect = ({ 
  containerRef, 
  parentRef, 
  className, 
  color, 
  duration, 
  delay 
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  parentRef: React.RefObject<HTMLDivElement>;
  className: string;
  color: string;
  duration: number;
  delay: number;
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });

  useEffect(() => {
    const checkCollision = () => {
      if (beamRef.current && containerRef.current && parentRef.current) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
        }
      }
    };

    const interval = setInterval(checkCollision, 50);
    return () => clearInterval(interval);
  }, [containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected) {
      setTimeout(() => setCollision({ detected: false, coordinates: null }), 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        ref={beamRef}
        className={cn(
          "absolute h-14 w-px rounded-full bg-gradient-to-t",
          color,
          className
        )}
        initial={{ translateY: -200, opacity: 0 }}
        animate={{ 
          translateY: [null, 800],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration,
          repeat: Infinity,
          delay,
          ease: "linear",
          repeatDelay: 3,
        }}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute z-30 h-4 w-4 rounded-full bg-usal-green-400"
            style={{
              left: collision.coordinates.x,
              top: collision.coordinates.y,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Demo del chatbot mejorada
const ChatbotDemo = () => {
  const [currentConversation, setCurrentConversation] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<Array<{role: string, content: string, avatar?: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');

  // Conversaciones predefinidas más dinámicas
  const conversations = [
    {
      title: "Consulta de Notas",
      messages: [
        { role: 'user', content: '¿Cómo consulto mis notas del parcial?', avatar: '👤' },
        { role: 'assistant', content: '¡Por supuesto! Te ayudo con eso. Ve a "Académico" → "Notas" → selecciona el período actual.', avatar: '🤖' },
        { role: 'user', content: '¡Genial! ¿Y si quiero ver el promedio general?', avatar: '👤' },
        { role: 'assistant', content: 'Perfecto. En la misma sección, haz click en "Ver Historial Completo" y verás tu promedio actualizado.', avatar: '🤖' }
      ]
    },
    {
      title: "Inscripción a Materias",
      messages: [
        { role: 'user', content: 'Necesito inscribirme a materias para el próximo cuatrimestre', avatar: '👤' },
        { role: 'assistant', content: 'Te guío paso a paso: Ve a "Inscripciones" → "Cursar Materias" → selecciona el período 2024-2.', avatar: '🤖' },
        { role: 'user', content: '¿Qué hago si una materia está llena?', avatar: '👤' },
        { role: 'assistant', content: 'Puedes anotarte en lista de espera o elegir otro horario. Te mostraré todas las opciones disponibles.', avatar: '🤖' }
      ]
    },
    {
      title: "Horarios de Cursada",
      messages: [
        { role: 'user', content: 'No encuentro mis horarios de clase', avatar: '👤' },
        { role: 'assistant', content: '¡No te preocupes! Ve a "Académico" → "Mi Horario Semanal" y verás todas tus clases organizadas.', avatar: '🤖' },
        { role: 'user', content: '¿Puedo exportar el horario al calendario?', avatar: '👤' },
        { role: 'assistant', content: '¡Claro! Hay un botón "Exportar a Google Calendar" que sincroniza automáticamente tus horarios.', avatar: '🤖' }
      ]
    }
  ];

  const quickActions = [
    { icon: '📚', text: 'Ver Notas', color: 'bg-blue-100 text-blue-700' },
    { icon: '📝', text: 'Inscripciones', color: 'bg-green-100 text-green-700' },
    { icon: '📅', text: 'Horarios', color: 'bg-purple-100 text-purple-700' },
    { icon: '💰', text: 'Pagos', color: 'bg-orange-100 text-orange-700' }
  ];

  // Efecto de escritura
  const typeMessage = (message: string, callback: () => void) => {
    setTypingText('');
    setIsTyping(true);
    
    let i = 0;
    const typeInterval = setInterval(() => {
      setTypingText(message.slice(0, i + 1));
      i++;
      
      if (i >= message.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setIsTyping(false);
          callback();
        }, 500);
      }
    }, 30);
  };

  // Lógica para mostrar mensajes progresivamente
  useEffect(() => {
    const conversation = conversations[currentConversation];
    
    if (currentMessage < conversation.messages.length) {
      const message = conversation.messages[currentMessage];
      
      const timer = setTimeout(() => {
        if (message.role === 'assistant') {
          typeMessage(message.content, () => {
            setDisplayedMessages(prev => [...prev, message]);
            setCurrentMessage(prev => prev + 1);
          });
        } else {
          setDisplayedMessages(prev => [...prev, message]);
          setCurrentMessage(prev => prev + 1);
        }
      }, currentMessage === 0 ? 1000 : 2000);
      
      return () => clearTimeout(timer);
    } else {
      // Cambiar a la siguiente conversación después de un pausa
      const nextConversationTimer = setTimeout(() => {
        setCurrentConversation((prev) => (prev + 1) % conversations.length);
        setCurrentMessage(0);
        setDisplayedMessages([]);
        setTypingText('');
        setIsTyping(false);
      }, 4000);
      
      return () => clearTimeout(nextConversationTimer);
    }
  }, [currentMessage, currentConversation]);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-usal-navy-900 mb-2">
          Prueba Testis en Acción
        </h3>
        <p className="text-usal-navy-600 mb-4">
          Mira cómo Testis resuelve consultas reales de estudiantes
        </p>
        
        {/* Indicador de conversación actual */}
        <div className="flex justify-center space-x-2 mb-4">
          {conversations.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                index === currentConversation ? 'bg-usal-green-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        <div className="text-sm font-medium text-usal-green-600 mb-2">
          {conversations[currentConversation].title}
        </div>
      </div>
      
      {/* Chat Container - DIMENSIONES FIJAS */}
      <div className="bg-gradient-to-br from-usal-green-50 to-white rounded-xl border border-usal-green-200 shadow-inner w-full h-[500px] flex flex-col">
        {/* Chat Header - ALTURA FIJA */}
        <div className="flex items-center justify-between p-4 border-b border-usal-green-100 h-[72px] flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-usal-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">T</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-usal-navy-900 truncate">Testis</div>
              <div className="text-xs text-usal-green-600 truncate">
                {isTyping ? 'Escribiendo...' : 'En línea'}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 flex-shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
        
        {/* Messages - ALTURA FIJA CON SCROLL */}
        <div className="p-4 h-[356px] overflow-y-auto space-y-4 flex-1">
          {displayedMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-usal-green-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {message.avatar}
                </div>
              )}
              
              <div className={`max-w-[280px] min-w-[120px] px-4 py-3 rounded-2xl shadow-sm ${
                message.role === 'user' 
                  ? 'bg-usal-green-500 text-white rounded-br-md' 
                  : 'bg-white text-usal-navy-800 border border-usal-green-100 rounded-bl-md'
              }`}>
                <div className="text-sm leading-relaxed break-words">
                  {message.content}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-usal-navy-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {message.avatar}
                </div>
              )}
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="w-8 h-8 bg-usal-green-100 rounded-full flex items-center justify-center text-lg">
                🤖
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-usal-green-100 shadow-sm max-w-[280px] min-w-[120px]">
                <div className="text-sm text-usal-navy-800 break-words">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Quick Actions - ALTURA FIJA */}
        <div className="p-4 border-t border-usal-green-100 bg-usal-green-25 h-[72px] flex-shrink-0 flex flex-col justify-center">
          <div className="text-xs text-usal-navy-600 mb-2 text-center">
            Acciones rápidas
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${action.color} hover:shadow-md`}
              >
                <span className="mr-1">{action.icon}</span>
                {action.text}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.3)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "",
        className
      )}
    ></div>
  );
};
