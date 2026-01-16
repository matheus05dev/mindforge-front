"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, Languages, PenTool, Image, Sparkles } from "lucide-react"

interface ContentToolsProps {
  onToolSelect: (tool: string) => void
}

const tools = [
  {
    id: "summarize",
    name: "Resumir Texto",
    description: "Criar um resumo conciso do conteúdo",
    icon: FileText,
  },
  {
    id: "translate",
    name: "Traduzir",
    description: "Traduzir entre idiomas",
    icon: Languages,
  },
  {
    id: "rewrite",
    name: "Reescrever",
    description: "Otimizar e melhorar o texto",
    icon: PenTool,
  },
  {
    id: "ocr",
    name: "Extrair Texto (OCR)",
    description: "Extrair texto de imagens",
    icon: Image,
  },
]

export function ContentTools({ onToolSelect }: ContentToolsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" title="Ferramentas de Conteúdo">
          <Sparkles className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Ferramentas de Conteúdo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <DropdownMenuItem
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className="flex items-start gap-3 cursor-pointer"
            >
              <Icon className="h-4 w-4 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium">{tool.name}</div>
                <div className="text-xs text-muted-foreground">{tool.description}</div>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

