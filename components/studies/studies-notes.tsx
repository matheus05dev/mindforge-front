"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, BookOpen, Calendar, Tag, FileText, Sparkles, Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { studiesService } from "@/lib/api"
import type { Note, Subject } from "@/lib/api/types"
import { toast } from "sonner"

export function StudiesNotes() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [notes, setNotes] = useState<(Note & { subjectName?: string })[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const subjectsData = await studiesService.getAllSubjects({ size: 1000 })
      setSubjects(subjectsData.content)

      const allNotes: (Note & { subjectName?: string })[] = []
      
      // Buscar notas de cada matéria
      // Nota: Idealmente teríamos um endpoint /api/studies/notes para pegar todas de uma vez
      for (const subject of subjectsData.content) {
        try {
          const subjectNotes = await studiesService.getNotesBySubject(subject.id)
          const notesWithSubject = subjectNotes.map((note: any) => ({
            ...note,
            subjectName: subject.name
          }))
          allNotes.push(...notesWithSubject)
        } catch (err) {
            console.error(`Erro ao carregar notas da matéria ${subject.name}`, err)
        }
      }
      
      // Ordenar por data de criação (mais recentes primeiro)
      allNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      setNotes(allNotes)
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error)
      const errorMessage = error?.message || error?.toString() || "Erro ao carregar notas."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Coletar todas as tags únicas
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags ? note.tags.split(",").map(t => t.trim()) : []))).filter(Boolean)

  // Filtrar notas
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.subjectName && note.subjectName.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Check tags handling splitting string
    const noteTags = note.tags ? note.tags.split(",").map(t => t.trim()) : []
    const matchesTag = !selectedTag || noteTags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  // Group tags for display only
  const getTagsArray = (tagsString?: string) => {
      if (!tagsString) return []
      return tagsString.split(",").map(t => t.trim()).filter(Boolean)
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar anotações por título, conteúdo ou assunto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Anotação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Anotação</DialogTitle>
              <DialogDescription>
                Crie uma nova anotação para seus estudos.
              </DialogDescription>
            </DialogHeader>
            <NoteForm subjects={subjects} onSuccess={() => {
                setIsFormOpen(false)
                loadData()
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrar por tag:</span>
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            Todas
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      )}

      {loading ? (
          <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      ) : (
        <>
            {/* Lista de Notas */}
            {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-border bg-card/50 border-dashed">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Comece sua jornada de conhecimento!</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md px-4">
                    {searchQuery || selectedTag
                    ? "Nenhuma anotação encontrada com os filtros aplicados."
                    : "Ainda não há anotações. Criar notas ajuda a fixar o conteúdo e acompanhar seu progresso."}
                  </p>
                  {!searchQuery && !selectedTag && (
                      <Button onClick={() => setIsFormOpen(true)} className="gap-2 text-md px-6 h-11">
                      <Plus className="h-5 w-5" />
                      Criar Primeira Anotação
                      </Button>
                  )}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                    <div
                    key={note.id}
                    onClick={() => router.push(`/studies/subjects/${note.subjectId}/notes?noteId=${note.id}`)}
                    className="group rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer"
                    >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">{note.subjectName || "Geral"}</span>
                        </div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {note.title}
                        </h3>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{note.content}</p>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {getTagsArray(note.tags).slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                        ))}
                        {getTagsArray(note.tags).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{getTagsArray(note.tags).length - 3}
                        </Badge>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(parseISO(note.createdAt), "d MMM yyyy", { locale: ptBR })}</span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
        </>
      )}
    </div>
  )
}

function NoteForm({ subjects, onSuccess }: { subjects: Subject[], onSuccess: () => void }) {
  const [subjectId, setSubjectId] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
        await studiesService.createNote(Number(subjectId), {
            title,
            content,
            tags // Send as string, backend handles it
        })
        toast.success("Anotação criada com sucesso!")
        onSuccess()
    } catch (error) {
        console.error(error)
        toast.error("Erro ao criar anotação.")
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Matéria *</Label>
        <Select value={subjectId} onValueChange={setSubjectId} required>
            <SelectTrigger>
                <SelectValue placeholder="Selecione a matéria" />
            </SelectTrigger>
            <SelectContent>
                {subjects.map(subject => (
                    <SelectItem key={subject.id} value={String(subject.id)}>{subject.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Streams e Lambdas"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Use Markdown para formatação..."
          rows={10}
          required
        />
        <p className="text-xs text-muted-foreground">
          Suporte a Markdown: **negrito**, *itálico*, `código`, etc.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Ex: java, streams, lambdas"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Anotação"}
        </Button>
      </div>
    </form>
  )
}
