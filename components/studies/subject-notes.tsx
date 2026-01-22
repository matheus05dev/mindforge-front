"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Edit } from "lucide-react"
import { studiesService } from "@/lib/api"
import type { Note } from "@/lib/api/types"

interface SubjectNotesProps {
  subjectId: number
}

export function SubjectNotes({ subjectId }: SubjectNotesProps) {
  const searchParams = useSearchParams()
  const targetNoteId = searchParams.get("noteId")

  const [notes, setNotes] = useState<Note[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ title: "", content: "", tags: "" })

  useEffect(() => {
    loadNotes()
  }, [subjectId])

  useEffect(() => {
    if (targetNoteId && notes.length > 0) {
      const noteToOpen = notes.find(n => n.id === Number(targetNoteId))
      if (noteToOpen) {
        startEdit(noteToOpen)
        
        setTimeout(() => {
            const formElement = document.getElementById("note-form")
            if (formElement) formElement.scrollIntoView({ behavior: "smooth" })
        }, 300)
      }
    }
  }, [notes, targetNoteId])

  async function loadNotes() {
    try {
      const data = await studiesService.getNotesBySubject(subjectId)
      setNotes(data)
    } catch (error) {
      console.error("Erro ao carregar notas:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        await studiesService.updateNote(editingId, formData)
      } else {
        await studiesService.createNote(subjectId, formData)
      }
      setFormData({ title: "", content: "", tags: "" })
      setIsCreating(false)
      setEditingId(null)
      loadNotes()
    } catch (error) {
      console.error("Erro ao salvar nota:", error)
    }
  }

  async function handleDelete(noteId: number) {
    if (confirm("Deseja realmente excluir esta nota?")) {
      try {
        await studiesService.deleteNote(noteId)
        loadNotes()
      } catch (error) {
        console.error("Erro ao deletar nota:", error)
      }
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id)
    setFormData({ title: note.title, content: note.content || "", tags: note.tags || "" })
    setIsCreating(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Notas</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Nota
        </Button>
      </div>

      {isCreating && (
        <Card className="p-4">
          <form id="note-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Título da nota"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="Conteúdo (suporta Markdown)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
            />
            <Input
              placeholder="Tags (separadas por vírgula)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Atualizar" : "Criar"}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setEditingId(null)
                  setFormData({ title: "", content: "", tags: "" })
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{note.title}</h3>
                {note.content && (
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                    {note.content}
                  </p>
                )}
                {note.tags && (
                  <div className="flex gap-2 mt-2">
                    {note.tags.split(",").map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Atualizado: {new Date(note.updatedAt).toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => startEdit(note)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(note.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
