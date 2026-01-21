"use client"

import { useState } from "react"
import { Check, X, FileText, Plus, Minus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { KnowledgeAgentProposal, ContentChange } from "@/lib/api/types/agent"

interface AgentProposalViewerProps {
  proposal: KnowledgeAgentProposal
  onApprove: (changeIndices: number[], approveAll: boolean) => Promise<void>
  onReject: () => void
}

export function AgentProposalViewer({ proposal, onApprove, onReject }: AgentProposalViewerProps) {
  const [selectedChanges, setSelectedChanges] = useState<Set<number>>(
    new Set(proposal.changes.map((_, i) => i))
  )
  const [isApplying, setIsApplying] = useState(false)

  const toggleChange = (index: number) => {
    const newSelected = new Set(selectedChanges)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedChanges(newSelected)
  }

  const selectAll = () => {
    setSelectedChanges(new Set(proposal.changes.map((_, i) => i)))
  }

  const deselectAll = () => {
    setSelectedChanges(new Set())
  }

  const handleApprove = async () => {
    if (selectedChanges.size === 0) {
      toast.error("Selecione pelo menos uma mudança para aplicar")
      return
    }

    setIsApplying(true)
    try {
      const approveAll = selectedChanges.size === proposal.changes.length
      await onApprove(Array.from(selectedChanges), approveAll)
      toast.success(`${selectedChanges.size} mudança(s) aplicada(s) com sucesso!`)
    } catch (error: any) {
      toast.error("Erro ao aplicar mudanças: " + error.message)
    } finally {
      setIsApplying(false)
    }
  }

  const getChangeIcon = (type: ContentChange['type']) => {
    switch (type) {
      case 'ADD':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'REMOVE':
        return <Minus className="h-4 w-4 text-red-500" />
      case 'REPLACE':
        return <RefreshCw className="h-4 w-4 text-blue-500" />
    }
  }

  const getChangeColor = (type: ContentChange['type']) => {
    switch (type) {
      case 'ADD':
        return 'border-green-500/50 bg-green-500/5'
      case 'REMOVE':
        return 'border-red-500/50 bg-red-500/5'
      case 'REPLACE':
        return 'border-blue-500/50 bg-blue-500/5'
    }
  }

  return (
    <div className="flex flex-col h-full border-l border-border bg-muted/10 w-[450px]">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="font-semibold text-sm">Proposta do Agente</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {proposal.changes.length} mudança(s)
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">{proposal.summary}</p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAll}
            className="flex-1 h-8 text-xs"
          >
            Selecionar Todas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deselectAll}
            className="flex-1 h-8 text-xs"
          >
            Desmarcar Todas
          </Button>
        </div>
      </div>

      {/* Changes List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {proposal.changes.map((change, index) => (
            <Card
              key={index}
              className={cn(
                "p-3 cursor-pointer transition-all border-2",
                selectedChanges.has(index)
                  ? getChangeColor(change.type)
                  : "border-border bg-background opacity-60"
              )}
              onClick={() => toggleChange(index)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getChangeIcon(change.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {change.type}
                    </Badge>
                    {selectedChanges.has(index) && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>

                  {change.reason && (
                    <p className="text-xs text-muted-foreground italic">
                      {change.reason}
                    </p>
                  )}

                  {/* Original Content (for REMOVE and REPLACE) */}
                  {change.originalContent && change.type !== 'ADD' && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-red-400">- Original:</p>
                      <pre className="text-xs bg-red-950/20 border border-red-900/30 rounded p-2 overflow-x-auto">
                        {change.originalContent}
                      </pre>
                    </div>
                  )}

                  {/* Proposed Content (for ADD and REPLACE) */}
                  {change.proposedContent && change.type !== 'REMOVE' && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-green-400">+ Proposto:</p>
                      <pre className="text-xs bg-green-950/20 border border-green-900/30 rounded p-2 overflow-x-auto">
                        {change.proposedContent}
                      </pre>
                    </div>
                  )}

                  {change.startLine !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      Linhas: {change.startLine} - {change.endLine}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={isApplying || selectedChanges.size === 0}
            className="flex-1 gap-2"
          >
            <Check className="h-4 w-4" />
            {isApplying ? "Aplicando..." : `Aplicar (${selectedChanges.size})`}
          </Button>
          <Button
            onClick={onReject}
            variant="outline"
            disabled={isApplying}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Rejeitar
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Clique nas mudanças para selecionar/desselecionar
        </p>
      </div>
    </div>
  )
}
