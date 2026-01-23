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
import { Map, Loader2 } from "lucide-react"
import { studiesService } from "@/lib/api/services/studies.service"
import { useToast } from "@/components/ui/use-toast"

interface RoadmapGeneratorDialogProps {
  onRoadmapGenerated: () => void
}

export function RoadmapGeneratorDialog({ onRoadmapGenerated }: RoadmapGeneratorDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Beginner")
  const [duration, setDuration] = useState("4 weeks")
  const { toast } = useToast()

  async function handleGenerate() {
    if (!topic.trim()) {
      toast({
        title: "Tópico obrigatório",
        description: "Por favor, informe um tópico para o roadmap.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await studiesService.generateRoadmap(topic, duration, difficulty)
      toast({
        title: "Roadmap gerado com sucesso!",
        description: "Seu plano de estudos foi criado com recursos personalizados.",
      })
      onRoadmapGenerated()
      setOpen(false)
      setTopic("")
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao gerar roadmap",
        description: "Ocorreu um erro ao tentar gerar o roadmap. Tente novamente.",
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
          <Map className="w-4 h-4 mr-2" />
          Novo Roadmap IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-500" />
            Criar Roadmap de Estudos
          </DialogTitle>
          <DialogDescription>
            A IA irá criar um plano semanal com recursos curados da web (Cisco, Khan, Docs).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">O que você quer aprender?</Label>
            <Input
              id="topic"
              placeholder="Ex: Spring Boot, Data Science, Python..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Nível Atual</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Iniciante</SelectItem>
                  <SelectItem value="Intermediate">Intermediário</SelectItem>
                  <SelectItem value="Advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duração Disponível</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 weeks">2 Semanas</SelectItem>
                  <SelectItem value="4 weeks">4 Semanas</SelectItem>
                  <SelectItem value="8 weeks">8 Semanas</SelectItem>
                  <SelectItem value="12 weeks">12 Semanas</SelectItem>
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
                Criando Plano...
              </>
            ) : (
              "Gerar Roadmap"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
