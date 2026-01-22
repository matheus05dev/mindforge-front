"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Sparkles, Wand2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { decisionsService } from "@/lib/api/services/decisions.service"
import { DecisionRequest, DecisionStatus } from "@/lib/api/types"

const formSchema = z.object({
  title: z.string().min(3, "Título muito curto"),
  status: z.enum(["PROPOSED", "ACCEPTED", "REJECTED", "DEPRECATED", "SUPERSEDED"]),
  context: z.string().min(10, "Contexto muito curto"),
  decision: z.string().min(10, "Decisão muito curta"),
  consequences: z.string().min(10, "Consequências muito curtas"),
  author: z.string().default("Eu"),
})

interface DecisionWizardProps {
  projectId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editMode?: boolean
  initialData?: {
    id: number
    title: string
    status: DecisionStatus
    context: string
    decision: string
    consequences: string
    author?: string
  }
}

export function DecisionWizard({
  projectId,
  open,
  onOpenChange,
  onSuccess,
  editMode = false,
  initialData,
}: DecisionWizardProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editMode && initialData ? {
        title: initialData.title,
        status: initialData.status,
        context: initialData.context,
        decision: initialData.decision,
        consequences: initialData.consequences,
        author: initialData.author || "User",
    } : {
        title: "",
        status: "PROPOSED",
        context: "",
        decision: "",
        consequences: "",
        author: "User",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const decisionRequest: DecisionRequest = {
        projectId,
        title: values.title,
        status: values.status as DecisionStatus,
        context: values.context,
        decision: values.decision,
        consequences: values.consequences,
        tags: [],
        author: values.author,
      }
      
      if (editMode && initialData) {
        await decisionsService.update(projectId, initialData.id, decisionRequest)
        toast({
          title: "Decisão atualizada!",
          description: "As alterações foram salvas com sucesso.",
        })
      } else {
        await decisionsService.create(projectId, decisionRequest)
        toast({
          title: "Decisão registrada!",
          description: "A decisão foi salva com sucesso no histórico do projeto.",
        })
      }
      
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a decisão. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  async function generateDraft() {
    const currentContext = form.getValues("context")
    if (!currentContext || currentContext.length < 5) {
      toast({
        title: "Contexto necessário",
        description: "Descreva brevemente o problema no campo 'Contexto' para a IA gerar o resto.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const proposal = await decisionsService.propose(projectId, currentContext)
      
      form.setValue("title", proposal.title)
      form.setValue("decision", proposal.decision)
      form.setValue("consequences", proposal.consequences)
      // Opcional: Se a IA sugerir status, usar.
      
      toast({
        title: "Rascunho gerado ✨",
        description: "A IA preencheu os campos com base no contexto.",
      })
    } catch (error) {
      toast({
        title: "Erro na IA",
        description: "A IA não conseguiu gerar o rascunho agora.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2">
             <DialogTitle className="text-xl">{editMode ? "Editar Decisão (ADR)" : "Nova Decisão (ADR)"}</DialogTitle>
             {/* Badge or icon indicating AI Power */}
             {!editMode && <Sparkles className="h-4 w-4 text-purple-400" />}
          </div>
          <DialogDescription>
            {editMode 
              ? "Atualize os detalhes desta decisão arquitetural."
              : "Documente uma decisão arquitetural ou de produto para o histórico do projeto."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Migração para PostgreSQL" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="col-span-1">
                    <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="PROPOSED">Proposto</SelectItem>
                                <SelectItem value="ACCEPTED">Aceito</SelectItem>
                                <SelectItem value="REJECTED">Rejeitado</SelectItem>
                                <SelectItem value="DEPRECATED">Deprecado</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>O Contexto (Problema)</FormLabel>
                    {!editMode && (
                      <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 gap-1"
                          onClick={generateDraft}
                          disabled={isGenerating}
                      >
                          {isGenerating ? <Loader2 className="h-3 w-3 animate-spin"/> : <Wand2 className="h-3 w-3" />}
                          {isGenerating ? "Gerando..." : "Completar com IA"}
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea 
                        placeholder="Descreva o problema ou o motivo da discussão... (A IA pode usar isso para gerar o resto)" 
                        className="resize-none min-h-[80px]" 
                        {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Tente digitar o problema e clicar em "Completar com IA".
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="decision"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>A Decisão</FormLabel>
                    <FormControl>
                        <Textarea 
                            placeholder="O que foi decidido..." 
                            className="resize-none min-h-[120px] bg-muted/30" 
                            {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="consequences"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Consequências</FormLabel>
                    <FormControl>
                        <Textarea 
                            placeholder="Prós, contras e impactos..." 
                            className="resize-none min-h-[120px] bg-muted/30" 
                            {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {editMode ? "Atualizar Decisão" : "Salvar Decisão"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
