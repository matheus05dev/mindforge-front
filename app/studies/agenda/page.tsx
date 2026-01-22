"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Construction } from "lucide-react"

export default function PlaceholderPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center space-y-4">
        <div className="p-4 bg-muted/20 rounded-full">
            <Construction className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Agenda de Estudos</h1>
        <p className="text-muted-foreground max-w-sm">
           Em breve você poderá planejar sua semana de estudos aqui.
        </p>
      </div>
    </AppShell>
  )
}
