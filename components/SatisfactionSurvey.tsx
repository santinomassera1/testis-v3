"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconStar, IconStarFilled, IconX, IconSend } from "@tabler/icons-react";

interface SurveyData {
  rating: number;
  wasHelpful: boolean | null;
  comment: string;
  timestamp: string;
  sessionDuration: number; // en segundos
  messagesCount: number;
  categoriesUsed: string[];
}

interface SatisfactionSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SurveyData) => void;
  messagesCount: number;
  sessionDuration: number;
  categoriesUsed?: string[];
}

export function SatisfactionSurvey({
  isOpen,
  onClose,
  onSubmit,
  messagesCount,
  sessionDuration,
  categoriesUsed = [],
}: SatisfactionSurveyProps) {
  console.log('🎨 SatisfactionSurvey renderizado con isOpen:', isOpen);
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Por favor, seleccioná una calificación");
      return;
    }

    setIsSubmitting(true);

    const surveyData: SurveyData = {
      rating,
      wasHelpful,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
      sessionDuration,
      messagesCount,
      categoriesUsed,
    };

    // Simular delay de envío
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSubmit(surveyData);
    setSubmitted(true);

    // Cerrar después de 2 segundos
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleSkip = () => {
    // Guardar que se saltó la encuesta
    const skipData: SurveyData = {
      rating: 0,
      wasHelpful: null,
      comment: "SKIPPED",
      timestamp: new Date().toISOString(),
      sessionDuration,
      messagesCount,
      categoriesUsed,
    };
    onSubmit(skipData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-usal-navy-800">
                      ¿Cómo fue tu experiencia?
                    </h3>
                    <p className="text-sm text-usal-navy-600 mt-1">
                      Tu opinión nos ayuda a mejorar
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <IconX className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Rating Stars */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-usal-navy-700 mb-3">
                    Calificá tu experiencia:
                  </p>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        {star <= (hoveredRating || rating) ? (
                          <IconStarFilled className="h-10 w-10 text-yellow-400" />
                        ) : (
                          <IconStar className="h-10 w-10 text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-usal-navy-600 mt-2"
                    >
                      {rating === 5 && "¡Excelente! 🎉"}
                      {rating === 4 && "¡Muy bueno! 😊"}
                      {rating === 3 && "Bueno 👍"}
                      {rating === 2 && "Puede mejorar 🤔"}
                      {rating === 1 && "Necesitamos mejorar 😔"}
                    </motion.p>
                  )}
                </div>

                {/* Was Helpful */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-usal-navy-700 mb-3">
                    ¿Testis te ayudó con tu consulta?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setWasHelpful(true)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        wasHelpful === true
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      Sí ✅
                    </button>
                    <button
                      onClick={() => setWasHelpful(false)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        wasHelpful === false
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      No ❌
                    </button>
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-usal-navy-700 mb-2">
                    ¿Algo que quieras comentar? (opcional)
                  </p>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Contanos qué te gustó o qué podríamos mejorar..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-usal-green-500 resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {comment.length}/500
                  </p>
                </div>

                {/* Session Info */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    📊 Datos de tu sesión:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div>
                      💬 {messagesCount} mensaje{messagesCount !== 1 ? "s" : ""}
                    </div>
                    <div>
                      ⏱️ {Math.floor(sessionDuration / 60)}:
                      {(sessionDuration % 60).toString().padStart(2, "0")} min
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="flex-1 py-2 px-4 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Ahora no
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 py-2 px-4 text-sm bg-gradient-to-r from-usal-green-600 to-usal-green-500 text-white rounded-lg hover:from-usal-green-700 hover:to-usal-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar <IconSend className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-usal-navy-800 mb-2">
                  ¡Gracias por tu feedback!
                </h3>
                <p className="text-sm text-usal-navy-600">
                  Tu opinión nos ayuda a mejorar Testis cada día
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

