# API Client - MindForge Frontend

Este diretório contém o cliente HTTP e todos os serviços para comunicação com a API do MindForge.

## Estrutura

```
lib/api/
├── config.ts              # Configuração de endpoints e URL base
├── client.ts              # Cliente HTTP base (ApiClient)
├── types.ts               # Tipos TypeScript correspondentes aos DTOs da API
├── index.ts               # Exportações centralizadas
└── services/
    ├── workspaces.service.ts
    ├── projects.service.ts
    ├── studies.service.ts
    ├── knowledge.service.ts
    ├── kanban.service.ts
    ├── documents.service.ts
    └── ai.service.ts
```

## Configuração

1. Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. A URL padrão é `http://localhost:8080` se a variável não estiver definida.

## Uso Básico

### Importar serviços

```typescript
import { projectsService, aiService } from "@/lib/api"
```

### Exemplo: Listar projetos

```typescript
import { projectsService } from "@/lib/api"

async function loadProjects() {
  try {
    const projects = await projectsService.getAll()
    console.log(projects)
  } catch (error) {
    console.error("Erro ao carregar projetos:", error)
  }
}
```

### Exemplo: Criar projeto

```typescript
import { projectsService } from "@/lib/api"

async function createProject() {
  try {
    const project = await projectsService.create({
      workspaceId: 1,
      name: "Meu Projeto",
      description: "Descrição do projeto"
    })
    console.log("Projeto criado:", project)
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
  }
}
```

### Exemplo: Usar hook useApi

```typescript
"use client"

import { useApi } from "@/lib/hooks/use-api"
import { projectsService } from "@/lib/api"

export function ProjectsList() {
  const { data: projects, loading, error, execute } = useApi()

  const loadProjects = () => {
    execute(() => projectsService.getAll())
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error.message}</div>
  if (!projects) return <button onClick={loadProjects}>Carregar Projetos</button>

  return (
    <ul>
      {projects.map(project => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

## Serviços Disponíveis

### Workspaces
- `workspacesService.getAll()`
- `workspacesService.getById(id)`
- `workspacesService.create(data)`
- `workspacesService.update(id, data)`
- `workspacesService.delete(id)`

### Projects
- `projectsService.getAll()`
- `projectsService.getById(id)`
- `projectsService.create(data)`
- `projectsService.update(id, data)`
- `projectsService.delete(id)`
- `projectsService.linkGithub(id, repoUrl)`
- `projectsService.createMilestone(projectId, data)`
- `projectsService.updateMilestone(id, data)`
- `projectsService.deleteMilestone(id)`

### Studies
- `studiesService.getAllSubjects()`
- `studiesService.getSubjectById(id)`
- `studiesService.createSubject(data)`
- `studiesService.updateSubject(id, data)`
- `studiesService.deleteSubject(id)`
- `studiesService.createSession(subjectId, data)`
- `studiesService.updateSession(id, data)`
- `studiesService.deleteSession(id)`

### Knowledge
- `knowledgeService.getAll()`
- `knowledgeService.getById(id)`
- `knowledgeService.create(data)`
- `knowledgeService.update(id, data)`
- `knowledgeService.delete(id)`
- `knowledgeService.searchByTag(tag)`

### Kanban
- `kanbanService.getBoard()`
- `kanbanService.createColumn(data)`
- `kanbanService.updateColumn(id, data)`
- `kanbanService.deleteColumn(id)`
- `kanbanService.createTask(columnId, data)`
- `kanbanService.updateTask(id, data)`
- `kanbanService.moveTask(taskId, targetColumnId)`
- `kanbanService.deleteTask(id)`

### Documents
- `documentsService.upload(params)`
- `documentsService.download(fileName)`
- `documentsService.downloadAsUrl(fileName)`

### AI
- `aiService.analyzeCode(data)`
- `aiService.analyzeGithubFile(data)`
- `aiService.analyzeGeneric(data)`
- `aiService.editKnowledgeItem(itemId, instruction)`
- `aiService.transcribeDocument(documentId, itemId)`
- `aiService.reviewPortfolio(githubRepoUrl)`
- `aiService.thinkProduct(featureDescription)`

## Tratamento de Erros

Todos os serviços lançam `ApiError` em caso de falha:

```typescript
import type { ApiError } from "@/lib/api"

try {
  await projectsService.create(data)
} catch (error) {
  const apiError = error as ApiError
  console.error("Status:", apiError.status)
  console.error("Mensagem:", apiError.message)
  console.error("Erros de validação:", apiError.errors)
}
```

## Upload de Arquivos

```typescript
import { documentsService } from "@/lib/api"

const file = event.target.files[0]
const document = await documentsService.upload({
  file,
  projectId: 1,
  // ou kanbanTaskId, knowledgeItemId, studySessionId
})
```

## Download de Arquivos

```typescript
import { documentsService } from "@/lib/api"

// Opção 1: Obter Blob
const blob = await documentsService.download("documento.pdf")

// Opção 2: Obter URL para download
const url = await documentsService.downloadAsUrl("documento.pdf")
window.open(url, "_blank")
```

## Mapeamento de Personas

As personas do frontend precisam ser mapeadas para os modos da API:

```typescript
const personaToMode: Record<AIPersona, AIMode> = {
  mentor: "MENTOR",
  analista: "ANALYST",
  tutor_socratico: "SOCRATIC_TUTOR",
  debug_assistant: "DEBUG_ASSISTANT",
  recrutador_tecnico: "MENTOR", // Usa modo genérico
  planejador: "MENTOR", // Usa modo genérico
  geral: "MENTOR",
}
```

