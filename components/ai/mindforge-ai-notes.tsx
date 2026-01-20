"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Button } from "@/components/ui/button"
import { X, Bot, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"

export function MindforgeAINotes() {
  const { isAINotesOpen, toggleAINotes } = useStore()
  const [aiStyle, setAiStyle] = useState<"AGENT" | "THINKING">("AGENT")

  return (
    <>
      {/* Overlay Backdrop */}
      {isAINotesOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={toggleAINotes}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] flex flex-col bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out",
          isAINotesOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">MindForge AI</h2>
          </div>
          
          <div className="flex items-center gap-1 border border-border rounded-md p-1 bg-muted/20">
            <Button 
                variant={aiStyle === "AGENT" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setAiStyle("AGENT")}
                className="h-7 px-3 text-xs gap-1.5 transition-all"
            >
                <Bot className="h-3.5 w-3.5" />
                Agent
            </Button>
            <Button 
                variant={aiStyle === "THINKING" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setAiStyle("THINKING")}
                className="h-7 px-3 text-xs gap-1.5 transition-all"
            >
                <BrainCircuit className="h-3.5 w-3.5" />
                Thinking
            </Button>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleAINotes}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content (Chat Interface) */}
        <div className="flex-1 overflow-hidden p-0 bg-muted/30">
            {/* We pass the style prop to ChatInterface so it can adjust its behavior */}
            {/* Compact mode hides the inner sidebar and auto-loads the latest chat */}
            <ChatInterface aiStyle={aiStyle} compact={true} />
        </div>
      </div>
    </>
  )
}
