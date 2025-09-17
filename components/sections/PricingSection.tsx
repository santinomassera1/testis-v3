"use client";
import { motion } from "framer-motion";
import { IconCheck, IconStar, IconUsers } from "@tabler/icons-react";
import UniversalBackground from "../UniversalBackground";

export const PricingSection = () => {
  const plans = [
    {
      name: "Estudiante",
      description: "Perfecto para uso personal",
      price: "Gratis",
      period: "siempre",
      icon: <IconUsers className="h-8 w-8 text-usal-green-600" />,
      features: [
        "Consultas ilimitadas al chatbot",
        "Generación de correos académicos",
        "Consulta de horarios y notas",
        "Guías paso a paso del SIU",
        "Soporte por email",
        "Acceso desde cualquier dispositivo",
        "Integración con SIU Guaraní",
        "Recordatorios de fechas importantes"
      ],
      buttonText: "Comenzar Gratis",
      buttonStyle: "bg-usal-green-600 hover:bg-usal-green-700 text-white",
      popular: false
    },
    {
      name: "Universidad",
      description: "Solución completa institucional",
      price: "Personalizado",
      period: "contactar",
      icon: <IconStar className="h-8 w-8 text-usal-gold-600" />,
      features: [
        "Todo lo del plan Estudiante",
        "Panel de administración avanzado",
        "Implementación multi-campus",
        "API personalizada y webhooks",
        "Integración con ERP universitario",
        "Branded white-label completo",
        "Analíticas de uso detalladas",
        "Gerente de cuenta dedicado",
        "SLA garantizado 99.9%",
        "Desarrollo de funcionalidades específicas",
        "Soporte prioritario 24/7",
        "Capacitación del personal docente"
      ],
      buttonText: "Contactar Ventas",
      buttonStyle: "bg-usal-gold-600 hover:bg-usal-gold-700 text-white",
      popular: true
    }
  ];

  return (
    <section className="pt-32 pb-24 bg-gradient-to-br from-white to-usal-green-50 relative overflow-hidden">
      <UniversalBackground intensity="medium" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-usal-navy-900 mb-4">
            Planes para Cada Necesidad
          </h2>
          <p className="text-xl text-usal-navy-600 max-w-3xl mx-auto">
            Acceso gratuito e ilimitado para todos los estudiantes, 
            con soluciones personalizadas para instituciones educativas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto pt-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 group overflow-hidden ${
                plan.popular 
                  ? 'border-usal-gold-400 transform scale-105' 
                  : 'border-usal-green-200'
              }`}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
              animate={{
                rotateY: [0, 1, -1, 0],
                rotateX: [0, 0.5, -0.5, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: index * 0.2 },
                y: { duration: 0.6, delay: index * 0.2 },
                rotateX: { duration: 0.6, delay: index * 0.2 },
                rotateY: { duration: 8, delay: index * 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
              }}
              whileHover={{
                scale: plan.popular ? 1.08 : 1.05,
                rotateY: 8,
                rotateX: -3,
                z: 50,
                boxShadow: plan.popular 
                  ? '0 25px 50px -12px rgba(245, 158, 11, 0.4), 0 0 30px rgba(245, 158, 11, 0.2)'
                  : '0 25px 50px -12px rgba(34, 197, 94, 0.25), 0 0 20px rgba(34, 197, 94, 0.1)',
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{
                scale: plan.popular ? 1.02 : 0.98,
                rotateY: -5,
                rotateX: 2,
              }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-usal-gold-100/0 to-usal-gold-100/30' 
                  : 'bg-gradient-to-br from-usal-green-100/0 to-usal-green-100/30'
              }`} />
              
              {/* Inner highlight */}
              <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <motion.div 
                    className="bg-gradient-to-r from-usal-gold-500 to-usal-gold-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                    animate={{
                      boxShadow: ['0 4px 15px rgba(245, 158, 11, 0.3)', '0 4px 20px rgba(245, 158, 11, 0.5)', '0 4px 15px rgba(245, 158, 11, 0.3)']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
                    }}
                  >
                    Más Popular
                  </motion.div>
                </div>
              )}

              <div className="text-center mb-8 relative z-10">
                <motion.div 
                  className="flex justify-center mb-4 relative"
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
                    {plan.icon}
                    {/* Icon glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                      style={{
                        filter: 'blur(8px)',
                        transform: 'scale(1.5)',
                        color: plan.popular ? '#f59e0b' : '#22c55e'
                      }}
                    >
                      {plan.icon}
                    </div>
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-usal-navy-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-usal-navy-600 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <motion.span 
                    className="text-4xl font-bold text-usal-navy-900"
                    whileHover={{ 
                      scale: 1.1,
                      textShadow: plan.popular ? '0 0 20px rgba(245, 158, 11, 0.5)' : '0 0 20px rgba(34, 197, 94, 0.5)'
                    }}
                  >
                    {plan.price}
                  </motion.span>
                  {plan.period !== "contactar" && (
                    <span className="text-usal-navy-600 ml-2">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <IconCheck className="h-5 w-5 text-usal-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-usal-navy-700 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button 
                className={`w-full py-3 px-6 rounded-lg font-semibold relative overflow-hidden ${plan.buttonStyle}`}
                style={{ perspective: '1000px' }}
                whileHover={{
                  scale: 1.05,
                  rotateX: -2,
                  boxShadow: plan.popular 
                    ? '0 10px 25px -5px rgba(245, 158, 11, 0.4)' 
                    : '0 10px 25px -5px rgba(34, 197, 94, 0.4)',
                }}
                whileTap={{
                  scale: 0.98,
                  rotateX: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">{plan.buttonText}</span>
              </motion.button>

              {/* Floating particles around the card */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-40 ${
                    plan.popular ? 'bg-usal-gold-400' : 'bg-usal-green-400'
                  }`}
                  style={{
                    top: `${10 + i * 15}%`,
                    left: `${5 + (i % 2) * 90}%`,
                  }}
                  animate={{
                    y: [-4, 4, -4],
                    x: [-2, 2, -2],
                    scale: [0.5, 1, 0.5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-6 bg-usal-green-50 rounded-2xl border border-usal-green-200"
        >
          <h3 className="text-xl font-semibold text-usal-navy-900 mb-2">
            🎓 Siempre Gratuito para Estudiantes
          </h3>
          <p className="text-usal-navy-600 mb-4">
            Testis es y siempre será completamente gratuito para todos los estudiantes de la USAL. 
            Nuestra misión es facilitar tu experiencia académica sin costo alguno.
          </p>
          <p className="text-sm text-usal-navy-500">
            Las soluciones institucionales permiten a las universidades personalizar y ampliar las capacidades de Testis.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
