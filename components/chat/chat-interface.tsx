"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, AIPersona } from "@/lib/types";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessageBubble } from "./chat-message";
import { ChatInput } from "./chat-input";
import { PersonaSelector } from "./persona-selector";
import { ContentTools } from "./content-tools";
import { Sparkles } from "lucide-react";

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI assistant for MindForge. I can help you with:\n\n- **Project management** - Create tasks, set priorities, organize your workflow\n- **Study planning** - Design learning paths, track progress, suggest resources\n- **Knowledge base** - Search your notes, create summaries, find connections\n- **Code assistance** - Explain concepts, debug issues, suggest best practices\n\nHow can I help you today?",
    createdAt: new Date().toISOString(),
  },
];

interface Conversation {
  id: string;
  title: string;
  messages?: ChatMessage[];
  createdAt: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "System Design Patterns",
    messages: initialMessages,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "TypeScript Generics Help",
    messages: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Docker Best Practices",
    messages: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function ChatInterface() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversation, setActiveConversation] = useState(
    mockConversations[0]
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>("geral");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    const attachments = files?.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      attachments,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let documentId: number | null = null;

    try {
      // Importar serviços de IA
      const { aiService } = await import("@/lib/api");

      let aiResponse: ChatMessage;

      if (files && files.length > 0) {
        // Use document analysis endpoint for messages with attachments
        const response = await aiService.analyzeDocument({
          file: files[0],
          prompt: content,
          provider: selectedPersona === "geral" ? undefined : selectedPersona,
        });

        aiResponse = {
          id: Date.now().toString(),
          role: "assistant",
          content: response.content || "Análise do documento concluída.",
          persona: selectedPersona,
          createdAt: new Date().toISOString(),
        };
      } else {
        // Use direct chat endpoint for text-only messages
        const response = await aiService.chat({
          prompt: content,
          provider: selectedPersona === "geral" ? undefined : selectedPersona,
        });

        aiResponse = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            response.content || response.response || "Resposta recebida.",
          persona: selectedPersona,
          createdAt: new Date().toISOString(),
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se a API está rodando e tente novamente.",
        persona: selectedPersona,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolSelect = (tool: string) => {
    const toolPrompts: Record<string, string> = {
      summarize: "Por favor, resuma o seguinte texto:",
      translate: "Traduza o seguinte texto para português:",
      rewrite: "Reescreva e melhore o seguinte texto:",
      ocr: "Extraia o texto da seguinte imagem:",
    };
    const prompt = toolPrompts[tool] || "";
    // Aqui você pode abrir um modal ou inserir o prompt no input
    console.log("Tool selected:", tool, prompt);
  };

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setMessages([]);
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setMessages(conv.id === "1" ? initialMessages : []);
  };

  return (
    <div className="flex h-full gap-4">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col rounded-lg border border-border bg-card overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{activeConversation.title}</h2>
              <p className="text-xs text-muted-foreground">
                AI Assistant - MindForge
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PersonaSelector
              selectedPersona={selectedPersona}
              onPersonaChange={setSelectedPersona}
            />
            <ContentTools onToolSelect={handleToolSelect} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <EmptyState onPromptClick={handleSendMessage} />
          ) : (
            messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} />
            ))
          )}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

