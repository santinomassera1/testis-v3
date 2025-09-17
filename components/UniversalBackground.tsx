'use client';

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import FloatingElements3D from './FloatingElements3D';
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

interface UniversalBackgroundProps {
  intensity?: 'light' | 'medium' | 'full';
  className?: string;
}

export default function UniversalBackground({ intensity = 'medium', className }: UniversalBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={parentRef} className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Background Grids */}
      <BackgroundGrids />
      
      {/* Floating Particles - En todas las intensidades */}
      <FloatingParticles intensity={intensity} />
      
      {/* Floating Academic Icons - Medium y Full */}
      {(intensity === 'medium' || intensity === 'full') && <FloatingAcademicIcons />}
      
      {/* Floating 3D Geometric Shapes - Medium y Full */}
      {(intensity === 'medium' || intensity === 'full') && <FloatingElements3D />}
      
      {/* Single Light Beam - Medium intensity */}
      {intensity === 'medium' && (
        <AnimatedBeam
          containerRef={containerRef}
          parentRef={parentRef}
          beamOptions={{
            initialX: -100,
            translateX: 400,
            duration: 15,
            repeatDelay: 10,
            className: "bg-gradient-to-t from-usal-green-400 via-usal-green-300 to-transparent opacity-15"
          }}
        />
      )}
      
      {/* Multiple Animated Beams (Comets) - Full intensity */}
      {intensity === 'full' && <AnimatedBeams containerRef={containerRef} parentRef={parentRef} />}
    </div>
  );
}

// Componente de grids de fondo
const BackgroundGrids = () => {
  return (
    <div className="absolute inset-0 z-0 grid h-full w-full -rotate-45 transform select-none grid-cols-2 gap-10 md:grid-cols-4 opacity-20">
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full bg-gradient-to-b from-transparent via-usal-green-50 to-transparent">
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
    { Icon: IconBook, color: "text-usal-green-500", size: "h-6 w-6", delay: 0, opacity: "opacity-20" },
    { Icon: IconPencil, color: "text-usal-red-500", size: "h-5 w-5", delay: 0.5, opacity: "opacity-15" },
    { Icon: IconNotebook, color: "text-usal-gold-500", size: "h-6 w-6", delay: 1, opacity: "opacity-20" },
    { Icon: IconEdit, color: "text-usal-navy-500", size: "h-5 w-5", delay: 1.5, opacity: "opacity-15" },
    
    // Elementos académicos
    { Icon: IconSchool, color: "text-usal-green-600", size: "h-7 w-7", delay: 2, opacity: "opacity-25" },
    { Icon: IconCertificate, color: "text-usal-red-600", size: "h-6 w-6", delay: 2.5, opacity: "opacity-20" },
    { Icon: IconClipboardList, color: "text-usal-gold-600", size: "h-6 w-6", delay: 3, opacity: "opacity-20" },
    { Icon: IconBookmark, color: "text-usal-navy-600", size: "h-5 w-5", delay: 3.5, opacity: "opacity-15" },
    
    // Elementos de ciencias
    { Icon: IconCalculator, color: "text-usal-green-400", size: "h-6 w-6", delay: 4, opacity: "opacity-20" },
    { Icon: IconFlask, color: "text-usal-red-400", size: "h-6 w-6", delay: 4.5, opacity: "opacity-20" },
    { Icon: IconAtom, color: "text-usal-gold-400", size: "h-6 w-6", delay: 5, opacity: "opacity-20" },
    { Icon: IconMath, color: "text-usal-navy-400", size: "h-5 w-5", delay: 5.5, opacity: "opacity-15" },
    
    // Elementos de comunicación
    { Icon: IconMail, color: "text-usal-green-700", size: "h-5 w-5", delay: 6, opacity: "opacity-15" },
    { Icon: IconCalendar, color: "text-usal-red-700", size: "h-6 w-6", delay: 6.5, opacity: "opacity-20" },
    
    // Elementos de inspiración
    { Icon: IconBulb, color: "text-usal-gold-300", size: "h-6 w-6", delay: 7, opacity: "opacity-20" },
    { Icon: IconClipboard, color: "text-usal-navy-300", size: "h-5 w-5", delay: 7.5, opacity: "opacity-15" },
  ];

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {icons.map((iconData, index) => {
        // Generar posiciones aleatorias pero distribuidas
        const positions = [
          { top: "10%", left: "5%" },
          { top: "15%", right: "8%" },
          { top: "25%", left: "12%" },
          { top: "35%", right: "15%" },
          { top: "45%", left: "8%" },
          { top: "55%", right: "12%" },
          { top: "65%", left: "15%" },
          { top: "75%", right: "5%" },
          { top: "20%", left: "85%" },
          { top: "40%", right: "80%" },
          { top: "60%", left: "90%" },
          { top: "80%", right: "85%" },
          { top: "30%", left: "50%" },
          { top: "70%", right: "45%" },
          { top: "50%", left: "25%" },
          { top: "90%", right: "25%" }
        ];

        const position = positions[index % positions.length];
        const { Icon, color, size, delay, opacity } = iconData;

        return (
          <motion.div
            key={index}
            className={`absolute ${opacity} ${color}`}
            style={position}
            initial={{ 
              opacity: 0,
              scale: 0,
              rotate: Math.random() * 360
            }}
            animate={{
              opacity: [0, 0.3, 0.1, 0.3, 0],
              scale: [0, 1, 1.1, 1, 0],
              rotate: [Math.random() * 360, Math.random() * 360 + 180],
              y: [-10, 10, -10],
              x: [-5, 5, -5]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: delay + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 3 + Math.random() * 5,
              ease: "easeInOut"
            }}
          >
            <Icon className={size} />
          </motion.div>
        );
      })}
    </div>
  );
};

