"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, Loader2 } from "lucide-react"
import { studiesService } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface QuizGeneratorDialogProps {
  subjectId: number
  onQuizGenerated: () => void
}

export function QuizGeneratorDialog({ subjectId, onQuizGenerated }: QuizGeneratorDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("MEDIUM")
  const [count, setCount] = useState("5")
  const { toast } = useToast()

  async function handleGenerate() {
    if (!topic.trim()) {
      toast({
        title: "Tópico obrigatório",
        description: "Por favor, informe um tópico para o quiz.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await studiesService.generateQuiz(subjectId, topic, difficulty, Number(count))
      toast({
        title: "Quiz gerado com sucesso!",
        description: "As perguntas foram criadas pela IA.",
      })
      onQuizGenerated()
      setOpen(false)
      setTopic("")
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao gerar quiz",
        description: "Ocorreu um erro ao tentar gerar o quiz. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar com IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Gerar Quiz via IA
          </DialogTitle>
          <DialogDescription>
            A IA irá analisar suas notas e buscar conteúdo na web para criar perguntas desafiadoras.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">Tópico ou Foco</Label>
            <Input
              id="topic"
              placeholder="Ex: Principais design parrerns, Streams API..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Dificuldade</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Fácil</SelectItem>
                  <SelectItem value="MEDIUM">Médio</SelectItem>
                  <SelectItem value="HARD">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="count">Qtd. Questões</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger id="count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Questões</SelectItem>
                  <SelectItem value="5">5 Questões</SelectItem>
                  <SelectItem value="10">10 Questões</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar Quiz"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
