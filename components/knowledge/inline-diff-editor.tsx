"use client"

import React, { useState, useEffect } from "react"
import { Check, X, Edit2, RotateCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ContentChange {
  type: "ADD" | "REMOVE" | "REPLACE"
  startLine: number
  endLine: number
  originalContent: string
  proposedContent: string
  reason: string
}

interface InlineDiffEditorProps {
  originalContent: string
  changes: ContentChange[]
  selectedIndices: Set<number>
  editedContentMap: Map<number, string>
  onToggleChange: (index: number) => void
  onEditChange: (index: number, content: string) => void
  onApply: () => void
  onCancel: () => void
}

export function InlineDiffEditor({
  originalContent = "",
  changes = [],
  selectedIndices,
  editedContentMap,
  onToggleChange,
  onEditChange,
  onApply,
  onCancel,
}: InlineDiffEditorProps) {
  const [editingChangeIndex, setEditingChangeIndex] = useState<number | null>(null)
  const [localEditedContent, setLocalEditedContent] = useState<string>("")

  // Validate and sort changes
  const sortedChanges = React.useMemo(() => {
    if (!changes || !Array.isArray(changes)) return []
    return [...changes]
      .filter(c => c && typeof c.startLine === 'number')
      .sort((a, b) => (a.startLine || 0) - (b.startLine || 0))
  }, [changes])

  // Split content into lines for rendering context
  const contentLines = React.useMemo(() => originalContent.split("\n"), [originalContent])

  const handleEditStart = (index: number, content: string) => {
    setEditingChangeIndex(index)
    setLocalEditedContent(editedContentMap.get(index) ?? content)
  }

  const handleEditSave = (index: number) => {
    onEditChange(index, localEditedContent)
    setEditingChangeIndex(null)
    setLocalEditedContent("")
    if (!selectedIndices.has(index)) {
      onToggleChange(index)
    }
  }

  const handleSelectAll = () => {
    changes.forEach((_, idx) => {
      if (!selectedIndices.has(idx)) onToggleChange(idx)
    })
  }
  
  const handleDeselectAll = () => {
    selectedIndices.forEach(idx => onToggleChange(idx))
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-md border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            Revisão de Mudanças ({changes.length})
          </h3>
          <div className="flex gap-2 text-xs">
             <Button variant="ghost" size="sm" onClick={handleSelectAll} className="h-7 px-2">
               Selecionar Todas
             </Button>
             <Button variant="ghost" size="sm" onClick={handleDeselectAll} className="h-7 px-2">
               Limpar Seleção
             </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} className="h-8 hover:text-destructive">
            Cancelar
          </Button>
          <Button size="sm" onClick={onApply} disabled={selectedIndices.size === 0} className="h-8 gap-2">
            <Check className="h-4 w-4" />
            Aplicar Selecionadas ({selectedIndices.size})
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed">
        {renderContentWithDiffs()}
      </div>
    </div>
  )

  function renderContentWithDiffs() {
    // Safety check
    if (!contentLines.length && !sortedChanges.length) {
      return <div className="text-muted-foreground p-4">Nenhum conteúdo para exibir.</div>
    }

    const resultElements: JSX.Element[] = []
    let currentLine = 0

    sortedChanges.forEach((change, index) => {
      // Safe index access
      const sLine = change.startLine || 0
      const eLine = change.endLine || 0
      
      // Calculate 0-based indices (assuming backend sends 1-based)
      const changeStartZero = Math.max(0, sLine - 1)
      const changeEndZero = Math.max(0, eLine - 1)

      // Render context before
      // Ensure we don't slice backwards or out of bounds negatively
      if (currentLine < changeStartZero) {
        // Safe slice
        const end = Math.min(changeStartZero, contentLines.length)
        const textSegment = contentLines.slice(currentLine, end).join("\n")
        
        if (textSegment) {
          resultElements.push(
            <div key={`unchanged-${currentLine}`} className="text-muted-foreground whitespace-pre-wrap py-1">
              {textSegment}
            </div>
          )
        }
        // Update currentLine to where we left off
        currentLine = end
      }

      // Render the Change Block
      const isEditing = editingChangeIndex === index

      resultElements.push(
        <div key={`change-${index}`} className={cn(
          "my-4 border rounded-md overflow-hidden shrink-0", 
          change.type === "ADD" && "border-green-200 bg-green-50/30 dark:border-green-900/50 dark:bg-green-900/10",
          change.type === "REMOVE" && "border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-900/10",
          change.type === "REPLACE" && "border-yellow-200 bg-yellow-50/30 dark:border-yellow-900/50 dark:bg-yellow-900/10",
        )}>
          {/* Change Header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/50 text-xs">
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-1.5 py-0.5 rounded font-bold uppercase",
                change.type === "ADD" && "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300",
                change.type === "REMOVE" && "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300",
                change.type === "REPLACE" && "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
              )}>
                {change.type === "ADD" ? "+" : change.type === "REMOVE" ? "-" : "~"} {change.type}
              </span>
              <span className="text-muted-foreground truncate max-w-[300px]">
                {change.reason}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {!isEditing && change.type !== "REMOVE" && (
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditStart(index, editedContentMap.get(index) ?? change.proposedContent)}>
                   <Edit2 className="h-3 w-3" />
                 </Button>
              )}
              {selectedIndices.has(index) ? (
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30" onClick={() => onToggleChange(index)}>
                   <Check className="h-4 w-4 fill-current" />
                 </Button>
              ) : (
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onToggleChange(index)}>
                   <div className="h-3 w-3 border rounded-sm" />
                 </Button>
              )}
            </div>
          </div>

          {/* Change Content */}
          <div className="p-3">
             {isEditing ? (
               <div className="space-y-2">
                 <Textarea 
                   value={localEditedContent} 
                   onChange={(e) => setLocalEditedContent(e.target.value)}
                   className="font-mono text-sm min-h-[100px]"
                 />
                 <div className="flex justify-end gap-2">
                   <Button size="sm" variant="outline" onClick={() => setEditingChangeIndex(null)}>Cancelar</Button>
                   <Button size="sm" onClick={() => handleEditSave(index)}>Salvar Edição</Button>
                 </div>
               </div>
             ) : (
               <>
                 {change.type === "REPLACE" && (
                   <div className="mb-2 opacity-60 line-through decoration-red-500 decoration-2 select-none">
                     {change.originalContent}
                   </div>
                 )}
                 {change.type === "REMOVE" ? (
                    <div className="line-through decoration-red-500 decoration-2 opacity-70 select-none">
                      {change.originalContent}
                    </div>
                 ) : (
                    <div className="whitespace-pre-wrap">
                      {editedContentMap.has(index) ? (
                        <div className="relative">
                          {editedContentMap.get(index)}
                          <div className="absolute -top-2 -right-2 transform translate-x-full">
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">Editado</span>
                          </div>
                        </div>
                      ) : change.proposedContent}
                    </div>
                 )}
               </>
             )}
          </div>
        </div>
      )

      currentLine = Math.max(currentLine, changeEndZero + 1)
    })

    // 3. Render any remaining content
    if (currentLine < contentLines.length) {
      const remaining = contentLines.slice(currentLine).join("\n")
      if (remaining) {
        resultElements.push(
            <div key="unchanged-remaining" className="text-muted-foreground whitespace-pre-wrap py-1">
              {remaining}
            </div>
        )
      }
    }

    return resultElements
  }
}