// Componente de beams animados
const AnimatedBeam = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  return (
    <motion.div
      ref={ref}
      animate="animate"
      initial={{
        translateY: beamOptions.initialY || "-200px",
        translateX: beamOptions.initialX || "0px",
        rotate: beamOptions.rotate || -45,
      }}
      variants={{
        animate: {
          translateY: beamOptions.translateY || "600px",
          translateX: beamOptions.translateX || "500px",
          rotate: beamOptions.rotate || -45,
        },
      }}
      transition={{
        duration: beamOptions.duration || 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay: beamOptions.delay || 0,
        repeatDelay: beamOptions.repeatDelay || 0,
      }}
      className={cn(
        "absolute left-96 top-20 m-auto h-10 w-px rounded-full",
        beamOptions.className || "bg-gradient-to-t from-usal-green-500 via-usal-green-400 to-transparent opacity-30"
      )}
    />
  );
});

AnimatedBeam.displayName = "AnimatedBeam";

// Componente de rayos animados (Cometas)
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
        className="left-1/3 top-10"
        color="from-usal-gold-500 via-usal-gold-400 to-transparent"
        duration={10}
        delay={4}
      />
      <BeamEffect
        containerRef={containerRef}
        parentRef={parentRef}
        className="right-1/3 top-16"
        color="from-usal-navy-500 via-usal-navy-400 to-transparent"
        duration={7}
        delay={1}
      />
    </>
  );
};

// Componente individual de rayo/cometa
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
  return (
    <motion.div
      className={cn("absolute w-px h-20 opacity-40", className)}
      style={{
        background: `linear-gradient(to bottom, ${color.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`,
        transform: 'rotate(-45deg)',
      }}
      animate={{
        translateY: ["-100vh", "100vh"],
        translateX: ["-50px", "50px"],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
      }}
    />
  );
};

// Partículas flotantes pequeñas
const FloatingParticles = ({ intensity = 'medium' }: { intensity?: 'light' | 'medium' | 'full' }) => {
  const [isMounted, setIsMounted] = useState(false);
  const particleCount = intensity === 'light' ? 8 : intensity === 'medium' ? 15 : 25;
  const glowCount = intensity === 'light' ? 3 : intensity === 'medium' ? 5 : 8;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generar posiciones determinísticas basadas en el índice para evitar hidratación mismatch
  const getParticlePosition = (index: number) => ({
    left: `${((index * 7 + 15) % 100)}%`,
    top: `${((index * 11 + 25) % 100)}%`,
  });

  const getGlowPosition = (index: number) => ({
    left: `${((index * 13 + 35) % 100)}%`,
    top: `${((index * 17 + 45) % 100)}%`,
  });

  const getStarPosition = (index: number) => ({
    left: `${((index * 19 + 55) % 100)}%`,
    top: `${((index * 23 + 65) % 100)}%`,
  });

  if (!isMounted) {
    // Renderizar versión simplificada durante SSR
    return (
      <>
        {Array.from({ length: particleCount }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full ${
              i % 4 === 0 ? 'bg-usal-green-400' :
              i % 4 === 1 ? 'bg-usal-gold-400' :
              i % 4 === 2 ? 'bg-usal-red-400' :
              'bg-usal-navy-400'
            } opacity-40`}
            style={getParticlePosition(i)}
          />
        ))}
      </>
    );
  }
  
  return (
    <>
      {/* Partículas USAL de colores */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute w-1 h-1 rounded-full ${
            i % 4 === 0 ? 'bg-usal-green-400' :
            i % 4 === 1 ? 'bg-usal-gold-400' :
            i % 4 === 2 ? 'bg-usal-red-400' :
            'bg-usal-navy-400'
          } opacity-40`}
          style={getParticlePosition(i)}
          animate={{
            y: [-30, 30],
            x: [-15, 15],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 4 + (i % 4),
            delay: (i % 3) * 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Partículas más grandes con glow */}
      {Array.from({ length: glowCount }).map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className={`absolute w-2 h-2 rounded-full ${
            i % 2 === 0 ? 'bg-usal-green-300' : 'bg-usal-gold-300'
          } opacity-30`}
          style={{
            ...getGlowPosition(i),
            filter: 'blur(1px)',
            boxShadow: `0 0 10px ${i % 2 === 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          }}
          animate={{
            y: [-50, 50],
            x: [-25, 25],
            opacity: [0.1, 0.5, 0.1],
            scale: [0.8, 1.5, 0.8],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + (i % 3),
            delay: (i % 2) * 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Estrellas parpadeantes - solo en full intensity */}
      {intensity === 'full' && Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
          style={{
            ...getStarPosition(i),
            boxShadow: '0 0 4px rgba(255,255,255,0.8)',
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.5, 0.8],
          }}
          transition={{
            duration: 2 + (i % 3),
            delay: (i % 4) * 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

// Líneas de grid verticales
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
          "--color": "rgba(34, 197, 94, 0.1)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(34, 197, 94, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-10",
        className
      )}
    />
  );
};
