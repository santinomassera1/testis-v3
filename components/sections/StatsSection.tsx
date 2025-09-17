"use client";
import { motion } from "framer-motion";
import { IconUsers, IconClock, IconTrendingUp, IconSchool } from "@tabler/icons-react";
import UniversalBackground from "../UniversalBackground";

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
    <section className="py-24 bg-gradient-to-br from-usal-green-50 to-white relative overflow-hidden">
      <UniversalBackground intensity="light" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              initial={{ opacity: 0, y: 20, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg border border-usal-green-100 text-center relative overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: [0, 2, -2, 0],
                  rotateX: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 6,
                  delay: index * 0.8,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  rotateX: -5,
                  z: 50,
                  boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.25), 0 0 30px rgba(34, 197, 94, 0.1)',
                  borderColor: 'rgba(34, 197, 94, 0.3)',
                  transition: { 
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }}
                whileTap={{
                  scale: 0.98,
                  rotateY: -5,
                  rotateX: 5,
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-usal-green-100/0 to-usal-green-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                {/* Inner highlight */}
                <div 
                  className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <motion.div 
                  className="flex justify-center mb-4 relative z-10"
                  whileHover={{
                    rotateY: 360,
                    scale: 1.2,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative">
                    {stat.icon}
                    {/* Icon glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                      style={{
                        filter: 'blur(8px)',
                        transform: 'scale(1.5)',
                      }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-3xl font-bold text-usal-navy-900 mb-2 relative z-10"
                  whileHover={{
                    scale: 1.1,
                    textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  {stat.number}
                </motion.div>
                
                <div className="text-lg font-semibold text-usal-navy-700 mb-2 relative z-10">
                  {stat.label}
                </div>
                
                <div className="text-sm text-usal-navy-600 relative z-10">
                  {stat.description}
                </div>

                {/* Floating particles */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-usal-green-400 rounded-full opacity-0 group-hover:opacity-60"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${10 + i * 25}%`,
                    }}
                    animate={{
                      y: [-3, 3, -3],
                      x: [-2, 2, -2],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
              
              {/* Card reflection */}
              <div 
                className="absolute -bottom-2 left-0 right-0 h-16 bg-gradient-to-b from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  transform: 'rotateX(180deg) scaleY(0.5)',
                  transformOrigin: 'top',
                  filter: 'blur(2px)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
