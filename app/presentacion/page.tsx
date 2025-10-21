"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  IconChevronLeft,
  IconChevronRight,
  IconNotes,
  IconHome,
  IconCheck,
  IconAlertTriangle,
  IconTarget,
  IconShield,
  IconRocket,
  IconTrendingUp,
  IconFileCheck,
  IconBulb,
  IconUsers,
  IconBook,
  IconChartBar,
  IconCircleCheck,
  IconChecks,
  IconSparkles,
} from '@tabler/icons-react';
import Link from 'next/link';
import presentationData from '@/data/presentation.json';
import FinancialSimulator from '@/components/sections/FinancialSimulator';

export default function PresentacionPage() {
  const [showNotes, setShowNotes] = useState(false);
  const [activeSection, setActiveSection] = useState('abstract');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const sections = presentationData.meta.toc.map(t => t.id);
      const currentIndex = sections.indexOf(activeSection);

      if ((e.key === 'ArrowRight' || e.key === 'j') && currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        document.getElementById(nextSection)?.scrollIntoView({ behavior: 'smooth' });
      } else if ((e.key === 'ArrowLeft' || e.key === 'k') && currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        document.getElementById(prevSection)?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'n') {
        setShowNotes(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = presentationData.meta.toc.map(t => t.id);
      let current = sections[0];

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = id;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-usal-green-50 via-white to-cream-50">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-usal-green-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-b border-usal-green-200/50 z-50">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo y título */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-r from-usal-green-600 to-usal-green-500 rounded-lg p-2 transition-transform group-hover:scale-105">
              <img 
                src="/usal-logo.jpg" 
                alt="USAL" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-usal-green-600 to-usal-green-500 bg-clip-text text-transparent">
                Testis
              </span>
              <span className="text-xs text-usal-navy-600 -mt-1">
                Presentación de Tesis
              </span>
            </div>
          </Link>
          
          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                showNotes
                  ? 'bg-usal-green-600 text-white shadow-lg'
                  : 'bg-usal-green-100 text-usal-green-700 hover:bg-usal-green-200'
              }`}
              title="Notas del orador (N)"
            >
              <IconNotes className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-usal-navy-100 text-usal-navy-700 rounded-lg hover:bg-usal-navy-200 transition-all duration-200 font-medium text-sm"
            >
              <IconHome className="h-4 w-4" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* TOC Sidebar */}
      <nav className="fixed left-6 top-24 hidden xl:block w-64 max-h-[calc(100vh-150px)] overflow-y-auto">
        <div className="bg-white rounded-xl border border-usal-green-200 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-usal-navy-900 mb-3 flex items-center gap-2">
            <IconBook className="h-4 w-4" />
            Contenido
          </h2>
          <ul className="space-y-1">
            {presentationData.meta.toc.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-usal-green-100 text-usal-green-700 font-medium'
                      : 'text-usal-navy-600 hover:bg-usal-green-50'
                  }`}
                >
                  <span className="text-xs text-usal-navy-400 mr-2">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Keyboard shortcuts */}
        <div className="mt-4 bg-usal-navy-50 rounded-xl p-3 text-xs text-usal-navy-600">
          <p className="font-semibold mb-2">Atajos de teclado:</p>
          <ul className="space-y-1">
            <li>→ / J: Siguiente</li>
            <li>← / K: Anterior</li>
            <li>N: Notas del orador</li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 xl:px-80 pt-20 pb-20">
        {/* Hero */}
        <HeroSection />

        {/* Sections */}
        {presentationData.sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            showNotes={showNotes}
            index={index}
          />
        ))}
      </main>

      {/* Navigation Arrows */}
      <NavigationArrows activeSection={activeSection} />
    </div>
  );
}

