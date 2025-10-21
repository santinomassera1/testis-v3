"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconStar, IconStarFilled, IconTrendingUp, IconUsers, IconClock, IconMessageCircle } from "@tabler/icons-react";

interface SurveyData {
  rating: number;
  wasHelpful: boolean | null;
  comment: string;
  timestamp: string;
  sessionDuration: number;
  messagesCount: number;
  categoriesUsed: string[];
}

export default function SurveysDashboard() {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    averageRating: 0,
    helpfulPercentage: 0,
    averageSessionDuration: 0,
    averageMessages: 0,
    mostUsedCategories: [] as { category: string; count: number }[],
  });

  useEffect(() => {
    // Cargar encuestas desde localStorage
    const stored = localStorage.getItem("testis_surveys");
    if (stored) {
      const data: SurveyData[] = JSON.parse(stored);
      const validSurveys = data.filter((s) => s.comment !== "SKIPPED");
      setSurveys(validSurveys);

      // Calcular estadísticas
      const totalRating = validSurveys.reduce((sum, s) => sum + s.rating, 0);
      const helpfulCount = validSurveys.filter((s) => s.wasHelpful === true).length;
      const totalDuration = validSurveys.reduce((sum, s) => sum + s.sessionDuration, 0);
      const totalMessages = validSurveys.reduce((sum, s) => sum + s.messagesCount, 0);

      // Categorías más usadas
      const categoryCount: Record<string, number> = {};
      validSurveys.forEach((s) => {
        s.categoriesUsed.forEach((cat) => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
      });

      const sortedCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalSurveys: validSurveys.length,
        averageRating: validSurveys.length > 0 ? totalRating / validSurveys.length : 0,
        helpfulPercentage: validSurveys.length > 0 ? (helpfulCount / validSurveys.length) * 100 : 0,
        averageSessionDuration: validSurveys.length > 0 ? totalDuration / validSurveys.length : 0,
        averageMessages: validSurveys.length > 0 ? totalMessages / validSurveys.length : 0,
        mostUsedCategories: sortedCategories,
      });
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-usal-navy-800 mb-2">
            Dashboard de Satisfacción
          </h1>
          <p className="text-usal-navy-600">
            Métricas y feedback de usuarios de Testis
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Surveys */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <IconUsers className="h-8 w-8 text-blue-500" />
              <span className="text-3xl font-bold text-usal-navy-800">
                {stats.totalSurveys}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total de Encuestas</p>
          </motion.div>

          {/* Average Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star}>
                    {star <= Math.round(stats.averageRating) ? (
                      <IconStarFilled className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <IconStar className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
              <span className="text-3xl font-bold text-usal-navy-800">
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Calificación Promedio</p>
          </motion.div>

          {/* Helpful Percentage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <IconTrendingUp className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold text-usal-navy-800">
                {stats.helpfulPercentage.toFixed(0)}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Considerado Útil</p>
          </motion.div>

          {/* Average Session */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <IconClock className="h-8 w-8 text-purple-500" />
              <span className="text-3xl font-bold text-usal-navy-800">
                {formatDuration(Math.floor(stats.averageSessionDuration))}
              </span>
            </div>
            <p className="text-sm text-gray-600">Duración Promedio</p>
          </motion.div>
        </div>

        {/* Categories & Recent Surveys */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Used Categories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-usal-navy-800 mb-4">
              Categorías Más Consultadas
            </h2>
            {stats.mostUsedCategories.length > 0 ? (
              <div className="space-y-3">
                {stats.mostUsedCategories.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {cat.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-usal-green-600 to-usal-green-500"
                          style={{
                            width: `${(cat.count / stats.totalSurveys) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-usal-navy-800 w-8">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay datos suficientes aún</p>
            )}
          </motion.div>

          {/* Recent Comments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-usal-navy-800 mb-4">
              Comentarios Recientes
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {surveys
                .filter((s) => s.comment && s.comment.trim() !== "")
                .slice(0, 5)
                .map((survey, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(survey.rating)].map((_, i) => (
                        <IconStarFilled
                          key={i}
                          className="h-4 w-4 text-yellow-400"
                        />
                      ))}
                      <span className="text-xs text-gray-500">
                        {new Date(survey.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{survey.comment}</p>
                  </div>
                ))}
              {surveys.filter((s) => s.comment && s.comment.trim() !== "").length ===
                0 && <p className="text-gray-500">No hay comentarios aún</p>}
            </div>
          </motion.div>
        </div>

        {/* All Surveys Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-usal-navy-800 mb-4">
            Todas las Encuestas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Rating
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    ¿Útil?
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Mensajes
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Duración
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Comentario
                  </th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(survey.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex">
                        {[...Array(survey.rating)].map((_, i) => (
                          <IconStarFilled
                            key={i}
                            className="h-4 w-4 text-yellow-400"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {survey.wasHelpful === true ? (
                        <span className="text-green-600">✅ Sí</span>
                      ) : survey.wasHelpful === false ? (
                        <span className="text-red-600">❌ No</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {survey.messagesCount}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formatDuration(survey.sessionDuration)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {survey.comment || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {surveys.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay encuestas aún. ¡Empieza a chatear con Testis!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

