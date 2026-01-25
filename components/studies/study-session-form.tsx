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
import { studiesService } from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"

const sessionSchema = z.object({
  subjectId: z.string().min(1, "Selecione um assunto"),
  startTime: z.string().min(1, "Data e hora são obrigatórias"),
  durationMinutes: z.coerce.number().min(1, "Duração mínima de 1 minuto"),
  notes: z.string().optional(),
})

type SessionFormData = z.infer<typeof sessionSchema>

interface StudySessionFormProps {
  onSuccess?: () => void
  sessionId?: number
}

export function StudySessionForm({ onSuccess, sessionId }: StudySessionFormProps) {
  const { data: subjects, loading, execute } = useApi()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      durationMinutes: 60,
    },
  })

  useEffect(() => {
    execute(() => studiesService.getAllSubjects({ size: 1000 }))
  }, [execute])

  const onSubmit = async (data: SessionFormData) => {
    setIsSubmitting(true)
    try {
      if (sessionId) {
        await studiesService.updateSession(sessionId, {
          startTime: data.startTime,
          durationMinutes: data.durationMinutes,
          notes: data.notes,
        })
        toast.success("Sessão atualizada com sucesso!")
      } else {
        await studiesService.logSession(Number(data.subjectId), {
          startTime: data.startTime,
          durationMinutes: data.durationMinutes,
          notes: data.notes,
        })
        toast.success("Sessão criada com sucesso!")
      }
      onSuccess?.()
    } catch (error) {
      toast.error("Erro ao salvar sessão. Tente novamente.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Carregando assuntos...</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subjectId">Assunto *</Label>
        <Select
          onValueChange={(value) => setValue("subjectId", value)}
          disabled={!!sessionId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um assunto" />
          </SelectTrigger>
          <SelectContent>
            {subjects?.content?.map((subject) => (
              <SelectItem key={subject.id} value={String(subject.id)}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subjectId && (
          <p className="text-sm text-destructive">{errors.subjectId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime">Data e Hora *</Label>
        <Input
          id="startTime"
          type="datetime-local"
          {...register("startTime")}
          disabled={isSubmitting}
        />
        {errors.startTime && (
          <p className="text-sm text-destructive">{errors.startTime.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="durationMinutes">Duração (minutos) *</Label>
        <Input
          id="durationMinutes"
          type="number"
          min="1"
          {...register("durationMinutes")}
          disabled={isSubmitting}
        />
        {errors.durationMinutes && (
          <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Anotações</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Anotações sobre a sessão de estudo..."
          disabled={isSubmitting}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : sessionId ? "Atualizar" : "Criar"} Sessão
        </Button>
      </div>
    </form>
  )
}

