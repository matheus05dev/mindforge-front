"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, BookOpen, MoreHorizontal, Trash2, Edit, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SubjectFormModal } from "./subject-form-modal"
import type { Subject } from "@/lib/api/types"
import { studiesService } from "@/lib/api"

interface SubjectListProps {
  subjects: Subject[]
  onRefresh: () => void
}

const proficiencyColors = {
  BEGINNER: "bg-green-100 text-green-700 hover:bg-green-100/80",
  INTERMEDIATE: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
  ADVANCED: "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
}

const proficiencyLabels = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
}

export function SubjectList({ subjects, onRefresh }: SubjectListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta matéria? Todo o histórico será perdido.")) {
      try {
        await studiesService.deleteSubject(id)
        onRefresh()
      } catch (error) {
        console.error("Erro ao excluir matéria:", error)
        alert("Erro ao excluir matéria")
      }
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingSubject(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Suas Matérias</h2>
        <Button onClick={handleCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Nova Matéria
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 overflow-y-auto pr-2 pb-4 flex-1 content-start">
        {subjects.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed rounded-lg">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma matéria cadastrada.</p>
            <Button variant="link" onClick={handleCreate}>
              Comece agora
            </Button>
          </div>
        )}

        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="group relative rounded-lg border bg-card p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold leading-none tracking-tight">{subject.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                  {subject.description || "Sem descrição."}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(subject)}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={() => handleDelete(subject.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary" className={proficiencyColors[subject.proficiencyLevel] || ""}>
                {proficiencyLabels[subject.proficiencyLevel]}
              </Badge>
              
              {/* Future: Total Study Time here */}
              {/* <span className="text-xs text-muted-foreground font-mono">12h estudadas</span> */}
            </div>
          </div>
        ))}
      </div>

      <SubjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
        subjectToEdit={editingSubject}
      />
    </div>
  )
}
