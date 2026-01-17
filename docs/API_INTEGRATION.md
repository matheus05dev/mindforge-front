# Documentação de Integração - Frontend com API

Esta documentação descreve tudo que é necessário para conectar o frontend MindForge com a API backend.

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Variáveis de Ambiente](#variáveis-de-ambiente)
3. [Estrutura de Endpoints](#estrutura-de-endpoints)
4. [Estrutura de Dados (DTOs)](#estrutura-de-dados-dtos)
5. [Autenticação](#autenticação)
6. [CORS](#cors)
7. [Formato de Requisições e Respostas](#formato-de-requisições-e-respostas)
8. [Tratamento de Erros](#tratamento-de-erros)
9. [Testando a Conexão](#testando-a-conexão)

---

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend:

```env
# URL base da API
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Importante:**
- A variável deve começar com `NEXT_PUBLIC_` para ser acessível no cliente
- Se não for definida, o padrão é `http://localhost:8080`
- Para produção, use a URL do seu servidor: `https://api.seudominio.com`

### 2. Estrutura de Código

O frontend já está configurado para usar a API através de:
- `lib/api/config.ts` - Configuração de endpoints
- `lib/api/client.ts` - Cliente HTTP base
- `lib/api/types.ts` - Tipos TypeScript
- `lib/api/services/*.ts` - Serviços específicos

---

## 🌐 Variáveis de Ambiente

### Frontend (`.env.local`)

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080

# Opcional: Se a API usar autenticação JWT
# NEXT_PUBLIC_JWT_SECRET=your-secret-key
```

### Backend (Configuração Esperada)

A API deve estar configurada para aceitar requisições do frontend:

```properties
# Exemplo para Spring Boot
server.port=8080
cors.allowed-origins=http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
```

---

## 📡 Estrutura de Endpoints

A API deve implementar os seguintes endpoints:

### Workspaces

```
GET    /api/workspaces                    # Listar todos
GET    /api/workspaces/{id}               # Buscar por ID
POST   /api/workspaces                    # Criar
PUT    /api/workspaces/{id}               # Atualizar
DELETE /api/workspaces/{id}               # Deletar
```

### Projects

```
GET    /api/projects                      # Listar todos
GET    /api/projects/{id}                 # Buscar por ID
POST   /api/projects                      # Criar
PUT    /api/projects/{id}                 # Atualizar
DELETE /api/projects/{id}                 # Deletar
POST   /api/projects/{id}/link            # Vincular GitHub
```

### Milestones

```
GET    /api/projects/{projectId}/milestones           # Listar milestones do projeto
POST   /api/projects/{projectId}/milestones           # Criar milestone
GET    /api/projects/milestones/{id}                 # Buscar milestone por ID
PUT    /api/projects/milestones/{id}                  # Atualizar milestone
DELETE /api/projects/milestones/{id}                  # Deletar milestone
```

### Studies - Subjects

```
GET    /api/studies/subjects              # Listar todos
GET    /api/studies/subjects/{id}         # Buscar por ID
POST   /api/studies/subjects              # Criar
PUT    /api/studies/subjects/{id}         # Atualizar
DELETE /api/studies/subjects/{id}         # Deletar
```

### Studies - Sessions

```
GET    /api/studies/subjects/{subjectId}/sessions     # Listar sessions do subject
POST   /api/studies/subjects/{subjectId}/sessions     # Criar session
GET    /api/studies/sessions/{id}                    # Buscar session por ID
PUT    /api/studies/sessions/{id}                    # Atualizar session
DELETE /api/studies/sessions/{id}                    # Deletar session
```

### Knowledge

```
GET    /api/knowledge                     # Listar todos
GET    /api/knowledge/{id}                # Buscar por ID
POST   /api/knowledge                     # Criar
PUT    /api/knowledge/{id}                # Atualizar
DELETE /api/knowledge/{id}                # Deletar
GET    /api/knowledge/search?tag={tag}   # Buscar por tag
```

### Kanban

```
GET    /api/kanban/board                  # Obter board completo
GET    /api/kanban/columns                # Listar colunas
GET    /api/kanban/columns/{id}           # Buscar coluna por ID
POST   /api/kanban/columns                # Criar coluna
PUT    /api/kanban/columns/{id}           # Atualizar coluna
DELETE /api/kanban/columns/{id}          # Deletar coluna
GET    /api/kanban/columns/{columnId}/tasks           # Listar tasks da coluna
POST   /api/kanban/columns/{columnId}/tasks           # Criar task
GET    /api/kanban/tasks/{id}            # Buscar task por ID
PUT    /api/kanban/tasks/{id}            # Atualizar task
DELETE /api/kanban/tasks/{id}           # Deletar task
POST   /api/kanban/tasks/{taskId}/move/{columnId}    # Mover task
```

### Documents

```
POST   /api/documents/upload              # Upload de arquivo
GET    /api/documents/download/{fileName}  # Download de arquivo
```

### AI

```
POST   /api/ai/analyze/code               # Analisar código
POST   /api/ai/analyze/github-file        # Analisar arquivo GitHub
POST   /api/ai/analyze/generic            # Análise genérica
POST   /api/ai/edit/knowledge-item/{itemId}           # Editar item de conhecimento
POST   /api/ai/transcribe/document/{documentId}/to-item/{itemId}  # Transcrever documento
POST   /api/ai/review/portfolio           # Revisar portfólio
POST   /api/ai/think/product              # Pensar produto
```

### Integrations

```
GET    /api/integrations/github/connect   # Conectar GitHub (OAuth)
GET    /api/integrations/github/callback # Callback OAuth GitHub
```

---

## 📦 Estrutura de Dados (DTOs)

### Workspace

```typescript
interface Workspace {
  id: number
  name: string
  description?: string
  type: "PROJECT" | "STUDY" | "GENERIC"
}
```

**Exemplo de Requisição POST:**
```json
{
  "name": "Meu Workspace",
  "description": "Workspace para projetos pessoais",
  "type": "PROJECT"
}
```

### Project

```typescript
interface Project {
  id: number
  name: string
  description?: string
  documents?: Document[]
  workspaceId?: number
  githubRepo?: string
  milestones?: Milestone[]
}
```

**Exemplo de Requisição POST:**
```json
{
  "workspaceId": 1,
  "name": "API Backend",
  "description": "API RESTful para gerenciamento",
  "githubRepo": "github.com/user/api-backend"
}
```

### Milestone

```typescript
interface Milestone {
  id: number
  projectId: number
  title: string
  description?: string
  dueDate?: string  // ISO 8601: "2024-01-15" ou "2024-01-15T10:30:00Z"
  completed: boolean
}
```

**Exemplo de Requisição POST:**
```json
{
  "title": "MVP Completo",
  "description": "Primeira versão funcional",
  "dueDate": "2024-02-15",
  "completed": false
}
```

### Subject

```typescript
interface Subject {
  id: number
  name: string
  description?: string
  proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  professionalLevel: "JUNIOR" | "PLENO" | "SENIOR"
  studySessions?: StudySession[]
}
```

**Exemplo de Requisição POST:**
```json
{
  "name": "Java",
  "description": "Linguagem de programação orientada a objetos",
  "proficiencyLevel": "INTERMEDIATE",
  "professionalLevel": "PLENO"
}
```

### StudySession

```typescript
interface StudySession {
  id: number
  subjectId: number
  subjectName?: string
  startTime: string  // ISO 8601: "2024-01-15T10:30:00Z"
  durationMinutes: number
  notes?: string
  documents?: Document[]
}
```

**Exemplo de Requisição POST:**
```json
{
  "startTime": "2024-01-15T10:30:00Z",
  "durationMinutes": 120,
  "notes": "Estudei Streams e Lambdas"
}
```

### KnowledgeItem

```typescript
interface KnowledgeItem {
  id: number
  title: string
  content: string
  tags: string[]
  documents?: Document[]
}
```

**Exemplo de Requisição POST:**
```json
{
  "title": "Streams em Java",
  "content": "# Streams\n\nStreams são...",
  "tags": ["java", "streams", "functional"]
}
```

### KanbanColumn

```typescript
interface KanbanColumn {
  id: number
  name: string
  position: number
  tasks: KanbanTask[]
}
```

**Exemplo de Requisição POST:**
```json
{
  "name": "Em Progresso",
  "position": 1
}
```

### KanbanTask

```typescript
interface KanbanTask {
  id: number
  title: string
  description?: string
  position: number
  columnId: number
  subjectId?: number
  subjectName?: string
  projectId?: number
  projectName?: string
  documents?: Document[]
}
```

**Exemplo de Requisição POST:**
```json
{
  "title": "Implementar autenticação",
  "description": "Sistema de login com JWT",
  "position": 0,
  "columnId": 1,
  "projectId": 1
}
```

### Document

```typescript
interface Document {
  id: number
  fileName: string
  fileType: string
  downloadUri: string
  uploadDate: string  // ISO 8601
}
```

---

## 🔐 Autenticação

### Status Atual

**⚠️ IMPORTANTE:** O frontend atualmente **NÃO implementa autenticação JWT**. O sistema está preparado para usar apenas OAuth do GitHub.

### OAuth GitHub

O frontend redireciona para:
```
GET /api/integrations/github/connect
```

E espera o callback em:
```
GET /api/integrations/github/callback
```

### Se Implementar JWT no Futuro

Se você quiser adicionar autenticação JWT, será necessário:

1. **Modificar `lib/api/client.ts`:**
```typescript
private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token') // ou cookie
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }
  // ... resto do código
}
```

2. **Adicionar endpoints de autenticação:**
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
```

---

## 🌍 CORS

A API backend **DEVE** estar configurada para aceitar requisições do frontend.

### Configuração CORS Esperada

**Spring Boot (Java):**
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

**Express.js (Node.js):**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

**FastAPI (Python):**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📨 Formato de Requisições e Respostas

### Headers Padrão

Todas as requisições incluem:
```
Content-Type: application/json
```

### Exemplo: GET /api/projects

**Requisição:**
```http
GET /api/projects HTTP/1.1
Host: localhost:8080
Content-Type: application/json
```

**Resposta (200 OK):**
```json
[
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
        "title": "MVP Completo",
        "description": "Primeira versão",
        "dueDate": "2024-02-15",
        "completed": false
      }
    ]
  }
]
```

### Exemplo: POST /api/projects

**Requisição:**
```http
POST /api/projects HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "workspaceId": 1,
  "name": "Novo Projeto",
  "description": "Descrição do projeto"
}
```

**Resposta (201 Created):**
```json
{
  "id": 2,
  "name": "Novo Projeto",
  "description": "Descrição do projeto",
  "workspaceId": 1,
  "milestones": []
}
```

### Exemplo: Upload de Documento

**Requisição:**
```http
POST /api/documents/upload HTTP/1.1
Host: localhost:8080
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="documento.pdf"
Content-Type: application/pdf

[binary data]
------WebKitFormBoundary
Content-Disposition: form-data; name="projectId"

1
------WebKitFormBoundary--
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "fileName": "documento.pdf",
  "fileType": "application/pdf",
  "downloadUri": "/api/documents/download/documento.pdf",
  "uploadDate": "2024-01-15T10:30:00Z"
}
```

---

## ⚠️ Tratamento de Erros

### Formato de Erro Esperado

A API deve retornar erros no seguinte formato:

**400 Bad Request:**
```json
{
  "message": "Dados inválidos",
  "errors": {
    "name": ["O nome é obrigatório"],
    "workspaceId": ["Workspace não encontrado"]
  }
}
```

**404 Not Found:**
```json
{
  "message": "Projeto não encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Erro interno do servidor"
}
```

### Códigos de Status HTTP

- `200 OK` - Sucesso (GET, PUT)
- `201 Created` - Criado com sucesso (POST)
- `204 No Content` - Sucesso sem conteúdo (DELETE)
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor

---

## 🧪 Testando a Conexão

### 1. Verificar se a API está rodando

```bash
# Teste básico
curl http://localhost:8080/api/projects
```

### 2. Testar do Frontend

Abra o console do navegador (F12) e execute:

```javascript
// Teste básico de conexão
fetch('http://localhost:8080/api/projects')
  .then(res => res.json())
  .then(data => console.log('✅ API conectada:', data))
  .catch(err => console.error('❌ Erro:', err))
```

### 3. Verificar CORS

Se receber erro de CORS, verifique:
- A API está configurada para aceitar `http://localhost:3000`
- Headers CORS estão corretos
- Métodos HTTP permitidos incluem GET, POST, PUT, DELETE

### 4. Testar Endpoints Específicos

```bash
# Listar projetos
curl http://localhost:8080/api/projects

# Criar projeto
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -d '{"workspaceId":1,"name":"Teste","description":"Projeto de teste"}'

# Listar subjects
curl http://localhost:8080/api/studies/subjects

# Criar subject
curl -X POST http://localhost:8080/api/studies/subjects \
  -H "Content-Type: application/json" \
  -d '{"name":"Java","proficiencyLevel":"BEGINNER","professionalLevel":"JUNIOR"}'
```

---

## 📝 Checklist de Implementação Backend

Use este checklist para garantir que sua API está compatível:

### ✅ Endpoints Básicos
- [ ] GET /api/workspaces
- [ ] GET /api/projects
- [ ] GET /api/studies/subjects
- [ ] GET /api/knowledge
- [ ] GET /api/kanban/board

### ✅ CRUD Completo
- [ ] CREATE (POST) para todos os recursos
- [ ] READ (GET) para todos os recursos
- [ ] UPDATE (PUT) para todos os recursos
- [ ] DELETE para todos os recursos

### ✅ Relacionamentos
- [ ] GET /api/projects/{id}/milestones
- [ ] GET /api/studies/subjects/{id}/sessions
- [ ] GET /api/kanban/columns/{id}/tasks

### ✅ Funcionalidades Especiais
- [ ] POST /api/projects/{id}/link (GitHub)
- [ ] POST /api/kanban/tasks/{id}/move/{columnId}
- [ ] GET /api/knowledge/search?tag={tag}
- [ ] POST /api/documents/upload
- [ ] GET /api/documents/download/{fileName}

### ✅ AI Endpoints
- [ ] POST /api/ai/analyze/code
- [ ] POST /api/ai/analyze/github-file
- [ ] POST /api/ai/analyze/generic
- [ ] POST /api/ai/review/portfolio
- [ ] POST /api/ai/think/product

### ✅ Integrações
- [ ] GET /api/integrations/github/connect
- [ ] GET /api/integrations/github/callback

### ✅ Configuração
- [ ] CORS configurado para localhost:3000
- [ ] Content-Type: application/json nos headers
- [ ] Formato de erro padronizado
- [ ] Datas em formato ISO 8601

---

## 🔍 Troubleshooting

### Erro: "Failed to fetch" ou "Network Error"

**Causas possíveis:**
1. API não está rodando
2. URL incorreta no `.env.local`
3. CORS não configurado
4. Firewall bloqueando

**Solução:**
```bash
# Verificar se a API está rodando
curl http://localhost:8080/api/projects

# Verificar variável de ambiente
echo $NEXT_PUBLIC_API_URL  # Linux/Mac
echo %NEXT_PUBLIC_API_URL% # Windows
```

### Erro: "CORS policy"

**Solução:**
Configure CORS na API para aceitar `http://localhost:3000`

### Erro: "404 Not Found"

**Causas:**
1. Endpoint não existe na API
2. Rota incorreta
3. Base path diferente

**Solução:**
Verifique se o endpoint existe na API e se o path está correto em `lib/api/config.ts`

### Erro: "400 Bad Request"

**Causas:**
1. Dados inválidos
2. Formato incorreto
3. Campos obrigatórios faltando

**Solução:**
Verifique o formato dos dados enviados e compare com os DTOs esperados

---

## 📚 Recursos Adicionais

- [Documentação da API](./lib/api/README.md) - Documentação interna do cliente
- [Roadmap da API](./lib/api/ROADMAP.md) - Status dos endpoints
- [Visualização de Endpoints](./app/api-roadmap/page.tsx) - Roadmap visual da API

---

## 🚀 Próximos Passos

1. **Configurar variável de ambiente** `.env.local`
2. **Iniciar a API backend** na porta 8080
3. **Configurar CORS** na API
4. **Testar conexão básica** com `curl` ou Postman
5. **Iniciar o frontend** e verificar se os dados carregam
6. **Implementar autenticação** (se necessário)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador (F12)
2. Verifique os logs da API backend
3. Teste os endpoints diretamente com `curl` ou Postman
4. Compare os DTOs esperados com os retornados pela API


