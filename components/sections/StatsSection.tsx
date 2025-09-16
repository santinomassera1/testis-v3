"use client";
import { motion } from "framer-motion";
import { IconUsers, IconClock, IconTrendingUp, IconSchool } from "@tabler/icons-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: <IconUsers className="h-8 w-8 text-usal-green-600" />,
      number: "15,000+",
      label: "Estudiantes Activos",
      description: "Usuarios registrados en el SIU Guaraní USAL"
    },
    {
      icon: <IconClock className="h-8 w-8 text-usal-red-600" />,
      number: "85%",
      label: "Reducción de Tiempo",
      description: "Menos tiempo en trámites administrativos"
    },
    {
      icon: <IconTrendingUp className="h-8 w-8 text-usal-gold-600" />,
      number: "92%",
      label: "Satisfacción",
      description: "De estudiantes recomiendan Testis"
    },
    {
      icon: <IconSchool className="h-8 w-8 text-usal-navy-600" />,
      number: "24/7",
      label: "Disponibilidad",
      description: "Asistencia disponible en todo momento"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-usal-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-usal-navy-900 mb-4">
            Resultados que Hablan por Sí Solos
          </h2>
          <p className="text-xl text-usal-navy-600 max-w-3xl mx-auto">
            Testis ha revolucionado la experiencia académica en la USAL, 
            reduciendo tiempos de gestión y mejorando la satisfacción estudiantil.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-usal-green-100 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-usal-navy-900 mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-usal-navy-700 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-usal-navy-600">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
