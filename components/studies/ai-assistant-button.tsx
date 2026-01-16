"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { aiService, getAIMode } from "@/lib/api"
import type { AIPersona } from "@/lib/types"
import type { Subject } from "@/lib/api/types"

interface AIAssistantButtonProps {
  subject: Subject
  persona?: AIPersona
}

export function AIAssistantButton({ subject, persona = "mentor" }: AIAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return

    setIsLoading(true)
    setResponse("")

    try {
      const result = await aiService.analyzeGeneric({
        question: `${question}\n\nContexto: Estou estudando ${subject.name} (${subject.proficiencyLevel}). ${subject.description || ""}`,
        subjectId: subject.id,
        projectId: null,
        provider: null,
      })

      setResponse(result.content)
    } catch (error) {
      console.error("Erro ao consultar IA:", error)
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Erro ao consultar IA. Verifique se a API está rodando."
      setResponse(`Erro: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeCode = async (code: string) => {
    setIsLoading(true)
    setResponse("")

    try {
      const mode = getAIMode(persona)
      const result = await aiService.analyzeCode({
        codeToAnalyze: code,
        subjectId: subject.id,
        documentId: null,
        mode,
      })

      setResponse(result.content)
    } catch (error) {
      console.error("Erro ao analisar código:", error)
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Erro ao analisar código. Verifique se a API está rodando."
      setResponse(`Erro: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(true)}
        title="Assistente de IA para este estudo"
      >
        <Sparkles className="h-4 w-4" />
        IA
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assistente de IA - {subject.name}</DialogTitle>
            <DialogDescription>
              Faça perguntas sobre {subject.name} ou peça ajuda com código relacionado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Sua pergunta ou código</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Como funciona X em Java? ou cole seu código aqui..."
                rows={4}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAsk} disabled={isLoading || !question.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Perguntar"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (question.trim()) {
                    handleAnalyzeCode(question)
                  }
                }}
                disabled={isLoading || !question.trim()}
              >
                Analisar Código
              </Button>
            </div>

            {response && (
              <div className="mt-4 p-4 rounded-lg border border-border bg-muted/50">
                <Label className="mb-2 block">Resposta da IA:</Label>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{response}</div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

