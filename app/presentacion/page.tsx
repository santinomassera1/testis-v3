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
        { year: 5, ingresos: 92000000, costos: 10646125, flujoNeto: 81353875, flujoAcumulado: 130096375 },
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
        { year: 4, ingresos: 75000000, costos: 9257500, flujoNeto: 65742500, flujoAcumulado: 91742500 },
        { year: 5, ingresos: 120000000, costos: 10646125, flujoNeto: 109353875, flujoAcumulado: 201096375 },
      ],
      van: 201096375,
      tir: null,
      payback: 2.5,
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
          className="text-8xl font-bold text-white mb-4 leading-tight drop-shadow-2xl"
      >
          No es un reclamo
      </motion.h1>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-7xl font-bold bg-gradient-to-r from-usal-green-400 to-usal-gold-400 bg-clip-text text-transparent mb-10 leading-tight drop-shadow-2xl"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        >
          es una oportunidad
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg"
        >
          SIU funciona; la experiencia puede ser más clara
        </motion.p>

        {/* Stats cards translúcidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: IconAlertTriangle, label: 'Navegación promedio', value: '2.86/5', color: 'red' },
            { icon: IconFileText, label: 'Dificultad en inscripciones', value: '≈23%', color: 'gold' },
            { icon: IconMail, label: 'Problemas de contacto', value: '≈32%', color: 'green' },
          ].map((stat, i) => (
      <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border-2 border-white/30 hover:bg-white/25 hover:shadow-3xl transition-all duration-300`}
            >
              <stat.icon className={`h-14 w-14 text-usal-${stat.color}-300 mb-4 mx-auto drop-shadow-lg`} />
              <div className={`text-5xl font-bold text-white mb-3 drop-shadow-lg`}>{stat.value}</div>
              <div className="text-xl text-white/90 leading-tight">{stat.label}</div>
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
      color: 'red',
    },
    {
      icon: IconClock,
      title: 'Horarios',
      desc: 'Superposiciones y dudas de disponibilidad',
      stat: '13.6%',
      color: 'gold',
    },
    {
      icon: IconFileText,
      title: 'Certificados',
      desc: 'Rutas de descarga poco evidentes',
      stat: '13.6%',
      color: 'navy',
    },
    {
      icon: IconMail,
      title: 'Contacto',
      desc: 'Incertidumbre sobre a quién escribir',
      stat: '31.8%',
      color: 'green',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo USAL con overlay rojizo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/fondo_usal.png"
          alt="USAL Background"
          fill
          className="object-cover"
        />
        {/* Overlay rojizo para reflejar "problema" */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-red-900/70 via-white/85 to-usal-navy-900/70" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
          <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-bold text-usal-navy-900 mb-4">
            Dónde se traba el estudiante
          </h1>
          <p className="text-3xl text-usal-navy-600">
            Fricción en puntos críticos del flujo académico
          </p>
      </motion.div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`bg-white/35 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border-l-8 border-usal-${problem.color}-500 hover:bg-white/40 hover:shadow-3xl transition-all`}
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-xl bg-usal-${problem.color}-100/80 backdrop-blur-sm`}>
                  <problem.icon className={`h-12 w-12 text-usal-${problem.color}-600`} />
              </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-usal-navy-900 mb-2 drop-shadow-md">{problem.title}</h3>
                  <p className="text-xl text-usal-navy-700 mb-3 drop-shadow-sm">{problem.desc}</p>
                  <div className={`text-4xl font-bold text-usal-${problem.color}-600 drop-shadow-lg`}>{problem.stat}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact summary */}
          <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-usal-red-500/90 to-usal-red-600/90 backdrop-blur-lg rounded-2xl p-10 text-white shadow-2xl border-2 border-white/30"
        >
          <h3 className="text-4xl font-bold mb-4 flex items-center gap-4 drop-shadow-lg">
            <IconAlertTriangle className="h-12 w-12" />
            Impacto: tiempo perdido, ansiedad en picos, tickets repetitivos
          </h3>
          </motion.div>
      </div>
    </div>
  );
}

// Slide 3: Objetivo
function Slide3() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 bg-gradient-to-br from-usal-green-600 via-usal-green-500 to-usal-gold-500 relative overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
            className="absolute w-3 h-3 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
              y: [0, -40, 0],
              opacity: [0, 1, 0],
              }}
              transition={{
              duration: 3 + Math.random() * 2,
                repeat: Infinity,
              delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

      <div className="relative z-10 max-w-6xl text-center text-white">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <IconTarget className="h-28 w-28 mx-auto mb-8" />
          <h1 className="text-8xl font-bold mb-8 leading-tight">
            Menos fricción.<br />Más flujo.
          </h1>
      </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-12 mb-12 border-2 border-white/30"
        >
          <p className="text-4xl leading-relaxed">
            Un asistente conversacional que reduce <span className="font-bold underline decoration-usal-gold-300">tiempo, errores y ansiedad</span> al guiar tareas académicas en SIU
          </p>
        </motion.div>

        {/* Key points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: IconMessageDots, text: 'Lenguaje natural', desc: 'Habla como estudiante' },
            { icon: IconShield, text: 'Validaciones previas', desc: 'Antes de actuar' },
            { icon: IconMail, text: 'Emails automáticos', desc: 'Generación institucional' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30"
            >
              <item.icon className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">{item.text}</h3>
              <p className="text-2xl text-white/90">{item.desc}</p>
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
    { category: 'Framework', tech: 'Next.js 14', desc: 'App Router, RSC', icon: '⚛️' },
    { category: 'IA', tech: 'Google Gemini', desc: 'NLU/NLG con citas', icon: '🤖' },
    { category: 'Backend', tech: 'Neon Postgres', desc: 'Serverless, API Routes', icon: '🗄️' },
    { category: 'UI', tech: 'Tailwind + Framer', desc: 'Aceternity UI', icon: '🎨' },
    { category: 'Integración', tech: 'Widget embebido', desc: 'Sin tocar SIU', icon: '🔌' },
    { category: 'Deploy', tech: 'Vercel', desc: 'Edge Functions', icon: '▲' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 bg-gradient-to-br from-usal-navy-900 via-usal-navy-800 to-usal-navy-700 text-white">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <IconCode className="h-20 w-20 mx-auto mb-6 text-usal-green-400" />
          <h1 className="text-7xl font-bold mb-4">Arquitectura lista para escalar</h1>
          <p className="text-3xl text-white/70">Interfaz moderna + IA + datos confiables</p>
        </motion.div>

        {/* Stack grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stack.map((item, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20"
            >
              <div className="text-6xl mb-4">{item.icon}</div>
              <div className="text-lg text-white/60 mb-2">{item.category}</div>
              <h3 className="text-3xl font-bold mb-2">{item.tech}</h3>
              <p className="text-xl text-white/70">{item.desc}</p>
            </motion.div>
          ))}
      </div>

        {/* Architecture */}
      <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-usal-green-500 to-usal-gold-500 rounded-3xl p-10 shadow-2xl"
        >
          <h3 className="text-4xl font-bold mb-8 text-center">4 capas: Interfaz · Orquestación · IA · Observabilidad</h3>
      </motion.div>
      </div>
    </div>
  );
}

// Slide 5: Inversión inicial
function Slide5() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo plata */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/plata.jpg"
          alt="Inversión"
          fill
          className="object-cover"
        />
        {/* Overlay para legibilidad (reducido para ver mejor la imagen) */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-gold-900/70 via-white/65 to-usal-green-900/70" />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
            <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <IconCurrencyDollar className="h-20 w-20 mx-auto mb-6 text-usal-gold-600" />
          <h1 className="text-7xl font-bold text-usal-navy-900 mb-4">
            Qué se necesita para empezar
          </h1>
          <p className="text-3xl text-usal-navy-600">Equipo mínimo y recursos</p>
            </motion.div>

        {/* Team */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { role: 'Dev Full-Stack', icon: '👨‍💻' },
            { role: 'PM/UX Research', icon: '🎨' },
            { role: 'Content Designer', icon: '✍️' },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/25 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border-2 border-white/40"
            >
              <div className="text-7xl mb-4 text-center">{member.icon}</div>
              <h3 className="text-3xl font-bold text-usal-navy-900 text-center">{member.role}</h3>
            </motion.div>
          ))}
      </div>

        {/* Total */}
      <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-usal-green-600/90 to-usal-gold-600/90 backdrop-blur-lg rounded-3xl p-12 text-white shadow-2xl text-center border-2 border-white/30"
        >
          <h3 className="text-4xl font-bold mb-6">Inversión Inicial Total (Año 1)</h3>
          <div className="text-8xl font-bold drop-shadow-lg">
            $33.9M
        </div>
          <p className="text-2xl text-white/95 mt-4">Incluye setup, contenido base y salarios</p>
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
          <IconTrendingUp className="h-20 w-20 mx-auto mb-6 text-usal-gold-400" />
          <h1 className="text-7xl font-bold mb-4">Tres caminos posibles</h1>
          <p className="text-3xl text-white/70">Números de la página principal</p>
        </motion.div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {financialData.scenarios.map((scenario, i) => (
            <motion.div
                  key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={`bg-white/10 backdrop-blur-md rounded-3xl p-8 border-3 ${
                scenario.name === 'Moderado' ? 'border-usal-gold-400' : 'border-white/20'
              } relative`}
            >
              <h3 className={`text-4xl font-bold mb-8 text-center ${
                scenario.name === 'Conservador' ? 'text-usal-red-400' :
                scenario.name === 'Moderado' ? 'text-usal-gold-400' :
                'text-usal-green-400'
              }`}>
                {scenario.name}
              </h3>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-5">
                  <div className="text-lg text-white/60 mb-1">VAN (5 años)</div>
                  <div className={`text-3xl font-bold ${scenario.van < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {formatCurrency(scenario.van)}
        </div>
      </div>

                {scenario.tir !== null && (
                  <div className="bg-white/5 rounded-xl p-5">
                    <div className="text-lg text-white/60 mb-1">TIR</div>
                    <div className={`text-3xl font-bold ${scenario.tir < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {scenario.tir > 0 ? '+' : ''}{scenario.tir.toFixed(2)}%
        </div>
      </div>
                )}

                {scenario.payback && (
                  <div className="bg-white/5 rounded-xl p-5">
                    <div className="text-lg text-white/60 mb-1">Payback</div>
                    <div className="text-3xl font-bold text-usal-gold-400">
                      {scenario.payback.toFixed(2)} años
            </div>
        </div>
                )}

                <div className="bg-white/5 rounded-xl p-5">
                  <div className="text-lg text-white/60 mb-1">Flujo año 5</div>
                  <div className={`text-2xl font-bold ${scenario.data[4].flujoAcumulado < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {formatCurrency(scenario.data[4].flujoAcumulado)}
            </div>
        </div>
      </div>
            </motion.div>
          ))}
    </div>

        {/* Recommendation */}
            <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-usal-gold-500 to-usal-gold-600 rounded-3xl p-10 shadow-2xl text-center"
        >
          <p className="text-3xl font-medium">
            Moderado como base defendible: payback ~3.09 años, TIR ~50.43%, flujo positivo acumulado ~$130.1M al año 5
          </p>
            </motion.div>
        </div>
    </div>
  );
}

