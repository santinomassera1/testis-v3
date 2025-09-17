'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChartLine, IconTrendingUp, IconCurrencyDollar, IconCalendar, IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';
import UniversalBackground from '../UniversalBackground';

interface ScenarioData {
  year: number;
  ingresos: number;
  costos: number;
  flujoNeto: number;
  flujoAcumulado: number;
  clientes: number;
}

interface Scenario {
  name: string;
  color: string;
  bgColor: string;
  data: ScenarioData[];
  van?: number;
  tir?: number;
  payback?: number;
  gananciaAcumulada?: number;
}

const scenarios: Scenario[] = [
  {
    name: 'Conservador',
    color: 'text-usal-red-500',
    bgColor: 'bg-usal-red-500',
    data: [
      { year: 1, ingresos: 7000000, costos: 33950000, flujoNeto: -26950000, flujoAcumulado: -26950000, clientes: 1 },
      { year: 2, ingresos: 7000000, costos: 7000000, flujoNeto: 0, flujoAcumulado: -26950000, clientes: 1 },
      { year: 3, ingresos: 10000000, costos: 8050000, flujoNeto: 1950000, flujoAcumulado: -25000000, clientes: 2 },
      { year: 4, ingresos: 15000000, costos: 9257500, flujoNeto: 5742500, flujoAcumulado: -19257500, clientes: 3 },
      { year: 5, ingresos: 20000000, costos: 10646125, flujoNeto: 9353875, flujoAcumulado: -9903625, clientes: 4 },
    ],
    van: -19469703,
    tir: -15.93,
  },
  {
    name: 'Moderado',
    color: 'text-usal-gold-500',
    bgColor: 'bg-usal-gold-500',
    data: [
      { year: 1, ingresos: 7000000, costos: 33950000, flujoNeto: -26950000, flujoAcumulado: -26950000, clientes: 1 },
      { year: 2, ingresos: 10000000, costos: 7000000, flujoNeto: 3000000, flujoAcumulado: -23950000, clientes: 1 },
      { year: 3, ingresos: 30000000, costos: 8050000, flujoNeto: 21950000, flujoAcumulado: -2000000, clientes: 2 },
      { year: 4, ingresos: 60000000, costos: 9257500, flujoNeto: 50742500, flujoAcumulado: 48742500, clientes: 3 },
      { year: 5, ingresos: 92000000, costos: 10646125, flujoNeto: 81353875, flujoAcumulado: 130096375, clientes: 4 },
    ],
    van: 73477873,
    tir: 50.43,
    payback: 3.09,
  },
  {
    name: 'Optimista',
    color: 'text-usal-green-500',
    bgColor: 'bg-usal-green-500',
    data: [
      { year: 1, ingresos: 10000000, costos: 33950000, flujoNeto: -23950000, flujoAcumulado: -23950000, clientes: 1 },
      { year: 2, ingresos: 20000000, costos: 7000000, flujoNeto: 13000000, flujoAcumulado: -10950000, clientes: 1 },
      { year: 3, ingresos: 45000000, costos: 8050000, flujoNeto: 36950000, flujoAcumulado: 26000000, clientes: 2 },
      { year: 4, ingresos: 75000000, costos: 9257500, flujoNeto: 65742500, flujoAcumulado: 91742500, clientes: 3 },
      { year: 5, ingresos: 120000000, costos: 10646125, flujoNeto: 109353875, flujoAcumulado: 201096375, clientes: 4 },
    ],
    gananciaAcumulada: 201096375,
  },
];

const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const isNegative = amount < 0;
  const formatted = absAmount.toLocaleString('es-AR');
  return `${isNegative ? '-' : ''}$${formatted}`;
};

const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const formatClientes = (count: number): string => {
  return `${count} ${count === 1 ? 'universidad' : 'universidades'}`;
};

const getUniversidadNames = (count: number): string[] => {
  const universidades = [
    'Universidad del Salvador (USAL)',
    'Universidad Católica Argentina (UCA)', 
    'Universidad de Buenos Aires (UBA)',
    'Universidad Torcuato Di Tella (UTDT)'
  ];
  return universidades.slice(0, count);
};

