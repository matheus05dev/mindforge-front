import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Edit, History } from "lucide-react"
import { studiesService } from "@/lib/api"
import type { Note } from "@/lib/api/types"
import { StudyChatSidebar } from "./study-chat-sidebar"
import { AgentProposalInline } from "@/components/knowledge/agent-proposal-inline"
import { StudyNoteHistorySidebar, StudyNoteVersion } from "./study-note-history-sidebar"
import type { KnowledgeAgentProposal } from "@/lib/api/types/agent"

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
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const [activeProposal, setActiveProposal] = useState<KnowledgeAgentProposal | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

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
      closeEditor()
      loadNotes()
    } catch (error) {
      console.error("Erro ao salvar nota:", error)
    }
  }

  function closeEditor() {
    setFormData({ title: "", content: "", tags: "" })
    setIsCreating(false)
    setEditingId(null)
    setActiveProposal(null)
    setIsHistoryOpen(false)
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

  async function handleAIAssist(command: "CONTINUE" | "SUMMARIZE" | "FIX_GRAMMAR" | "IMPROVE") {
    if (!formData.content) return

    setIsAIProcessing(true)
    try {
      const response = await studiesService.noteAIAssist({
        command,
        context: formData.content,
        noteId: editingId || undefined,
        useContext: false,
        agentMode: false
      })

      if (response.success && response.result) {
        if (command === "SUMMARIZE") {
          setFormData({ ...formData, content: formData.content + "\n\n---\n\n" + response.result })
        } else {
          setFormData({ ...formData, content: response.result })
        }
      } else {
        alert("Erro ao processar: " + response.message)
      }
    } catch (error) {
      console.error("Erro ao processar IA:", error)
      alert("Erro ao processar com IA")
    } finally {
      setIsAIProcessing(false)
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id)
    setFormData({ title: note.title, content: note.content || "", tags: note.tags || "" })
    setIsCreating(true)
    setActiveProposal(null)
    setIsHistoryOpen(false)
  }

  async function handleApproveProposal(changeIndices: number[], approveAll: boolean) {
    if (!activeProposal || !editingId) return

    try {
      await studiesService.applyProposal(activeProposal.proposalId, {
         approvedChangeIndices: changeIndices,
         approveAll: approveAll
      })

      const updatedNote = await studiesService.getNoteById(editingId)
      setFormData(prev => ({ ...prev, content: updatedNote.content || "" }))
      setActiveProposal(null)
      loadNotes()

    } catch (error) {
      console.error("Erro ao aplicar proposta:", error)
      alert("Erro ao aplicar proposta.")
    }
  }

  async function handleRollback(version: StudyNoteVersion) {
    if (!editingId) return
    try {
      const updatedNote = await studiesService.rollbackToVersion(editingId, version.id)
      setFormData({ 
        ...formData, 
        title: updatedNote.title, 
        content: updatedNote.content || "" 
      })
      alert("Versão restaurada com sucesso!")
      loadNotes()
    } catch (error) {
      console.error("Erro ao restaurar versão:", error)
      alert("Erro ao restaurar versão.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Notas</h2>
        <Button onClick={() => {
            setIsCreating(!isCreating)
            setEditingId(null)
            setFormData({ title: "", content: "", tags: "" })
            setActiveProposal(null)
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Nota
        </Button>
      </div>

      {isCreating && (
             activeProposal ? (
                 <div className="flex-1 h-full overflow-hidden border rounded-lg bg-background shadow-sm">
                      <AgentProposalInline 
                         proposal={activeProposal}
                         originalContent={formData.content}
                         onApprove={handleApproveProposal}
                         onReject={() => setActiveProposal(null)}
                      />
                 </div>
             ) : (
                <div className="flex flex-col lg:flex-row gap-4 h-[700px]">
                    {/* Editor Area */}
                    <Card className="flex-1 p-4 flex flex-col h-full overflow-hidden">
                        <form id="note-form" onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
                            <div className="flex gap-2">
                                <Input
                                placeholder="Título da nota"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="flex-1"
                                />
                                {editingId && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => setIsHistoryOpen(true)}
                                      title="Histórico de Versões"
                                    >
                                      <History className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            
                            <div className="flex-1 flex flex-col">
                                <Textarea
                                placeholder="Conteúdo (suporta Markdown)"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="flex-1 resize-none [field-sizing:fixed] overflow-y-auto"
                                style={{ fieldSizing: "fixed" } as any}
                                />
                            </div>
                            
                            {/* Quick AI Toolbar */}
                            <div className="flex gap-2 flex-wrap">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleAIAssist("CONTINUE")}
                                disabled={!formData.content || isAIProcessing}
                            >
                                {isAIProcessing ? "⏳" : "✨"} Continuar
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleAIAssist("SUMMARIZE")}
                                disabled={!formData.content || isAIProcessing}
                            >
                                {isAIProcessing ? "⏳" : "📝"} Resumir
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleAIAssist("FIX_GRAMMAR")}
                                disabled={!formData.content || isAIProcessing}
                            >
                                {isAIProcessing ? "⏳" : "✏️"} Corrigir
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleAIAssist("IMPROVE")}
                                disabled={!formData.content || isAIProcessing}
                            >
                                {isAIProcessing ? "⏳" : "🚀"} Melhorar
                            </Button>
                            </div>

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
                                onClick={closeEditor}
                            >
                                Cancelar
                            </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Agent/Chat Sidebar (Only for existing notes) */}
                    {editingId && (
                        <div className="w-full lg:w-[400px] shrink-0 h-full border rounded-lg overflow-hidden bg-background shadow-sm flex flex-col">
                             <StudyChatSidebar 
                                noteId={editingId}
                                contextContent={formData.content}
                                onProposal={(p) => setActiveProposal(p)}
                                aiMode="AGENT" // Default to AGENT mode capable
                             />
                        </div>
                    )}
                    
                    {/* History Sidebar */}
                    {editingId && (
                        <StudyNoteHistorySidebar 
                            noteId={editingId}
                            isOpen={isHistoryOpen}
                            onClose={() => setIsHistoryOpen(false)}
                            onRollback={handleRollback}
                        />
                    )}
                </div>
             )
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
