"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { githubService, type CodeReviewRequest } from "@/lib/api/services/github.service"
import { toast } from "sonner"
import { Sparkles, Loader2, Brain, Bug, GraduationCap, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CodeReviewPanelProps {
  projectId?: number
  subjectId?: number
  selectedFile?: string
  onReviewComplete: (result: any) => void
}

type AnalysisMode = "MENTOR" | "ANALYST" | "DEBUG_ASSISTANT" | "SOCRATIC_TUTOR"

const ANALYSIS_MODES: Record<AnalysisMode, { label: string; description: string; icon: any; color: string }> = {
  MENTOR: {
    label: "Mentor",
    description: "Feedback construtivo e sugestões de melhoria",
    icon: GraduationCap,
    color: "text-blue-500"
  },
  ANALYST: {
    label: "Analista",
    description: "Análise técnica detalhada do código",
    icon: Brain,
    color: "text-purple-500"
  },
  DEBUG_ASSISTANT: {
    label: "Debug Assistant",
    description: "Identifica bugs e problemas potenciais",
    icon: Bug,
    color: "text-red-500"
  },
  SOCRATIC_TUTOR: {
    label: "Tutor Socrático",
    description: "Aprenda através de perguntas guiadas",
    icon: MessageSquare,
    color: "text-green-500"
  }
}

export function CodeReviewPanel({ projectId, subjectId, selectedFile, onReviewComplete }: CodeReviewPanelProps) {
  const [mode, setMode] = useState<AnalysisMode>("MENTOR")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo para analisar")
      return
    }

    setIsAnalyzing(true)
    try {
      const request: CodeReviewRequest = {
        projectId: projectId!,
        subjectId: subjectId,
        filePath: selectedFile,
        mode
      }

      
      const result = await githubService.analyzeFile(request)
      toast.success("Análise concluída!")
      onReviewComplete(result)
    } catch (error: any) {
      console.error("Erro ao analisar código:", error)
      toast.error(error.message || "Erro ao analisar código")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Code Review com IA
        </CardTitle>
        <CardDescription>
          Escolha o modo de análise e receba feedback inteligente sobre seu código
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Modo de Análise</Label>
          <Select value={mode} onValueChange={(value) => setMode(value as AnalysisMode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ANALYSIS_MODES).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", config.color)} />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          
          {/* Descrição do modo selecionado */}
          <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
            {(() => {
              const Icon = ANALYSIS_MODES[mode].icon
              return <Icon className={cn("h-4 w-4 mt-0.5", ANALYSIS_MODES[mode].color)} />
            })()}
            <p className="text-sm text-muted-foreground">
              {ANALYSIS_MODES[mode].description}
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="space-y-2">
            <Label>Arquivo Selecionado</Label>
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30 border">
              <Badge variant="outline" className="font-mono text-xs">
                {selectedFile}
              </Badge>
            </div>
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className="w-full gap-2"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analisar Código
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
