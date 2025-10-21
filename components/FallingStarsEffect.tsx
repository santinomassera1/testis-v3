'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FallingStar {
  id: number;
  x: number;
  y: number;
  velocity: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
  color: string;
  size: number;
  angle: number;
  type: 'comet' | 'spark' | 'meteor' | 'energy';
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  particles: Array<{
    x: number;
    y: number;
    velocity: { x: number; y: number };
    color: string;
    size: number;
    life: number;
  }>;
  timestamp: number;
}

interface Container {
  x: number;
  y: number;
  width: number;
  height: number;
  element: HTMLElement;
}

const FallingStarsEffect = () => {
  const [stars, setStars] = useState<FallingStar[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);

  const starColors = [
    'bg-gradient-to-r from-usal-green-400 to-usal-green-600',
    'bg-gradient-to-r from-usal-gold-400 to-usal-gold-600', 
    'bg-gradient-to-r from-usal-red-400 to-usal-red-600',
    'bg-gradient-to-r from-blue-400 to-blue-600',
    'bg-gradient-to-r from-purple-400 to-purple-600',
    'bg-gradient-to-r from-pink-400 to-pink-600',
    'bg-gradient-to-r from-cyan-400 to-cyan-600'
  ];

  const starTypes: Array<FallingStar['type']> = ['comet', 'spark', 'meteor', 'energy'];

  // Detectar contenedores para colisiones
  const updateContainers = useCallback(() => {
    const demoContainers = document.querySelectorAll('[data-demo-container]');
    const newContainers: Container[] = [];

    demoContainers.forEach((element) => {
      const rect = element.getBoundingClientRect();
      newContainers.push({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        element: element as HTMLElement
      });
    });

    setContainers(newContainers);
  }, []);

  // Crear nueva estrella (sin useCallback para evitar dependencias circulares)
  const createStar = (): FallingStar => {
    const x = Math.random() * (window.innerWidth + 200) - 100;
    const velocity = 2 + Math.random() * 4;
    const angle = -15 + Math.random() * 30; // Ángulo de caída
    const type = starTypes[Math.floor(Math.random() * starTypes.length)];
    
    return {
      id: Date.now() + Math.random(),
      x,
      y: -50,
      velocity,
      angle,
      trail: [],
      color: starColors[Math.floor(Math.random() * starColors.length)],
      size: type === 'meteor' ? 6 + Math.random() * 4 : 3 + Math.random() * 3,
      type
    };
  };

  // Crear explosión (sin useCallback para evitar dependencias circulares)
  const createExplosion = (x: number, y: number, starColor: string): Explosion => {
    const particles = [];
    const particleCount = 8 + Math.random() * 12;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      
      particles.push({
        x,
        y,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        color: starColor,
        size: 2 + Math.random() * 4,
        life: 1
      });
    }

    return {
      id: Date.now() + Math.random(),
      x,
      y,
      particles,
      timestamp: Date.now()
    };
  };

  // Detectar colisión (sin useCallback, usa containers directamente)
  const checkCollision = (star: FallingStar, currentContainers: Container[]): boolean => {
    for (const container of currentContainers) {
      if (
        star.x >= container.x - 20 &&
        star.x <= container.x + container.width + 20 &&
        star.y >= container.y - 20 &&
        star.y <= container.y + container.height + 20
      ) {
        return true;
      }
    }
    return false;
  };

  // Animación principal (simplificada)
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      const now = Date.now();
      
      // Spawn nuevas estrellas
      if (now - lastSpawnRef.current > 800 + Math.random() * 1200) {
        setStars(prev => [...prev, createStar()]);
        lastSpawnRef.current = now;
      }

      // Actualizar estrellas
      setStars(prev => prev.map(star => {
        const newY = star.y + star.velocity;
        const newX = star.x + Math.sin(star.angle * Math.PI / 180) * 0.5;
        
        // Actualizar trail
        const newTrail = [
          { x: star.x, y: star.y, opacity: 1 },
          ...star.trail.slice(0, 8).map((point, index) => ({
            ...point,
            opacity: point.opacity * 0.8
          }))
        ];

        return {
          ...star,
          x: newX,
          y: newY,
          trail: newTrail
        };
      }).filter(star => {
        // Remover estrellas que salen de pantalla
        if (star.y > window.innerHeight + 100) {
          return false;
        }

        // Verificar colisiones usando el estado actual de containers
        if (checkCollision(star, containers)) {
          setExplosions(prev => [...prev, createExplosion(star.x, star.y, star.color)]);
          return false;
        }

        return true;
      }));

      // Actualizar explosiones
      setExplosions(prev => prev.map(explosion => ({
        ...explosion,
        particles: explosion.particles.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          velocity: {
            x: particle.velocity.x * 0.95,
            y: particle.velocity.y * 0.95 + 0.1 // gravedad
          },
          life: particle.life * 0.95,
          size: particle.size * 0.98
        })).filter(particle => particle.life > 0.1)
      })).filter(explosion => explosion.particles.length > 0));

      animationId = requestAnimationFrame(animate);
    };

    // Inicializar
    updateContainers();
    const resizeHandler = () => updateContainers();
    window.addEventListener('resize', resizeHandler);
    
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []); 

  // Re-detectar contenedores periódicamente (simplificado)
  useEffect(() => {
    const interval = setInterval(() => {
      const demoContainers = document.querySelectorAll('[data-demo-container]');
      const newContainers: Container[] = [];

      demoContainers.forEach((element) => {
        const rect = element.getBoundingClientRect();
        newContainers.push({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          element: element as HTMLElement
        });
      });

      setContainers(newContainers);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []); // Array vacío - solo se ejecuta una vez

  const getStarStyle = (star: FallingStar) => {
    switch (star.type) {
      case 'comet':
        return {
          borderRadius: '50% 0 50% 50%',
          background: `linear-gradient(135deg, rgba(255,255,255,0.8), transparent 70%)`,
          boxShadow: `0 0 20px rgba(255,255,255,0.6), 0 0 40px ${star.color.includes('green') ? '#10b981' : star.color.includes('gold') ? '#f59e0b' : '#ef4444'}`,
        };
      case 'meteor':
        return {
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 60%)`,
          boxShadow: `0 0 15px rgba(255,255,255,0.4), 0 0 30px ${star.color.includes('green') ? '#10b981' : star.color.includes('gold') ? '#f59e0b' : '#ef4444'}`,
        };
      case 'spark':
        return {
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          boxShadow: `0 0 10px rgba(255,255,255,0.8)`,
        };
      default:
        return {
          borderRadius: '50%',
          background: `linear-gradient(135deg, rgba(255,255,255,0.6), transparent)`,
          boxShadow: `0 0 12px rgba(255,255,255,0.5)`,
        };
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {/* Estrellas que caen */}
        {stars.map((star) => (
          <React.Fragment key={star.id}>
            {/* Trail de la estrella */}
            {star.trail.map((point, index) => (
              <motion.div
                key={`${star.id}-trail-${index}`}
                className="absolute pointer-events-none"
                style={{
                  left: point.x,
                  top: point.y,
                  width: star.size * (0.3 + index * 0.1),
                  height: star.size * (0.3 + index * 0.1),
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: '50%',
                  opacity: point.opacity * 0.3,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
            
            {/* Estrella principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className={`absolute pointer-events-none ${star.color}`}
              style={{
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                transform: 'translate(-50%, -50%)',
                ...getStarStyle(star)
              }}
            />
          </React.Fragment>
        ))}

        {/* Explosiones */}
        {explosions.map((explosion) => (
          <React.Fragment key={explosion.id}>
            {explosion.particles.map((particle, index) => (
              <motion.div
                key={`${explosion.id}-particle-${index}`}
                className="absolute pointer-events-none"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  background: `radial-gradient(circle, rgba(255,255,255,${particle.life}), transparent)`,
                  borderRadius: '50%',
                  opacity: particle.life,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 ${particle.size * 2}px rgba(255,255,255,${particle.life * 0.5})`
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FallingStarsEffect;
