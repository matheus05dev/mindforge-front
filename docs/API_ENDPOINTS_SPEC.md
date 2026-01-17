# Especificação Completa de Endpoints da API

Este documento detalha todos os endpoints que a API backend deve implementar para funcionar com o frontend MindForge.

## 📋 Convenções

- **Base URL:** `http://localhost:8080` (configurável via `NEXT_PUBLIC_API_URL`)
- **Content-Type:** `application/json` (exceto upload de arquivos)
- **Formato de Data:** ISO 8601 (`"2024-01-15"` ou `"2024-01-15T10:30:00Z"`)

---

## 🗂️ Workspaces

### Listar Workspaces
```
GET /api/workspaces
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Projetos",
    "description": "Workspace para projetos",
    "type": "PROJECT"
  }
]
```

### Buscar Workspace por ID
```
GET /api/workspaces/{id}
```

**Resposta:**
```json
{
  "id": 1,
  "name": "Projetos",
  "description": "Workspace para projetos",
  "type": "PROJECT"
}
```

### Criar Workspace
```
POST /api/workspaces
```

**Body:**
```json
{
  "name": "Novo Workspace",
  "description": "Descrição",
  "type": "PROJECT"
}
```

### Atualizar Workspace
```
PUT /api/workspaces/{id}
```

**Body:**
```json
{
  "name": "Workspace Atualizado",
  "description": "Nova descrição"
}
```

### Deletar Workspace
```
DELETE /api/workspaces/{id}
```

**Resposta:** `204 No Content`

---

## 📁 Projects

### Listar Projetos
```
GET /api/projects
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "API Backend",
    "description": "API RESTful",
    "workspaceId": 1,
    "githubRepo": "github.com/user/api-backend",
    "milestones": []
  }
]
```

### Buscar Projeto por ID
```
GET /api/projects/{id}
```

**Resposta:**
```json
{
  "id": 1,
  "name": "API Backend",
  "description": "API RESTful",
  "workspaceId": 1,
  "githubRepo": "github.com/user/api-backend",
  "milestones": [
    {
      "id": 1,
      "projectId": 1,
      "title": "MVP",
      "dueDate": "2024-02-15",
      "completed": false
    }
  ]
}
```

### Criar Projeto
```
POST /api/projects
```

**Body:**
```json
{
  "workspaceId": 1,
  "name": "Novo Projeto",
  "description": "Descrição do projeto"
}
```

### Atualizar Projeto
```
PUT /api/projects/{id}
```

**Body:**
```json
{
  "name": "Projeto Atualizado",
  "description": "Nova descrição"
}
```

### Deletar Projeto
```
DELETE /api/projects/{id}
```

### Vincular GitHub
```
POST /api/projects/{id}/link
```

**Body:**
```json
{
  "repoUrl": "https://github.com/user/repo"
}
```

---

## 🎯 Milestones

### Listar Milestones do Projeto
```
GET /api/projects/{projectId}/milestones
```

**Resposta:**
```json
[
  {
    "id": 1,
    "projectId": 1,
    "title": "MVP Completo",
    "description": "Primeira versão funcional",
    "dueDate": "2024-02-15",
    "completed": false
  }
]
```

### Criar Milestone
```
POST /api/projects/{projectId}/milestones
```

**Body:**
```json
{
  "title": "Novo Marco",
  "description": "Descrição do marco",
  "dueDate": "2024-03-01",
  "completed": false
}
```

### Buscar Milestone por ID
```
GET /api/projects/milestones/{id}
```

### Atualizar Milestone
```
PUT /api/projects/milestones/{id}
```

**Body:**
```json
{
  "title": "Marco Atualizado",
  "completed": true
}
```

### Deletar Milestone
```
DELETE /api/projects/milestones/{id}
```

---

## 📚 Studies - Subjects

### Listar Subjects
```
GET /api/studies/subjects
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Java",
    "description": "Linguagem de programação",
    "proficiencyLevel": "INTERMEDIATE",
    "professionalLevel": "PLENO",
    "studySessions": []
  }
]
```

