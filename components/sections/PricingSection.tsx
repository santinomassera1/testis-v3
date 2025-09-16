"use client";
import { motion } from "framer-motion";
import { IconCheck, IconStar, IconUsers, IconBuilding } from "@tabler/icons-react";

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
        "Acceso desde cualquier dispositivo"
      ],
      buttonText: "Comenzar Gratis",
      buttonStyle: "bg-usal-green-600 hover:bg-usal-green-700 text-white",
      popular: false
    },
    {
      name: "Facultad",
      description: "Para departamentos académicos",
      price: "$299",
      period: "por mes",
      icon: <IconBuilding className="h-8 w-8 text-usal-gold-600" />,
      features: [
        "Todo lo del plan Estudiante",
        "Panel de administración",
        "Analíticas de uso detalladas",
        "Personalización de respuestas",
        "Integración con sistemas existentes",
        "Soporte prioritario 24/7",
        "Capacitación del personal",
        "Reportes de satisfacción"
      ],
      buttonText: "Solicitar Demo",
      buttonStyle: "bg-usal-gold-600 hover:bg-usal-gold-700 text-white",
      popular: true
    },
    {
      name: "Universidad",
      description: "Solución completa institucional",
      price: "Personalizado",
      period: "contactar",
      icon: <IconStar className="h-8 w-8 text-usal-red-600" />,
      features: [
        "Todo lo del plan Facultad",
        "Implementación multi-campus",
        "API personalizada",
        "Integración con ERP universitario",
        "Branded white-label",
        "Gerente de cuenta dedicado",
        "SLA garantizado 99.9%",
        "Desarrollo de funcionalidades específicas"
      ],
      buttonText: "Contactar Ventas",
      buttonStyle: "bg-usal-red-600 hover:bg-usal-red-700 text-white",
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white to-usal-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Desde estudiantes individuales hasta universidades completas, 
            tenemos la solución perfecta para optimizar tu gestión académica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular 
                  ? 'border-usal-gold-400 transform scale-105' 
                  : 'border-usal-green-200'
              } hover:shadow-xl transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-usal-gold-500 to-usal-gold-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-usal-navy-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-usal-navy-600 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-usal-navy-900">
                    {plan.price}
                  </span>
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

              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${plan.buttonStyle}`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Garantía */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-6 bg-usal-green-50 rounded-2xl border border-usal-green-200"
        >
          <h3 className="text-xl font-semibold text-usal-navy-900 mb-2">
            Garantía de Satisfacción de 30 Días
          </h3>
          <p className="text-usal-navy-600">
            Si no estás completamente satisfecho con Testis, te devolvemos tu dinero. Sin preguntas.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
