"use client"

import { useState } from "react"
import type { KnowledgeItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Save,
  Hash,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Quote,
  Heading1,
  Heading2,
  Sparkles,
  Bot,
  History,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useStore } from "@/lib/store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { KnowledgeChatSidebar } from "./knowledge-chat-sidebar"
import { InlineDiffEditor } from "./inline-diff-editor"
import { KnowledgeVersionHistory } from "./knowledge-version-history"

interface KnowledgeEditorProps {
  item?: KnowledgeItem
  onClose: () => void
}

const categoryColors: Record<string, string> = {
  Programming: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  DevOps: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Database: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Frontend: "bg-green-500/10 text-green-500 border-green-500/20",
  Architecture: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Tools: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

export function KnowledgeEditor({ item, onClose }: KnowledgeEditorProps) {
  const { currentWorkspace, workspaces, isAINotesOpen, toggleAINotes, setAiContext, setKnowledgeItems, isAgentMode, toggleAgentMode } = useStore()
  const [title, setTitle] = useState(item?.title || "")
  const [content, setContent] = useState(item?.content || "")
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(
    item?.workspaceId || currentWorkspace.id
  )
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [agentProposal, setAgentProposal] = useState<any>(null) // KnowledgeAgentProposal
  // Estado local de IA removido em favor da store global
  
  // Estado de Histórico e Diff
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedChangeIndices, setSelectedChangeIndices] = useState<Set<number>>(new Set())
  const [editedChangeContent, setEditedChangeContent] = useState<Map<number, string>>(new Map())

  // Novo handler de proposta
  const handleProposalReceived = (proposal: any) => {
    setAgentProposal(proposal)
    // Auto-seleciona todas as mudanças por padrão
    const allIndices = new Set<number>(proposal.changes.map((_: any, i: number) => i))
    setSelectedChangeIndices(allIndices)
    setEditedChangeContent(new Map())
  }

  const handleApplyChanges = async () => {
    if (!agentProposal) return

    try {
      const { knowledgeService } = await import("@/lib/api/services/knowledge.service")
      
      const modifiedContentObj: Record<number, string> = {}
      editedChangeContent.forEach((val, key) => {
        modifiedContentObj[key] = val
      })

      const updated = await knowledgeService.applyProposal(agentProposal.proposalId, {
        approvedChangeIndices: Array.from(selectedChangeIndices),
        approveAll: selectedChangeIndices.size === agentProposal.changes.length && editedChangeContent.size === 0,
        modifiedContent: modifiedContentObj
      })

      // Verificação defensiva: backend pode retornar array ou objeto
      let newContent = ""
      if (Array.isArray(updated)) {
          newContent = updated[0]?.content || ""
      } else {
          newContent = (updated as any).content || ""
      }

      // Atualiza conteúdo local com o novo conteúdo do backend
      setContent(newContent)
      
      // Força reset do estado da proposta para garantir que a UI feche a visualização de diff
      setAgentProposal(null)
      setSelectedChangeIndices(new Set())
      setEditedChangeContent(new Map())
      
      toast.success("Alterações aplicadas com sucesso!")

      // Refresh knowledge list
      const updatedItems = await knowledgeService.getAll()
      const mappedItems = updatedItems.map((apiItem: any) => ({
        id: String(apiItem.id),
        workspaceId: apiItem.workspaceId ? String(apiItem.workspaceId) : currentWorkspace.id,
        title: apiItem.title,
        content: apiItem.content,
        tags: apiItem.tags || [],
        category: "Geral",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      setKnowledgeItems(mappedItems)
    } catch (error: any) {
      toast.error(error.message || "Erro ao aplicar proposta")
    }
  }

  const handleRollback = async (version: any) => {
    if (!item) return
    try {
      const { knowledgeService } = await import("@/lib/api/services/knowledge.service")
      const updated = await knowledgeService.rollbackToVersion(Number(item.id), version.id)
      
      setContent(updated.content || "")
      setTitle(updated.title)
      toast.success(`Restaurado para versão de ${new Date(version.createdAt).toLocaleString()}`)
    } catch (error) {
       toast.error("Erro ao restaurar versão")
    }
  }

  // Ações da Toolbar
  const insertText = (text: string) => {
    setContent((prev) => prev + text)
  }

  const wrapText = (wrapper: string) => {
    setContent((prev) => prev + `${wrapper}text${wrapper}`)
  }
  
  const toolbarButtons = [
    { icon: Heading1, label: "Heading 1", action: () => insertText("# ") },
    { icon: Heading2, label: "Heading 2", action: () => insertText("## ") },
    { type: "separator" as const },
    { icon: Bold, label: "Bold", action: () => wrapText("**") },
    { icon: Italic, label: "Italic", action: () => wrapText("*") },
    { icon: Code, label: "Code", action: () => wrapText("`") },
    { type: "separator" as const },
    { icon: List, label: "Bullet List", action: () => insertText("- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertText("1. ") },
    { icon: Quote, label: "Quote", action: () => insertText("> ") },
    { type: "separator" as const },
    { icon: Link2, label: "Link", action: () => insertText("[text](url)") },
    { icon: ImageIcon, label: "Image", action: () => insertText("![alt](url)") },
  ]

  const renderMarkdown = (text: string) => {
    // Renderização markdown simples para preview
    // Nota: Em produção, considerar usar 'react-markdown'
    const html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-muted rounded-md p-4 my-4 overflow-x-auto font-mono text-sm"><code>$2</code></pre>',
      )
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, "<br />")

    return html
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-0 focus-visible:ring-0 px-0 h-auto"
            placeholder="Título da nota..."
          />
        </div>
        <div className="flex items-center gap-2">
          {item && (
             <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)} className="gap-2">
               <History className="h-4 w-4" />
               Histórico
             </Button>
          )}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Toggle de Modo IA */}
          <Button 
            variant={isAgentMode ? "default" : "outline"}
            size="sm" 
            className={cn("gap-2 transition-all", isAgentMode && "bg-purple-600 hover:bg-purple-700")}
            onClick={() => {
              toggleAgentMode()
              toast.info(!isAgentMode ? "Modo Agente ativado" : "Modo Pensamento ativado")
            }}
          >
            <Bot className="h-4 w-4" />
            {isAgentMode ? "Agent Mode" : "Thinking Mode"}
          </Button>

          <Button
            size="sm"
            className="gap-2"
            onClick={async () => {
              if (!title.trim()) return
              setIsSaving(true)
              try {
                const { knowledgeService } = await import("@/lib/api/services/knowledge.service")
                if (item) {
                  await knowledgeService.update(Number(item.id), {
                    title,
                    content,
                    tags: item.tags || [],
                    workspaceId: selectedWorkspaceId
                  })
                  toast.success("Nota atualizada com sucesso!")
                } else {
                  await knowledgeService.create({
                    title,
                    content,
                    tags: [],
                    workspaceId: selectedWorkspaceId
                  })
                  toast.success("Nota criada com sucesso!")
                }
                
                // Atualiza a lista de conhecimentos
                const updatedItems = await knowledgeService.getAll()
                const mappedItems = updatedItems.map((apiItem: any) => ({
                  id: String(apiItem.id),
                  workspaceId: apiItem.workspaceId ? String(apiItem.workspaceId) : currentWorkspace.id,
                  title: apiItem.title,
                  content: apiItem.content,
                  tags: apiItem.tags || [],
                  category: "Geral",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }))
                setKnowledgeItems(mappedItems)
                
                onClose()
              } catch (error: any) {
                console.error("Erro ao salvar:", error.message || error)
                toast.error(`Erro ao salvar: ${error.message || "Verifique a conexão."}`)
              } finally {
                setIsSaving(false)
              }
            }}
            disabled={isSaving || !title.trim()}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Toolbar - Exibir apenas se não estiver em modo diff */}
      {!agentProposal && (
        <div className="flex items-center gap-1 py-2 border-b border-border overflow-x-auto">
          {toolbarButtons.map((btn, index) =>
            btn.type === "separator" ? (
              <Separator key={index} orientation="vertical" className="h-6 mx-1" />
            ) : (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={btn.action}
                title={btn.label}
              >
                <btn.icon className="h-4 w-4" />
              </Button>
            ),
          )}
          <div className="ml-auto flex items-center gap-2">
            <Select value={selectedWorkspaceId} onValueChange={setSelectedWorkspaceId}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Selecione o workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((ws) => (
                  <SelectItem key={ws.id} value={ws.id}>
                    {ws.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className={cn(isPreview && "bg-muted")}
            >
              {isPreview ? "Editar" : "Visualizar"}
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="flex-1 flex overflow-hidden relative min-h-0 w-full">
        <div className="flex-1 overflow-hidden flex flex-col p-4 min-w-0 min-h-0">
          {agentProposal ? (
            <InlineDiffEditor 
              originalContent={content}
              changes={agentProposal.changes}
              selectedIndices={selectedChangeIndices}
              editedContentMap={editedChangeContent}
              onToggleChange={(index) => {
                const newSet = new Set(selectedChangeIndices)
                if (newSet.has(index)) newSet.delete(index)
                else newSet.add(index)
                setSelectedChangeIndices(newSet)
              }}
              onEditChange={(index, text) => {
                const newMap = new Map(editedChangeContent)
                newMap.set(index, text)
                setEditedChangeContent(newMap)
              }}
              onApply={handleApplyChanges}
              onCancel={() => {
                setAgentProposal(null)
                setSelectedChangeIndices(new Set())
                setEditedChangeContent(new Map())
              }}
            />
          ) : isPreview ? (
            <div
              className="prose dark:prose-invert max-w-none h-full overflow-y-auto pr-4"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none border-0 focus-visible:ring-0 p-0 leading-7 font-sans text-base"
              placeholder="Comece a escrever sua nota..."
            />
          )}
        </div>

        {/* Sidebar Unificado de Chat da Base de Conhecimento */}
        {item && (
            <div className="h-full shrink-0">
                <KnowledgeChatSidebar
                knowledgeId={Number(item.id)}
                contextContent={content}
                onProposal={handleProposalReceived}
                aiMode={isAgentMode ? "AGENT" : "THINKING"}
                />
            </div>
        )}
      </div>
      
      {/* Sidebar de Histórico de Versões */}
      {item && (
        <KnowledgeVersionHistory 
          knowledgeId={Number(item.id)}
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onRollback={handleRollback}
        />
      )}
    </div>
  )
}
