"use client"

import type React from "react"
import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import { MindforgeAINotes } from "@/components/ai/mindforge-ai-notes"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className={cn("flex-1 overflow-auto p-6")}>{children}</main>
      </div>
      <MindforgeAINotes />
    </div>
  )
}
