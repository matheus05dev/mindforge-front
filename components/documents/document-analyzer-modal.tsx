"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, X, FileText, Send } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Document } from "@/lib/api/types"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

interface DocumentAnalyzerModalProps {
  document: Document | null
  isOpen: boolean
  onClose: () => void
}

export function DocumentAnalyzerModal({ document, isOpen, onClose }: DocumentAnalyzerModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Reset messages when document changes
  useEffect(() => {
    if (document) {
      setMessages([])
      setInput("")
    }
  }, [document])

  const handleSend = async () => {
    if (!input.trim() || !document || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const { aiService } = await import("@/lib/api")
      
      // Fetch the document file from backend
      const fileUrl = document.downloadUri?.startsWith('http')
        ? document.downloadUri
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${document.downloadUri}`
        
      const fileResponse = await fetch(fileUrl)
      const fileBlob = await fileResponse.blob()
      const file = new File([fileBlob], document.fileName || 'document', { type: document.fileType || 'application/octet-stream' })

      // Send to AI analysis endpoint
      const response = await aiService.analyzeDocument({
        file,
        prompt: input,
        provider: undefined, // Use default provider
      })

      const extractedContent =
        response.answer?.markdown || response.content || "Análise concluída."

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: extractedContent,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Erro ao analisar documento:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao analisar o documento. Verifique se a API está rodando.",
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-muted/20 shrink-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-semibold tracking-tight">Analisar Documento</DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
                  {document?.originalFileName || document?.fileName || "Carregando..."}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area - Native Scrolling */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 bg-gradient-to-b from-background to-muted/5 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          <div className="space-y-6 py-8 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <div className="relative rounded-2xl bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent p-6 ring-1 ring-border/50">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-bold tracking-tight">Pronto para analisar</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Faça perguntas sobre o conteúdo do documento e receba respostas precisas com citações e contexto.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    {message.role === "assistant" && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}
                    
                    <div
                      className={`relative px-5 py-4 shadow-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[75%]"
                          : "bg-muted/50 border border-border/50 text-foreground rounded-2xl rounded-tl-sm max-w-[90%] md:max-w-[85%]"
                      }`}
                    >
                      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words leading-relaxed whitespace-pre-wrap">
                         {message.content}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                        <div className="h-3 w-3 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-4 animate-in fade-in duration-300">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-muted/50 px-5 py-4 border border-border/50 shadow-sm">
                      <div className="flex gap-1.5 items-center h-6">
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-[bounce_1s_infinite_0ms]" />
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-[bounce_1s_infinite_200ms]" />
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-[bounce_1s_infinite_400ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/50 shrink-0 z-10">
          <div className="max-w-4xl mx-auto flex gap-3 relative">
            <div className="relative flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Faça uma pergunta sobre o documento..."
                className="min-h-[56px] w-full resize-none rounded-xl border-border/50 bg-muted/30 px-4 py-4 pr-12 text-sm shadow-sm transition-all focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/30"
                disabled={isLoading}
              />
              <div className="absolute right-3 bottom-3 text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider select-none pointer-events-none">
                Enter
              </div>
            </div>
            
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[56px] w-[56px] shrink-0 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
