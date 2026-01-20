"use client"

import { useEffect, useState, useRef } from "react"
import { Send, Bot, User, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  createdAt?: string
}

interface KnowledgeChatSidebarProps {
  knowledgeId: number
  contextContent: string
}

export function KnowledgeChatSidebar({ knowledgeId, contextContent }: KnowledgeChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChatHistory()
  }, [knowledgeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const { knowledgeService } = await import("@/lib/api")
      const session = await knowledgeService.getChatSession(knowledgeId)
      if (session && session.messages) {
        setMessages(session.messages)
      }
    } catch (error) {
      console.error("Failed to load chat history", error)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now(), // temporary ID
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      const { knowledgeService } = await import("@/lib/api")
      const response = await knowledgeService.aiAssist({
        command: "ASK_AGENT",
        context: contextContent,
        instruction: newMessage.content,
        useContext: true,
        knowledgeId: knowledgeId
      })

      if (response.success) {
        const aiMessage: Message = {
            id: Date.now() + 1,
            role: "assistant",
            content: response.result
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        toast.error("Erro no agente: " + response.message)
      }
    } catch (error: any) {
      toast.error("Erro ao enviar mensagem: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full border-l border-border bg-muted/10 w-[350px]">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Bot className="h-4 w-4" />
           <span className="font-semibold text-sm">Chat com Agente</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={loadChatHistory}>
            <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
           {messages.length === 0 && (
               <div className="text-center text-muted-foreground text-sm py-8">
                   Nenhuma mensagem ainda. <br/>Pergunte algo sobre esta nota!
               </div>
           )}
           {messages.map((msg) => (
             <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
               <div className={cn(
                 "rounded-lg p-3 text-sm max-w-[85%]",
                 msg.role === "user" 
                   ? "bg-primary text-primary-foreground" 
                   : "bg-muted border border-border"
               )}>
                 {msg.content}
               </div>
             </div>
           ))}
           {isLoading && (
               <div className="flex justify-start">
                   <div className="bg-muted border border-border rounded-lg p-3">
                       <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                   </div>
               </div>
           )}
           <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                placeholder="Pergunte ao agente..."
                className="flex-1"
                disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
            </Button>
        </form>
      </div>
    </div>
  )
}
