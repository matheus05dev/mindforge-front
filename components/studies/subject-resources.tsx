"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ExternalLink, Video, FileText, Book } from "lucide-react"
import { studiesService } from "@/lib/api"
import type { StudyResource } from "@/lib/api/types"

interface SubjectResourcesProps {
  subjectId: number
}

export function SubjectResources({ subjectId }: SubjectResourcesProps) {
  const [resources, setResources] = useState<StudyResource[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "VIDEO" as StudyResource["type"],
    url: "",
    description: "",
  })

  useEffect(() => {
    loadResources()
  }, [subjectId])

  async function loadResources() {
    try {
      const data = await studiesService.getResourcesBySubject(subjectId)
      setResources(data)
    } catch (error) {
      console.error("Erro ao carregar recursos:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await studiesService.createResource(subjectId, formData)
      setFormData({ title: "", type: "VIDEO", url: "", description: "" })
      setIsCreating(false)
      loadResources()
    } catch (error) {
      console.error("Erro ao salvar recurso:", error)
    }
  }

  async function handleDelete(resourceId: number) {
    if (confirm("Deseja realmente excluir este recurso?")) {
      try {
        await studiesService.deleteResource(resourceId)
        loadResources()
      } catch (error) {
        console.error("Erro ao deletar recurso:", error)
      }
    }
  }

  function getResourceIcon(type: StudyResource["type"]) {
    switch (type) {
      case "VIDEO":
        return <Video className="w-5 h-5" />
      case "ARTICLE":
        return <FileText className="w-5 h-5" />
      case "BOOK":
        return <Book className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recursos de Estudo</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Recurso
        </Button>
      </div>

      {isCreating && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Título do recurso"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Select
              value={formData.type}
              onValueChange={(value: StudyResource["type"]) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Vídeo</SelectItem>
                <SelectItem value="ARTICLE">Artigo</SelectItem>
                <SelectItem value="BOOK">Livro</SelectItem>
                <SelectItem value="COURSE">Curso</SelectItem>
                <SelectItem value="DOCUMENTATION">Documentação</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="URL do recurso"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
            <Textarea
              placeholder="Descrição (opcional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            <div className="flex gap-2">
              <Button type="submit">Adicionar</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setFormData({ title: "", type: "VIDEO", url: "", description: "" })
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <div className="flex-shrink-0 text-primary">{getResourceIcon(resource.type)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{resource.title}</h3>
                {resource.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    Acessar <ExternalLink className="w-3 h-3" />
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto"
                    onClick={() => handleDelete(resource.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
