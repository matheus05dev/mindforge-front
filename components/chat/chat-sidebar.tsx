"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MessageSquare, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  title: string
  createdAt: string
}

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversation: Conversation
  onNewChat: () => void
  onSelectConversation: (conv: Conversation) => void
}

export function ChatSidebar({ conversations, activeConversation, onNewChat, onSelectConversation }: ChatSidebarProps) {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  const groupedConversations = conversations.reduce(
    (acc, conv) => {
      const date = new Date(conv.createdAt).toDateString()
      let group = "Older"
      if (date === today) group = "Today"
      else if (date === yesterday) group = "Yesterday"

      if (!acc[group]) acc[group] = []
      acc[group].push(conv)
      return acc
    },
    {} as Record<string, Conversation[]>,
  )

  return (
    <aside className="w-64 shrink-0 flex flex-col rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <Button onClick={onNewChat} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-9 h-9" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(groupedConversations).map(([group, convs]) => (
          <div key={group} className="mb-4">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground px-2 mb-2">{group}</h3>
            <div className="space-y-1">
              {convs.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer transition-colors",
                    activeConversation.id === conv.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent/50 text-foreground",
                  )}
                  onClick={() => onSelectConversation(conv)}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="text-sm truncate flex-1">{conv.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
