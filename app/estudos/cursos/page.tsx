"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { SubjectsList } from "@/components/studies/subjects-list"
import { SubjectForm } from "@/components/studies/subject-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CursosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Meus Estudos</h1>
            <p className="text-muted-foreground">Gerencie seus estudos e acompanhe seus níveis de proficiência.</p>
          </div>
          <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Estudo
          </Button>
        </div>

        <SubjectsList />
        <SubjectForm open={isFormOpen} onOpenChange={setIsFormOpen} onSuccess={() => setIsFormOpen(false)} />
      </div>
    </AppShell>
  )
}

