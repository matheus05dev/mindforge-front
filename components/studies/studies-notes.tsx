"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, BookOpen, Calendar, Tag, FileText, Sparkles } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

// Mock data para visualização
const mockNotes: StudyNote[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: "Java",
    title: "Streams e Lambdas",
    content: `# Streams e Lambdas em Java

## O que são Streams?
Streams são uma abstração para processar coleções de forma funcional e declarativa.

## Exemplos práticos:

\`\`\`java
List<String> names = Arrays.asList("João", "Maria", "Pedro");

// Filtrar nomes que começam com 'J'
List<String> filtered = names.stream()
    .filter(name -> name.startsWith("J"))
    .collect(Collectors.toList());
\`\`\`

## Lambdas
Lambdas permitem escrever código mais conciso e funcional.`,
    tags: ["java", "streams", "lambdas", "functional"],
    createdAt: "2024-01-15T10:30:00",
    sessionId: 1,
  },
  {
    id: 2,
    subjectId: 1,
    subjectName: "Java",
    title: "Collections: HashMap vs ArrayList",
    content: `# Diferenças entre HashMap e ArrayList

## HashMap
- Estrutura de dados baseada em chave-valor
- Acesso O(1) em média
- Não mantém ordem de inserção (a menos que use LinkedHashMap)

## ArrayList
- Lista dinâmica baseada em array
- Acesso O(1) por índice
- Mantém ordem de inserção

## Quando usar cada um?
- **HashMap**: Quando precisa buscar por chave rapidamente
- **ArrayList**: Quando precisa manter ordem e acessar por índice`,
    tags: ["java", "collections", "hashmap", "arraylist"],
    createdAt: "2024-01-16T14:15:00",
    sessionId: 2,
  },
  {
    id: 3,
    subjectId: 2,
    subjectName: "TypeScript",
    title: "Generics e Utility Types",
    content: `# TypeScript: Generics e Utility Types

## Generics
Permitem criar componentes reutilizáveis que funcionam com múltiplos tipos.

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}
\`\`\`

## Utility Types

### Partial<T>
Torna todas as propriedades opcionais.

### Pick<T, K>
Seleciona propriedades específicas de um tipo.

### Omit<T, K>
Remove propriedades específicas de um tipo.`,
    tags: ["typescript", "generics", "utility-types", "advanced"],
    createdAt: "2024-01-17T09:45:00",
    sessionId: 3,
  },
  {
    id: 4,
    subjectId: 2,
    subjectName: "TypeScript",
    title: "Conditional Types",
    content: `# Conditional Types em TypeScript

Conditional types permitem criar tipos que dependem de condições.

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Example = NonNullable<string | null>; // string
\`\`\`

## Aplicações práticas
- Criar tipos mais seguros
- Inferir tipos baseados em condições
- Criar utilitários de tipo avançados`,
    tags: ["typescript", "conditional-types", "advanced"],
    createdAt: "2024-01-18T11:20:00",
  },
]

export function StudiesNotes() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Coletar todas as tags únicas
  const allTags = Array.from(new Set(mockNotes.flatMap((note) => note.tags)))

  // Filtrar notas
  const filteredNotes = mockNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || note.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar anotações por título, conteúdo ou assunto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Anotação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Anotação</DialogTitle>
              <DialogDescription>
                Crie uma nova anotação para seus estudos. Você pode usar Markdown para formatação.
              </DialogDescription>
            </DialogHeader>
            <NoteForm onSuccess={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrar por tag:</span>
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            Todas
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      )}

      {/* Lista de Notas */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-border bg-card">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedTag
              ? "Nenhuma anotação encontrada com os filtros aplicados."
              : "Nenhuma anotação criada ainda."}
          </p>
          {!searchQuery && !selectedTag && (
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeira Anotação
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => router.push(`/estudos/anotacoes/${note.id}`)}
              className="group rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{note.subjectName}</span>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {note.title}
                  </h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{note.content}</p>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(parseISO(note.createdAt), "d MMM yyyy", { locale: ptBR })}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/estudos/anotacoes/${note.id}`)
                  }}
                >
                  Ver mais
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NoteForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria a integração com a API
    console.log("Criar nota:", { title, content, tags: tags.split(",").map((t) => t.trim()) })
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Streams e Lambdas"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Use Markdown para formatação..."
          rows={10}
          required
        />
        <p className="text-xs text-muted-foreground">
          Suporte a Markdown: **negrito**, *itálico*, `código`, etc.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Ex: java, streams, lambdas"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Criar Anotação</Button>
      </div>
    </form>
  )
}
