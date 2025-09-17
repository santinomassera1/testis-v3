'use client';

import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollEffects3D() {
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);

  useEffect(() => {
    // Agregar efectos 3D globales al scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * -0.5;
      const rate2 = scrolled * -0.2;
      
      // Efecto parallax en elementos con clase 3d-float
      const elements = document.querySelectorAll('.float-3d');
      elements.forEach((element, index) => {
        const el = element as HTMLElement;
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translate3d(0, ${rate * speed}px, 0) rotateY(${scrolled * 0.1}deg)`;
      });

      // Efecto de profundidad en secciones
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inView) {
          const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
          const el = section as HTMLElement;
          el.style.transform = `perspective(1000px) rotateX(${(1 - progress) * 5}deg)`;
          el.style.transformOrigin = 'center bottom';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Elementos flotantes que siguen el scroll */}
      <motion.div
        className="fixed top-20 right-20 w-2 h-2 bg-usal-green-400 rounded-full opacity-30 pointer-events-none z-10"
        style={{ y: y1, rotateZ: rotate }}
      />
      <motion.div
        className="fixed top-40 left-10 w-1 h-1 bg-usal-gold-400 rounded-full opacity-40 pointer-events-none z-10"
        style={{ y: y2 }}
      />
      <motion.div
        className="fixed bottom-32 right-40 w-1.5 h-1.5 bg-usal-red-400 rounded-full opacity-35 pointer-events-none z-10"
        style={{ y: y1, rotateZ: rotate }}
      />
    </>
  );
}
