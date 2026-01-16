// Mapeadores entre tipos do frontend e tipos da API

import type { AIPersona } from "../types"
import type { AIMode } from "./types"

/**
 * Mapeia personas do frontend para modos da API
 */
export const personaToMode: Record<AIPersona, AIMode> = {
  mentor: "MENTOR",
  analista: "ANALYST",
  tutor_socratico: "SOCRATIC_TUTOR",
  debug_assistant: "DEBUG_ASSISTANT",
  recrutador_tecnico: "MENTOR", // Usa modo genérico ou específico
  planejador: "MENTOR", // Usa modo genérico
  geral: "MENTOR",
}

/**
 * Mapeia níveis de proficiência do frontend para a API
 */
export const proficiencyToApi: Record<
  "iniciante" | "basico" | "intermediario" | "avancado" | "especialista",
  "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
> = {
  iniciante: "BEGINNER",
  basico: "BEGINNER",
  intermediario: "INTERMEDIATE",
  avancado: "ADVANCED",
  especialista: "ADVANCED",
}

/**
 * Mapeia níveis de proficiência da API para o frontend
 */
export const proficiencyFromApi: Record<
  "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  "iniciante" | "basico" | "intermediario" | "avancado" | "especialista"
> = {
  BEGINNER: "basico",
  INTERMEDIATE: "intermediario",
  ADVANCED: "avancado",
}

/**
 * Mapeia tipos de workspace do frontend para a API
 */
export const workspaceTypeToApi: Record<
  "geral" | "estudos" | "projetos",
  "GENERIC" | "STUDY" | "PROJECT"
> = {
  geral: "GENERIC",
  estudos: "STUDY",
  projetos: "PROJECT",
}

/**
 * Mapeia tipos de workspace da API para o frontend
 */
export const workspaceTypeFromApi: Record<
  "GENERIC" | "STUDY" | "PROJECT",
  "geral" | "estudos" | "projetos"
> = {
  GENERIC: "geral",
  STUDY: "estudos",
  PROJECT: "projetos",
}