// Hero Section
function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center mb-20 relative overflow-hidden pt-16"
    >
      {/* Animated background stripes */}
      <div className="absolute inset-0 -z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-usal-green-200 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Logo USAL Grande */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
        className="mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-usal-green-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-usal-green-600 to-usal-green-500 rounded-2xl p-6 shadow-2xl">
            <img 
              src="/usal-logo.jpg" 
              alt="Universidad del Salvador" 
              className="h-32 w-32 md:h-40 md:w-40 object-contain"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="inline-block px-4 py-2 bg-usal-green-100 text-usal-green-700 rounded-full text-sm font-medium mb-6"
      >
        Ingeniería en Informática — USAL
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-6xl md:text-7xl font-bold text-usal-navy-900 mb-6 tracking-tight"
      >
        Testis
      </motion.h1>
      <p className="text-2xl md:text-3xl text-usal-navy-600 mb-8 max-w-3xl">
        Asistente conversacional para SIU Guaraní
      </p>
      <p className="text-lg text-usal-navy-500 mb-12 max-w-2xl">
        Reduciendo fricción en tareas académicas frecuentes a través de guía contextual, validaciones inteligentes y explicaciones claras
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="#abstract"
          className="px-6 py-3 bg-usal-green-600 text-white rounded-lg hover:bg-usal-green-700 transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          Ver presentación
        </a>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-usal-green-600 border-2 border-usal-green-600 rounded-lg hover:bg-usal-green-50 transition-colors font-medium"
        >
          Probar chatbot
        </Link>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-usal-green-600 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-usal-green-600 rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}

