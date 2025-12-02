"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  IconChevronLeft,
  IconChevronRight,
  IconHome,
  IconAlertTriangle,
  IconTarget,
  IconCode,
  IconCurrencyDollar,
  IconChartBar,
  IconRocket,
  IconCircleCheck,
  IconUsers,
  IconBulb,
  IconMessageDots,
  IconMail,
  IconFileText,
  IconTrendingUp,
  IconClock,
  IconShield,
  IconSparkles,
  IconCheckbox,
  IconX,
  IconExternalLink,
  IconPlayerPlay,
  IconPlayerPause,
  IconArrowLeft,
  IconArrowRight,
  IconBrandNextjs,
  IconBrain,
  IconServer,
  IconDatabase,
  IconLock,
  IconUserSearch,
  IconPencil,
} from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';

// Tipos
interface Slide {
  id: number;
  title: string;
  component: React.ComponentType<any>;
}

// Datos financieros reales de la página principal
const financialData = {
  scenarios: [
    {
      name: 'Conservador',
      color: 'red',
      data: [
        { year: 1, ingresos: 7000000, costos: 33950000, flujoNeto: -26950000, flujoAcumulado: -26950000 },
        { year: 2, ingresos: 7000000, costos: 7000000, flujoNeto: 0, flujoAcumulado: -26950000 },
        { year: 3, ingresos: 10000000, costos: 8050000, flujoNeto: 1950000, flujoAcumulado: -25000000 },
        { year: 4, ingresos: 15000000, costos: 9257500, flujoNeto: 5742500, flujoAcumulado: -19257500 },
        { year: 5, ingresos: 20000000, costos: 10646125, flujoNeto: 9353875, flujoAcumulado: -9903625 },
      ],
      van: -19469703,
      tir: -15.93,
      payback: null,
    },
    {
      name: 'Moderado',
      color: 'gold',
      data: [
        { year: 1, ingresos: 7000000, costos: 33950000, flujoNeto: -26950000, flujoAcumulado: -26950000 },
        { year: 2, ingresos: 10000000, costos: 7000000, flujoNeto: 3000000, flujoAcumulado: -23950000 },
        { year: 3, ingresos: 30000000, costos: 8050000, flujoNeto: 21950000, flujoAcumulado: -2000000 },
        { year: 4, ingresos: 60000000, costos: 9257500, flujoNeto: 50742500, flujoAcumulado: 48742500 },
        { year: 5, ingresos: 80000000, costos: 10646125, flujoNeto: 69353875, flujoAcumulado: 118096375 },
      ],
      van: 73477873,
      tir: 50.43,
      payback: 3.09,
    },
    {
      name: 'Optimista',
      color: 'green',
      data: [
        { year: 1, ingresos: 10000000, costos: 33950000, flujoNeto: -23950000, flujoAcumulado: -23950000 },
        { year: 2, ingresos: 20000000, costos: 7000000, flujoNeto: 13000000, flujoAcumulado: -10950000 },
        { year: 3, ingresos: 45000000, costos: 8050000, flujoNeto: 36950000, flujoAcumulado: 26000000 },
        { year: 4, ingresos: 60000000, costos: 9257500, flujoNeto: 50742500, flujoAcumulado: 76742500 },
        { year: 5, ingresos: 92000000, costos: 10646125, flujoNeto: 81353875, flujoAcumulado: 158096375 },
      ],
      van: 100000000,
      tir: 65.5,
      payback: 2.8,
    },
  ],
};

const formatCurrency = (amount: number): string => {
  const millions = Math.abs(amount) / 1000000;
  const isNegative = amount < 0;
  return `${isNegative ? '-' : ''}$${millions.toFixed(1)}M`;
};

// ======================
// SLIDES COMPONENTS
// ======================