### Buscar Subject por ID
```
GET /api/studies/subjects/{id}
```

### Criar Subject
```
POST /api/studies/subjects
```

**Body:**
```json
{
  "name": "TypeScript",
  "description": "Superset do JavaScript",
  "proficiencyLevel": "BEGINNER",
  "professionalLevel": "JUNIOR"
}
```

### Atualizar Subject
```
PUT /api/studies/subjects/{id}
```

### Deletar Subject
```
DELETE /api/studies/subjects/{id}
```

---

## 📖 Studies - Sessions

### Listar Sessions do Subject
```
GET /api/studies/subjects/{subjectId}/sessions
```

**Resposta:**
```json
[
  {
    "id": 1,
    "subjectId": 1,
    "startTime": "2024-01-15T10:30:00Z",
    "durationMinutes": 120,
    "notes": "Estudei Streams e Lambdas"
  }
]
```

### Criar Session
```
POST /api/studies/subjects/{subjectId}/sessions
```

**Body:**
```json
{
  "startTime": "2024-01-15T10:30:00Z",
  "durationMinutes": 120,
  "notes": "Notas da sessão"
}
```

### Buscar Session por ID
```
GET /api/studies/sessions/{id}
```

### Atualizar Session
```
PUT /api/studies/sessions/{id}
```

**Body:**
```json
{
  "durationMinutes": 150,
  "notes": "Notas atualizadas"
}
```

### Deletar Session
```
DELETE /api/studies/sessions/{id}
```

---

## 💡 Knowledge

### Listar Itens de Conhecimento
```
GET /api/knowledge
```

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Streams em Java",
    "content": "# Streams\n\nConteúdo...",
    "tags": ["java", "streams"]
  }
]
```

### Buscar Item por ID
```
GET /api/knowledge/{id}
```

### Criar Item
```
POST /api/knowledge
```

**Body:**
```json
{
  "title": "Novo Item",
  "content": "Conteúdo do item",
  "tags": ["tag1", "tag2"]
}
```

### Atualizar Item
```
PUT /api/knowledge/{id}
```

### Deletar Item
```
DELETE /api/knowledge/{id}
```

### Buscar por Tag
```
GET /api/knowledge/search?tag=java
```

---

## 📋 Kanban

### Obter Board Completo
```
GET /api/kanban/board
```

**Resposta:**
```json
{
  "columns": [
    {
      "id": 1,
      "name": "To Do",
      "position": 0,
      "tasks": [
        {
          "id": 1,
          "title": "Tarefa 1",
          "position": 0,
          "columnId": 1
        }
      ]
    }
  ]
}
```

### Listar Colunas
```
GET /api/kanban/columns
```

### Criar Coluna
```
POST /api/kanban/columns
```

**Body:**
```json
{
  "name": "Nova Coluna",
  "position": 1
}
```

### Atualizar Coluna
```
PUT /api/kanban/columns/{id}
```

### Deletar Coluna
```
DELETE /api/kanban/columns/{id}
```

### Listar Tasks da Coluna
```
GET /api/kanban/columns/{columnId}/tasks
```

### Criar Task
```
POST /api/kanban/columns/{columnId}/tasks
```

**Body:**
```json
{
  "title": "Nova Tarefa",
  "description": "Descrição",
  "position": 0,
  "projectId": 1
}
```

### Buscar Task por ID
```
GET /api/kanban/tasks/{id}
```

### Atualizar Task
```
PUT /api/kanban/tasks/{id}
```

### Deletar Task
```
DELETE /api/kanban/tasks/{id}
```

### Mover Task
```
POST /api/kanban/tasks/{taskId}/move/{columnId}
```

**Resposta:**
```json
{
  "id": 1,
  "title": "Tarefa",
  "columnId": 2,
  "position": 0
}
```

---

## 📄 Documents

### Upload de Arquivo
```
POST /api/documents/upload
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Arquivo (File)
- `projectId`: number (opcional)
- `kanbanTaskId`: number (opcional)
- `knowledgeItemId`: number (opcional)
- `studySessionId`: number (opcional)

