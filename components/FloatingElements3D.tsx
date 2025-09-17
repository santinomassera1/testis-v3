'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingShape {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  shape: 'cube' | 'sphere' | 'pyramid' | 'torus';
  color: string;
}

const shapes: FloatingShape[] = [
  { id: 1, size: 60, x: 10, y: 20, delay: 0, duration: 8, shape: 'cube', color: 'bg-gradient-to-r from-usal-green-400 to-usal-green-600' },
  { id: 2, size: 40, x: 80, y: 10, delay: 1, duration: 10, shape: 'sphere', color: 'bg-gradient-to-r from-usal-gold-400 to-usal-gold-600' },
  { id: 3, size: 50, x: 70, y: 70, delay: 2, duration: 12, shape: 'pyramid', color: 'bg-gradient-to-r from-usal-red-400 to-usal-red-600' },
  { id: 4, size: 35, x: 20, y: 80, delay: 1.5, duration: 9, shape: 'torus', color: 'bg-gradient-to-r from-usal-navy-400 to-usal-navy-600' },
  { id: 5, size: 45, x: 90, y: 50, delay: 0.5, duration: 11, shape: 'cube', color: 'bg-gradient-to-r from-usal-green-300 to-usal-green-500' },
  { id: 6, size: 30, x: 5, y: 60, delay: 2.5, duration: 7, shape: 'sphere', color: 'bg-gradient-to-r from-usal-gold-300 to-usal-gold-500' },
];

const ShapeComponent = ({ shape, size, color }: { shape: string; size: number; color: string }) => {
  const baseClasses = `absolute rounded-lg ${color} shadow-xl`;
  
  switch (shape) {
    case 'cube':
      return (
        <div 
          className={`${baseClasses}`}
          style={{
            width: size,
            height: size,
            transform: 'rotateX(15deg) rotateY(15deg)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        />
      );
    case 'sphere':
      return (
        <div 
          className={`${baseClasses} rounded-full`}
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%), ${color.replace('bg-gradient-to-r', 'linear-gradient(135deg')}`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        />
      );
    case 'pyramid':
      return (
        <div 
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${size}px solid rgba(34, 197, 94, 0.8)`,
            filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))',
            transform: 'rotateX(15deg) rotateZ(15deg)',
          }}
        />
      );
    case 'torus':
      return (
        <div 
          className={`${baseClasses} rounded-full border-8 border-transparent`}
          style={{
            width: size,
            height: size,
            background: `conic-gradient(from 0deg, ${color.replace('bg-gradient-to-r from-', '').replace(' to-', ', ')})`,
            maskImage: 'radial-gradient(circle, transparent 30%, black 30%, black 70%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 30%, black 30%, black 70%, transparent 70%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        />
      );
    default:
      return null;
  }
};

// Partículas con posiciones predefinidas para evitar errores de hidratación
const particles = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  x: (i * 7 + 15) % 100, // Distribución más uniforme
  y: (i * 11 + 25) % 100,
  duration: 4 + (i % 4),
  delay: (i % 3) * 0.5,
}));

export default function FloatingElements3D() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Renderizar versión simplificada durante SSR
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <ShapeComponent shape={shape.shape} size={shape.size} color={shape.color} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotateX: [15, -15, 15],
            rotateY: [15, -15, 15],
            rotateZ: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.2,
            rotateY: 45,
            transition: { duration: 0.3 }
          }}
        >
          <div
            style={{
              filter: 'blur(0.5px)',
              transform: 'perspective(1000px)',
            }}
          >
            <ShapeComponent shape={shape.shape} size={shape.size} color={shape.color} />
          </div>
        </motion.div>
      ))}
      
      {/* Partículas flotantes con posiciones predefinidas */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute w-1 h-1 bg-usal-green-400 rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-50, 50],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