// Slide 1: Apertura con imagen USAL de fondo
function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo USAL con efectos */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/fondo_usal.png"
          alt="Universidad del Salvador"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay oscuro con gradiente para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-navy-900/80 via-usal-navy-800/75 to-usal-green-900/70" />
        {/* Sombra adicional en los bordes */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Decoración animada sutil */}
      <div className="absolute inset-0 z-0 opacity-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-40 border border-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-6xl"
      >
        {/* Badge translúcido */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-8 py-3 bg-white/15 backdrop-blur-md text-white rounded-full text-xl font-semibold mb-8 border-2 border-white/30 shadow-2xl"
        >
          🎓 Ingeniería en Informática — Proyecto de Tesis
        </motion.div>

        {/* Título principal */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-9xl font-bold text-white mb-6 leading-tight drop-shadow-2xl tracking-tight"
        >
          No es un reclamo
        </motion.h1>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-8xl font-bold bg-gradient-to-r from-usal-green-400 via-usal-gold-300 to-usal-gold-500 bg-clip-text text-transparent mb-12 leading-tight drop-shadow-2xl"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
        >
          es una oportunidad
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl text-white/95 mb-16 max-w-5xl mx-auto leading-relaxed font-medium drop-shadow-lg"
        >
          El SIU Guaraní funciona; la experiencia del alumno puede ser <span className="font-bold text-usal-gold-300">más clara, rápida y humana</span>.
        </motion.p>

        {/* Stats cards translúcidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: IconAlertTriangle, label: 'Satisfacción actual (NPS)', value: '2.86/5', color: 'red' },
            { icon: IconFileText, label: 'Dificultad en inscripciones', value: '≈23%', color: 'gold' },
            { icon: IconMail, label: 'Tickets por falta de contacto', value: '≈32%', color: 'green' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className={`bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300`}
            >
              <stat.icon className={`h-16 w-16 text-usal-${stat.color}-300 mb-4 mx-auto drop-shadow-lg`} />
              <div className={`text-6xl font-bold text-white mb-3 drop-shadow-lg`}>{stat.value}</div>
              <div className="text-2xl text-white/90 leading-tight font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Slide 2: Problema medido
function Slide2() {
  const problems = [
    {
      icon: IconFileText,
      title: 'Inscripciones',
      desc: 'Pasos extra y reintentos por correlativas no claras',
      stat: '22.7%',
      impact: 'Riesgo de perder cuatrimestre',
      color: 'red',
      gradient: 'from-red-500 to-orange-500',
      iconColor: 'text-red-100'
    },
    {
      icon: IconClock,
      title: 'Horarios',
      desc: 'Superposiciones y dudas de disponibilidad',
      stat: '13.6%',
      impact: 'Dificultad para trabajar y estudiar',
      color: 'amber',
      gradient: 'from-amber-400 to-yellow-500',
      iconColor: 'text-amber-100'
    },
    {
      icon: IconFileText,
      title: 'Certificados',
      desc: 'Rutas de descarga poco evidentes',
      stat: '13.6%',
      impact: 'Trámites burocráticos bloqueados',
      color: 'cyan',
      gradient: 'from-cyan-400 to-blue-500',
      iconColor: 'text-cyan-100'
    },
    {
      icon: IconMail,
      title: 'Contacto',
      desc: 'Incertidumbre sobre a quién escribir',
      stat: '31.8%',
      impact: 'Sensación de abandono institucional',
      color: 'emerald',
      gradient: 'from-emerald-400 to-green-500',
      iconColor: 'text-emerald-100'
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden bg-[#2a0a0a]">
      {/* Background Heatmap Vibrant */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-900 to-purple-900" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Heat spots */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/30 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
            Dónde se traba el estudiante
          </h1>
          <p className="text-3xl text-orange-100/90 font-light tracking-wide">
            Fricción en puntos críticos del flujo académico
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group relative overflow-hidden shadow-xl"
            >
              {/* Hover gradient border */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${problem.gradient}`} />

              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${problem.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <problem.icon className={`h-10 w-10 text-white drop-shadow-md`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white">{problem.title}</h3>
                    <div className={`text-3xl font-bold text-white drop-shadow-sm`}>
                      {problem.stat}
                    </div>
                  </div>
                  <p className="text-lg text-white/80 mb-3 leading-snug font-light border-b border-white/10 pb-3">
                    {problem.desc}
                  </p>
                  <div className="flex items-center gap-2 text-orange-200 font-medium text-sm uppercase tracking-wider">
                    <IconAlertTriangle className="h-4 w-4" />
                    Impacto: {problem.impact}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insight Global Banner */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-orange-600/90 to-red-600/90 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl border border-white/20 flex items-center justify-center gap-6"
        >
          <div className="p-3 bg-white/20 rounded-full">
            <IconBrain className="h-8 w-8 text-white" />
          </div>
          <p className="text-2xl font-medium">
            <span className="font-bold">Insight:</span> El <span className="font-bold underline decoration-white/50 underline-offset-4">81% de la fricción</span> es administrativa, no académica.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
// Slide 3: Objetivo
function Slide3() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo abstracta */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/slide3_bg.png"
          alt="Flow background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-green-900/40 via-white/20 to-usal-gold-900/30" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-6xl text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h1 className="text-8xl font-bold mb-8 leading-tight text-white drop-shadow-2xl">
            Menos burocracia.<br />Más estudio.
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-12 mb-16 border border-white/40 shadow-2xl"
        >
          <p className="text-4xl leading-relaxed font-light text-white drop-shadow-md">
            Un asistente inteligente que <span className="font-bold text-usal-gold-300">elimina la fricción administrativa</span>, permitiendo al alumno enfocarse en su carrera.
          </p>
        </motion.div>

        {/* Key points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: IconMessageDots, text: 'Interacción Natural', desc: 'Entiende la intención del alumno sin comandos rígidos' },
            { icon: IconShield, text: 'Validación Proactiva', desc: 'Previene errores chequeando el plan de estudios' },
            { icon: IconMail, text: 'Gestión Automatizada', desc: 'Redacta y envía solicitudes formales al instante' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 border border-white/50 hover:bg-white hover:-translate-y-2 transition-all duration-300 shadow-xl group"
            >
              <div className="bg-usal-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="h-12 w-12 text-usal-green-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-usal-navy-900">{item.text}</h3>
              <p className="text-xl text-usal-navy-700 leading-snug">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slide 4: Stack Técnico (con Gemini)
function Slide4() {
  const stack = [
    {
      category: 'Frontend Moderno',
      tech: 'Next.js 14',
      desc: 'App Router, Server Components',
      icon: IconBrandNextjs,
      color: 'from-white to-gray-400',
      bg: 'bg-white/10',
      iconColor: 'text-white'
    },
    {
      category: 'Motor de IA',
      tech: 'Google Gemini',
      desc: 'NLU/NLG con citas de fuentes',
      icon: IconBrain,
      color: 'from-blue-400 to-purple-500',
      bg: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
    },
    {
      category: 'Infraestructura',
      tech: 'Vercel / Node',
      desc: 'Serverless Functions & Edge',
      icon: IconServer,
      color: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-500/10',
      iconColor: 'text-pink-400'
    },
    {
      category: 'Persistencia',
      tech: 'JSON / Local',
      desc: 'Acceso inmediato sin latencia',
      icon: IconDatabase,
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-500/10',
      iconColor: 'text-amber-400'
    },
    {
      category: 'Seguridad',
      tech: 'NextAuth.js',
      desc: 'Auth Google Workspace USAL',
      icon: IconLock,
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400'
    },
    {
      category: 'Comunicaciones',
      tech: 'Nodemailer',
      desc: 'SMTP Institucional Integrado',
      icon: IconMail,
      color: 'from-red-500 to-orange-500',
      bg: 'bg-red-500/10',
      iconColor: 'text-red-400'
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden bg-[#030712]">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030712]" />
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white drop-shadow-2xl tracking-tight">
            Arquitectura lista para escalar
          </h1>
          <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-2xl text-blue-200/80 font-light tracking-wide">
              Interfaz moderna <span className="mx-2 text-blue-500">•</span> IA Generativa <span className="mx-2 text-blue-500">•</span> Datos confiables
            </p>
          </div>
        </motion.div>

        {/* Stack grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {stack.map((item, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-white/20 hover:bg-gray-800/60 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Gradient border effect on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${item.color}`} />

              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl ${item.bg} border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <item.icon className={`h-10 w-10 ${item.iconColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/5 ${item.iconColor} uppercase tracking-wider`}>
                  {item.category}
                </div>
              </div>

              <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                {item.tech}
              </h3>
              <p className="text-lg text-gray-400 group-hover:text-gray-300 leading-relaxed font-light">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slide 5: Inversión inicial
function Slide5() {
  const team = [
    {
      role: 'Dev Full-Stack',
      seniority: 'Ssr, 3–5 años',
      fte: '0.8 FTE',
      icon: IconCode,
      responsibility: 'Arquitectura, integración con Gemini, seguridad, deploy y observabilidad'
    },
    {
      role: 'PM/UX Research',
      seniority: '2–4 años',
      fte: '0.5 FTE',
      icon: IconUserSearch,
      responsibility: 'Entrevistas, flujos, prototipos, pruebas de usabilidad y métricas'
    },
    {
      role: 'Content Designer',
      seniority: '1–3 años',
      fte: '0.25 FTE',
      icon: IconPencil,
      responsibility: 'FAQs, guías, plantillas de mail institucional, tono y citas normativas'
    },
  ];

  const services = [
    { name: 'Vercel', desc: 'Hosting & CD' },
    { name: 'Gemini API', desc: 'Inteligencia Artificial' },
    { name: 'Gmail SMTP', desc: 'Email institucional' },
    { name: 'NextAuth.js', desc: 'Autenticación segura' },
    { name: 'Google Cloud', desc: 'Gestión de credenciales' },
    { name: 'GitHub', desc: 'Control de versiones' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 relative overflow-hidden">
      {/* Imagen de fondo abstracta */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/slide5_bg.png"
          alt="Inversión background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-navy-900/80 via-white/40 to-usal-gold-900/50" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Header con inversión */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-bold text-usal-navy-900 mb-8 drop-shadow-sm">
            Inversión y Equipo
          </h1>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 text-usal-navy-900 shadow-2xl inline-block border-4 border-usal-gold-400 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <IconCurrencyDollar className="h-32 w-32 text-usal-gold-600" />
            </div>
            <p className="text-2xl font-bold mb-2 text-usal-navy-600 uppercase tracking-wider">Inversión Inicial (Año 1)</p>
            <div className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-usal-gold-600 to-usal-gold-500 drop-shadow-sm tracking-tighter">$33.9M</div>
            <p className="text-2xl text-usal-navy-600 mt-4 font-medium">Incluye equipo, servicios y setup</p>
          </div>
        </motion.div>

        {/* Equipo y dedicación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/60 hover:bg-white/80 transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-usal-navy-100 rounded-2xl group-hover:bg-usal-navy-200 transition-colors">
                  <member.icon className="h-10 w-10 text-usal-navy-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-usal-navy-900 leading-tight">{member.role}</h3>
                  <p className="text-lg text-usal-navy-600 font-semibold">{member.seniority}</p>
                  <p className="text-sm text-usal-navy-500">{member.fte}</p>
                </div>
              </div>
              <p className="text-lg text-usal-navy-800 leading-snug font-light">{member.responsibility}</p>
            </motion.div>
          ))}
        </div>

        {/* Servicios y licencias */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="bg-usal-navy-900/90 backdrop-blur-md rounded-xl p-4 border border-usal-navy-700 shadow-lg hover:bg-usal-navy-800 transition-colors text-center"
              >
                <h4 className="text-lg font-bold text-white mb-1">{service.name}</h4>
                <p className="text-sm text-gray-300 leading-snug">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Slide 6: Escenarios
function Slide6() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden text-white">
      {/* Imagen de fondo tres caminos */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/tres_caminos.jpg"
          alt="Tres caminos"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay oscuro para legibilidad (reducido para ver mejor la imagen) */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-navy-900/75 via-usal-green-900/70 to-usal-gold-900/75" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-bold mb-4">Tres caminos posibles</h1>
          <p className="text-3xl text-white/70">Números de la página principal</p>
        </motion.div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {financialData.scenarios.map((scenario, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={`bg-black/40 backdrop-blur-xl rounded-3xl p-8 border-2 ${scenario.name === 'Moderado' ? 'border-usal-gold-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]' : 'border-white/20'
                } relative hover:scale-105 transition-transform duration-300`}
            >
              <h3 className={`text-5xl font-bold mb-8 text-center drop-shadow-lg ${scenario.name === 'Conservador' ? 'text-red-400' :
                scenario.name === 'Moderado' ? 'text-usal-gold-400' :
                  'text-green-400'
                }`}>
                {scenario.name}
              </h3>

              <div className="space-y-6">
                <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                  <div className="text-xl text-white/70 mb-2 font-medium">VAN (5 años)</div>
                  <div className={`text-4xl font-bold tracking-tight ${scenario.van < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {formatCurrency(scenario.van)}
                  </div>
                </div>

                {scenario.tir !== null && (
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                    <div className="text-xl text-white/70 mb-2 font-medium">TIR</div>
                    <div className={`text-4xl font-bold tracking-tight ${scenario.tir < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {scenario.tir > 0 ? '+' : ''}{scenario.tir.toFixed(2)}%
                    </div>
                  </div>
                )}

                {scenario.payback && (
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                    <div className="text-xl text-white/70 mb-2 font-medium">Payback</div>
                    <div className="text-4xl font-bold text-usal-gold-400 tracking-tight">
                      {scenario.payback.toFixed(2)} años
                    </div>
                  </div>
                )}

                <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                  <div className="text-xl text-white/70 mb-2 font-medium">Flujo año 5</div>
                  <div className={`text-3xl font-bold tracking-tight ${scenario.data[4].flujoAcumulado < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {formatCurrency(scenario.data[4].flujoAcumulado)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slide 7: Clientes objetivo
function Slide7() {
  const clients = [
    { name: 'USAL', logo: '/usal-logo.jpg', status: 'active', label: 'Piloto Activo' },
    { name: 'UTN', logo: '/images/tesis/utnlogo.png', status: 'planned', label: 'Q3 2025' },
    { name: 'UNC', logo: '/images/tesis/unclogo.png', status: 'planned', label: 'Q4 2025' },
    { name: '?', logo: null, status: 'evaluation', label: 'En Negociación' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/slide7_bg.png"
          alt="Network Background"
          fill
          className="object-cover"
        />
        {/* Overlay para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-usal-navy-100/50" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-bold text-usal-navy-900 mb-4 drop-shadow-sm">
            Estrategia de Expansión
          </h1>
          <p className="text-3xl text-usal-navy-600 font-light">
            Del piloto controlado a la escala nacional
          </p>
        </motion.div>

        {/* Grid de logos */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-7xl mx-auto">
          {clients.map((client, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              className="flex flex-col items-center group"
            >
              {/* Logo container */}
              <div className={`
                w-60 h-60 rounded-[2rem] shadow-xl border-2 
                flex items-center justify-center relative overflow-hidden
                ${client.status === 'active'
                  ? 'bg-white border-usal-green-500 shadow-[0_10px_40px_rgba(34,197,94,0.2)]'
                  : client.status === 'planned'
                    ? 'bg-white/80 border-usal-navy-200'
                    : 'bg-gray-50 border-gray-200'
                }
                group-hover:-translate-y-2 transition-all duration-300
              `}>
                {client.status === 'active' && (
                  <div className="absolute top-4 right-4">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                    </span>
                  </div>
                )}

                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className={`w-40 h-40 object-contain p-2 filter transition-all duration-300 ${client.status !== 'active' ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : ''}`}
                  />
                ) : (
                  <div className="text-gray-300 flex flex-col items-center">
                    <IconUserSearch className="h-20 w-20 mb-2" />
                  </div>
                )}
              </div>

              {/* Etiqueta */}
              <div className={`
                mt-6 px-6 py-3 rounded-xl text-xl font-bold shadow-md tracking-wide
                ${client.status === 'active'
                  ? 'bg-usal-green-600 text-white'
                  : client.status === 'planned'
                    ? 'bg-usal-navy-700 text-white'
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {client.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contexto estratégico */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-lg text-center border border-white/80"
        >
          <p className="text-2xl text-usal-navy-800 leading-relaxed font-medium">
            Validación intensiva en <span className="text-usal-green-600 font-bold">USAL</span> para luego replicar el modelo en universidades públicas con ecosistema <span className="text-usal-navy-600 font-bold">SIU Guaraní</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Slide 8: Comparativa dinámica
function Slide8() {
  const [currentView, setCurrentView] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  type ViewKey = 'ingresos' | 'costos' | 'flujoNeto' | 'flujoAcumulado';
  const views: ViewKey[] = ['ingresos', 'costos', 'flujoNeto', 'flujoAcumulado'];
  const viewLabels: Record<ViewKey, string> = {
    ingresos: 'Ingresos',
    costos: 'Costos',
    flujoNeto: 'Flujo neto',
    flujoAcumulado: 'Flujo neto acumulado',
  };

  useEffect(() => {
    if (isPlaying && !prefersReducedMotion) {
      const interval = setInterval(() => {
        setCurrentView((prev) => (prev + 1) % views.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, prefersReducedMotion, views.length]);

  const currentViewKey = views[currentView];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden bg-slate-900">
      {/* Background sofisticado CSS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-usal-navy-900 to-teal-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(30deg, #22c55e 1px, transparent 1px), linear-gradient(150deg, #22c55e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Cómo cambia según el escenario
          </h1>
          <p className="text-3xl text-teal-400 font-light">
            Vista por variable: <span className="font-bold text-white">{viewLabels[views[currentView]]}</span>
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={() => setCurrentView((prev) => (prev - 1 + views.length) % views.length)}
            className="p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10"
            aria-label="Vista anterior"
          >
            <IconArrowLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-8 py-4 rounded-2xl transition-all flex items-center gap-3 text-xl font-semibold border ${isPlaying
              ? 'bg-teal-500/20 text-teal-400 border-teal-500/50'
              : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <IconPlayerPause className="h-6 w-6" /> : <IconPlayerPlay className="h-6 w-6" />}
            {isPlaying ? 'Pausar' : 'Auto Play'}
          </button>
          <button
            onClick={() => setCurrentView((prev) => (prev + 1) % views.length)}
            className="p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10"
            aria-label="Vista siguiente"
          >
            <IconArrowRight className="h-6 w-6" />
          </button>
        </div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-10 py-8 text-left text-2xl font-bold text-white/90">Año</th>
                  {financialData.scenarios.map((scenario) => (
                    <th key={scenario.name} className={`px-10 py-8 text-center text-2xl font-bold ${scenario.name === 'Conservador' ? 'text-red-400' :
                      scenario.name === 'Moderado' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                      {scenario.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3, 4, 5].map((year, i) => (
                  <motion.tr
                    key={year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-10 py-6 text-2xl font-medium text-white/80">Año {year}</td>
                    {financialData.scenarios.map((scenario) => {
                      const value = scenario.data[year - 1][currentViewKey] as number;
                      return (
                        <td key={scenario.name} className="px-10 py-6 text-center">
                          <div className={`text-4xl font-bold tracking-tight ${value < 0 ? 'text-red-400' : 'text-white'
                            }`}>
                            {formatCurrency(value)}
                          </div>
                          {/* Mostrar clientes debajo del valor */}
                          <div className="text-base text-white/40 mt-2 font-light">
                            {year === 1 ? '1 cliente' :
                              year === 2 ? '1 cliente' :
                                year === 3 ? '2 clientes' :
                                  year === 4 ? '3 clientes' :
                                    '4 clientes'}
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Slide 9: Demo
function Slide9() {
  const demos = [
    { title: 'Inscripción guiada', image: '/images/tesis/inscripcion.jpg', desc: 'Valida correlativas y cupos en tiempo real' },
    { title: 'Email generado', image: '/images/tesis/mail.jpg', desc: 'Redacción formal automática con datos del alumno' },
    { title: 'Consulta correlativas', image: '/images/tesis/correlativas.jpg', desc: 'Respuesta basada en el plan de estudios oficial' },
    { title: 'Envío de adjuntos', image: '/images/tesis/envia_correo.png', desc: 'Adjunta certificados médicos o constancias' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 relative overflow-hidden">
      {/* Imagen de fondo prototipo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/prototipo_backround.jpg"
          alt="Prototipo background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-usal-green-50/50 to-white/40" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full h-full flex flex-col justify-center">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-bold text-usal-navy-900 mb-2 drop-shadow-sm">
            Lo que hace el asistente
          </h1>
          <p className="text-2xl text-usal-navy-700 font-medium">Capturas reales del funcionamiento</p>
        </motion.div>

        {/* Grid 2x2 para maximizar tamaño */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 max-h-[70vh]">
          {demos.map((demo, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-3xl shadow-2xl border-4 border-usal-green-100 overflow-hidden hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:scale-[1.02] transition-all duration-300 flex flex-row"
            >
              {/* Imagen grande a la izquierda */}
              <div className="relative w-1/2 h-full bg-gray-100 border-r border-gray-200">
                <Image
                  src={demo.image}
                  alt={demo.title}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Descripción a la derecha */}
              <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
                <h3 className="text-3xl font-bold text-usal-navy-900 mb-4 leading-tight">{demo.title}</h3>
                <p className="text-xl text-usal-navy-600 leading-relaxed">{demo.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slide 10: Resultados MVP
function Slide10() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo prototipo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/prototipo_backround.jpg"
          alt="Prototipo"
          fill
          className="object-cover"
        />
        {/* Overlay más oscuro para resaltar datos */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-navy-900/85 via-white/90 to-usal-green-900/85" />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-7xl font-bold text-usal-navy-900 mb-4 drop-shadow-sm">
            Impacto medido en piloto
          </h1>
          <p className="text-3xl text-usal-navy-700 font-medium">
            Comparativa: Proceso tradicional vs. Asistente Testis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Columna 1: Métricas duras */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-usal-navy-800 mb-6 border-b-4 border-usal-green-500 inline-block pb-2">Eficiencia Operativa</h3>
            {[
              {
                label: 'Tiempo de Resolución (TTR)',
                value: '2.4 min',
                baseline: '8.5 min',
                improvement: '-72%',
                desc: 'Reducción drástica en consultas de rutina',
                icon: IconClock,
                color: 'gold'
              },
              {
                label: 'Tasa de Éxito sin Ayuda Humana',
                value: '87%',
                baseline: '65%',
                improvement: '+22%',
                desc: 'Alumnos resuelven solos sus dudas',
                icon: IconCheckbox,
                color: 'green'
              },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-l-8 border-usal-green-500 flex items-center gap-6"
              >
                <div className={`p-4 rounded-full bg-usal-${metric.color}-100`}>
                  <metric.icon className={`h-10 w-10 text-usal-${metric.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-2xl font-bold text-usal-navy-900">{metric.label}</h4>
                    <span className="bg-green-100 text-green-800 text-lg font-bold px-3 py-1 rounded-full">{metric.improvement}</span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-5xl font-extrabold text-usal-navy-800">{metric.value}</span>
                    <span className="text-xl text-gray-500 line-through">vs {metric.baseline}</span>
                  </div>
                  <p className="text-lg text-usal-navy-600 mt-2">{metric.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Columna 2: Experiencia y Calidad */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-usal-navy-800 mb-6 border-b-4 border-usal-navy-500 inline-block pb-2">Experiencia del Usuario</h3>
            {[
              {
                label: 'Satisfacción (NPS)',
                value: '4.2/5',
                baseline: '2.8/5',
                improvement: '+1.4 pts',
                desc: 'Percepción positiva por inmediatez',
                icon: IconUsers,
                color: 'navy'
              },
              {
                label: 'Errores Críticos por Flujo',
                value: '0.3',
                baseline: '1.2',
                improvement: '-75%',
                desc: 'Menos bloqueos en inscripciones',
                icon: IconAlertTriangle,
                color: 'red'
              },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-l-8 border-usal-navy-500 flex items-center gap-6"
              >
                <div className={`p-4 rounded-full bg-usal-${metric.color}-100`}>
                  <metric.icon className={`h-10 w-10 text-usal-${metric.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-2xl font-bold text-usal-navy-900">{metric.label}</h4>
                    <span className="bg-green-100 text-green-800 text-lg font-bold px-3 py-1 rounded-full">{metric.improvement}</span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-5xl font-extrabold text-usal-navy-800">{metric.value}</span>
                    <span className="text-xl text-gray-500 line-through">vs {metric.baseline}</span>
                  </div>
                  <p className="text-lg text-usal-navy-600 mt-2">{metric.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insight cualitativo */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-usal-navy-800 to-usal-navy-900 rounded-2xl p-8 shadow-2xl text-white flex items-center gap-8 border border-white/20"
        >
          <div className="text-6xl">💡</div>
          <div>
            <h4 className="text-2xl font-bold text-usal-gold-300 mb-2">Insight Clave</h4>
            <p className="text-2xl font-light italic">
              "La capacidad de <span className="font-bold text-white">pre-validar correlativas</span> antes de entrar al SIU eliminó la frustración principal de los alumnos de primer año."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Slide 11: Cierre
function Slide11() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo future */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/slide11_bg.png"
          alt="Future Background"
          fill
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-usal-navy-900 via-usal-navy-900/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl w-full text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-16"
        >
          <h1 className="text-9xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
            De idea a impacto
          </h1>
          <p className="text-4xl text-usal-gold-300 font-light max-w-4xl mx-auto leading-relaxed">
            Testis no es solo un chat. Es la evolución de la experiencia académica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 text-left hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-usal-green-500/20 rounded-xl">
                <IconRocket className="h-10 w-10 text-usal-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white">Objetivo Actual</h3>
            </div>
            <p className="text-2xl text-white/80 leading-relaxed">
              Integración profunda con API SIU Guaraní y lanzamiento de prueba piloto controlada para estudiantes de Ingeniería.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 text-left hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-usal-gold-500/20 rounded-xl">
                <IconSparkles className="h-10 w-10 text-usal-gold-400" />
              </div>
              <h3 className="text-3xl font-bold text-white">Visión Futura</h3>
            </div>
            <p className="text-2xl text-white/80 leading-relaxed">
              Desarrollo de módulo para profesores, analíticas predictivas de deserción y expansión a otras facultades.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent mb-8" />
          <p className="text-xl text-white/60 uppercase tracking-[0.2em] font-medium">
            Tesis de Ingeniería en Informática — Santino Massera
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ======================
// MAIN COMPONENT
// ======================

export default function PresentacionPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides: Slide[] = [
    { id: 1, title: 'Apertura', component: Slide1 },
    { id: 2, title: 'Problema', component: Slide2 },
    { id: 3, title: 'Objetivo', component: Slide3 },
    { id: 4, title: 'Stack Técnico', component: Slide4 },
    { id: 5, title: 'Inversión', component: Slide5 },
    { id: 6, title: 'Escenarios', component: Slide6 },
    { id: 7, title: 'Clientes', component: Slide7 },
    { id: 8, title: 'Comparativa', component: Slide8 },
    { id: 9, title: 'Demo', component: Slide9 },
    { id: 10, title: 'Resultados', component: Slide10 },
    { id: 11, title: 'Conclusión', component: Slide11 },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 'Home') goToSlide(0);
      else if (e.key === 'End') goToSlide(slides.length - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const CurrentSlideComponent = slides[currentSlide].component;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative h-screen overflow-hidden bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-r from-usal-green-600 to-usal-green-500 rounded-lg p-2 transition-transform group-hover:scale-105">
              <img
                src="/usal-logo.jpg"
                alt="USAL"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-usal-green-600 to-usal-green-500 bg-clip-text text-transparent">
                Testis
              </span>
              <span className="text-sm text-usal-navy-600 block -mt-1">
                Presentación de Tesis
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-xl text-usal-navy-600 font-medium">
              Slide {currentSlide + 1} de {slides.length}
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-3 bg-usal-navy-100 text-usal-navy-700 rounded-lg hover:bg-usal-navy-200 transition-all text-lg font-medium"
            >
              <IconHome className="h-5 w-5" />
              Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Slides */}
      <div className="h-screen">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="h-full"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="fixed left-6 top-1/2 -translate-y-1/2 p-5 bg-usal-green-600 text-white rounded-full shadow-2xl hover:bg-usal-green-700 transition-colors z-40"
        >
          <IconChevronLeft className="h-10 w-10" />
        </button>
      )}

      {currentSlide < slides.length - 1 && (
        <button
          onClick={nextSlide}
          className="fixed right-6 top-1/2 -translate-y-1/2 p-5 bg-usal-green-600 text-white rounded-full shadow-2xl hover:bg-usal-green-700 transition-colors z-40"
        >
          <IconChevronRight className="h-10 w-10" />
        </button>
      )}

      {/* Dots */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg z-40">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
              ? 'w-16 h-4 bg-usal-green-600'
              : 'w-4 h-4 bg-gray-300 hover:bg-gray-400'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
