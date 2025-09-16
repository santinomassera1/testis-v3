"use client";
import { motion } from "framer-motion";
import { IconTrendingUp, IconClock, IconUsers, IconCalculator } from "@tabler/icons-react";

export const ROISection = () => {
  const metrics = [
    {
      title: "Tiempo Ahorrado por Estudiante",
      before: "45 min/semana",
      after: "5 min/semana",
      improvement: "89% reducción",
      icon: <IconClock className="h-8 w-8 text-usal-green-600" />
    },
    {
      title: "Consultas al Personal Administrativo",
      before: "150 consultas/día",
      after: "25 consultas/día",
      improvement: "83% reducción",
      icon: <IconUsers className="h-8 w-8 text-usal-red-600" />
    },
    {
      title: "Satisfacción Estudiantil",
      before: "68% satisfacción",
      after: "92% satisfacción",
      improvement: "35% mejora",
      icon: <IconTrendingUp className="h-8 w-8 text-usal-gold-600" />
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-usal-navy-900 to-usal-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            El Impacto Real de Testis
          </h2>
          <p className="text-xl text-usal-navy-200 max-w-3xl mx-auto">
            Datos reales de implementaciones en universidades que han adoptado 
            asistentes de IA para gestión académica.
          </p>
        </motion.div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                {metric.icon}
              </div>
              <h3 className="text-xl font-semibold mb-6">
                {metric.title}
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-usal-navy-300">Antes:</span>
                  <span className="font-semibold text-usal-red-300">
                    {metric.before}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-usal-navy-300">Después:</span>
                  <span className="font-semibold text-usal-green-300">
                    {metric.after}
                  </span>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <div className="text-2xl font-bold text-usal-gold-400">
                    {metric.improvement}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calculadora de ROI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <IconCalculator className="h-12 w-12 text-usal-gold-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Calculadora de ROI para tu Universidad
            </h3>
            <p className="text-usal-navy-200">
              Estimación basada en una universidad de 10,000 estudiantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-usal-gold-400 mb-4">
                Costos Actuales (Anual)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Personal administrativo adicional</span>
                  <span className="font-semibold">$240,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo perdido estudiantes (valorado)</span>
                  <span className="font-semibold">$180,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Errores en procesos manuales</span>
                  <span className="font-semibold">$60,000</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Costos:</span>
                    <span className="text-usal-red-300">$480,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-usal-green-400 mb-4">
                Con Testis (Anual)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Licencia Testis Universidad</span>
                  <span className="font-semibold">$36,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Implementación y capacitación</span>
                  <span className="font-semibold">$24,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Mantenimiento anual</span>
                  <span className="font-semibold">$12,000</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Inversión:</span>
                    <span className="text-usal-gold-300">$72,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 p-6 bg-gradient-to-r from-usal-green-600/20 to-usal-gold-600/20 rounded-xl border border-usal-gold-400/30">
            <div className="text-3xl font-bold text-usal-gold-400 mb-2">
              ROI: 567%
            </div>
            <div className="text-xl mb-2">
              Ahorro anual: <span className="font-bold text-usal-green-400">$408,000</span>
            </div>
            <div className="text-usal-navy-200">
              Recuperación de la inversión en menos de 2 meses
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">
            ¿Quieres Calcular el ROI Específico para tu Institución?
          </h3>
          <p className="text-usal-navy-200 mb-6 text-lg">
            Nuestro equipo puede crear un análisis personalizado basado en tus números reales.
          </p>
          <button className="bg-usal-gold-600 hover:bg-usal-gold-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
            Solicitar Análisis Gratuito
          </button>
        </motion.div>
      </div>
    </section>
  );
};