function EmptyState({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void;
}) {
  const suggestions = [
    "Help me plan my study schedule for learning TypeScript",
    "What are the best practices for Docker containerization?",
    "Create a project plan for building a REST API",
    "Summarize my notes on system design",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">How can I help you?</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        I can assist with project management, study planning, knowledge
        organization, and code-related questions.
      </p>
      <div className="grid gap-2 w-full max-w-lg">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onPromptClick(suggestion)}
            className="text-left px-4 py-3 rounded-lg border border-border bg-background hover:bg-accent/50 hover:border-primary/30 transition-colors text-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-primary/10 p-2 shrink-0">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="rounded-lg bg-muted px-4 py-3">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

function generateMockResponse(
  input: string,
  persona: AIPersona = "geral"
): string {
  const lowerInput = input.toLowerCase();

  // Respostas específicas por persona
  if (persona === "mentor") {
    return `Como seu mentor, vou te guiar passo a passo:\n\n${generateMentorResponse(
      lowerInput
    )}`;
  }

  if (persona === "analista") {
    return `Análise técnica detalhada:\n\n${generateAnalystResponse(
      lowerInput
    )}`;
  }

  if (persona === "tutor_socratico") {
    return `Vamos aprender juntos! Antes de responder, deixe-me fazer algumas perguntas:\n\n${generateSocraticResponse(
      lowerInput
    )}`;
  }

  if (persona === "debug_assistant") {
    return `Vou ajudar você a debugar isso. Vamos investigar:\n\n${generateDebugResponse(
      lowerInput
    )}`;
  }

  if (persona === "recrutador_tecnico") {
    return `Como recrutador técnico, aqui está minha análise:\n\n${generateRecruiterResponse(
      lowerInput
    )}`;
  }

  if (persona === "planejador") {
    return `Vamos criar um plano estratégico:\n\n${generatePlannerResponse(
      lowerInput
    )}`;
  }

  if (lowerInput.includes("typescript") || lowerInput.includes("study")) {
    return `Great question! Here's a suggested study plan for TypeScript:

## Week 1-2: Fundamentals
- Basic types (string, number, boolean)
- Arrays and tuples
- Enums and type aliases

## Week 3-4: Advanced Types
- Generics
- Utility types (Partial, Required, Pick, Omit)
- Conditional types

## Week 5-6: Practical Application
- React with TypeScript
- API integration with type safety
- Error handling patterns

Would you like me to create tasks in your Projects for tracking this learning path?`;
  }

  if (lowerInput.includes("docker")) {
    return `Here are some Docker best practices I'd recommend:

### Image Optimization
\`\`\`dockerfile
# Use multi-stage builds
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules
\`\`\`

### Security
- Always use official base images
- Run containers as non-root users
- Scan images for vulnerabilities regularly

### Networking
- Use custom bridge networks
- Never expose unnecessary ports

I noticed you have a note on "Docker Best Practices" in your Knowledge Base. Would you like me to add these points to it?`;
  }

  if (lowerInput.includes("project") || lowerInput.includes("api")) {
    return `I can help you create a project plan! Here's a suggested structure for a REST API project:

### Phase 1: Setup & Architecture
- [ ] Define API requirements and endpoints
- [ ] Choose tech stack and set up project
- [ ] Design database schema

### Phase 2: Core Development
- [ ] Implement authentication (JWT)
- [ ] Create CRUD operations
- [ ] Add input validation

### Phase 3: Quality & Deployment
- [ ] Write unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production

Would you like me to create this as a new Project with these tasks already set up in the Kanban board?`;
  }

  return `I understand you're asking about "${input.slice(0, 50)}...". 

Based on your workspace data, I can help you:
1. **Create related tasks** in your projects
2. **Find relevant notes** in your Knowledge Base
3. **Suggest study resources** based on your learning goals

What would you like to focus on?`;
}

function generateMentorResponse(input: string): string {
  return `Vamos começar do básico e construir conhecimento sólido. Primeiro, entenda os fundamentos, depois pratique e por fim aplique em projetos reais.`;
}

function generateAnalystResponse(input: string): string {
  return `Análise técnica:\n- Complexidade: O(n)\n- Padrões identificados: Strategy, Factory\n- Pontos de melhoria: Otimização de queries\n- Recomendações: Implementar cache`;
}

function generateSocraticResponse(input: string): string {
  return `1. O que você já sabe sobre isso?\n2. Qual é o problema específico que você está enfrentando?\n3. O que você tentou até agora?\n4. O que você acha que pode estar faltando?`;
}

function generateDebugResponse(input: string): string {
  return `Vamos debugar sistematicamente:\n1. Verificar logs de erro\n2. Testar casos isolados\n3. Verificar dependências\n4. Analisar stack trace\n5. Reproduzir o problema`;
}

function generateRecruiterResponse(input: string): string {
  return `Análise de carreira:\n- Pontos fortes: Experiência sólida em TypeScript\n- Áreas de crescimento: Arquitetura de sistemas\n- Sugestões: Destaque projetos open-source\n- Próximos passos: Certificações relevantes`;
}

function generatePlannerResponse(input: string): string {
  return `Plano estratégico:\n\n**Fase 1 (Semana 1-2):** Setup e fundamentos\n**Fase 2 (Semana 3-4):** Desenvolvimento core\n**Fase 3 (Semana 5-6):** Testes e otimização\n**Fase 4 (Semana 7-8):** Deploy e documentação`;
}
