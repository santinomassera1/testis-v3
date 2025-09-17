"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX, IconExternalLink } from "@tabler/icons-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menu móvil al hacer scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navigationLinks = [
    { href: "#estadisticas", label: "Estadísticas" },
    { href: "#caracteristicas", label: "Características" },
    { href: "#testimonios", label: "Testimonios" },
    { href: "#simulador", label: "Simulador" },
    { href: "#precios", label: "Precios" },
    { href: "#encuesta", label: "Encuesta" },
  ];

  const externalLinks = [
    { href: "https://www.usal.edu.ar", label: "Portal USAL", external: true },
    { href: "https://autogestion.usal.edu.ar/autogestion/acceso/login?ref=https://autogestion.usal.edu.ar/autogestion/inicio_alumno", label: "SIU Guaraní", external: true },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-usal-green-200/50"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-usal-green-600 to-usal-green-500 rounded-lg p-2 transition-transform group-hover:scale-105">
              <img 
                src="/usal-logo.jpg" 
                alt="USAL" 
                className="h-6 w-6 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-usal-green-600 to-usal-green-500 bg-clip-text text-transparent">
                Testis
              </span>
              <span className="text-xs text-usal-navy-600 -mt-1">
                Asistente USAL
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-usal-navy-700 hover:text-usal-green-600 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-usal-green-600 transition-all duration-200 group-hover:w-full" />
              </button>
            ))}
            
            {/* Separator */}
            <div className="h-6 w-px bg-usal-navy-200" />
            
            {externalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-usal-navy-600 hover:text-usal-green-600 transition-colors duration-200 flex items-center space-x-1 group"
              >
                <span>{link.label}</span>
                <IconExternalLink className="h-3 w-3 transition-transform group-hover:scale-110" />
              </Link>
            ))}
          </div>

          {/* Authentication Section - Temporalmente deshabilitado */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-usal-navy-600">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-usal-gold-100 text-usal-gold-800">
                Próximamente: Login USAL
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-usal-navy-700 hover:bg-usal-green-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <IconX className="h-6 w-6" /> : <IconMenu2 className="h-6 w-6" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-usal-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-usal-green-600 to-usal-green-500 rounded-lg p-2">
                      <img 
                        src="/usal-logo.jpg" 
                        alt="USAL" 
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-usal-green-600">Testis</div>
                      <div className="text-sm text-usal-navy-600">Asistente USAL</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-usal-navy-700 hover:bg-usal-green-50 transition-colors"
                  >
                    <IconX className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-6 py-4 space-y-2">
                  <div className="text-sm font-semibold text-usal-navy-400 uppercase tracking-wider mb-4">
                    Navegación
                  </div>
                  {navigationLinks.map((link, index) => (
                    <motion.button
                      key={link.href}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(link.href)}
                      className="w-full text-left px-4 py-3 rounded-lg text-usal-navy-700 hover:bg-usal-green-50 hover:text-usal-green-600 transition-colors duration-200 flex items-center justify-between group"
                    >
                      {link.label}
                    </motion.button>
                  ))}

                  <div className="my-6 border-t border-usal-green-200" />
                  
                  <div className="text-sm font-semibold text-usal-navy-400 uppercase tracking-wider mb-4">
                    Enlaces Externos
                  </div>
                  {externalLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (navigationLinks.length + index) * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-left px-4 py-3 rounded-lg text-usal-navy-700 hover:bg-usal-green-50 hover:text-usal-green-600 transition-colors duration-200 flex items-center justify-between group"
                      >
                        <span>{link.label}</span>
                        <IconExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Authentication - Temporalmente deshabilitado */}
                <div className="p-6 border-t border-usal-green-200">
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-usal-gold-100 text-usal-gold-800 text-sm font-medium">
                      🔐 Próximamente: Acceso con cuenta USAL
                    </div>
                    <p className="text-xs text-usal-navy-500 mt-2">
                      Podrás acceder con tu email @usal.edu.ar
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
