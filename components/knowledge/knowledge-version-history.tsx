"use client"

import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { History, RotateCcw, ArrowLeft, Calendar, FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import type { KnowledgeVersion } from "@/lib/api/services/knowledge.service"

interface VersionHistoryProps {
  knowledgeId: number
  isOpen: boolean
  onClose: () => void
  onRollback: (version: KnowledgeVersion) => void
}

export function KnowledgeVersionHistory({
  knowledgeId,
  isOpen,
  onClose,
  onRollback
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<KnowledgeVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<KnowledgeVersion | null>(null)

  useEffect(() => {
    if (isOpen && knowledgeId) {
      loadVersions()
    }
  }, [isOpen, knowledgeId])

  const loadVersions = async () => {
    setLoading(true)
    try {
      const { knowledgeService } = await import("@/lib/api/services/knowledge.service")
      const data = await knowledgeService.getVersions(knowledgeId)
      setVersions(data)
    } catch (error) {
      console.error("Failed to load versions", error)
      toast.error("Erro ao carregar histórico de versões")
    } finally {
      setLoading(false)
    }
  }

  const handleRollback = () => {
    if (!selectedVersion) return
    
    if (confirm(`Tem certeza que deseja restaurar a versão de ${format(new Date(selectedVersion.createdAt), "dd/MM/yyyy HH:mm")}? O conteúdo atual será salvo como um backup.`)) {
      onRollback(selectedVersion)
      onClose()
    }
  }

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case "MANUAL_EDIT": return "Edição Manual"
      case "AGENT_PROPOSAL": return "IA Agent"
      case "ROLLBACK": return "Restauração"
      case "INITIAL_VERSION": return "Criação"
      default: return type
    }
  }

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "MANUAL_EDIT": return "secondary"
      case "AGENT_PROPOSAL": return "default" // primary
      case "ROLLBACK": return "destructive"
      case "INITIAL_VERSION": return "outline"
      default: return "secondary"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 gap-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Versões
          </SheetTitle>
          <SheetDescription>
            Visualize e restaure versões anteriores deste documento.
          </SheetDescription>
        </SheetHeader>

        {selectedVersion ? (
          <div className="flex-1 flex flex-col overflow-hidden">
             <div className="flex items-center justify-between p-4 border-b bg-muted/30">
               <Button variant="ghost" size="sm" onClick={() => setSelectedVersion(null)} className="gap-1">
                 <ArrowLeft className="h-4 w-4" /> Voltar
               </Button>
               <Button size="sm" variant="destructive" onClick={handleRollback} className="gap-2">
                 <RotateCcw className="h-4 w-4" /> Restaurar esta versão
               </Button>
             </div>
             
             <div className="p-6 space-y-6 overflow-y-auto">
               <div className="space-y-2">
                 <h3 className="font-semibold text-lg">{selectedVersion.title}</h3>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <Badge variant={getChangeTypeColor(selectedVersion.changeType) as any}>
                     {getChangeTypeLabel(selectedVersion.changeType)}
                   </Badge>
                   <span>•</span>
                   <span>{format(new Date(selectedVersion.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
                 </div>
                 {selectedVersion.changeSummary && (
                   <p className="text-sm bg-muted p-3 rounded-md italic">
                     "{selectedVersion.changeSummary}"
                   </p>
                 )}
               </div>

               <div className="space-y-2">
                 <h4 className="text-sm font-medium flex items-center gap-2">
                   <FileText className="h-4 w-4" /> Preview do Conteúdo
                 </h4>
                 <div className="p-4 border rounded-md bg-card font-mono text-xs whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                   {selectedVersion.fullContent || selectedVersion.contentPreview}
                 </div>
               </div>
             </div>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="text-center py-10 text-muted-foreground">Carregando histórico...</div>
              ) : versions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">Nenhuma versão anterior encontrada.</div>
              ) : (
                <div className="relative border-l border-border ml-2 space-y-6">
                  {versions.map((version) => (
                    <div key={version.id} className="ml-6 relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border border-primary bg-background group-hover:bg-primary transition-colors" />
                      
                      <div 
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer space-y-2"
                        onClick={() => setSelectedVersion(version)}
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant={getChangeTypeColor(version.changeType) as any} className="text-[10px] px-2 h-5">
                            {getChangeTypeLabel(version.changeType)}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(version.createdAt), "dd/MM/yy HH:mm")}
                          </span>
                        </div>
                        
                        <div className="text-sm font-medium leading-none">
                          {version.changeSummary || "Alteração sem descrição"}
                        </div>
                        
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {version.contentPreview}
                        </div>
                        
                        <div className="pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-primary flex items-center">
                            Ver detalhes <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}
