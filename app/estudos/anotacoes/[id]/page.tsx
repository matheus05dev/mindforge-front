"use client"

import type React from "react"
import { useParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, BookOpen, Tag, Edit, Trash2, Sparkles } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"

interface StudyNote {
  id: number
  subjectId: number
  subjectName: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  sessionId?: number
}

export default function NoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const noteId = Number(params.id)
  const [isEditing, setIsEditing] = useState(false)
  const [note, setNote] = useState<StudyNote | null>(null)

  // TODO: Carregar nota da API
  // useEffect(() => {
  //   // Carregar nota por ID da API
  // }, [noteId])

  if (!note) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Anotação não encontrada.</p>
          <Button onClick={() => router.push("/estudos/anotacoes")}>Voltar para Anotações</Button>
        </div>
      </AppShell>
    )
  }

  const formatContent = (content: string) => {
    // Dividir por blocos de código primeiro
    const parts = content.split(/(```[\s\S]*?```)/g)
    
    return parts.map((part, partIndex) => {
      // Se é um bloco de código
      if (part.startsWith("```")) {
        const codeMatch = part.match(/```(\w+)?\n([\s\S]*?)```/)
        if (codeMatch) {
          const [, language, code] = codeMatch
          return (
            <div key={partIndex} className="my-6">
              {language && (
                <div className="bg-muted/50 px-3 py-1 text-xs text-muted-foreground rounded-t-lg border-b border-border">
                  {language}
                </div>
              )}
              <pre className={`bg-muted rounded-lg ${language ? "rounded-t-none" : ""} p-4 overflow-x-auto border border-border`}>
                <code className="text-sm font-mono">{code.trim()}</code>
              </pre>
            </div>
          )
        }
      }
      
      // Processar linhas normais
      const lines = part.split("\n")
      const elements: React.ReactNode[] = []
      let currentList: string[] = []
      
      lines.forEach((line, lineIndex) => {
        const globalIndex = partIndex * 1000 + lineIndex
        
        // Headers
        if (line.startsWith("# ")) {
          if (currentList.length > 0) {
            elements.push(
              <ul key={`list-${globalIndex}`} className="my-3 ml-6 list-disc space-y-1">
                {currentList.map((item, i) => (
                  <li key={i} className="text-foreground">{item}</li>
                ))}
              </ul>
            )
            currentList = []
          }
          elements.push(
            <h1 key={globalIndex} className="text-3xl font-bold mt-8 mb-4 text-foreground">
              {line.substring(2)}
            </h1>
          )
          return
        }
        if (line.startsWith("## ")) {
          if (currentList.length > 0) {
            elements.push(
              <ul key={`list-${globalIndex}`} className="my-3 ml-6 list-disc space-y-1">
                {currentList.map((item, i) => (
                  <li key={i} className="text-foreground">{item}</li>
                ))}
              </ul>
            )
            currentList = []
          }
          elements.push(
            <h2 key={globalIndex} className="text-2xl font-semibold mt-6 mb-3 text-foreground">
              {line.substring(3)}
            </h2>
          )
          return
        }
        if (line.startsWith("### ")) {
          if (currentList.length > 0) {
            elements.push(
              <ul key={`list-${globalIndex}`} className="my-3 ml-6 list-disc space-y-1">
                {currentList.map((item, i) => (
                  <li key={i} className="text-foreground">{item}</li>
                ))}
              </ul>
            )
            currentList = []
          }
          elements.push(
            <h3 key={globalIndex} className="text-xl font-semibold mt-5 mb-2 text-foreground">
              {line.substring(4)}
            </h3>
          )
          return
        }
        
        // List items
        if (line.startsWith("- ") || line.startsWith("* ")) {
          currentList.push(line.substring(2))
          return
        }
        
        // Processar lista acumulada
        if (currentList.length > 0 && line.trim() === "") {
          elements.push(
            <ul key={`list-${globalIndex}`} className="my-3 ml-6 list-disc space-y-1">
              {currentList.map((item, i) => (
                <li key={i} className="text-foreground">{item}</li>
              ))}
            </ul>
          )
          currentList = []
        }
        
        // Empty lines
        if (line.trim() === "") {
          if (currentList.length === 0) {
            elements.push(<br key={globalIndex} />)
          }
          return
        }
        
        // Regular text with formatting
        if (line.trim() && currentList.length === 0) {
          let processedLine = line
          const components: React.ReactNode[] = []
          let lastIndex = 0
          
          // Process bold **text**
          const boldRegex = /\*\*(.+?)\*\*/g
          let match
          while ((match = boldRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              components.push(<span key={`text-${lastIndex}`}>{processedLine.substring(lastIndex, match.index)}</span>)
            }
            components.push(<strong key={`bold-${match.index}`} className="font-semibold">{match[1]}</strong>)
            lastIndex = match.index + match[0].length
          }
          if (lastIndex < processedLine.length) {
            components.push(<span key={`text-${lastIndex}`}>{processedLine.substring(lastIndex)}</span>)
          }
          
          // Process inline code `code`
          const codeRegex = /`([^`]+)`/g
          const finalComponents: React.ReactNode[] = []
          components.forEach((comp, compIndex) => {
            if (typeof comp === "object" && "props" in comp && typeof comp.props.children === "string") {
              const text = comp.props.children
              let textLastIndex = 0
              let codeMatch
              while ((codeMatch = codeRegex.exec(text)) !== null) {
                if (codeMatch.index > textLastIndex) {
                  finalComponents.push(
                    <span key={`text-${compIndex}-${textLastIndex}`}>
                      {text.substring(textLastIndex, codeMatch.index)}
                    </span>
                  )
                }
                finalComponents.push(
                  <code
                    key={`code-${compIndex}-${codeMatch.index}`}
                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                  >
                    {codeMatch[1]}
                  </code>
                )
                textLastIndex = codeMatch.index + codeMatch[0].length
              }
              if (textLastIndex < text.length) {
                finalComponents.push(
                  <span key={`text-${compIndex}-${textLastIndex}`}>
                    {text.substring(textLastIndex)}
                  </span>
                )
              } else if (textLastIndex === 0) {
                finalComponents.push(comp)
              }
            } else {
              finalComponents.push(comp)
            }
          })
          
          elements.push(
            <p key={globalIndex} className="mb-3 text-foreground leading-relaxed">
              {finalComponents.length > 0 ? finalComponents : line}
            </p>
          )
        }
      })
      
      // Adicionar lista final se houver
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-final-${partIndex}`} className="my-3 ml-6 list-disc space-y-1">
            {currentList.map((item, i) => (
              <li key={i} className="text-foreground">{item}</li>
            ))}
          </ul>
        )
      }
      
      return <div key={partIndex}>{elements}</div>
    })
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Button variant="ghost" size="sm" onClick={() => router.push("/estudos/anotacoes")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{note.subjectName}</span>
              </div>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">{note.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(parseISO(note.createdAt), "EEEE, d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              IA
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="prose prose-invert max-w-none">
            <div className="text-foreground leading-relaxed">
              {formatContent(note.content)}
            </div>
          </div>
        </div>

        {/* Session Info */}
        {note.sessionId && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Esta anotação está vinculada à sessão de estudo #{note.sessionId}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

