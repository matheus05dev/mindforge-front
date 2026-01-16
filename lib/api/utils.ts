import { personaToMode } from "./mappers"
import type { AIPersona } from "../types"
import type { AIMode } from "./types"

/**
 * Converte persona do frontend para modo da API
 */
export function getAIMode(persona: AIPersona): AIMode {
  return personaToMode[persona]
}

/**
 * Extrai o nome do arquivo de uma URL de download
 */
export function extractFileName(downloadUri: string): string {
  const parts = downloadUri.split("/")
  return parts[parts.length - 1]
}

/**
 * Formata bytes para tamanho legível
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Valida se uma URL é um repositório GitHub válido
 */
export function isValidGithubRepo(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname === "github.com" && parsed.pathname.split("/").length >= 3
  } catch {
    return false
  }
}

/**
 * Extrai owner e repo de uma URL do GitHub
 */
export function parseGithubRepo(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== "github.com") return null
    const parts = parsed.pathname.split("/").filter(Boolean)
    if (parts.length < 2) return null
    return { owner: parts[0], repo: parts[1] }
  } catch {
    return null
  }
}

