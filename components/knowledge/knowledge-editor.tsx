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
  CheckCircle2,
  Bot,
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
  const { currentWorkspace, workspaces, isAINotesOpen, toggleAINotes, setAiContext, setKnowledgeItems } = useStore()
  const [title, setTitle] = useState(item?.title || "")
  const [content, setContent] = useState(item?.content || "")
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(
    item?.workspaceId || currentWorkspace.id
  )
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  const insertText = (text: string) => {
    setContent((prev) => prev + text)
  }

  const wrapText = (wrapper: string) => {
    setContent((prev) => prev + `${wrapper}text${wrapper}`)
  }

  const renderMarkdown = (text: string) => {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
            />
            {item && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", categoryColors[item.category])}>
                  {item.category}
                </Badge>
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs gap-1">
                    <Hash className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedWorkspaceId} onValueChange={setSelectedWorkspaceId}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((ws) => (
                <SelectItem key={ws.id} value={ws.id}>
                  {ws.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? "Edit" : "Preview"}
          </Button>
          
          <Button
            variant={isAINotesOpen ? "secondary" : "outline"}
            size="sm"
            className="gap-2 bg-transparent"
            onClick={() => {
                setAiContext(content)
                if (!isAINotesOpen) toggleAINotes()
            }}
          >
            <Sparkles className="h-4 w-4" />
            AI Assist
          </Button>

          <Button
            size="sm"
            className="gap-2"
            onClick={async () => {
              if (!title.trim()) return
              setIsSaving(true)
              try {
                const { knowledgeService } = await import("@/lib/api")
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
                
                // Refresh the knowledge list
                const updatedItems = await knowledgeService.getAll()
                const mappedItems = updatedItems.map((apiItem: any) => ({
                  ...apiItem,
                  id: String(apiItem.id),
                  workspaceId: apiItem.workspaceId ? String(apiItem.workspaceId) : currentWorkspace.id,
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

      {/* Toolbar */}
      {!isPreview && (
        <div className="flex items-center gap-1 py-1 border-b border-border px-2">
          {toolbarButtons.map((btn, idx) =>
            btn.type === "separator" ? (
              <Separator key={idx} orientation="vertical" className="h-6 mx-1" />
            ) : (
              <Button key={idx} variant="ghost" size="icon" className="h-7 w-7" onClick={btn.action} title={btn.label}>
                {btn.icon && <btn.icon className="h-4 w-4" />}
              </Button>
            ),
          )}
          <div className="flex-1" />
        </div>
      )}

      {/* Editor / Preview Layout */}
      <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-auto py-4 px-6">
            {isPreview ? (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-full resize-none border-none focus-visible:ring-0 font-mono text-sm leading-relaxed bg-transparent p-0"
                placeholder="Start writing in Markdown..."
              />
            )}
          </div>
      </div>
    </div>
  )
}
