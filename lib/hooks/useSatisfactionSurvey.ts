"use client";

import { useState, useEffect, useCallback } from "react";

interface SurveyData {
  rating: number;
  wasHelpful: boolean | null;
  comment: string;
  timestamp: string;
  sessionDuration: number;
  messagesCount: number;
  categoriesUsed: string[];
}

interface SurveyMetrics {
  sessionStartTime: number;
  messagesCount: number;
  categoriesUsed: Set<string>;
}

export function useSatisfactionSurvey() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [metrics, setMetrics] = useState<SurveyMetrics>({
    sessionStartTime: Date.now(),
    messagesCount: 0,
    categoriesUsed: new Set(),
  });
  const [hasSurveyBeenShown, setHasSurveyBeenShown] = useState(false);

  // Cargar estado desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("testis_survey_shown_today");
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) {
        setHasSurveyBeenShown(true);
      }
    }
  }, []);

  // Incrementar contador de mensajes
  const incrementMessageCount = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      messagesCount: prev.messagesCount + 1,
    }));
  }, []);

  // Agregar categoría usada
  const addCategory = useCallback((category: string) => {
    setMetrics((prev) => {
      const newCategories = new Set(prev.categoriesUsed);
      newCategories.add(category);
      return {
        ...prev,
        categoriesUsed: newCategories,
      };
    });
  }, []);

  // Calcular duración de sesión
  const getSessionDuration = useCallback(() => {
    return Math.floor((Date.now() - metrics.sessionStartTime) / 1000);
  }, [metrics.sessionStartTime]);

  // Mostrar encuesta si cumple condiciones
  const checkAndShowSurvey = useCallback(() => {
    console.log('🔍 checkAndShowSurvey llamado');
    console.log('  - hasSurveyBeenShown:', hasSurveyBeenShown);
    console.log('  - messagesCount:', metrics.messagesCount);
    
    // No mostrar si ya se mostró hoy
    if (hasSurveyBeenShown) {
      console.log('⏭️  Ya se mostró la encuesta hoy');
      return;
    }

    // Condiciones para mostrar la encuesta:
    // 1. Mínimo 2 mensajes intercambiados (reducido para testing)
    // 2. Mínimo 15 segundos de sesión (reducido para testing)
    const duration = getSessionDuration();
    const shouldShow = metrics.messagesCount >= 2 && duration >= 15;

    console.log('  - duration:', duration);
    console.log('  - shouldShow:', shouldShow);

    if (shouldShow) {
      console.log('✅ Mostrando encuesta!');
      setShowSurvey(true);
      setHasSurveyBeenShown(true);
      
      // Guardar que ya se mostró hoy
      localStorage.setItem(
        "testis_survey_shown_today",
        JSON.stringify({ date: new Date().toDateString() })
      );
    } else {
      console.log('❌ No se cumplen las condiciones aún');
    }
  }, [hasSurveyBeenShown, metrics.messagesCount, getSessionDuration]);

  // Forzar mostrar encuesta (por ej. al cerrar el chat o botón manual)
  const triggerSurvey = useCallback(() => {
    console.log('⭐⭐⭐ triggerSurvey llamado manualmente ⭐⭐⭐');
    console.log('  - showSurvey actual:', showSurvey);
    console.log('  - hasSurveyBeenShown:', hasSurveyBeenShown);
    console.log('  - messagesCount:', metrics.messagesCount);
    
    // DEBUGGING: Ignorar todas las condiciones temporalmente
    console.log('🚨 DEBUG MODE: Mostrando encuesta SIN condiciones!');
    setShowSurvey(true);
    setHasSurveyBeenShown(true);
    
    /* VERSIÓN ORIGINAL (comentada para debug):
    if (!hasSurveyBeenShown && metrics.messagesCount > 0) {
      console.log('✅ Mostrando encuesta (manual)!');
      setShowSurvey(true);
      setHasSurveyBeenShown(true);
      localStorage.setItem(
        "testis_survey_shown_today",
        JSON.stringify({ date: new Date().toDateString() })
      );
    } else {
      console.log('❌ No se puede mostrar:', { 
        razon: hasSurveyBeenShown ? 'Ya se mostró hoy' : 'No hay mensajes'
      });
    }
    */
  }, [hasSurveyBeenShown, metrics.messagesCount, showSurvey]);

  // Cerrar encuesta
  const closeSurvey = useCallback(() => {
    setShowSurvey(false);
  }, []);

  // Enviar encuesta
  const submitSurvey = useCallback(async (data: SurveyData) => {
    // Guardar en localStorage
    const surveys = JSON.parse(
      localStorage.getItem("testis_surveys") || "[]"
    ) as SurveyData[];
    surveys.push(data);
    localStorage.setItem("testis_surveys", JSON.stringify(surveys));

    // Enviar a API (si existe)
    try {
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("✅ Encuesta enviada exitosamente");
      }
    } catch (error) {
      console.log("📊 Encuesta guardada localmente (API no disponible)");
    }

    // Cerrar encuesta
    closeSurvey();
  }, [closeSurvey]);

  // Resetear métricas
  const resetMetrics = useCallback(() => {
    setMetrics({
      sessionStartTime: Date.now(),
      messagesCount: 0,
      categoriesUsed: new Set(),
    });
  }, []);

  return {
    showSurvey,
    metrics: {
      ...metrics,
      sessionDuration: getSessionDuration(),
      categoriesUsed: Array.from(metrics.categoriesUsed),
    },
    incrementMessageCount,
    addCategory,
    checkAndShowSurvey,
    triggerSurvey,
    closeSurvey,
    submitSurvey,
    resetMetrics,
  };
}

