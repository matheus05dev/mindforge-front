# MindForge Frontend - AI-Native Knowledge Workspace

![Status](https://img.shields.io/badge/status-active_development-blue?style=for-the-badge&logo=git)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan?style=for-the-badge&logo=tailwindcss&logoColor=white)

> **A interface cognitiva do seu Segundo Cérebro. Uma experiência de usuário fluida projetada para integrar fluxos de trabalho humanos com inteligência artificial.**

---

## 🚀 Visão do Produto

O **MindForge Frontend** é a manifestação visual da engenharia de IA. Não é apenas um dashboard administrativo; é um **Workspace Cognitivo** onde cada interação é desenhada para reduzir carga mental e maximizar o estado de flow.

Construído sobre o **Next.js 14**, o frontend abstrai a complexidade da orquestração de IA do backend, entregando uma interface reativa, otimista e esteticamente refinada. Ele transforma dados brutos e streams de LLM em componentes visuais interativos, permitindo que o usuário colabore com Agentes de IA como se fossem colegas de equipe.

---

## 🏗️ Visão Arquitetural

```mermaid
graph TD
    User((Usuário)) <-->|Interação UI/UX| NextClient[Next.js Client<br/>(App Router)]
    
    subgraph "Frontend Layer"
        NextClient <-->|State Magement| Zustand[Zustand Store]
        NextClient -->|Data Viz| Recharts
        NextClient -->|Markdown/Diff| EditorLayers
    end
    
    NextClient <-->|REST / Streams| BackendAPI[MindForge API]
```

---

## 📐 Destaques de Engenharia Frontend

### 🎨 Design System & UX "AI-First"
A interface não apenas exibe dados, ela **respira** com o usuário.
- **Glassmorphism & Dark Mode**: Estética moderna que reduz fadiga ocular durante longas sessões de estudo ou coding.
- **Streaming UI**: Tratamento robusto de respostas de IA em stream, renderizando markdown, code blocks e diffs em tempo real, sem "layout shift" brusco.
- **Feedback Otimista**: Ações como mover cards no Kanban ou criar notas refletem instantaneamente na UI enquanto sincronizam em background.

### 🧠 Editor de Conhecimento "Agent-Aware"
O componente central não é um simples `textarea`. É um **Editor Inteligente** capaz de:
- **Renderização Híbrida**: Markdown preview com syntax highlighting.
- **Inline Diffs**: Visualização estilo Git de alterações propostas pela IA, permitindo review cirúrgico antes da aplicação.
- **Thinking Mode vs Agent Mode**: A UI adapta seus affordances dependendo do modo de operação da IA (apenas chat vs. agente ativo).

### ⚡ Performance & Next.js 14
- **Server Components**: Carregamento inicial ultra-rápido de layouts estáticos.
- **Client Components**: Interatividade rica nas bordas da aplicação (Chat, Editor, Kanban).
- **Type Safety**: Tipagem rigorosa compartilhada com os contratos da API (DTOs) para prevenir erros de runtime.

---

## �️ Tech Stack & Decisões Técnicas

| Categoria | Tecnologia | Justificativa da Escolha |
|-----------|------------|--------------------------|
| **Core** | **Next.js 14** | App Router para routing robusto e mix de Server/Client components. |
| **Language** | **TypeScript** | Segurança de tipos indispensável para grandes codebases. |
| **State** | **Zustand** | Gerenciamento de estado global minimalista, sem o boilerplate do Redux. |
| **Styling** | **Tailwind CSS** | Velocidade de desenvolvimento e consistência de Design System. |
| **Components** | **Shadcn/UI** | Componentes acessíveis e customizáveis baseados em Radix UI. |
| **Icons** | **Lucide React** | Leveza e consistência visual. |
| **Viz** | **Recharts** | Gráficos responsivos para métricas de estudo (XP/Níveis). |

---

## 🧩 Funcionalidades Chave (UX Features)

### 1. Chat Contextual Lateral
Diferente de modais intrusivos, o chat de IA vive em uma sidebar colapsável, permitindo **trabalho e consulta simultâneos**. O chat conhece o contexto da página aberta (ex: o documento que você está editando).

### 2. Kanban Drag-and-Drop
Gestão visual de tarefas unificada. A UI lida com reordenação complexa e atualizações de colunas com animações fluidas, mantendo o estado sincronizado com o backend.

### 3. Gamification HUD
Visualização de progresso de estudos com barras de XP e indicadores de nível, utilizando animações para recompensar o usuário visualmente ao completar sessões.

### 4. Integração com Backend
O frontend consome a poderosa **MindForge API**, normalizando erros e gerenciando tokens de autenticação de forma transparente.
- **Backend Link**: [MindForge API (Spring Boot)](https://github.com/matheus05dev/mindforge-api)

---

## � Como Executar o Projeto

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/mindforge-front.git

# 2. Instale as dependências
npm install

# 3. Configuração de Variáveis de Ambiente
# Crie um arquivo .env.local na raiz:
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local

# 4. Execute em modo de desenvolvimento
npm run dev
```

> **Nota**: A aplicação rodará em `localhost:3000` e tentará conectar ao backend em `localhost:8080`.

---

## 📚 Documentação Técnica

Para detalhes de integração e padrões de código:

- [🚀 Quick Start](./docs/QUICK_START.md) - Guia rápido para devs.
- [📡 API Integration](./docs/API_INTEGRATION.md) - Camada de serviço e clientes HTTP.
- [🔌 API Endpoints](./docs/API_ENDPOINTS_SPEC.md) - Contratos esperados do backend.

---

## 👨💻 Autor

**Matheus Dev**

Desenvolvido com foco em **UX de Alta Fidelidade** e integração de sistemas complexos de IA.

---

<div align="center">
  Desenvolvido por Matheus
</div>