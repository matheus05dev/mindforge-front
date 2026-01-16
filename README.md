# MindForge - Seu Segundo Cérebro

Frontend do MindForge, uma aplicação para desenvolvedores e estudantes gerenciarem projetos, estudos e conhecimento com IA.

## 🚀 Início Rápido

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev
```

### Configuração da API

1. Crie o arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. Inicie sua API backend na porta 8080

3. Configure CORS na API para aceitar `http://localhost:3000`

📖 **Documentação completa:** Veja [docs/QUICK_START.md](./docs/QUICK_START.md)

## 📚 Documentação

### Integração com API
- [🚀 Guia Rápido](./docs/QUICK_START.md) - Comece aqui!
- [📡 Documentação Completa de Integração](./docs/API_INTEGRATION.md) - Tudo sobre conectar com a API
- [📋 Especificação de Endpoints](./docs/API_ENDPOINTS_SPEC.md) - Detalhes de todos os endpoints
- [🗺️ Roadmap da API](./lib/api/ROADMAP.md) - Status dos endpoints

### Desenvolvimento
- [📖 Documentação da API Client](./lib/api/README.md) - Como usar os serviços

## 🎯 Funcionalidades

- ✅ **Projetos** - Gerenciamento de projetos com milestones
- ✅ **Estudos** - Subjects, sessions e progressão de níveis
- ✅ **Base de Conhecimento** - Itens de conhecimento com tags
- ✅ **Kanban** - Board de tarefas drag-and-drop
- ✅ **Chat com IA** - Assistente inteligente para análise
- ✅ **Roadmaps** - Visualização timeline e mindmap
- ✅ **Temas** - Modo claro e escuro
- ✅ **OAuth GitHub** - Integração para análise de repositórios

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Recharts** - Gráficos e visualizações
- **date-fns** - Manipulação de datas

## 📦 Estrutura do Projeto

```
mindforge-front/
├── app/                    # Páginas Next.js
├── components/              # Componentes React
│   ├── layout/             # Layout principal
│   ├── projetos/           # Componentes de projetos
│   ├── studies/            # Componentes de estudos
│   └── ui/                 # Componentes UI base
├── lib/
│   ├── api/                # Cliente API
│   │   ├── config.ts       # Configuração de endpoints
│   │   ├── client.ts       # Cliente HTTP
│   │   ├── types.ts        # Tipos TypeScript
│   │   └── services/       # Serviços específicos
│   └── store.tsx           # Estado global
├── docs/                   # Documentação
└── public/                 # Arquivos estáticos
```

## 🔗 Links Úteis

- [Documentação de Integração](./docs/API_INTEGRATION.md)
- [Especificação de Endpoints](./docs/API_ENDPOINTS_SPEC.md)
- [Guia Rápido](./docs/QUICK_START.md)