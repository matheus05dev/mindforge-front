/**
 * EXEMPLO: Como integrar o chat com a API real
 * 
 * Este arquivo mostra como substituir o mock do chat pela API real.
 * Copie e adapte este código para o componente ChatInterface.
 */

import { aiService, getAIMode } from "@/lib/api"
import type { AIPersona } from "@/lib/types"
import type { ChatMessage } from "@/lib/types"

/**
 * Exemplo de função para enviar mensagem usando a API real
 */
export async function sendChatMessage(
  content: string,
  persona: AIPersona,
  subjectId?: number,
  projectId?: number,
): Promise<ChatMessage> {
  try {
    // Mapeia persona para modo da API
    const mode = getAIMode(persona)

    // Chama a API de análise genérica
    const response = await aiService.analyzeGeneric({
      question: content,
      subjectId: subjectId ?? null,
      projectId: projectId ?? null,
      provider: null, // Usa o padrão "mindforge"
    })

    // Converte a resposta da API para o formato do frontend
    return {
      id: response.id.toString(),
      role: "assistant",
      content: response.content,
      persona,
      createdAt: response.createdAt,
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    throw error
  }
}

/**
 * Exemplo de função para análise de código
 */
export async function analyzeCode(
  code: string,
  persona: AIPersona,
  subjectId?: number,
): Promise<ChatMessage> {
  try {
    const mode = getAIMode(persona)

    const response = await aiService.analyzeCode({
      codeToAnalyze: code,
      subjectId: subjectId ?? null,
      documentId: null,
      mode,
    })

    return {
      id: response.id.toString(),
      role: "assistant",
      content: response.content,
      persona,
      createdAt: response.createdAt,
    }
  } catch (error) {
    console.error("Erro ao analisar código:", error)
    throw error
  }
}

/**
 * Exemplo de função para revisar portfólio
 */
export async function reviewPortfolio(githubRepoUrl: string): Promise<ChatMessage> {
  try {
    const response = await aiService.reviewPortfolio(githubRepoUrl)

    return {
      id: response.id.toString(),
      role: "assistant",
      content: response.content,
      persona: "recrutador_tecnico",
      createdAt: response.createdAt,
    }
  } catch (error) {
    console.error("Erro ao revisar portfólio:", error)
    throw error
  }
}

/**
 * Exemplo de uso no componente:
 * 
 * const handleSendMessage = async (content: string) => {
 *   const userMessage: ChatMessage = {
 *     id: Date.now().toString(),
 *     role: "user",
 *     content,
 *     createdAt: new Date().toISOString(),
 *   }
 * 
 *   setMessages((prev) => [...prev, userMessage])
 *   setIsLoading(true)
 * 
 *   try {
 *     const aiResponse = await sendChatMessage(content, selectedPersona)
 *     setMessages((prev) => [...prev, aiResponse])
 *   } catch (error) {
 *     const errorMessage: ChatMessage = {
 *       id: Date.now().toString(),
 *       role: "assistant",
 *       content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
 *       createdAt: new Date().toISOString(),
 *     }
 *     setMessages((prev) => [...prev, errorMessage])
 *   } finally {
 *     setIsLoading(false)
 *   }
 * }
 */

