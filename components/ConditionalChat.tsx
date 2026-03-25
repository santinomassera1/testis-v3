"use client";

import { usePathname } from "next/navigation";
import { TestisChat } from "@/components/chat/TestisChat";

/**
 * ConditionalChat - Renderiza el chat solo en páginas donde tiene sentido
 * No se muestra en:
 * - /presentacion (modo defensa de tesis)
 */
export function ConditionalChat() {
  const pathname = usePathname();

  // Lista de rutas donde NO queremos mostrar el chat
  const hiddenRoutes = ["/presentacion"];

  // Si la ruta actual está en la lista de ocultas, no renderizar nada
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  // En todas las demás rutas, mostrar el chat normalmente
  return <TestisChat />;
}