export default function FinancialSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<number>(1); // Moderado por defecto
  const [selectedMetric, setSelectedMetric] = useState<'ingresos' | 'costos' | 'flujoNeto' | 'flujoAcumulado'>('flujoAcumulado');
  const [hoveredPoint, setHoveredPoint] = useState<{ scenario: number; year: number; data: ScenarioData } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms entre años

  const currentScenario = scenarios[selectedScenario];

  // Timeline Animation Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= 5) {
            setIsPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, animationSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed]);

  // Reset animation when scenario changes
  useEffect(() => {
    setCurrentYear(1);
    setIsPlaying(false);
  }, [selectedScenario]);

  // Calcular valores máximos y mínimos para el gráfico
  const allValues = scenarios.flatMap(scenario => 
    scenario.data.map(d => d[selectedMetric])
  );
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue;

  const getYPosition = (value: number): number => {
    return ((maxValue - value) / range) * 300 + 50;
  };

  const getXPosition = (year: number): number => {
    return ((year - 1) / 4) * 800 + 100;
  };

  const createPath = (data: ScenarioData[], maxYear?: number): string => {
    const visibleData = maxYear !== undefined 
      ? data.filter(d => d.year <= maxYear)
      : data;
    
    if (visibleData.length === 0) return '';
    
    return visibleData
      .map((d, i) => 
        `${i === 0 ? 'M' : 'L'} ${getXPosition(d.year)} ${getYPosition(d[selectedMetric])}`
      )
      .join(' ');
  };

  // Tooltip Component
  const Tooltip = ({ data, x, y, scenario }: { 
    data: ScenarioData; 
    x: number; 
    y: number; 
    scenario: Scenario;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="absolute z-20 bg-white rounded-xl shadow-2xl p-4 pointer-events-none border border-gray-200 backdrop-blur-sm bg-white/95"
      style={{
        left: x + 15,
        top: y - 280,
        minWidth: '280px',
        maxWidth: '320px'
      }}
    >
      <div className="text-sm font-semibold text-gray-900 mb-2">
        Año {data.year} - {scenario.name}
      </div>
      <div className="space-y-2">
        {/* Header con clientes */}
        <div className="bg-usal-navy-50 rounded-lg p-3 border-l-4 border-usal-gold-500">
          <div className="flex justify-between items-center">
            <span className="text-usal-navy-700 font-semibold text-sm">Clientes Activos:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-usal-gold-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{data.clientes}</span>
              </div>
              <span className="font-semibold text-usal-navy-800">{formatClientes(data.clientes)}</span>
            </div>
          </div>
          {data.clientes > 0 && (
            <div className="mt-2 text-xs text-usal-navy-600">
              Universidades: {getUniversidadNames(data.clientes).map(uni => uni.split('(')[1]?.replace(')', '') || uni).join(', ')}
            </div>
          )}
        </div>
        
        {/* Métricas financieras */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Ingresos:</span>
            <span className="font-medium text-green-600">{formatCurrency(data.ingresos)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Costos:</span>
            <span className="font-medium text-red-600">{formatCurrency(data.costos)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 bg-gray-50 px-2 py-1 rounded">
            <span className="text-gray-700 font-semibold">Ganancia Neta:</span>
            <span className={`font-bold ${data.flujoNeto < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(data.flujoNeto)}
            </span>
          </div>
          {data.clientes > 0 && data.flujoNeto > 0 && (
            <div className="flex justify-between text-usal-gold-700 bg-usal-gold-50 px-2 py-1 rounded">
              <span className="font-medium">Por Universidad:</span>
              <span className="font-semibold">
                {formatCurrency(Math.round(data.flujoNeto / data.clientes))}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t pt-1">
            <span className="text-gray-600">Acumulado:</span>
            <span className={`font-semibold ${data.flujoAcumulado < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(data.flujoAcumulado)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <UniversalBackground intensity="light" className="absolute inset-0 -mx-4 -my-16" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Simulador de Escenarios Financieros
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Visualización interactiva de la evolución financiera del proyecto Testis según diferentes escenarios de crecimiento
        </p>
      </motion.div>

      {/* Selector de Escenarios */}
      <div className="mb-8 relative z-10">
        <div className="flex flex-wrap justify-center gap-4">
          {scenarios.map((scenario, index) => (
            <motion.button
              key={scenario.name}
              onClick={() => setSelectedScenario(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedScenario === index
                  ? `${scenario.bgColor} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Escenario {scenario.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selector de Métrica */}
      <div className="mb-8 relative z-10">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { key: 'ingresos', label: 'Ingresos', icon: IconTrendingUp },
            { key: 'costos', label: 'Costos', icon: IconCurrencyDollar },
            { key: 'flujoNeto', label: 'Flujo Neto', icon: IconChartLine },
            { key: 'flujoAcumulado', label: 'Flujo Acumulado', icon: IconCalendar },
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              onClick={() => setSelectedMetric(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedMetric === key
                  ? 'bg-usal-navy-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={16} />
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="mb-8 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-6 py-3 bg-usal-green-600 text-white rounded-lg font-semibold hover:bg-usal-green-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
              {isPlaying ? 'Pausar' : 'Reproducir'} Timeline
            </motion.button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Velocidad:</span>
              <select
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value={2000}>Lenta (2s)</option>
                <option value={1000}>Normal (1s)</option>
                <option value={500}>Rápida (0.5s)</option>
              </select>
            </div>
          </div>
          
          {/* Timeline Scrubber */}
          <div className="w-full max-w-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Año:</span>
              <input
                type="range"
                min="1"
                max="5"
                value={currentYear}
                onChange={(e) => {
                  setCurrentYear(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="flex-1"
              />
              <span className="text-sm font-semibold text-usal-navy-700 min-w-[3rem]">
                {currentYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Gráfico Principal */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-white rounded-xl shadow-derek p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Evolución de {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1).replace(/([A-Z])/g, ' $1')}
            </h3>
            
            <div className="relative">
              <svg width="100%" height="400" viewBox="0 0 1000 400" className="overflow-visible">
                {/* Grid lines */}
                {[1, 2, 3, 4, 5].map(year => (
                  <g key={year} opacity={year <= currentYear ? 1 : 0.3}>
                    <line
                      x1={getXPosition(year)}
                      y1={50}
                      x2={getXPosition(year)}
                      y2={350}
                      stroke="#f3f4f6"
                      strokeWidth={1}
                    />
                    <text
                      x={getXPosition(year)}
                      y={370}
                      textAnchor="middle"
                      className={`fill-gray-600 text-sm ${year <= currentYear ? 'font-semibold' : ''}`}
                    >
                      Año {year}
                    </text>
                    {/* Mostrar valores monetarios */}
                    {year <= currentYear && currentScenario.data.find(d => d.year === year) && (
                      <text
                        x={getXPosition(year)}
                        y={390}
                        textAnchor="middle"
                        className="fill-usal-green-600 text-xs font-medium"
                      >
                        {formatCurrency(currentScenario.data.find(d => d.year === year)?.[selectedMetric] || 0)}
                      </text>
                    )}
                  </g>
                ))}

                {/* Área de relleno animada */}
                <AnimatePresence>
                  {scenarios.map((scenario, index) => {
                    const visibleData = scenario.data.filter(d => d.year <= currentYear);
                    if (visibleData.length < 2) return null;
                    
                    const color = scenario.bgColor.replace('bg-', '').replace('-500', '');
                    
                    // Crear path para el área de relleno
                    const areaPath = visibleData
                      .map((d, i) => 
                        `${i === 0 ? 'M' : 'L'} ${getXPosition(d.year)} ${getYPosition(d[selectedMetric])}`
                      )
                      .join(' ') + 
                      // Cerrar el área hacia el eje X
                      ` L ${getXPosition(visibleData[visibleData.length - 1].year)} 350` +
                      ` L ${getXPosition(visibleData[0].year)} 350 Z`;
                    
                    return (
                      <motion.g
                        key={scenario.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: selectedScenario === index ? 1 : 0.3 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Área de relleno con gradiente */}
                        <defs>
                          <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
                            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
                          </linearGradient>
                        </defs>
                        
                        <motion.path
                          d={areaPath}
                          fill={`url(#gradient-${index})`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        
                        {/* Línea principal animada */}
                        <motion.path
                          d={createPath(scenario.data, currentYear)}
                          fill="none"
                          stroke={color}
                          strokeWidth={selectedScenario === index ? 4 : 2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-lg"
                          style={{
                            filter: selectedScenario === index ? `drop-shadow(0 0 8px ${color}50)` : 'none'
                          }}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                        
                        {/* Punto indicador del año actual */}
                        {scenario.data.find(d => d.year === currentYear) && (
                          <motion.g>
                            {/* Círculo principal */}
                            <motion.circle
                              cx={getXPosition(currentYear)}
                              cy={getYPosition(scenario.data.find(d => d.year === currentYear)?.[selectedMetric] || 0)}
                              r={selectedScenario === index ? 8 : 5}
                              fill="white"
                              stroke={color}
                              strokeWidth={selectedScenario === index ? 4 : 3}
                              className="drop-shadow-lg cursor-pointer"
                              initial={{ scale: 0, rotate: 0 }}
                              animate={{ scale: 1, rotate: 360 }}
                              transition={{ duration: 0.8, ease: "backOut" }}
                              onMouseEnter={() => {
                                const yearData = scenario.data.find(d => d.year === currentYear);
                                if (yearData) {
                                  setHoveredPoint({
                                    scenario: index,
                                    year: currentYear,
                                    data: yearData
                                  });
                                }
                              }}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                            
                            {/* Anillo de pulso solo para el escenario seleccionado */}
                            {selectedScenario === index && (
                              <>
                                <motion.circle
                                  cx={getXPosition(currentYear)}
                                  cy={getYPosition(scenario.data.find(d => d.year === currentYear)?.[selectedMetric] || 0)}
                                  r={12}
                                  fill="none"
                                  stroke={color}
                                  strokeWidth={2}
                                  opacity={0.6}
                                  initial={{ scale: 0.5, opacity: 0.8 }}
                                  animate={{ scale: [0.8, 2, 0.8], opacity: [0.8, 0, 0.8] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <motion.circle
                                  cx={getXPosition(currentYear)}
                                  cy={getYPosition(scenario.data.find(d => d.year === currentYear)?.[selectedMetric] || 0)}
                                  r={8}
                                  fill="none"
                                  stroke={color}
                                  strokeWidth={1}
                                  opacity={0.4}
                                  initial={{ scale: 1 }}
                                  animate={{ scale: [1, 1.5, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                />
                              </>
                            )}
                          </motion.g>
                        )}
                      </motion.g>
                    );
                  })}
                </AnimatePresence>

                {/* Línea de referencia en cero */}
                {minValue < 0 && (
                  <line
                    x1={100}
                    y1={getYPosition(0)}
                    x2={getXPosition(currentYear)}
                    y2={getYPosition(0)}
                    stroke="#ef4444"
                    strokeWidth={1}
                    strokeDasharray="5,5"
                    opacity={0.5}
                  />
                )}
              </svg>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredPoint && (
                  <Tooltip
                    data={hoveredPoint.data}
                    x={getXPosition(hoveredPoint.data.year)}
                    y={getYPosition(hoveredPoint.data[selectedMetric])}
                    scenario={scenarios[hoveredPoint.scenario]}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Panel de Indicadores */}
        <div className="space-y-6">
          <motion.div
            className="bg-white rounded-xl shadow-derek p-6 relative overflow-hidden"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{
              rotateY: -5,
              rotateX: 2,
              scale: 1.02,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 20px rgba(34, 197, 94, 0.1)',
              transition: { duration: 0.3 }
            }}
          >
            <h3 className={`text-2xl font-bold mb-6 ${currentScenario.color}`}>
              Escenario {currentScenario.name}
            </h3>
            
            {/* Indicadores clave */}
            <div className="space-y-4">
              {currentScenario.van !== undefined && (
                <motion.div 
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg relative group overflow-hidden"
                  style={{ perspective: '1000px' }}
                  initial={{ opacity: 0, rotateX: 20, z: -50 }}
                  animate={{ opacity: 1, rotateX: 0, z: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{
                    rotateX: -5,
                    rotateY: 5,
                    scale: 1.05,
                    boxShadow: '0 15px 30px -5px rgba(0,0,0,0.2)',
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-sm text-gray-600 mb-1 relative z-10">VAN</div>
                  <motion.div 
                    className={`text-lg font-bold relative z-10 ${currentScenario.van < 0 ? 'text-red-500' : 'text-green-500'}`}
                    whileHover={{ scale: 1.1, textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
                  >
                    {formatCurrency(currentScenario.van)} ARS
                  </motion.div>
                </motion.div>
              )}
              
              {currentScenario.tir !== undefined && (
                <motion.div 
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg relative group overflow-hidden"
                  style={{ perspective: '1000px' }}
                  initial={{ opacity: 0, rotateX: 20, z: -50 }}
                  animate={{ opacity: 1, rotateX: 0, z: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{
                    rotateX: -5,
                    rotateY: 5,
                    scale: 1.05,
                    boxShadow: '0 15px 30px -5px rgba(0,0,0,0.2)',
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-sm text-gray-600 mb-1 relative z-10">TIR</div>
                  <motion.div 
                    className={`text-lg font-bold relative z-10 ${currentScenario.tir < 0 ? 'text-red-500' : 'text-green-500'}`}
                    whileHover={{ scale: 1.1, textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
                  >
                    {formatPercentage(currentScenario.tir)}
                  </motion.div>
                </motion.div>
              )}
              
              {currentScenario.payback !== undefined && (
                <motion.div 
                  className="p-4 bg-gradient-to-br from-usal-gold-50 to-usal-gold-100 rounded-lg relative group overflow-hidden"
                  style={{ perspective: '1000px' }}
                  initial={{ opacity: 0, rotateX: 20, z: -50 }}
                  animate={{ opacity: 1, rotateX: 0, z: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{
                    rotateX: -5,
                    rotateY: 5,
                    scale: 1.05,
                    boxShadow: '0 15px 30px -5px rgba(245, 158, 11, 0.3)',
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-sm text-usal-gold-700 mb-1 relative z-10">Payback</div>
                  <motion.div 
                    className="text-lg font-bold text-usal-gold-600 relative z-10"
                    whileHover={{ scale: 1.1, textShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}
                  >
                    {currentScenario.payback.toFixed(2)} años
                  </motion.div>
                </motion.div>
              )}
              
              {currentScenario.gananciaAcumulada !== undefined && (
                <motion.div 
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg relative group overflow-hidden"
                  style={{ perspective: '1000px' }}
                  initial={{ opacity: 0, rotateX: 20, z: -50 }}
                  animate={{ opacity: 1, rotateX: 0, z: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{
                    rotateX: -5,
                    rotateY: 5,
                    scale: 1.05,
                    boxShadow: '0 15px 30px -5px rgba(34, 197, 94, 0.3)',
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-sm text-green-700 mb-1 relative z-10">Ganancia Acumulada</div>
                  <motion.div 
                    className="text-lg font-bold text-green-500 relative z-10"
                    whileHover={{ scale: 1.1, textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
                  >
                    {formatCurrency(currentScenario.gananciaAcumulada)} ARS
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Tabla de datos hasta el año actual */}
          <motion.div
            className="bg-white rounded-xl shadow-derek p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Datos hasta Año {currentYear}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Año</th>
                    <th className="text-right py-2">Flujo Neto</th>
                    <th className="text-right py-2">Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {currentScenario.data
                    .filter(data => data.year <= currentYear)
                    .map((data, index) => (
                      <motion.tr 
                        key={index} 
                        className="border-b border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="py-2 font-medium">{data.year}</td>
                        <td className={`text-right py-2 font-medium ${
                          data.flujoNeto < 0 ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {formatCurrency(data.flujoNeto)}
                        </td>
                        <td className={`text-right py-2 font-semibold ${
                          data.flujoAcumulado < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(data.flujoAcumulado)}
                        </td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {/* Mostrar datos del año actual destacados */}
            {currentYear >= 1 && currentScenario.data.find(d => d.year === currentYear) && (
              <motion.div 
                className="mt-4 p-4 bg-gradient-to-r from-usal-green-50 to-usal-gold-50 rounded-lg border-l-4 border-usal-green-500"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-usal-green-700">
                      Año {currentYear} - Resumen con Clientes
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-usal-gold-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {currentScenario.data.find(d => d.year === currentYear)?.clientes || 0}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-usal-navy-700">
                        {formatClientes(currentScenario.data.find(d => d.year === currentYear)?.clientes || 0)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Lista de universidades */}
                  {currentScenario.data.find(d => d.year === currentYear)?.clientes && (
                    <div className="bg-usal-navy-50 rounded p-2">
                      <div className="text-xs text-usal-navy-600 font-medium mb-1">Universidades activas:</div>
                      <div className="flex flex-wrap gap-1">
                        {getUniversidadNames(currentScenario.data.find(d => d.year === currentYear)?.clientes || 0).map((uni, idx) => (
                          <span key={idx} className="text-xs bg-white px-2 py-1 rounded border text-usal-navy-700">
                            {uni.split('(')[1]?.replace(')', '') || uni}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-green-50 p-2 rounded border-l-2 border-green-400">
                      <span className="text-gray-600 block">Ingresos totales:</span>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(currentScenario.data.find(d => d.year === currentYear)?.ingresos || 0)}
                      </div>
                    </div>
                    <div className="bg-red-50 p-2 rounded border-l-2 border-red-400">
                      <span className="text-gray-600 block">Costos totales:</span>
                      <div className="font-semibold text-red-600">
                        {formatCurrency(currentScenario.data.find(d => d.year === currentYear)?.costos || 0)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Ganancia neta destacada */}
                  <div className="bg-gradient-to-r from-usal-gold-100 to-usal-green-100 p-3 rounded-lg border border-usal-gold-300">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-usal-navy-700">Ganancia Neta:</span>
                      <span className={`font-bold text-lg ${
                        (currentScenario.data.find(d => d.year === currentYear)?.flujoNeto || 0) < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(currentScenario.data.find(d => d.year === currentYear)?.flujoNeto || 0)}
                      </span>
                    </div>
                    
                    {/* Ganancia por universidad */}
                    {(currentScenario.data.find(d => d.year === currentYear)?.clientes || 0) > 0 && 
                     (currentScenario.data.find(d => d.year === currentYear)?.flujoNeto || 0) > 0 && (
                      <div className="mt-2 pt-2 border-t border-usal-gold-300 flex justify-between items-center">
                        <span className="text-sm text-usal-navy-600">Ganancia por Universidad:</span>
                        <span className="font-semibold text-usal-gold-700">
                          {formatCurrency(Math.round((currentScenario.data.find(d => d.year === currentYear)?.flujoNeto || 0) / (currentScenario.data.find(d => d.year === currentYear)?.clientes || 1)))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Comparación rápida */}
      <motion.div
        className="mt-12 bg-white rounded-xl shadow-derek p-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Resumen Comparativo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <div key={scenario.name} className="text-center p-6 bg-gray-50 rounded-lg">
              <h4 className={`text-lg font-semibold mb-3 ${scenario.color}`}>
                {scenario.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  Clientes año 5: <span className="font-semibold text-usal-navy-600">
                    {formatClientes(scenario.data[scenario.data.length - 1].clientes)}
                  </span>
                </div>
                <div>
                  Flujo final: <span className="font-semibold">
                    {formatCurrency(scenario.data[scenario.data.length - 1].flujoAcumulado)}
                  </span>
                </div>
                {scenario.van !== undefined && (
                  <div>
                    VAN: <span className={`font-semibold ${scenario.van < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatCurrency(scenario.van)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
