"use client";
import { motion } from "framer-motion";
import { IconQuote, IconStar } from "@tabler/icons-react";
import UniversalBackground from "../UniversalBackground";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "María González",
      career: "Ingeniería en Informática",
      year: "4to Año",
      avatar: "MG",
      rating: 5,
      text: "Antes de cada inscripción pasaba media hora cruzando correlativas a mano. Ahora le pregunto a Testis y en dos segundos sé si puedo inscribirme o qué me falta."
    },
    {
      name: "Carlos Rodríguez",
      career: "Ingeniería en Informática",
      year: "2do Año",
      avatar: "CR",
      rating: 5,
      text: "Las fechas de finales siempre estaban en un PDF que costaba encontrar. Testis me dice cuándo rindo con solo preguntar. Ojalá exista para toda la carrera."
    },
    {
      name: "Ana Martínez",
      career: "Ingeniería en Informática",
      year: "3er Año",
      avatar: "AM",
      rating: 5,
      text: "Lo mejor es que entiende cuando le hablás normal. Le dije 'quiero cursar Bases de Datos' y me dijo qué necesitaba aprobar antes. Así de simple."
    },
    {
      name: "Diego López",
      career: "Ingeniería en Informática",
      year: "1er Año",
      avatar: "DL",
      rating: 5,
      text: "Como estudiante nuevo, no entendía nada de correlativas. Testis me explicó todo el plan de estudios de una forma que nunca encontré en la página de la facu."
    },
    {
      name: "Sofía Chen",
      career: "Ingeniería en Informática",
      year: "5to Año",
      avatar: "SC",
      rating: 5,
      text: "Estoy terminando la carrera y todavía me confundo con correlativas de las últimas materias. Testis me ahorra mandar mails a secretaría cada vez."
    },
    {
      name: "Mateo Silva",
      career: "Ingeniería en Informática",
      year: "3er Año",
      avatar: "MS",
      rating: 5,
      text: "Lo uso a la noche cuando me acuerdo de que tengo que averiguar algo para inscribirme. Secretaría cierra a las 18, Testis está siempre."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <UniversalBackground intensity="full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-usal-navy-900 mb-4">
            Lo Que Dicen los Estudiantes
          </h2>
          <p className="text-xl text-usal-navy-600 max-w-3xl mx-auto">
            Consultas que antes requerían mails, llamadas o ir a secretaría, 
            ahora se resuelven en una conversación.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-usal-green-50 to-white rounded-2xl p-6 shadow-lg border border-usal-green-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <IconQuote className="h-6 w-6 text-usal-green-600 mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <IconStar key={i} className="h-4 w-4 text-usal-gold-500 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-usal-navy-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-usal-green-500 to-usal-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-usal-navy-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-usal-navy-600">
                    {testimonial.career} • {testimonial.year}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Estadística adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-usal-green-600 to-usal-green-500 rounded-2xl text-white"
        >
          <div className="text-4xl font-bold mb-2">3 consultas</div>
          <div className="text-xl mb-4">que saturan secretaría todos los días</div>
          <div className="text-usal-green-100">
            Correlativas, inscripción y finales: las preguntas más repetitivas, resueltas al instante
          </div>
        </motion.div>
      </div>
    </section>
  );
};
