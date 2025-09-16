"use client";
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
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
      
      {/* Demo Container */}
      <div
        ref={containerRef}
        className="relative z-30 mx-auto mt-16 max-w-6xl rounded-[32px] border border-usal-green-200/50 bg-gradient-to-br from-usal-green-50/90 to-white/90 p-2 backdrop-blur-lg md:p-4"
      >
        <div className="rounded-[24px] border border-usal-green-200 bg-white p-4">
          <ChatbotDemo />
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

// Demo del chatbot
const ChatbotDemo = () => {
  const [messages, setMessages] = useState([
    { role: 'user', content: '¿Cómo consulto mis notas?' },
    { role: 'assistant', content: 'Te guío paso a paso para consultar tus notas en el SIU Guaraní...' }
  ]);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-usal-navy-900 mb-2">
          Prueba Testis en Acción
        </h3>
        <p className="text-usal-navy-600">
          Interactúa con nuestro asistente y descubre lo fácil que es gestionar tu vida académica
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-usal-green-50 to-white rounded-xl p-4 min-h-[300px] border border-usal-green-200">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.5 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-usal-green-600 text-white' 
                  : 'bg-white text-usal-navy-800 border border-usal-green-200'
              }`}>
                {message.content}
              </div>
            </motion.div>
          ))}
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