**Resposta:**
```json
{
  "id": 1,
  "fileName": "documento.pdf",
  "fileType": "application/pdf",
  "downloadUri": "/api/documents/download/documento.pdf",
  "uploadDate": "2024-01-15T10:30:00Z"
}
```

### Download de Arquivo
```
GET /api/documents/download/{fileName}
```

**Resposta:** Binary file (Content-Type baseado no tipo de arquivo)

---

## 🤖 AI

### Analisar Código
```
POST /api/ai/analyze/code
```

**Body:**
```json
{
  "code": "function test() { return 1; }",
  "language": "javascript",
  "context": "Contexto adicional"
}
```

**Resposta:**
```json
{
  "id": 1,
  "role": "assistant",
  "content": "Análise do código...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Analisar Arquivo GitHub
```
POST /api/ai/analyze/github-file
```

**Body:**
```json
{
  "repoUrl": "https://github.com/user/repo",
  "filePath": "src/main.java",
  "context": "Contexto adicional"
}
```

### Análise Genérica
```
POST /api/ai/analyze/generic
```

**Body:**
```json
{
  "prompt": "Analise este conceito...",
  "mode": "MENTOR",
  "context": "Contexto adicional"
}
```

### Editar Item de Conhecimento
```
POST /api/ai/edit/knowledge-item/{itemId}
```

**Body:**
```json
{
  "instruction": "Adicione exemplos práticos",
  "mode": "ANALYST"
}
```

### Transcrever Documento
```
POST /api/ai/transcribe/document/{documentId}/to-item/{itemId}
```

**Body:**
```json
{
  "mode": "MENTOR"
}
```

### Revisar Portfólio
```
POST /api/ai/review/portfolio
```

**Body:**
```json
{
  "githubRepoUrl": "https://github.com/user/portfolio"
}
```

### Pensar Produto
```
POST /api/ai/think/product
```

**Body:**
```json
{
  "featureDescription": "Sistema de autenticação com JWT",
  "context": "Contexto adicional"
}
```

---

## 🔗 Integrations

### Conectar GitHub (OAuth)
```
GET /api/integrations/github/connect
```

**Resposta:** Redireciona para GitHub OAuth

### Callback GitHub OAuth
```
GET /api/integrations/github/callback?code={code}&state={state}
```

**Resposta:** Redireciona de volta para o frontend

---

## 📝 Notas Importantes

### Datas
- Use formato ISO 8601
- Exemplos: `"2024-01-15"` ou `"2024-01-15T10:30:00Z"`
- Timezone: UTC recomendado

### IDs
- Todos os IDs são números inteiros
- IDs são gerados pelo backend
- Não envie IDs ao criar novos recursos

### Relacionamentos
- `workspaceId`, `projectId`, `subjectId`, etc. são opcionais em alguns contextos
- Use `null` ou omita o campo se não houver relacionamento

### Arrays Vazios
- Retorne arrays vazios `[]` ao invés de `null`
- Facilita o tratamento no frontend

### Paginação (Futuro)
- Atualmente não há paginação
- Se implementar, use query params: `?page=1&size=20`

---

## ✅ Checklist de Compatibilidade

Use este checklist para verificar se sua API está compatível:

- [ ] Todos os endpoints GET retornam arrays ou objetos
- [ ] Todos os endpoints POST retornam o objeto criado
- [ ] Todos os endpoints PUT retornam o objeto atualizado
- [ ] DELETE retorna 204 No Content
- [ ] Erros retornam formato padronizado
- [ ] CORS configurado para localhost:3000
- [ ] Content-Type: application/json nos headers
- [ ] Datas em formato ISO 8601
- [ ] IDs são números inteiros
- [ ] Arrays vazios ao invés de null


