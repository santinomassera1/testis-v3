"use client";
import { motion } from "framer-motion";
import { IconRocket, IconUsers, IconShield, IconStar } from "@tabler/icons-react";

export const CTASection = () => {
  const benefits = [
    {
      icon: <IconRocket className="h-6 w-6 text-usal-gold-400" />,
      text: "Implementación en 24 horas"
    },
    {
      icon: <IconUsers className="h-6 w-6 text-usal-gold-400" />,
      text: "Soporte dedicado"
    },
    {
      icon: <IconShield className="h-6 w-6 text-usal-gold-400" />,
      text: "Garantía de satisfacción"
    },
    {
      icon: <IconStar className="h-6 w-6 text-usal-gold-400" />,
      text: "Sin compromiso a largo plazo"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-usal-green-600 to-usal-green-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para Transformar tu 
            <span className="block text-usal-gold-300">Experiencia Académica?</span>
          </h2>
          
          <p className="text-xl text-usal-green-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de estudiantes y universidades que ya han revolucionado 
            su gestión académica con Testis. La implementación es gratuita y toma menos de un día.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  {benefit.icon}
                </div>
                <span className="text-sm text-usal-green-100 font-medium">
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="bg-white text-usal-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-usal-green-50 transition-colors duration-300 shadow-lg">
              Comenzar Gratis Ahora
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-usal-green-600 transition-colors duration-300">
              Ver Demo en Vivo
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-usal-green-400/30"
          >
            <p className="text-usal-green-200 mb-4">
              Confiado por más de 50 instituciones educativas
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-70">
              <img 
                src="/usal-logo.jpg" 
                alt="USAL" 
                className="h-8 w-auto object-contain filter brightness-0 invert"
              />
              <div className="text-white text-sm">
                Universidad del Salvador
              </div>
            </div>
          </motion.div>

          {/* Urgency/Scarcity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 p-4 bg-usal-gold-500/20 rounded-lg border border-usal-gold-400/30"
          >
            <p className="text-usal-gold-200 text-sm">
              🔥 <strong>Oferta de Lanzamiento:</strong> Primeros 100 usuarios obtienen 6 meses gratis del plan Facultad
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
