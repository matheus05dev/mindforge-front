"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { studiesService } from "@/lib/api"
import type { Subject } from "@/lib/api/types"

interface SubjectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  subject?: Subject
}

export function SubjectForm({ open, onOpenChange, onSuccess, subject }: SubjectFormProps) {
  const [name, setName] = useState(subject?.name || "")
  const [description, setDescription] = useState(subject?.description || "")
  const [proficiencyLevel, setProficiencyLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">(
    subject?.proficiencyLevel || "BEGINNER",
  )
  const [professionalLevel, setProfessionalLevel] = useState<"JUNIOR" | "PLENO" | "SENIOR">(
    subject?.professionalLevel || "JUNIOR",
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (subject) {
        await studiesService.updateSubject(subject.id, {
          name,
          description,
          proficiencyLevel,
          professionalLevel,
        })
      } else {
        await studiesService.createSubject({
          name,
          description,
          proficiencyLevel,
          professionalLevel,
        })
      }
      onSuccess()
      onOpenChange(false)
      // Reset form
      setName("")
      setDescription("")
      setProficiencyLevel("BEGINNER")
      setProfessionalLevel("JUNIOR")
    } catch (error) {
      console.error("Erro ao salvar assunto:", error)
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Erro ao salvar assunto. Verifique se a API está rodando."
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{subject ? "Editar Estudo" : "Novo Estudo"}</DialogTitle>
            <DialogDescription>
              {subject
                ? "Atualize as informações do seu estudo e nível de proficiência."
                : "Crie um novo estudo e defina seu nível de proficiência atual."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Estudo *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Java, TypeScript, Docker, React..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que você vai estudar neste assunto..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="proficiency">Nível de Proficiência</Label>
                <Select value={proficiencyLevel} onValueChange={(v) => setProficiencyLevel(v as any)}>
                  <SelectTrigger id="proficiency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Iniciante</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
                    <SelectItem value="ADVANCED">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="professional">Nível Profissional</Label>
                <Select value={professionalLevel} onValueChange={(v) => setProfessionalLevel(v as any)}>
                  <SelectTrigger id="professional">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JUNIOR">Júnior</SelectItem>
                    <SelectItem value="PLENO">Pleno</SelectItem>
                    <SelectItem value="SENIOR">Sênior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Salvando..." : subject ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