// Section Component
function Section({ section, showNotes, index }: any) {
  const ref = useRef<HTMLElement>(null);

  return (
    <motion.section
      ref={ref}
      id={section.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="mb-32 scroll-mt-32"
    >
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-sm font-mono text-usal-green-600 font-bold">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="text-4xl font-bold text-usal-navy-900 tracking-tight">
          {section.title}
        </h2>
      </div>

      {/* Content based on section type */}
      {section.id === 'abstract' && <AbstractContent section={section} />}
      {section.id === 'introduccion' && <IntroduccionContent section={section} />}
      {section.id === 'objetivo_barreras_relevancia' && <ObjetivoBarrerasContent section={section} />}
      {section.id === 'hipotesis_enfoque_metricas' && <HipotesisEnfoqueContent section={section} />}
      {section.id === 'estado_del_arte_marco_teorico' && <EstadoArteContent section={section} />}
      {section.id === 'requisitos' && <RequisitosContent section={section} />}
      {section.id === 'diseno_mvp' && <DisenoMVPContent section={section} />}
      {section.id === 'encuesta_hallazgos' && <EncuestaContent section={section} />}
      {section.id === 'riesgos_mitigacion' && <RiesgosContent section={section} />}
      {section.id === 'supuestos_restricciones' && <SupuestosContent section={section} />}
      {section.id === 'qa_roadmap' && <QARoadmapContent section={section} />}
      {section.id === 'finanzas' && <FinanzasContent section={section} />}
      {section.id === 'implicancias_conclusiones' && <ImplicanciasContent section={section} />}

      {/* Speaker Notes */}
      <AnimatePresence>
        {showNotes && section.notes && section.notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg"
          >
            <div className="flex items-start gap-3">
              <IconNotes className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Notas del orador:</h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                  {section.notes.map((note: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

// Content Components
function AbstractContent({ section }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-usal-green-200">
        <p className="text-lg text-usal-navy-700 leading-relaxed mb-6">
          {section.summary}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {section.highlights.map((highlight: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-usal-green-50 rounded-lg">
              <IconCheck className="h-5 w-5 text-usal-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-usal-navy-700 font-medium">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function IntroduccionContent({ section }: any) {
  const frictions = [
    { title: 'Inscripciones', desc: '¿Dónde veo si hay cupo? ¿Puedo inscribirme si debo una correlativa?' },
    { title: 'Horarios', desc: '¿Cómo sé qué comisión me conviene? ¿Hay superposición?' },
    { title: 'Certificados', desc: '¿Cómo descargo una constancia de alumno regular?' },
    { title: 'Contacto', desc: '¿A quién le escribo para consultar sobre mi situación académica?' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <p className="text-lg text-usal-navy-700 leading-relaxed mb-6">{section.copy}</p>
          <ul className="space-y-3">
            {section.bullets.map((bullet: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <IconAlertTriangle className="h-5 w-5 text-usal-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-usal-navy-700">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-usal-navy-900 mb-4">Puntos de fricción identificados:</h3>
          {frictions.map((friction, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-usal-red-50 border-l-4 border-usal-red-400 rounded-r-lg"
            >
              <h4 className="font-semibold text-usal-red-900 mb-1">{friction.title}</h4>
              <p className="text-sm text-usal-red-700">{friction.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function ObjetivoBarrerasContent({ section }: any) {
  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-usal-green-200">
          <IconTarget className="h-8 w-8 text-usal-green-600 mb-4" />
          <h3 className="font-semibold text-usal-navy-900 mb-3">Objetivo</h3>
          <p className="text-sm text-usal-navy-600">Guía accionable y verificable para tareas frecuentes</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-usal-green-200">
          <IconShield className="h-8 w-8 text-usal-gold-600 mb-4" />
          <h3 className="font-semibold text-usal-navy-900 mb-3">Barreras</h3>
          <p className="text-sm text-usal-navy-600">Técnicas, organizacionales y legales</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-usal-green-200">
          <IconRocket className="h-8 w-8 text-usal-navy-600 mb-4" />
          <h3 className="font-semibold text-usal-navy-900 mb-3">Valor</h3>
          <p className="text-sm text-usal-navy-600">Autonomía 24/7 + alivio operativo</p>
        </div>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function HipotesisEnfoqueContent({ section }: any) {
  const timeline = ['Descubrir', 'Diseñar', 'Construir', 'Probar', 'Medir', 'Iterar'];
  const kpis = [
    { label: 'Tareas completadas', icon: IconCheck },
    { label: 'TTR (Time to Resolution)', icon: IconTrendingUp },
    { label: 'Errores críticos', icon: IconAlertTriangle },
    { label: 'Satisfacción percibida', icon: IconUsers },
  ];

  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      
      {/* Timeline */}
      <div className="bg-white p-8 rounded-xl border border-usal-green-200">
        <h3 className="text-xl font-semibold text-usal-navy-900 mb-6">Metodología iterativa:</h3>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {timeline.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-usal-green-100 flex items-center justify-center text-usal-green-700 font-bold mb-2">
                  {i + 1}
                </div>
                <span className="text-sm font-medium text-usal-navy-700">{step}</span>
              </div>
              {i < timeline.length - 1 && (
                <div className="hidden md:block h-px flex-1 bg-usal-green-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-to-br from-usal-green-50 to-white p-6 rounded-xl border border-usal-green-200"
          >
            <kpi.icon className="h-6 w-6 text-usal-green-600 mb-3" />
            <p className="text-sm font-medium text-usal-navy-700">{kpi.label}</p>
          </motion.div>
        ))}
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function EstadoArteContent({ section }: any) {
  const tabs = ['TAM', 'NLU/NLG', 'Reglas vs IA'];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      
      <div className="bg-white rounded-xl border border-usal-green-200 overflow-hidden">
        <div className="flex border-b border-usal-green-200">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === i
                  ? 'bg-usal-green-50 text-usal-green-700 border-b-2 border-usal-green-600'
                  : 'text-usal-navy-600 hover:bg-usal-green-50/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-8">
          {activeTab === 0 && (
            <div>
              <h4 className="font-semibold text-usal-navy-900 mb-3">Technology Acceptance Model</h4>
              <p className="text-usal-navy-700">Utilidad percibida + Facilidad de uso = Adopción exitosa</p>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <h4 className="font-semibold text-usal-navy-900 mb-3">Procesamiento de Lenguaje Natural</h4>
              <p className="text-usal-navy-700">Intenciones, entidades y explicaciones claras con citas</p>
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <h4 className="font-semibold text-usal-navy-900 mb-3">Enfoque Híbrido</h4>
              <p className="text-usal-navy-700">Reglas para procesos normados + IA para flexibilidad</p>
            </div>
          )}
        </div>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function RequisitosContent({ section }: any) {
  const rf = [
    { title: 'Inscripciones', desc: 'Guiadas con validaciones previas' },
    { title: 'Correlativas/Cupos', desc: 'Consulta en tiempo real' },
    { title: 'Certificados', desc: 'Descarga autoservicio' },
    { title: 'Navegación', desc: 'Deep-links directos' },
    { title: 'Emails', desc: 'Generación institucional' },
    { title: 'FAQs', desc: 'Con cita de fuente' },
  ];

  const rnf = [
    'Privacidad (Ley 25.326)',
    'Accesibilidad AA',
    'Rendimiento percibido',
    'Observabilidad sin PII',
    'Mantenibilidad',
    'Confiabilidad ante ambigüedad',
  ];

  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      
      <div>
        <h3 className="text-xl font-semibold text-usal-navy-900 mb-4 flex items-center gap-2">
          <IconCheck className="h-6 w-6 text-usal-green-600" />
          Requisitos Funcionales
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rf.map((req, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-usal-green-200">
              <h4 className="font-semibold text-usal-navy-900 mb-1">{req.title}</h4>
              <p className="text-sm text-usal-navy-600">{req.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-usal-navy-900 mb-4 flex items-center gap-2">
          <IconShield className="h-6 w-6 text-usal-gold-600" />
          Requisitos No Funcionales
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rnf.map((req, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-usal-gold-50 rounded-lg">
              <IconFileCheck className="h-5 w-5 text-usal-gold-600 flex-shrink-0" />
              <span className="text-sm text-usal-navy-700 font-medium">{req}</span>
            </div>
          ))}
        </div>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function DisenoMVPContent({ section }: any) {
  const layers = [
    { name: 'Interfaz', desc: 'Chat + componentes guía', color: 'bg-usal-green-100' },
    { name: 'Orquestación', desc: 'Flujos y política de respuestas', color: 'bg-usal-gold-100' },
    { name: 'Comprensión/Explicación', desc: 'NLU/NLG con citas', color: 'bg-usal-navy-100' },
    { name: 'Observabilidad', desc: 'Eventos sin PII', color: 'bg-usal-red-100' },
  ];

  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      
      <div className="bg-white rounded-xl p-8 border border-usal-green-200">
        <h3 className="text-xl font-semibold text-usal-navy-900 mb-6">Arquitectura en 4 capas:</h3>
        <div className="space-y-4">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg ${layer.color}`}
            >
              <h4 className="font-semibold text-usal-navy-900 mb-1">{layer.name}</h4>
              <p className="text-sm text-usal-navy-700">{layer.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-usal-green-50 to-white p-8 rounded-xl border border-usal-green-200">
        <h3 className="text-xl font-semibold text-usal-navy-900 mb-4">Demo del chatbot en acción:</h3>
        <p className="text-usal-navy-600 mb-4">El widget está embebido en la home. Pruébalo allí para ver la experiencia completa.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-usal-green-600 text-white rounded-lg hover:bg-usal-green-700 transition-colors font-medium"
        >
          <IconRocket className="h-5 w-5" />
          Ir al chatbot
        </Link>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function EncuestaContent({ section }: any) {
  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <SimpleBarChart
          title="Consultas más frecuentes"
          data={[
            { label: 'Inscripciones', value: 68 },
            { label: 'Horarios', value: 54 },
            { label: 'Certificados', value: 42 },
            { label: 'Contacto', value: 38 },
          ]}
        />
        <SimpleLineChart
          title="Adopción en el tiempo"
          insight="Picos en períodos de inscripción"
        />
        <SimpleDonutChart
          title="Satisfacción general"
          value={82}
          label="Útil"
        />
      </div>

      <div className="bg-usal-green-50 p-8 rounded-xl border border-usal-green-200">
        <h3 className="text-xl font-semibold text-usal-navy-900 mb-4 flex items-center gap-2">
          <IconBulb className="h-6 w-6 text-usal-gold-600" />
          Insight clave:
        </h3>
        <p className="text-lg text-usal-navy-700">
          El 68% reporta dificultad inicial en Inscripciones; el bot la reduce cuando explica "por qué no puedo inscribirme todavía" y cita la norma correspondiente.
        </p>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function RiesgosContent({ section }: any) {
  const risks = [
    { type: 'Técnicos', impact: 'Medio', mitigation: 'Versionado de contenido' },
    { type: 'Legal/Privacidad', impact: 'Alto', mitigation: 'Datos simulados + política clara' },
    { type: 'Organizacionales', impact: 'Medio', mitigation: 'Parametrización por unidad' },
    { type: 'Adopción', impact: 'Bajo', mitigation: 'Comunicación transparente' },
  ];

  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      
      <div className="bg-white rounded-xl border border-usal-green-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-usal-navy-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-usal-navy-900">Tipo de Riesgo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-usal-navy-900">Impacto</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-usal-navy-900">Mitigación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-usal-green-200">
            {risks.map((risk, i) => (
              <tr key={i} className="hover:bg-usal-green-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-usal-navy-700 font-medium">{risk.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      risk.impact === 'Alto'
                        ? 'bg-red-100 text-red-700'
                        : risk.impact === 'Medio'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {risk.impact}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-usal-navy-600">{risk.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function SupuestosContent({ section }: any) {
  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      <ul className="space-y-3">
        {section.bullets.map((bullet: string, i: number) => (
          <li key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-usal-green-200">
            <IconFileCheck className="h-5 w-5 text-usal-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-usal-navy-700">{bullet}</span>
          </li>
        ))}
      </ul>
      
      <div className="bg-usal-navy-50 p-6 rounded-xl border-2 border-usal-navy-200">
        <div className="flex items-start gap-3">
          <IconShield className="h-6 w-6 text-usal-navy-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-usal-navy-900 mb-2">Privacidad por diseño (Ley 25.326)</h3>
            <p className="text-sm text-usal-navy-700">
              Se minimiza la recolección de datos, se anonimiza para métricas y se respeta el consentimiento informado en cada interacción.
            </p>
          </div>
        </div>
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function QARoadmapContent({ section }: any) {
  const roadmap = [
    {
      phase: 'Corto plazo',
      items: ['Ampliar intents prioritarios', 'Ajustar prompts con feedback', 'Optimizar tiempos de respuesta'],
    },
    {
      phase: 'Mediano plazo',
      items: ['Panel de métricas sin PII', 'Contenidos por facultad', 'Plantillas de correo por caso'],
    },
    {
      phase: 'Largo plazo',
      items: ['Integración con sistemas internos', 'Soporte multilingüe', 'Interfaz por voz'],
    },
  ];

  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed">{section.copy}</p>
      
      <div className="space-y-6">
        {roadmap.map((phase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 border border-usal-green-200"
          >
            <h3 className="text-lg font-semibold text-usal-navy-900 mb-4">{phase.phase}</h3>
            <ul className="space-y-2">
              {phase.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3">
                  <IconCheck className="h-5 w-5 text-usal-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-usal-navy-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function ImplicanciasContent({ section }: any) {
  const logrosCompromisos = [
    {
      title: 'Objetivo del Proyecto',
      items: [
        'Desarrollar un asistente conversacional funcional',
        'Reducir fricción en tareas académicas frecuentes',
        'Guiar con pasos claros y validaciones previas',
        'Citar fuentes oficiales en cada respuesta',
      ],
      icon: IconTarget,
      color: 'usal-green',
    },
    {
      title: 'Enfoque Metodológico',
      items: [
        'Ciclo iterativo Descubrir→Diseñar→Construir→Probar',
        'Combinar reglas claras con IA explicativa',
        'Métricas objetivas: TTR, errores, satisfacción',
        'Validación con estudiantes reales',
      ],
      icon: IconChecks,
      color: 'usal-gold',
    },
    {
      title: 'Requisitos Técnicos',
      items: [
        'Arquitectura en 4 capas (UI, Orquestación, IA, Observabilidad)',
        'Privacidad por diseño (Ley 25.326, sin PII)',
        'Accesibilidad AA y navegación por teclado',
        'Fallbacks seguros ante ambigüedad',
      ],
      icon: IconShield,
      color: 'usal-navy',
    },
    {
      title: 'Validación y Resultados',
      items: [
        'Encuesta a estudiantes sobre dolores actuales',
        '68% identifica fricción en inscripciones',
        'Alta percepción de utilidad cuando cita fuente',
        'Preferencia por tono cercano y explicaciones claras',
      ],
      icon: IconChartBar,
      color: 'usal-red',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Pregunta retórica impactante */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-usal-green-600 via-usal-green-500 to-usal-gold-500 p-12 rounded-2xl text-white text-center relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative z-10">
          <IconSparkles className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            ¿Cumplí con el objetivo?
          </h2>
          <p className="text-2xl text-usal-green-50 mb-8 max-w-3xl mx-auto">
            Revisemos juntos cada compromiso del proyecto y validemos los resultados obtenidos
          </p>
        </div>
      </motion.div>

      {/* Checklists de logros */}
      <div className="grid md:grid-cols-2 gap-8">
        {logrosCompromisos.map((categoria, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-xl p-6 border-2 border-${categoria.color}-200 shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-lg bg-${categoria.color}-100`}>
                <categoria.icon className={`h-6 w-6 text-${categoria.color}-600`} />
              </div>
              <h3 className={`text-xl font-bold text-${categoria.color}-900 flex-1`}>
                {categoria.title}
              </h3>
            </div>
            <ul className="space-y-3">
              {categoria.items.map((item, j) => (
                <motion.li
                  key={j}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + j * 0.05 }}
                  className="flex items-start gap-3 group"
                >
                  <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-${categoria.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconCircleCheck className={`h-4 w-4 text-${categoria.color}-600`} />
                  </div>
                  <span className="text-sm text-usal-navy-700 leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Implicancias por stakeholder */}
      <div className="bg-gradient-to-br from-usal-navy-50 to-usal-green-50 p-8 rounded-xl border border-usal-green-200">
        <h3 className="text-2xl font-bold text-usal-navy-900 mb-6 text-center">
          ¿Qué cambia si lo adoptamos?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: IconUsers,
              title: 'Para estudiantes',
              desc: 'Mayor autonomía, menos ansiedad, disponibilidad 24/7',
              color: 'usal-green',
            },
            {
              icon: IconChartBar,
              title: 'Para administración',
              desc: 'Menos tickets repetitivos, comunicación estandarizada',
              color: 'usal-gold',
            },
            {
              icon: IconBulb,
              title: 'Para la universidad',
              desc: 'Datos para mejora continua, mejor experiencia institucional',
              color: 'usal-navy',
            },
          ].map((imp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-xl border border-usal-green-200 text-center"
            >
              <imp.icon className={`h-8 w-8 text-${imp.color}-600 mx-auto mb-4`} />
              <h4 className="font-semibold text-usal-navy-900 mb-2">{imp.title}</h4>
              <p className="text-sm text-usal-navy-600">{imp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Final con respuesta */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-usal-green-600 to-usal-green-500 p-10 rounded-2xl text-white text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <IconCircleCheck className="h-20 w-20 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-4xl font-bold mb-4">Sí, el objetivo se cumplió</h3>
          <p className="text-xl mb-8 text-usal-green-50 max-w-2xl mx-auto">
            Testis no solo guía: explica el porqué, cita la fuente y valida antes de actuar. 
            El bot no reemplaza SIU, lo hace transitable.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-white text-usal-green-600 rounded-lg hover:bg-usal-green-50 transition-colors font-bold shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <IconRocket className="h-5 w-5" />
              Probar Testis Ahora
            </Link>
            <a
              href="#abstract"
              className="px-8 py-4 bg-usal-green-700 text-white rounded-lg hover:bg-usal-green-800 transition-colors font-bold inline-flex items-center gap-2"
            >
              <IconBook className="h-5 w-5" />
              Ver desde el Inicio
            </a>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {section.figure && <FigurePlaceholder figure={section.figure} />}
    </div>
  );
}

function FinanzasContent({ section }: any) {
  return (
    <div className="space-y-8">
      <p className="text-lg text-usal-navy-700 leading-relaxed mb-8">
        Análisis financiero interactivo del proyecto Testis, mostrando tres escenarios de viabilidad económica a 5 años con indicadores clave de rentabilidad.
      </p>
      <div className="-mx-4 md:-mx-8 lg:-mx-16">
        <FinancialSimulator />
      </div>
    </div>
  );
}

// Utility Components
function FigurePlaceholder({ figure }: any) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden border border-usal-green-200 shadow-sm"
    >
      {!imageError && !imageLoaded && (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-usal-navy-50 to-usal-green-50">
            <IconChartBar className="h-16 w-16 text-usal-green-400 animate-pulse" />
          </div>
        </div>
      )}
      <img
        src={figure.src}
        alt={figure.alt}
        className={`w-full h-auto transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
        }}
        onLoad={() => {
          setImageLoaded(true);
          setImageError(false);
        }}
      />
      {imageError && (
        <div className="relative">
          <img
            src="/images/tesis/placeholder.svg"
            alt="Placeholder"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5">
            <p className="text-lg font-medium text-usal-navy-700 mb-1">{figure.caption}</p>
            <p className="text-sm text-usal-navy-500 italic px-4 text-center">
              Sube: {figure.src.split('/').pop()}
            </p>
          </div>
        </div>
      )}
      {(imageLoaded || imageError) && (
        <div className="px-4 py-3 bg-white border-t border-usal-green-200">
          <p className="text-sm text-usal-navy-600 text-center italic">{figure.caption}</p>
        </div>
      )}
    </motion.div>
  );
}

function SimpleBarChart({ title, data }: any) {
  const max = Math.max(...data.map((d: any) => d.value));
  return (
    <div className="bg-white p-6 rounded-xl border border-usal-green-200">
      <h4 className="font-semibold text-usal-navy-900 mb-4">{title}</h4>
      <div className="space-y-3">
        {data.map((item: any, i: number) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-usal-navy-700">{item.label}</span>
              <span className="text-usal-navy-500">{item.value}%</span>
            </div>
            <div className="h-2 bg-usal-green-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(item.value / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="h-full bg-usal-green-600 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleLineChart({ title, insight }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-usal-green-200">
      <h4 className="font-semibold text-usal-navy-900 mb-4">{title}</h4>
      <div className="h-32 flex items-end justify-between gap-2 mb-4">
        {[20, 35, 55, 45, 70, 85].map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex-1 bg-gradient-to-t from-usal-gold-600 to-usal-gold-400 rounded-t"
          />
        ))}
      </div>
      <p className="text-xs text-usal-navy-500 italic">{insight}</p>
    </div>
  );
}

function SimpleDonutChart({ title, value, label }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-usal-green-200">
      <h4 className="font-semibold text-usal-navy-900 mb-4">{title}</h4>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#16a34a"
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 56}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              whileInView={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - value / 100) }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-usal-navy-900">{value}%</span>
          </div>
        </div>
        <p className="text-sm text-usal-navy-600 font-medium">{label}</p>
      </div>
    </div>
  );
}

function NavigationArrows({ activeSection }: any) {
  const sections = presentationData.meta.toc.map(t => t.id);
  const currentIndex = sections.indexOf(activeSection);

  const goTo = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < sections.length) {
      document.getElementById(sections[newIndex])?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {currentIndex > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => goTo('prev')}
          className="fixed left-6 bottom-6 xl:left-96 p-4 bg-usal-green-600 text-white rounded-full shadow-xl hover:bg-usal-green-700 transition-colors z-30"
          title="Anterior (← o K)"
        >
          <IconChevronLeft className="h-6 w-6" />
        </motion.button>
      )}
      {currentIndex < sections.length - 1 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => goTo('next')}
          className="fixed right-6 bottom-6 p-4 bg-usal-green-600 text-white rounded-full shadow-xl hover:bg-usal-green-700 transition-colors z-30"
          title="Siguiente (→ o J)"
        >
          <IconChevronRight className="h-6 w-6" />
        </motion.button>
      )}
    </>
  );
}

