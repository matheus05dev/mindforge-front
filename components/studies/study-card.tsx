"use client"

import type { Study } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Play, MoreHorizontal, BookOpen, Target, TrendingUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface StudyCardProps {
  study: Study
  variant?: "grid" | "list"
}

const categoryColors: Record<string, string> = {
  Programming: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Architecture: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  DevOps: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Frontend: "bg-green-500/10 text-green-500 border-green-500/20",
  Database: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Backend: "bg-red-500/10 text-red-500 border-red-500/20",
  Programação: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Arquitetura: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

const proficiencyLabels: Record<string, string> = {
  iniciante: "Iniciante",
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
  especialista: "Especialista",
}

const proficiencyColors: Record<string, string> = {
  iniciante: "bg-gray-500/10 text-gray-500",
  basico: "bg-blue-500/10 text-blue-500",
  intermediario: "bg-yellow-500/10 text-yellow-500",
  avancado: "bg-orange-500/10 text-orange-500",
  especialista: "bg-purple-500/10 text-purple-500",
}

export function StudyCard({ study, variant = "grid" }: StudyCardProps) {
  if (variant === "list") {
    return (
      <div className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-all">
        <div className="rounded-md bg-primary/10 p-2.5">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{study.title}</h3>
            <Badge variant="outline" className={cn("text-xs", categoryColors[study.category])}>
              {study.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">{study.description}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1 min-w-[100px]">
            {study.subject && (
                 <Badge variant="outline" className={cn("text-xs", proficiencyColors[study.subject.proficiencyLevel])}>
                   <TrendingUp className="h-3 w-3 mr-1" />
                   {proficiencyLabels[study.subject.proficiencyLevel]}
                 </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {study.completedHours}h
            </span>
          </div>

          <Button size="sm" className="gap-2">
            <Play className="h-3.5 w-3.5" />
            Continue
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="group rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="outline" className={cn("text-xs", categoryColors[study.category])}>
            {study.category}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="font-semibold group-hover:text-primary transition-colors">{study.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{study.description}</p>
        
        {/* Subject e Proficiência */}
        {study.subject && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              {study.subject.name}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", proficiencyColors[study.subject.proficiencyLevel])}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {proficiencyLabels[study.subject.proficiencyLevel]}
            </Badge>
            {study.sessions && study.sessions.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {study.sessions.length} sessões
              </Badge>
            )}
          </div>
        )}
      </div>



      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {study.completedHours}h
          </span>
        </div>
        <Button size="sm" className="gap-2">
          <Play className="h-3.5 w-3.5" />
          Continue
        </Button>
      </div>
    </div>
  )
}
