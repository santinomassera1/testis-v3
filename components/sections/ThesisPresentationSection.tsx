"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconChevronLeft, 
  IconChevronRight,
  IconSchool,
  IconFileText,
  IconBrandGoogleDrive
} from '@tabler/icons-react';

interface Slide {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'title' | 'content' | 'image' | 'conclusion';
}

// Datos de ejemplo para la tesis - puedes reemplazar esto con tus datos reales
const thesisSlides: Slide[] = [
  {
    id: 1,
    type: 'title',
    title: 'Testis: Asistente IA para SIU Guaraní',
    content: 'Revolucionando la gestión académica universitaria con Inteligencia Artificial'
  },
  {
    id: 2,
    type: 'content',
    title: 'Problemática Identificada',
    content: 'Los estudiantes enfrentan dificultades navegando el complejo sistema SIU Guaraní. Proceso lento, interfaz poco intuitiva, falta de orientación.'
  },
  {
    id: 3,
    type: 'content',
    title: 'Solución Propuesta',
    content: 'Asistente conversacional inteligente que guía a los estudiantes paso a paso en sus gestiones académicas más comunes.'
  },
  {
    id: 4,
    type: 'content',
    title: 'Tecnologías Utilizadas',
    content: 'Next.js, TypeScript, OpenAI GPT-4, Tailwind CSS, Framer Motion, NextAuth para autenticación USAL.'
  },
  {
    id: 5,
    type: 'conclusion',
    title: 'Impacto y Beneficios',
    content: 'Reducción del 70% en tiempo de gestión académica. Mayor satisfacción estudiantil. Menos carga en secretaría académica.'
  }
];

export const ThesisPresentationSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const slideInterval = 5000; // 5 segundos por slide

  // Auto-slide logic
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % thesisSlides.length);
      setProgress(0);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  // Progress bar logic
  useEffect(() => {
    if (!isPlaying) return;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (slideInterval / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isPlaying, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % thesisSlides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + thesisSlides.length) % thesisSlides.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const getSlideColor = (type: string) => {
    switch (type) {
      case 'title': return 'from-usal-navy-600 to-usal-navy-700';
      case 'content': return 'from-usal-green-500 to-usal-green-600';
      case 'conclusion': return 'from-usal-gold-500 to-usal-gold-600';
      default: return 'from-usal-green-500 to-usal-green-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <IconSchool className="h-8 w-8 text-usal-navy-600" />
          <h3 className="text-xl font-semibold text-usal-navy-900">
            Presentación de Tesis
          </h3>
        </div>
        <p className="text-usal-navy-600 text-sm">
          Desarrollo y implementación de Testis como solución académica
        </p>
      </div>

      {/* Presentation Container */}
      <div className="bg-white rounded-xl border border-usal-green-200 overflow-hidden shadow-lg">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-usal-green-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Slide Content */}
        <div className="relative h-[350px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 bg-gradient-to-br ${getSlideColor(thesisSlides[currentSlide].type)} p-8 flex flex-col justify-center text-white`}
            >
              <h4 className="text-2xl font-bold mb-6 text-center">
                {thesisSlides[currentSlide].title}
              </h4>
              <p className="text-lg leading-relaxed text-center opacity-90">
                {thesisSlides[currentSlide].content}
              </p>
              
              {/* Slide counter */}
              <div className="absolute bottom-4 right-6 text-sm opacity-70">
                {currentSlide + 1} / {thesisSlides.length}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Slide anterior"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <IconPlayerPause className="h-4 w-4" /> : <IconPlayerPlay className="h-4 w-4" />}
            </button>
            
            <button
              onClick={nextSlide}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Siguiente slide"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Slide indicators */}
          <div className="flex items-center gap-1">
            {thesisSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-usal-green-500' : 'bg-gray-300'
                }`}
                title={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Future buttons for different presentation formats */}
          <div className="flex items-center gap-1">
            <button
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
              title="Proximamente: Ver en PowerPoint"
              disabled
            >
              <IconFileText className="h-4 w-4" />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
              title="Proximamente: Ver en Gamma"
              disabled
            >
              <IconBrandGoogleDrive className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="text-center text-sm text-gray-500">
        Presentación automática • {slideInterval / 1000}s por slide
      </div>
    </div>
  );
};
