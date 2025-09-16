"use client";
import { motion } from "framer-motion";
import { 
  IconRocket, 
  IconShield, 
  IconClock, 
  IconBrain,
  IconMail,
  IconCalendar,
  IconCertificate,
  IconBook,
  IconUsers,
  IconBolt
} from "@tabler/icons-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <IconRocket className="h-8 w-8 text-usal-green-600" />,
      title: "Navegación Intuitiva",
      description: "Olvídate de perderte en el SIU. Testis te guía paso a paso en cada proceso académico."
    },
    {
      icon: <IconBolt className="h-8 w-8 text-usal-gold-600" />,
      title: "Respuestas Instantáneas",
      description: "Obtén información sobre inscripciones, horarios y notas en segundos, no en minutos."
    },
    {
      icon: <IconMail className="h-8 w-8 text-usal-red-600" />,
      title: "Correos Profesionales",
      description: "Genera automáticamente correos formales para docentes y secretaría con el tono apropiado."
    },
    {
      icon: <IconCalendar className="h-8 w-8 text-usal-navy-600" />,
      title: "Gestión de Horarios",
      description: "Consulta tus horarios de cursada y fechas de exámenes de manera clara y organizada."
    },
    {
      icon: <IconCertificate className="h-8 w-8 text-usal-green-700" />,
      title: "Certificados Rápidos",
      description: "Genera constancias de alumno regular, certificados analíticos y más con un solo clic."
    },
    {
      icon: <IconBook className="h-8 w-8 text-usal-red-700" />,
      title: "Seguimiento Académico",
      description: "Monitorea tu progreso, notas y estado de regularidad en tiempo real."
    },
    {
      icon: <IconShield className="h-8 w-8 text-usal-navy-700" />,
      title: "100% Seguro",
      description: "Tus datos académicos están protegidos. Testis no almacena información sensible."
    },
    {
      icon: <IconClock className="h-8 w-8 text-usal-gold-700" />,
      title: "Disponible 24/7",
      description: "Accede a la asistencia académica en cualquier momento, desde cualquier dispositivo."
    },
    {
      icon: <IconBrain className="h-8 w-8 text-usal-green-800" />,
      title: "IA Especializada",
      description: "Entrenado específicamente en procesos de la USAL para brindarte respuestas precisas."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-usal-navy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-usal-navy-900 mb-4">
            Todo lo que Necesitas en un Solo Lugar
          </h2>
          <p className="text-xl text-usal-navy-600 max-w-3xl mx-auto">
            Testis combina inteligencia artificial avanzada con un profundo conocimiento 
            del sistema académico de la USAL para ofrecerte la mejor experiencia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-usal-green-100 hover:shadow-xl hover:border-usal-green-200 transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-usal-green-50 to-usal-green-100 rounded-xl mr-4 group-hover:from-usal-green-100 group-hover:to-usal-green-200 transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-usal-navy-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-usal-navy-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-usal-green-600 to-usal-green-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para Revolucionar tu Experiencia Académica?
            </h3>
            <p className="text-usal-green-100 mb-6 text-lg">
              Únete a miles de estudiantes que ya disfrutan de una gestión académica más eficiente.
            </p>
            <button className="bg-white text-usal-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-usal-green-50 transition-colors duration-300">
              Comenzar Ahora - Es Gratis
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
