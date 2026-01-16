"use client"

import { FileText, FolderKanban, GraduationCap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      icon: FolderKanban,
      label: "Novo Projeto",
      color: "text-blue-500 bg-blue-500/10 hover:bg-blue-500/20",
      href: "/projetos/novo",
    },
    {
      icon: GraduationCap,
      label: "Iniciar Estudo",
      color: "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20",
      href: "/estudos/novo",
    },
    {
      icon: FileText,
      label: "Adicionar Nota",
      color: "text-green-500 bg-green-500/10 hover:bg-green-500/20",
      href: "/conhecimento/novo",
    },
    {
      icon: Sparkles,
      label: "Perguntar à IA",
      color: "text-primary bg-primary/10 hover:bg-primary/20",
      href: "/chat",
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Ações Rápidas</h3>
        <p className="text-sm text-muted-foreground">Atalhos para tarefas comuns</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.label} href={action.href}>
              <Button
                variant="ghost"
                className={cn("flex h-auto w-full flex-col items-center gap-2 p-4 transition-colors", action.color)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
