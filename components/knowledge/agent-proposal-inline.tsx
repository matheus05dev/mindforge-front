"use client"

import { useState, useMemo } from "react"
import { Check, X, ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { KnowledgeAgentProposal, ContentChange } from "@/lib/api/types/agent"

interface AgentProposalInlineProps {
  proposal: KnowledgeAgentProposal
  originalContent: string
  onApprove: (changeIndices: number[], approveAll: boolean) => Promise<void>
  onReject: () => void
}

export function AgentProposalInline({ proposal, originalContent, onApprove, onReject }: AgentProposalInlineProps) {
  const [selectedChanges, setSelectedChanges] = useState<Set<number>>(
    new Set(proposal.changes.map((_, i) => i))
  )
  const [isApplying, setIsApplying] = useState(false)

  // Split content into lines for rendering
  const lines = useMemo(() => originalContent.split("\n"), [originalContent])

  // Map lines to changes
  // We create a map where key is line index (0-based) and value is the change that starts there
  // Note: API lines are likely 1-based, need to adjust
  const changeMap = useMemo(() => {
    const map = new Map<number, { change: ContentChange, index: number }>()
    proposal.changes.forEach((change, index) => {
        // Assuming startLine is 1-based, convert to 0-based
        const lineIndex = change.startLine - 1
        if (lineIndex >= 0) {
            map.set(lineIndex, { change, index })
        }
    })
    return map
  }, [proposal])

  const toggleChange = (index: number) => {
    const newSelected = new Set(selectedChanges)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedChanges(newSelected)
  }

  const handleApprove = async () => {
    setIsApplying(true)
    try {
      const approveAll = selectedChanges.size === proposal.changes.length
      await onApprove(Array.from(selectedChanges), approveAll)
    } finally {
      setIsApplying(false)
    }
  }

  const renderContent = () => {
    const elements = []
    let currentLine = 0
    
    while (currentLine < lines.length) {
        const changeInfo = changeMap.get(currentLine)
        
        if (changeInfo) {
            const { change, index } = changeInfo
            const isSelected = selectedChanges.has(index)
            
            // Render the Change Block
            elements.push(
                <div key={`change-${index}`} className={cn(
                    "my-4 border rounded-md overflow-hidden transition-all shadow-sm",
                    isSelected ? "ring-2 ring-primary/20 border-primary/50" : "border-muted opacity-80"
                )}>
                    {/* Header */}
                    <div className="bg-muted/50 p-2 flex items-center justify-between border-b text-xs">
                         <div className="flex items-center gap-2">
                             <Badge variant={isSelected ? "default" : "outline"} className={cn(
                                 "text-[10px] h-5",
                                 change.type === 'ADD' && "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
                                 change.type === 'REMOVE' && "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
                                 change.type === 'REPLACE' && "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                             )}>
                                {change.type}
                             </Badge>
                             <span className="text-muted-foreground font-medium">
                                {change.reason || "Sugestão de alteração"}
                             </span>
                         </div>
                         <div className="flex items-center gap-2">
                             <Button 
                                size="sm" 
                                variant={isSelected ? "secondary" : "ghost"} 
                                className="h-6 text-xs gap-1"
                                onClick={() => toggleChange(index)}
                             >
                                {isSelected ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                {isSelected ? "Ignorar" : "Aceitar"}
                             </Button>
                         </div>
                    </div>

                    {/* Diff Body */}
                    <div className="grid grid-cols-1 md:grid-cols-2 text-xs font-mono divide-y md:divide-y-0 md:divide-x">
                        {/* Original (Left) */}
                        <div className="bg-red-950/5 p-0 min-h-[30px] relative">
                             <div className="absolute top-0 right-0 p-1 text-[10px] text-red-500 font-bold opacity-50">ORIGINAL</div>
                             <div className="p-3 whitespace-pre-wrap text-red-900 dark:text-red-200 leading-relaxed">
                                {change.type === 'ADD' ? (
                                    <span className="text-muted-foreground italic opacity-50 select-none">Empty</span>
                                ) : (
                                    change.originalContent
                                )}
                             </div>
                        </div>

                         {/* Proposed (Right) */}
                        <div className="bg-green-950/5 p-0 min-h-[30px] relative">
                             <div className="absolute top-0 right-0 p-1 text-[10px] text-green-500 font-bold opacity-50">PROPOSED</div>
                             <div className="p-3 whitespace-pre-wrap text-green-900 dark:text-green-200 leading-relaxed">
                                {change.type === 'REMOVE' ? (
                                    <span className="text-muted-foreground italic opacity-50 select-none">Empty</span>
                                ) : (
                                    change.proposedContent
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            )

            // Skip lines that were part of this change
            // Calculate how many lines the original content took up
            // Note: If type is ADD, original lines count is 0 relative to text flow usually, but startLine anchors it.
            // If replace/remove, we skip (endLine - startLine + 1)
            
            if (change.type === 'ADD') {
                // ADD usually inserts BEFORE the line, so we don't consume the current line unless we want to displace it?
                // Logic: IDK exactly how the agent returns ADD. Assuming it means "Insert at startLine".
                // If we don't increment, the current line will be rendered AFTER this block.
            } else {
                 // REPLACE or REMOVE consumes lines
                 const linesToSkip = (change.endLine - change.startLine) + 1
                 currentLine += linesToSkip
                 continue // Jump to next iteration
            }
        }
        
        // Render normal line if we exist (and haven't skipped past end)
        if (currentLine < lines.length) {
            elements.push(
                <div key={`line-${currentLine}`} className="flex group hover:bg-muted/30 py-0.5 px-2">
                    <div className="w-8 text-right text-xs text-muted-foreground/30 select-none mr-4 font-mono">
                        {currentLine + 1}
                    </div>
                    <div className="flex-1 text-sm whitespace-pre-wrap font-mono text-muted-foreground/80">
                        {lines[currentLine]}
                    </div>
                </div>
            )
            currentLine++
        }
    }
    
    return elements
  }

  return (
    <div className="flex flex-col h-full bg-background/50">
        {/* Top Control Bar */}
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
             <div>
                 <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    Revisão de Sugestões
                 </h3>
                 <p className="text-xs text-muted-foreground mt-0.5">
                    {proposal.summary}
                 </p>
             </div>
             <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={onReject} disabled={isApplying}>
                     Cancelar
                 </Button>
                 <Button size="sm" onClick={handleApprove} disabled={isApplying || selectedChanges.size === 0}>
                     {isApplying ? "Aplicando..." : `Aplicar ${selectedChanges.size} alterações`}
                 </Button>
             </div>
        </div>

        {/* Diff Content */}
        <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto bg-card border rounded-lg shadow-sm min-h-[500px] p-6">
                {renderContent()}
            </div>
            
            {/* End Spacer */}
            <div className="h-20" /> 
        </ScrollArea>
    </div>
  )
}
