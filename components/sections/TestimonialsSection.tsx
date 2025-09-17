"use client";
import { motion } from "framer-motion";
import { IconQuote, IconStar } from "@tabler/icons-react";
import UniversalBackground from "../UniversalBackground";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "María González",
      career: "Ingeniería en Sistemas",
      year: "4to Año",
      avatar: "MG",
      rating: 5,
      text: "Testis me salvó durante la época de inscripciones. Antes tardaba horas navegando el SIU, ahora todo es súper rápido y claro. ¡Es como tener un compañero que conoce todos los trucos!"
    },
    {
      name: "Carlos Rodríguez",
      career: "Administración",
      year: "2do Año",
      avatar: "CR",
      rating: 5,
      text: "Lo que más me gusta es que puedo consultar mis notas y horarios al instante. Ya no tengo que recordar dónde está cada cosa en el sistema. Testis lo hace todo por mí."
    },
    {
      name: "Ana Martínez",
      career: "Psicología",
      year: "3er Año",
      avatar: "AM",
      rating: 5,
      text: "La función de generar correos automáticos es genial. Antes no sabía cómo escribir formalmente a los profesores, ahora Testis me ayuda con el formato correcto."
    },
    {
      name: "Diego López",
      career: "Derecho",
      year: "1er Año",
      avatar: "DL",
      rating: 5,
      text: "Como estudiante nuevo, el SIU me parecía un laberinto. Testis me guió paso a paso en mi primera inscripción. Ahora soy el que ayuda a otros compañeros."
    },
    {
      name: "Sofía Chen",
      career: "Medicina",
      year: "5to Año",
      avatar: "SC",
      rating: 5,
      text: "Con la carga de estudio que tenemos en medicina, cada minuto cuenta. Testis me permite hacer trámites académicos en segundos, no en horas."
    },
    {
      name: "Mateo Silva",
      career: "Economía",
      year: "3er Año",
      avatar: "MS",
      rating: 5,
      text: "La disponibilidad 24/7 es perfecta. Puedo consultar mis parciales o generar certificados a cualquier hora, incluso durante los fines de semana."
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
            Lo Que Dicen Nuestros Estudiantes
          </h2>
          <p className="text-xl text-usal-navy-600 max-w-3xl mx-auto">
            Miles de estudiantes de la USAL ya confían en Testis para simplificar su experiencia académica.
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
                "{testimonial.text}"
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
          <div className="text-4xl font-bold mb-2">4.9/5</div>
          <div className="text-xl mb-4">Calificación Promedio</div>
          <div className="text-usal-green-100">
            Basado en más de 2,500 reseñas de estudiantes de la USAL
          </div>
        </motion.div>
      </div>
    </section>
  );
};
