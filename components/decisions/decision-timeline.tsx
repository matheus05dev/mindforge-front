"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  History, 
  ArrowRightCircle,
  Calendar,
  User,
  Tag,
  Edit
} from "lucide-react"

import { cn } from "@/lib/utils"
import { decisionsService } from "@/lib/api/services/decisions.service"
import { DecisionRecord, DecisionStatus } from "@/lib/api/types"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { DecisionWizard } from "./decision-wizard"

interface DecisionTimelineProps {
  projectId: number
  refreshTrigger?: number // Simple prop to trigger refetch
}

export function DecisionTimeline({ projectId, refreshTrigger }: DecisionTimelineProps) {
  const [decisions, setDecisions] = useState<DecisionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord | null>(null)

  useEffect(() => {
    loadDecisions()
  }, [projectId, refreshTrigger])

  async function loadDecisions() {
    try {
      setLoading(true)
      const data = await decisionsService.getByProject(projectId)
      setDecisions(data)
    } catch (error) {
      console.error("Failed to load decisions", error)
      try {
        if (typeof error === 'object' && error !== null) {
          console.error("Decision error details:", JSON.stringify(error, null, 2))
        }
      } catch (e) {
        console.error("Could not serialize decision error")
      }
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(decision: DecisionRecord) {
    setSelectedDecision(decision)
    setEditModalOpen(true)
  }

  function handleEditSuccess() {
    loadDecisions() // Reload decisions after edit
  }

  const getStatusIcon = (status: DecisionStatus) => {
    switch (status) {
      case "ACCEPTED": return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "REJECTED": return <XCircle className="h-5 w-5 text-red-500" />
      case "DEPRECATED": return <History className="h-5 w-5 text-gray-500" />
      case "SUPERSEDED": return <ArrowRightCircle className="h-5 w-5 text-orange-500" />
      default: return <AlertCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: DecisionStatus) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20"
      case "DEPRECATED": return "bg-gray-500/10 text-gray-500 border-gray-500/20 line-through decoration-gray-500/50"
      case "SUPERSEDED": return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando histórico...</div>
  }

  if (decisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
        <History className="h-10 w-10 mb-4 opacity-50" />
        <p>Nenhuma decisão registrada ainda.</p>
        <p className="text-sm mt-1">Registre decisões arquiteturais para criar uma memória do projeto.</p>
      </div>
    )
  }

  return (
    <div className="relative border-l-2 border-border ml-4 space-y-8 py-4">
      {decisions.map((decision) => (
        <div key={decision.id} className="relative pl-8">
          {/* Timeline Node */}
          <div className="absolute -left-[9px] top-6 h-4 w-4 rounded-full border-2 border-background bg-border ring-4 ring-background" />

          <Card className={cn("group transition-all hover:shadow-md", decision.status === 'DEPRECATED' && "opacity-75")}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(decision.status)}
                    <CardTitle className="text-lg font-semibold">{decision.title}</CardTitle>
                    <Badge variant="outline" className={cn("ml-2", getStatusColor(decision.status))}>
                      {decision.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(decision.createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                    {decision.author && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {decision.author}
                      </span>
                    )}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEdit(decision)}
                  >
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    ADR-{decision.id.toString().padStart(3, '0')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="text-sm font-medium">Ver detalhes da decisão</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                          <AlertCircle className="h-4 w-4" /> Contexto
                        </h4>
                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md leading-relaxed">
                          {decision.context}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                          <CheckCircle2 className="h-4 w-4" /> Decisão
                        </h4>
                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md leading-relaxed font-medium text-foreground/90">
                          {decision.decision}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                        <ArrowRightCircle className="h-4 w-4" /> Consequências
                      </h4>
                      <div className="text-sm text-muted-foreground bg-blue-500/5 p-3 rounded-md leading-relaxed border-l-2 border-blue-500/20">
                        {decision.consequences}
                      </div>
                    </div>

                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Edit Modal */}
      {selectedDecision && (
        <DecisionWizard
          projectId={projectId}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={handleEditSuccess}
          editMode={true}
          initialData={{
            id: selectedDecision.id,
            title: selectedDecision.title,
            status: selectedDecision.status,
            context: selectedDecision.context,
            decision: selectedDecision.decision,
            consequences: selectedDecision.consequences,
            author: selectedDecision.author,
          }}
        />
      )}
    </div>
  )
}
