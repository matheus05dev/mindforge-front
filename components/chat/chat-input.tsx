"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic, Sparkles } from "lucide-react"

interface ChatInputProps {
  onSend: (content: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border p-4">
      <div className="relative flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your workspace..."
            className="min-h-[48px] max-h-[200px] resize-none pr-24 bg-background"
            disabled={isLoading}
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button type="submit" size="icon" className="h-12 w-12 shrink-0" disabled={!input.trim() || isLoading}>
          {isLoading ? <Sparkles className="h-5 w-5 animate-pulse" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        AI can make mistakes. Verify important information.
      </p>
    </form>
  )
}
