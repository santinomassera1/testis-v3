"use client";
import { motion } from "framer-motion";
import { 
  IconShield, 
  IconClock, 
  IconBrain,
  IconCalendar,
  IconBook,
  IconBolt,
  IconLink,
  IconChecklist,
  IconSchool
} from "@tabler/icons-react";
import UniversalBackground from "../UniversalBackground";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <IconLink className="h-8 w-8 text-usal-green-600" />,
      title: "Correlativas al Instante",
      description: "Consultá qué materias necesitás aprobar antes de inscribirte. Con nombres completos, no solo códigos."
    },
    {
      icon: <IconChecklist className="h-8 w-8 text-usal-gold-600" />,
      title: "Verificación de Inscripción",
      description: "Verificá si cumplís las condiciones para inscribirte a una materia según tu historial académico."
    },
    {
      icon: <IconCalendar className="h-8 w-8 text-usal-red-600" />,
      title: "Fechas de Finales",
      description: "Encontrá las fechas de exámenes finales por materia, sede y turno. Sin buscar en PDFs."
    },
    {
      icon: <IconBolt className="h-8 w-8 text-usal-navy-600" />,
      title: "Respuestas en Segundos",
      description: "Lo que antes tardaba minutos navegando el SIU, ahora se resuelve con una pregunta en lenguaje natural."
    },
    {
      icon: <IconBook className="h-8 w-8 text-usal-green-700" />,
      title: "Datos del Plan 11",
      description: "28 materias de Ingeniería en Informática con cupos, turnos, horarios y correlativas reales."
    },
    {
      icon: <IconSchool className="h-8 w-8 text-usal-red-700" />,
      title: "Pensado para la Institución",
      description: "Panel de métricas para que la universidad vea qué consultan los alumnos y cuánto resuelve el sistema."
    },
    {
      icon: <IconShield className="h-8 w-8 text-usal-navy-700" />,
      title: "100% Seguro",
      description: "Sin almacenamiento de datos sensibles. La lógica se ejecuta en tiempo real contra datos académicos."
    },
    {
      icon: <IconClock className="h-8 w-8 text-usal-gold-700" />,
      title: "Disponible 24/7",
      description: "Asistencia académica en cualquier momento, desde cualquier dispositivo con navegador."
    },
    {
      icon: <IconBrain className="h-8 w-8 text-usal-green-800" />,
      title: "IA Especializada",
      description: "Entrenado específicamente con los procesos y datos de la USAL para respuestas precisas y confiables."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-usal-navy-50 to-white relative overflow-hidden">
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
            Tres Consultas, Cero Burocracia
          </h2>
          <p className="text-xl text-usal-navy-600 max-w-3xl mx-auto">
            Correlativas, inscripción y finales: las tres consultas más repetitivas de 
            secretaría, resueltas en segundos con inteligencia artificial.
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
              ¿Querés verlo en acción?
            </h3>
            <p className="text-usal-green-100 mb-6 text-lg">
              Probá el chat en esta misma página. Consultá correlativas, verificá inscripción o buscá fechas de finales.
            </p>
            <button className="bg-white text-usal-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-usal-green-50 transition-colors duration-300">
              Probar Testis Ahora
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
