# 🚀 Guia Rápido - Conectando Frontend com API

Este é um guia rápido para conectar o frontend MindForge com sua API backend.

## ⚡ Passos Rápidos

### 1. Configurar Variável de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. Configurar CORS na API

A API deve aceitar requisições de `http://localhost:3000`

**Exemplo Spring Boot:**
```java
@CrossOrigin(origins = "http://localhost:3000")
```

**Exemplo Express.js:**
```javascript
app.use(cors({ origin: 'http://localhost:3000' }))
```

### 3. Iniciar a API

```bash
# Inicie sua API na porta 8080
# Exemplo Spring Boot:
./mvnw spring-boot:run

# Exemplo Node.js:
npm start
```

### 4. Iniciar o Frontend

```bash
npm run dev
```

O frontend estará em `http://localhost:3000`

### 5. Testar Conexão

Abra o console do navegador (F12) e verifique se há erros de conexão.

---

## 📋 Endpoints Mínimos Necessários

Para o frontend funcionar, você precisa implementar pelo menos:

### Essenciais
- ✅ `GET /api/projects` - Listar projetos
- ✅ `GET /api/projects/{id}/milestones` - Milestones do projeto
- ✅ `GET /api/studies/subjects` - Listar subjects
- ✅ `GET /api/studies/subjects/{id}/sessions` - Sessions do subject

### Recomendados
- ✅ `POST /api/projects` - Criar projeto
- ✅ `POST /api/projects/{id}/milestones` - Criar milestone
- ✅ `POST /api/studies/subjects` - Criar subject
- ✅ `POST /api/studies/subjects/{id}/sessions` - Criar session

---

## 🧪 Teste Rápido

### Teste 1: Verificar se API está rodando

```bash
curl http://localhost:8080/api/projects
```

Deve retornar um array (pode estar vazio `[]`).

### Teste 2: Verificar CORS

Abra o console do navegador e execute:

```javascript
fetch('http://localhost:8080/api/projects')
  .then(r => r.json())
  .then(d => console.log('✅ OK:', d))
  .catch(e => console.error('❌ Erro:', e))
```

Se aparecer "✅ OK", está funcionando!

---

## 📚 Documentação Completa

- [Documentação Completa de Integração](./API_INTEGRATION.md)
- [Especificação de Endpoints](./API_ENDPOINTS_SPEC.md)
- [Documentação da API Client](../lib/api/README.md)

---

## ⚠️ Problemas Comuns

### Erro: "Failed to fetch"
- ✅ API está rodando?
- ✅ URL no `.env.local` está correta?
- ✅ CORS configurado?

### Erro: "CORS policy"
- ✅ Configure CORS na API para aceitar `http://localhost:3000`

### Erro: "404 Not Found"
- ✅ Endpoint existe na API?
- ✅ Path está correto?

---

## 💡 Dica

O frontend usa dados mock quando a API não está disponível, então você pode desenvolver o frontend mesmo sem a API rodando. Quando a API estiver pronta, os dados reais serão carregados automaticamente.


