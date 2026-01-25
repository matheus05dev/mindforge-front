"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApi } from "@/lib/hooks/use-api"
import { projectsService } from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"
import type { Project } from "@/lib/api/types"

const commitmentSchema = z.object({
  projectId: z.string().min(1, "Selecione um projeto"),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Data é obrigatória"),
  type: z.enum(["milestone", "meeting"]),
})

type CommitmentFormData = z.infer<typeof commitmentSchema>

interface CommitmentFormProps {
  onSuccess?: () => void
  project?: Project
  milestoneId?: number
}

export function CommitmentForm({ onSuccess, project, milestoneId }: CommitmentFormProps) {
  const { data: projectsData, loading, execute } = useApi<any>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const projects: Project[] = projectsData?.content || []

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CommitmentFormData>({
    resolver: zodResolver(commitmentSchema),
    defaultValues: {
      type: "milestone",
      dueDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      projectId: project ? String(project.id) : "",
    },
  })

  useEffect(() => {
    if (!projectsData) {
      execute(() => projectsService.getAll({ size: 1000 }))
    }
    if (project) {
      setValue("projectId", String(project.id))
    }
  }, [execute, project, setValue, projectsData])

  const onSubmit = async (data: CommitmentFormData) => {
    setIsSubmitting(true)
    try {
      if (milestoneId) {
        await projectsService.updateMilestone(milestoneId, {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
        })
        toast.success("Compromisso atualizado com sucesso!")
      } else {
        await projectsService.createMilestone(Number(data.projectId), {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          completed: false,
        })
        toast.success("Compromisso criado com sucesso!")
      }
      onSuccess?.()
    } catch (error) {
      toast.error("Erro ao salvar compromisso. Tente novamente.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && !projectsData) {
    return <div className="text-center py-4 text-muted-foreground">Carregando projetos...</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectId">Projeto *</Label>
        <Select
          onValueChange={(value) => setValue("projectId", value)}
          defaultValue={project ? String(project.id) : undefined}
          disabled={!!project || !!milestoneId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um projeto" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map((proj) => (
              <SelectItem key={proj.id} value={String(proj.id)}>
                {proj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.projectId && (
          <p className="text-sm text-destructive">{errors.projectId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo *</Label>
        <Select
          onValueChange={(value) => setValue("type", value as "milestone" | "meeting")}
          defaultValue="milestone"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="milestone">Marco / Entrega</SelectItem>
            <SelectItem value="meeting">Reunião</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Ex: Entrega da API de autenticação"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Data e Hora *</Label>
        <Input
          id="dueDate"
          type="datetime-local"
          {...register("dueDate")}
          disabled={isSubmitting}
        />
        {errors.dueDate && (
          <p className="text-sm text-destructive">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Detalhes sobre o compromisso..."
          disabled={isSubmitting}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : milestoneId ? "Atualizar" : "Criar"} Compromisso
        </Button>
      </div>
    </form>
  )
}

