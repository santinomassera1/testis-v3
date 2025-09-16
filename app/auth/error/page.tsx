"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { IconAlertTriangle, IconArrowLeft, IconRefresh, IconMail } from "@tabler/icons-react";

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'Configuration':
        return {
          title: "Error de Configuración",
          message: "Hay un problema con la configuración del servidor.",
          suggestion: "Contacta al administrador del sistema."
        };
      case 'AccessDenied':
        return {
          title: "Acceso Denegado",
          message: "Solo se permiten cuentas de email institucionales de USAL (@usal.edu.ar).",
          suggestion: "Usa tu cuenta de estudiante o docente de la Universidad del Salvador."
        };
      case 'Verification':
        return {
          title: "Error de Verificación",
          message: "No se pudo verificar tu cuenta.",
          suggestion: "Intenta nuevamente o contacta soporte."
        };
      default:
        return {
          title: "Error de Autenticación",
          message: "Ocurrió un problema al iniciar sesión.",
          suggestion: "Por favor, intenta nuevamente."
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-usal-red-50 via-white to-usal-gold-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-usal-red-200"
      >
        {/* Error Icon */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-usal-red-500 to-usal-red-400 rounded-2xl flex items-center justify-center mb-6">
            <IconAlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-usal-navy-900">
            {errorInfo.title}
          </h2>
          <p className="mt-2 text-usal-navy-600">
            {errorInfo.message}
          </p>
        </div>

        {/* Suggestion */}
        <div className="bg-usal-gold-50 border border-usal-gold-200 rounded-lg p-4">
          <h3 className="font-medium text-usal-navy-800 mb-2">
            ¿Qué puedes hacer?
          </h3>
          <p className="text-sm text-usal-navy-600 mb-3">
            {errorInfo.suggestion}
          </p>
          
          {error === 'AccessDenied' && (
            <div className="bg-white border border-usal-gold-300 rounded p-3">
              <div className="flex items-center space-x-2 text-sm text-usal-navy-700">
                <IconMail className="h-4 w-4 text-usal-gold-600" />
                <span>Usa una cuenta que termine en <strong>@usal.edu.ar</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-usal-green-600 to-usal-green-500 hover:from-usal-green-700 hover:to-usal-green-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
          >
            <IconRefresh className="h-5 w-5" />
            <span>Intentar Nuevamente</span>
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-usal-navy-200 hover:border-usal-navy-300 text-usal-navy-700 py-3 px-4 rounded-lg font-medium transition-all duration-200"
          >
            <IconArrowLeft className="h-5 w-5" />
            <span>Volver al Inicio</span>
          </button>
        </div>

        {/* Help */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-usal-navy-500">
            ¿Necesitas ayuda? Contacta a{" "}
            <a 
              href="mailto:soporte@usal.edu.ar" 
              className="text-usal-green-600 hover:text-usal-green-700 font-medium"
            >
              soporte@usal.edu.ar
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