// Slide 7: Comparativa dinámica (NUEVA)
function Slide7() {
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
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, prefersReducedMotion, views.length]);

  const currentViewKey = views[currentView];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo tres caminos */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/tres_caminos.jpg"
          alt="Tres caminos"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay claro para legibilidad de tabla (reducido para ver mejor la imagen) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-usal-green-50/85 to-usal-navy-50/80" />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-7xl font-bold text-usal-navy-900 mb-4">
            Cómo cambia según el escenario
          </h1>
          <p className="text-3xl text-usal-navy-600">
            Vista por variable: {viewLabels[views[currentView]]}
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView((prev) => (prev - 1 + views.length) % views.length)}
            className="p-4 bg-usal-navy-600 text-white rounded-xl hover:bg-usal-navy-700 transition-colors"
            aria-label="Vista anterior"
          >
            <IconArrowLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-8 py-4 bg-usal-green-600 text-white rounded-xl hover:bg-usal-green-700 transition-colors flex items-center gap-3 text-xl font-semibold"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <IconPlayerPause className="h-6 w-6" /> : <IconPlayerPlay className="h-6 w-6" />}
            {isPlaying ? 'Pausar' : 'Auto'}
          </button>
          <button
            onClick={() => setCurrentView((prev) => (prev + 1) % views.length)}
            className="p-4 bg-usal-navy-600 text-white rounded-xl hover:bg-usal-navy-700 transition-colors"
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
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-usal-navy-200"
          >
        <table className="w-full">
              <thead className="bg-gradient-to-r from-usal-navy-600 to-usal-green-600 text-white">
                <tr>
                  <th className="px-8 py-6 text-left text-2xl font-bold">Año</th>
                  {financialData.scenarios.map((scenario) => (
                    <th key={scenario.name} className="px-8 py-6 text-center text-2xl font-bold">
                      {scenario.name}
                    </th>
                  ))}
            </tr>
          </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((year, i) => (
                  <motion.tr
                    key={year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-gray-200 hover:bg-usal-green-50 transition-colors"
                  >
                    <td className="px-8 py-6 text-2xl font-semibold text-usal-navy-900">Año {year}</td>
                    {financialData.scenarios.map((scenario) => {
                      const value = scenario.data[year - 1][currentViewKey] as number;
                      return (
                        <td key={scenario.name} className="px-8 py-6 text-center">
                          <div className={`text-3xl font-bold ${
                            value < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(value)}
                          </div>
                          {/* Mostrar clientes debajo del valor */}
                          <div className="text-sm text-usal-navy-500 mt-1">
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

// Slide 8: Demo
function Slide8() {
  const demos = [
    { title: 'Inscripción guiada', image: '/images/tesis/inscripcion.jpg', desc: 'Valida correlativas' },
    { title: 'Email generado', image: '/images/tesis/mail.jpg', desc: 'Borrador institucional' },
    { title: 'Consulta correlativas', image: '/images/tesis/correlativas.jpg', desc: 'Con cita de norma' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo prototipo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/prototipo_backround.jpg"
          alt="Prototipo background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay mínimo para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-usal-green-50/40 to-white/35" />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <IconRocket className="h-20 w-20 mx-auto mb-6 text-usal-green-600" />
          <h1 className="text-7xl font-bold text-usal-navy-900 mb-4">
            Lo que hace el asistente
          </h1>
          <p className="text-3xl text-usal-navy-600">Capturas reales del chatbot</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {demos.map((demo, i) => (
          <motion.div
            key={i}
              initial={{ scale: 0, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              className="bg-white rounded-2xl shadow-xl border-2 border-usal-green-200 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all"
            >
              {/* Image sin zoom - ajustadas al marco */}
              <div className="relative h-80 bg-gray-100 overflow-hidden">
                <Image
                  src={demo.image}
                  alt={demo.title}
                  fill
                  className="object-contain"
                />
              </div>
              {/* Description */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-usal-navy-900 mb-2">{demo.title}</h3>
                <p className="text-xl text-usal-navy-600">{demo.desc}</p>
              </div>
          </motion.div>
        ))}
      </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-usal-green-600 to-usal-green-500 rounded-3xl p-12 text-white text-center shadow-2xl"
        >
          <IconPlayerPlay className="h-20 w-20 mx-auto mb-6" />
          <h3 className="text-5xl font-bold mb-6">¿Querés probarlo en vivo?</h3>
          <Link
            href="/"
            className="inline-flex items-center gap-4 bg-white text-usal-green-600 px-10 py-5 rounded-xl text-2xl font-bold hover:bg-usal-green-50 transition-colors shadow-xl"
          >
            <IconExternalLink className="h-8 w-8" />
            Ver demo en vivo
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// Slide 9: Resultados MVP
function Slide9() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo prototipo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/prototipo_background.jpg"
          alt="Prototipo"
          fill
          className="object-cover"
        />
        {/* Overlay para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-navy-900/75 via-white/85 to-usal-green-900/75" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>

      <div className="relative z-10 max-w-6xl w-full">
      <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <IconChartBar className="h-20 w-20 mx-auto mb-6 text-usal-navy-600" />
          <h1 className="text-7xl font-bold text-usal-navy-900 mb-4">
            Lo que medimos
          </h1>
          <p className="text-3xl text-usal-navy-600">Resultados del MVP con usuarios piloto</p>
      </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {[
            { label: 'Tareas completadas sin ayuda', value: '87%', target: 'Meta: >80%', icon: IconCheckbox, color: 'green' },
            { label: 'TTR con asistente', value: '2.4 min', target: 'vs 8.5 min sin bot', icon: IconClock, color: 'gold' },
            { label: 'Errores críticos por flujo', value: '0.3', target: 'Meta: <1', icon: IconAlertTriangle, color: 'red' },
            { label: 'Satisfacción post-uso', value: '4.2/5', target: 'vs 2.86/5 baseline', icon: IconUsers, color: 'navy' },
          ].map((metric, i) => (
          <motion.div
            key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`bg-white/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border-2 border-white/40`}
            >
              <div className="flex items-start gap-6">
                <div className={`p-5 rounded-xl bg-usal-${metric.color}-100/80 backdrop-blur-sm`}>
                  <metric.icon className={`h-14 w-14 text-usal-${metric.color}-600`} />
              </div>
                <div>
                  <h3 className="text-2xl font-semibold text-usal-navy-900 mb-3 drop-shadow-md">{metric.label}</h3>
                  <div className={`text-5xl font-bold text-usal-${metric.color}-600 mb-2 drop-shadow-lg`}>{metric.value}</div>
                  <div className="text-lg text-usal-navy-700 drop-shadow-sm">{metric.target}</div>
            </div>
                  </div>
          </motion.div>
        ))}
      </div>

            <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-usal-gold-500/80 to-usal-green-500/80 backdrop-blur-lg rounded-3xl p-10 border-2 border-white/40 text-center shadow-2xl"
        >
          <p className="text-2xl text-white drop-shadow-lg">
            <strong>Datos de piloto MVP</strong> (n=15 estudiantes) — a validar con cohorte mayor en producción
          </p>
            </motion.div>
        </div>
      </div>
  );
}

// Slide 10: Conclusión
function Slide10() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-12 relative overflow-hidden">
      {/* Imagen de fondo chatbot - más visible */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tesis/chatbot_ultima_slide.jpg"
          alt="Chatbot final"
          fill
          className="object-cover"
        />
        {/* Overlay más transparente para ver mejor el robot */}
        <div className="absolute inset-0 bg-gradient-to-br from-usal-green-900/60 via-usal-green-800/50 to-usal-gold-900/60" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
          </div>

      {/* Particles celebratorias */}
      <div className="absolute inset-0 z-0">
        {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
            className="absolute w-4 h-4 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
              y: [0, -60, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
              }}
              transition={{
              duration: 3 + Math.random() * 2,
                repeat: Infinity,
              delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

      <div className="relative z-10 max-w-6xl w-full text-white text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <IconSparkles className="h-28 w-28 mx-auto mb-8 drop-shadow-2xl" />
          <h1 className="text-8xl font-bold mb-8" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)' }}>
            De idea a impacto
          </h1>
      </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-12 mb-12 border-2 border-white/50 shadow-2xl"
        >
          <p className="text-4xl leading-relaxed font-semibold" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.7)' }}>
            Testis cumple su promesa: <span className="font-bold underline decoration-usal-gold-300">guía, explica y cita la fuente</span> antes de actuar
          </p>
        </motion.div>

        {/* Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: IconTarget, title: 'Prototipo', desc: 'Reduce fricción' },
            { icon: IconCode, title: 'Stack', desc: 'Moderno, extensible' },
            { icon: IconChartBar, title: 'Finanzas', desc: 'Moderado viable' },
            { icon: IconUsers, title: 'Validación', desc: 'Piloto + feedback' },
          ].map((item, i) => (
    <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/25 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/50 shadow-xl"
            >
              <item.icon className="h-14 w-14 mx-auto mb-4 drop-shadow-2xl" />
              <h3 className="font-bold text-2xl mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{item.title}</h3>
              <p className="text-xl" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>{item.desc}</p>
            </motion.div>
          ))}
          </div>

        {/* Next steps */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white/30 backdrop-blur-xl rounded-3xl p-10 border-2 border-white/50 shadow-2xl"
        >
          <h3 className="text-4xl font-bold mb-6 flex items-center justify-center gap-4 text-white" style={{ textShadow: '0 3px 15px rgba(0,0,0,0.8)' }}>
            <IconRocket className="h-10 w-10 text-usal-gold-300 drop-shadow-2xl" />
            Próximos pasos
          </h3>
          <p className="text-2xl leading-relaxed text-white font-semibold" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            Ampliar cobertura · Integración formal con SIU · Analíticas sin PII para Académica
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
    { id: 7, title: 'Comparativa', component: Slide7 },
    { id: 8, title: 'Demo', component: Slide8 },
    { id: 9, title: 'Resultados', component: Slide9 },
    { id: 10, title: 'Conclusión', component: Slide10 },
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
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-16 h-4 bg-usal-green-600'
                : 'w-4 h-4 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
