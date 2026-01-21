# Guia de Integração Frontend-Backend

Este guia serve como referência para desenvolvedores conectarem o frontend MindForge à API Backend.

## ⚙️ Configuração do Ambiente

### 1. Variáveis de Ambiente
Certifique-se de que o arquivo `.env.local` na raiz do projeto contenha a URL correta da API.

```env
# URL Base do Backend (Spring Boot / Node / Python)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. Configurações de CORS (Backend)
Para que o frontend Next.js (rodando em `:3000`) comunique-se com o backend, é necessário liberar o **CORS** no servidor.

**Exemplo Spring Boot:**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }
}
```

## 🏗️ Estrutura do Cliente API

O projeto utiliza um padrão de **Service Layer** para centralizar as chamadas HTTP. Nunca faça `fetch` direto nos componentes; utilize os serviços exportados em `@/lib/api`.

### Arquitetura
```
lib/api/
├── client.ts       # Wrapper do fetch com tratamento de erros
├── config.ts       # Mapa de endpoints
├── types.ts        # Tipagens (DTOs)
└── services/       # Módulos de negócio
    ├── projects.service.ts
    ├── knowledge.service.ts
    └── ai.service.ts
```

### Exemplo de Uso
```typescript
import { projectsService } from '@/lib/api'

// Buscar projetos
const loadProjects = async () => {
  try {
    const data = await projectsService.getAll();
    setProjects(data);
  } catch (error) {
    toast.error("Erro ao carregar projetos");
  }
}
```

## 🔐 Autenticação (OAuth)

Atualmente, o fluxo de autenticação é delegado ao GitHub.
1. O usuário clica em "Login com GitHub".
2. Redireciona para `/api/integrations/github/connect`.
3. Backend processa o callback e redireciona de volta com sessão válida.

## 🐛 Debugging e Erros Comuns

- **Erro 404**: Verifique se a URL base no `.env.local` não possui uma barra extra no final (ex: deve ser `http://localhost:8080`, não `http://localhost:8080/`).
- **Network Error**: O backend está rodando? Verifique se a porta `8080` está ativa.
- **CORS Error**: Verifique os headers de resposta do backend.
