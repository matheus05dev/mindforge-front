"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AIPersona } from "@/lib/types"
import { GraduationCap, Search, HelpCircle, Bug, Briefcase, Calendar, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const personas: Array<{
  id: AIPersona
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}> = [
  {
    id: "geral",
    name: "Assistente Geral",
    description: "Assistência geral e versátil",
    icon: Sparkles,
    color: "text-primary",
  },
  {
    id: "mentor",
    name: "Mentor",
    description: "Orientação didática e pedagógica",
    icon: GraduationCap,
    color: "text-blue-500",
  },
  {
    id: "analista",
    name: "Analista Técnico",
    description: "Análise técnica profunda de código",
    icon: Search,
    color: "text-purple-500",
  },
  {
    id: "tutor_socratico",
    name: "Tutor Socrático",
    description: "Aprendizado guiado por perguntas",
    icon: HelpCircle,
    color: "text-green-500",
  },
  {
    id: "debug_assistant",
    name: "Assistente de Debug",
    description: "Identificação e resolução de problemas",
    icon: Bug,
    color: "text-red-500",
  },
  {
    id: "recrutador_tecnico",
    name: "Recrutador Técnico",
    description: "Análise de carreira e portfólio",
    icon: Briefcase,
    color: "text-amber-500",
  },
  {
    id: "planejador",
    name: "Planejador Estratégico",
    description: "Roadmaps e planejamento de projetos",
    icon: Calendar,
    color: "text-cyan-500",
  },
]

interface PersonaSelectorProps {
  selectedPersona: AIPersona
  onPersonaChange: (persona: AIPersona) => void
}

export function PersonaSelector({ selectedPersona, onPersonaChange }: PersonaSelectorProps) {
  const selected = personas.find((p) => p.id === selectedPersona) || personas[0]
  const Icon = selected.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon className={cn("h-4 w-4", selected.color)} />
          <span className="hidden sm:inline">{selected.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Selecione uma Persona</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {personas.map((persona) => {
          const PersonaIcon = persona.icon
          return (
            <DropdownMenuItem
              key={persona.id}
              onClick={() => onPersonaChange(persona.id)}
              className="flex items-start gap-3 cursor-pointer"
            >
              <PersonaIcon className={cn("h-4 w-4 mt-0.5", persona.color)} />
              <div className="flex-1">
                <div className="font-medium">{persona.name}</div>
                <div className="text-xs text-muted-foreground">{persona.description}</div>
              </div>
              {selectedPersona === persona.id && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

