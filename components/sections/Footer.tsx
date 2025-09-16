"use client";
import { motion } from "framer-motion";
import { 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconBrandLinkedin, 
  IconBrandTwitter,
  IconBrandGithub,
  IconHelp
} from "@tabler/icons-react";
import Link from "next/link";

export const Footer = () => {
  const footerSections = [
    {
      title: "Producto",
      links: [
        { name: "Características", href: "#features" },
        { name: "Precios", href: "#pricing" },
        { name: "Testimonios", href: "#testimonials" },
        { name: "Demo en Vivo", href: "#demo" },
        { name: "Integraciones", href: "#integrations" }
      ]
    },
    {
      title: "Recursos",
      links: [
        { name: "Documentación", href: "/docs" },
        { name: "API Reference", href: "/api" },
        { name: "Guías de Implementación", href: "/guides" },
        { name: "Centro de Ayuda", href: "/help" },
        { name: "Blog", href: "/blog" }
      ]
    },
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nosotros", href: "/about" },
        { name: "Equipo", href: "/team" },
        { name: "Carreras", href: "/careers" },
        { name: "Prensa", href: "/press" },
        { name: "Contacto", href: "/contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Términos de Servicio", href: "/terms" },
        { name: "Política de Privacidad", href: "/privacy" },
        { name: "Política de Cookies", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" },
        { name: "SLA", href: "/sla" }
      ]
    }
  ];

  return (
    <footer className="bg-usal-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-usal-green-500 to-usal-green-600 rounded-xl flex items-center justify-center mr-4">
                  <IconHelp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Testis</div>
                  <div className="text-usal-navy-300 text-sm">Asistente SIU Guaraní</div>
                </div>
              </div>
              
              <p className="text-usal-navy-300 mb-6 leading-relaxed">
                Revolucionamos la experiencia académica universitaria con inteligencia artificial, 
                haciendo que la gestión educativa sea más eficiente y accesible para todos.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-usal-navy-300">
                  <IconMail className="h-4 w-4 mr-3" />
                  <span>hola@testis.edu.ar</span>
                </div>
                <div className="flex items-center text-usal-navy-300">
                  <IconPhone className="h-4 w-4 mr-3" />
                  <span>+54 11 4000-8000</span>
                </div>
                <div className="flex items-center text-usal-navy-300">
                  <IconMapPin className="h-4 w-4 mr-3" />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4 text-usal-gold-400">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-usal-navy-300 hover:text-usal-green-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-usal-navy-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Mantente Actualizado
              </h3>
              <p className="text-usal-navy-300">
                Recibe las últimas noticias sobre funcionalidades, casos de éxito y mejores prácticas.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-2 bg-usal-navy-800 border border-usal-navy-600 rounded-lg text-white placeholder-usal-navy-400 focus:outline-none focus:border-usal-green-500"
              />
              <button className="bg-usal-green-600 hover:bg-usal-green-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                Suscribirse
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-usal-navy-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-usal-navy-300 mb-4 md:mb-0">
              © 2024 Testis. Todos los derechos reservados. Desarrollado con ❤️ para la comunidad universitaria.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Link
                href="https://linkedin.com/company/testis"
                className="text-usal-navy-300 hover:text-usal-green-400 transition-colors duration-300"
              >
                <IconBrandLinkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/testis_edu"
                className="text-usal-navy-300 hover:text-usal-green-400 transition-colors duration-300"
              >
                <IconBrandTwitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/testis-edu"
                className="text-usal-navy-300 hover:text-usal-green-400 transition-colors duration-300"
              >
                <IconBrandGithub className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* USAL Partnership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-usal-navy-700 text-center"
        >
          <div className="flex items-center justify-center space-x-4">
            <img 
              src="/usal-logo.jpg" 
              alt="Universidad del Salvador" 
              className="h-8 w-auto object-contain opacity-70"
            />
            <span className="text-usal-navy-400 text-sm">
              En colaboración con la Universidad del Salvador
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
