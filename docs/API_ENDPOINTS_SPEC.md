# Especificação de Endpoints da API

> Documentação técnica detalhada dos contratos de API para integração Backend-Frontend.

## 📋 Protocolos e Convenções

- **Protocolo**: REST
- **Base URL**: `http://localhost:8080` (Desenvolvimento)
- **Content-Type Padrão**: `application/json`
- **Autenticação**: OAuth2 (GitHub) / Bearer Token (Futuro)
- **Formato de Data**: ISO 8601 (`YYYY-MM-DDThh:mm:ssZ`)

---

## 🏗️ Core (Workspaces & Projects)

### Workspaces

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/workspaces` | Lista todos os workspaces disponíveis. |
| `GET` | `/api/workspaces/{id}` | Detalhes de um workspace específico. |
| `POST` | `/api/workspaces` | Cria um novo workspace. |
| `PUT` | `/api/workspaces/{id}` | Atualiza um workspace. |
| `DELETE` | `/api/workspaces/{id}` | Remove um workspace (Soft delete se aplicável). |

**Payload de Criação:**
```json
{
  "name": "Nome do Workspace",
  "description": "Descrição opcional",
  "type": "PROJECT"
}
```

### Projects

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/projects` | Lista todos os projetos. |
| `GET` | `/api/projects/{id}` | Busca projeto por ID com milestones. |
| `POST` | `/api/projects` | Cria novo projeto vinculado a um workspace. |
| `PUT` | `/api/projects/{id}` | Atualiza metadados do projeto. |
| `DELETE` | `/api/projects/{id}` | Remove projeto. |
| `POST` | `/api/projects/{id}/link` | Vincula repositório GitHub. |

**Payload de Criação:**
```json
{
  "workspaceId": 1,
  "name": "MindForge API",
  "description": "Backend services",
  "githubRepo": "username/repo"
}
```

---

## 📚 Módulo de Estudos (Gamification)

### Subjects (Matérias)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/studies/subjects` | Lista matérias cadastradas. |
| `POST` | `/api/studies/subjects` | Cadastra nova matéria. |

**Níveis de Proficiência:** `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
**Níveis Profissionais:** `JUNIOR`, `PLENO`, `SENIOR`

### Study Sessions

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/studies/subjects/{id}/sessions` | Histórico de sessões de uma matéria. |
| `POST` | `/api/studies/subjects/{id}/sessions` | Registra nova sessão de estudo (XP). |

---

## 🧠 Base de Conhecimento (Knowledge)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/knowledge` | Lista todos itens de conhecimento. |
| `GET` | `/api/knowledge/{id}` | Busca artigo completo. |
| `POST` | `/api/knowledge` | Cria novo artigo Markdown. |
| `GET` | `/api/knowledge/search?tag={tag}` | Busca por tags. |

---

## 🤖 Inteligência Artificial (Agentic)

Endpoints acionados pelos Agentes para análise e geração de conteúdo.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/ai/analyze/code` | Envia snippet para análise técnica. |
| `POST` | `/api/ai/analyze/github-file` | Analisa arquivo remoto do GitHub. |
| `POST` | `/api/ai/edit/knowledge-item/{id}` | Solicita refatoração/edição em um artigo. |
| `POST` | `/api/ai/think/product` | Agente de Produto: Brainstorming de features. |

**Exemplo de Payload (Analyze):**
```json
{
  "code": "function example() { ... }",
  "language": "typescript",
  "context": "Verificar complexidade ciclomática"
}
```

---

## 📋 Kanban

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/kanban/board` | Retorna board completo (Colunas + Tasks). |
| `POST` | `/api/kanban/tasks` | Cria nova tarefa. |
| `POST` | `/api/kanban/tasks/{id}/move/{colId}` | Move tarefa entre colunas. |

---

## 📄 Gerenciamento de Arquivos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/documents/upload` | Upload Multipart/Form-Data. |
| `GET` | `/api/documents/download/{name}` | Download de arquivo. |
