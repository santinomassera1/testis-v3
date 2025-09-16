"use client";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconBrandGoogle, IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signIn("google", { 
        callbackUrl: "/",
        redirect: false 
      });
      
      if (result?.error) {
        setError("Error al iniciar sesión. Asegúrate de usar una cuenta @usal.edu.ar");
      }
    } catch (err) {
      setError("Error al conectar con Google. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-usal-green-50 via-white to-usal-gold-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-usal-green-200"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-usal-green-600 to-usal-green-500 rounded-2xl flex items-center justify-center mb-6">
            <img 
              src="/usal-logo.jpg" 
              alt="USAL" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-usal-navy-900">
            Accede a <span className="text-usal-green-600">Testis</span>
          </h2>
          <p className="mt-2 text-usal-navy-600">
            Usa tu cuenta institucional de USAL
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-usal-red-50 border border-usal-red-200 text-usal-red-700 p-4 rounded-lg flex items-center space-x-2"
          >
            <IconAlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Sign In Button */}
        <div className="space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-usal-green-200 hover:border-usal-green-300 text-usal-navy-800 py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-usal-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <IconBrandGoogle className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
            )}
            <span>
              {isLoading ? "Conectando..." : "Continuar con Google"}
            </span>
          </button>

          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center space-x-2 text-usal-navy-600 hover:text-usal-green-600 transition-colors text-sm"
            >
              <IconArrowLeft className="h-4 w-4" />
              <span>Volver al inicio</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-usal-gold-50 border border-usal-gold-200 rounded-lg p-4">
          <h3 className="font-medium text-usal-navy-800 mb-2">
            ¿Por qué necesitas una cuenta USAL?
          </h3>
          <ul className="text-sm text-usal-navy-600 space-y-1">
            <li>• Acceso personalizado a tu información académica</li>
            <li>• Consultas específicas sobre tus materias y horarios</li>
            <li>• Comunicación directa con docentes</li>
            <li>• Experiencia completamente personalizada</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
