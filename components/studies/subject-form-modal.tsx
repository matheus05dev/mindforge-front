"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form" // Added Controller
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label" // Used Label directly
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
// Removed ui/form imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { studiesService } from "@/lib/api"
import type { Subject } from "@/lib/api/types"
import { useStore } from "@/lib/store"

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
})

interface SubjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  subjectToEdit?: Subject | null
}

export function SubjectFormModal({ isOpen, onClose, onSuccess, subjectToEdit }: SubjectFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      proficiencyLevel: "BEGINNER",
    },
  })

  // Reset form when opening/closing or changing edit mode
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: subjectToEdit?.name || "",
        description: subjectToEdit?.description || "",
        proficiencyLevel: subjectToEdit?.proficiencyLevel || "BEGINNER",
      })
    }
  }, [isOpen, subjectToEdit, form])

  const { currentWorkspace } = useStore() // Get current workspace

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const payload = {
        ...values,
        workspaceId: currentWorkspace?.id ? Number(currentWorkspace.id) : undefined
      }

      if (subjectToEdit) {
        await studiesService.updateSubject(subjectToEdit.id, payload)
      } else {
        await studiesService.createSubject(payload)
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Erro ao salvar matéria:", error)
      alert("Erro ao salvar matéria")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{subjectToEdit ? "Editar Matéria" : "Nova Matéria"}</DialogTitle>
          <DialogDescription>
            {subjectToEdit ? "Edite os detalhes da matéria." : "Adicione uma nova matéria para organizar seus estudos."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              placeholder="Ex: Java, História..." 
              {...form.register("name")} 
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea 
              id="description" 
              placeholder="O que você vai estudar?" 
              {...form.register("description")} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiencyLevel">Nível Atual</Label>
            <Controller
              control={form.control}
              name="proficiencyLevel"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Iniciante</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediário</SelectItem>
                    <SelectItem value="ADVANCED">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
