"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconMail, 
  IconMessageDots, 
  IconUser, 
  IconExternalLink,
  IconX,
  IconMaximize,
  IconMinimize
} from '@tabler/icons-react';

export const StudentSurveySection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-usal-navy-50 via-white to-usal-green-50 py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-usal-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-usal-gold-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-usal-navy-900 mb-4">
            Encuesta para Estudiantes USAL
          </h2>
          <p className="text-xl text-usal-navy-600 max-w-3xl mx-auto mb-8">
            Ayúdanos a entender mejor tu experiencia con el SIU Guaraní. Tus respuestas nos permiten mejorar Testis y crear una mejor experiencia académica.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center space-x-2">
              <IconUser className="h-5 w-5 text-usal-green-500" />
              <span className="text-sm text-usal-navy-600">Datos de estudiantes reales</span>
            </div>
            <div className="flex items-center space-x-2">
              <IconMessageDots className="h-5 w-5 text-usal-gold-500" />
              <span className="text-sm text-usal-navy-600">Solo 5 minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <IconMail className="h-5 w-5 text-usal-red-500" />
              <span className="text-sm text-usal-navy-600">Completamente anónimo</span>
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-usal-green-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-usal-green-500 to-usal-green-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <IconMessageDots className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Encuesta de Investigación USAL</h3>
                  <p className="text-sm text-usal-green-100">Comparte tu experiencia con el SIU Guaraní</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title={isExpanded ? "Contraer" : "Expandir"}
                >
                  {isExpanded ? (
                    <IconMinimize className="h-4 w-4 text-white" />
                  ) : (
                    <IconMaximize className="h-4 w-4 text-white" />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Abrir en ventana completa"
                >
                  <IconExternalLink className="h-4 w-4 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Embedded Form */}
            <div className="relative">
              {isMounted ? (
                <iframe 
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfaL-K7G0tFnQz2-1ZvF1tpdCvvcR7uCnu8QdMEiMXb-4gXCg/viewform?embedded=true" 
                  width="100%" 
                  height={isExpanded ? "1200" : "800"}
                  frameBorder="0" 
                  marginHeight={0} 
                  marginWidth={0}
                  className="transition-all duration-300"
                  title="Encuesta de investigación - Experiencia SIU Guaraní USAL"
                >
                  <div className="flex items-center justify-center h-64 text-usal-navy-600">
                    <div className="text-center">
                      <IconMessageDots className="h-12 w-12 mx-auto mb-4 text-usal-green-500" />
                      <p>Cargando encuesta...</p>
                    </div>
                  </div>
                </iframe>
              ) : (
                <div className="flex items-center justify-center h-64 text-usal-navy-600 bg-gradient-to-br from-usal-green-50 to-usal-gold-50">
                  <div className="text-center">
                    <IconMessageDots className="h-12 w-12 mx-auto mb-4 text-usal-green-500" />
                    <p>Cargando encuesta...</p>
                  </div>
                </div>
              )}
              
              {/* Loading overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-usal-green-50 to-usal-gold-50 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-usal-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-usal-navy-600">Cargando encuesta...</p>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="bg-usal-green-50 px-6 py-4 border-t border-usal-green-100">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-usal-navy-600">Encuesta anónima y segura</span>
                </div>
                
                <div className="text-sm text-usal-navy-500">
                  Investigación Testis • Universidad del Salvador
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-usal-gold-100 to-usal-green-100 rounded-2xl p-8 border border-usal-gold-200">
            <h4 className="text-xl font-semibold text-usal-navy-900 mb-2">
              ¿Por qué es importante tu participación?
            </h4>
            <p className="text-usal-navy-600 mb-4">
              Tus respuestas nos ayudan a crear un mejor Testis basado en experiencias reales de estudiantes USAL
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-usal-green-500 hover:bg-usal-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2"
              >
                <IconExternalLink className="h-4 w-4" />
                <span>Completar encuesta completa</span>
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white hover:bg-usal-navy-50 text-usal-navy-700 px-6 py-3 rounded-lg font-medium border border-usal-navy-200 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <IconUser className="h-4 w-4" />
                <span>100% Anónimo • 5 minutos</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-usal-green-500 to-usal-green-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Encuesta de Investigación - Estudiantes USAL</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <IconX className="h-5 w-5 text-white" />
              </motion.button>
            </div>
            
            {/* Modal Content */}
            <div className="h-[calc(90vh-80px)]">
              {isMounted ? (
                <iframe 
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfaL-K7G0tFnQz2-1ZvF1tpdCvvcR7uCnu8QdMEiMXb-4gXCg/viewform?embedded=true" 
                  width="100%" 
                  height="100%"
                  frameBorder="0" 
                  marginHeight={0} 
                  marginWidth={0}
                  title="Encuesta de investigación - Experiencia SIU Guaraní USAL - Modal"
                >
                  Cargando encuesta...
                </iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-usal-navy-600 bg-gradient-to-br from-usal-green-50 to-usal-gold-50">
                  <div className="text-center">
                    <IconMessageDots className="h-12 w-12 mx-auto mb-4 text-usal-green-500" />
                    <p>Cargando encuesta...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};
