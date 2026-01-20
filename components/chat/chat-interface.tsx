"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, AIPersona } from "@/lib/types";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessageBubble } from "./chat-message";
import { ChatInput } from "./chat-input";
import { PersonaSelector } from "./persona-selector";
import { ContentTools } from "./content-tools";
import { Sparkles } from "lucide-react";

import type { Conversation } from "@/lib/types";

export function ChatInterface() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>("geral");
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [serverDocReference, setServerDocReference] = useState<string | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load sessions from API
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const { aiService } = await import("@/lib/api");
        const sessions = await aiService.getAllSessions();
        setConversations(sessions);
      } catch (error) {
        console.error("Failed to load sessions", error);
      }
    };
    loadSessions();
  }, []);

  const handleSendMessage = async (content: string, files?: File[]) => {
    // Proteção: não permitir envio se não houver conversa ativa ou ID inválido
    if (!activeConversation || !activeConversation.id) {
      console.warn("Aguardando inicialização da conversa ou ID inválido...");
      return;
    }

    // Atualiza o arquivo ativo se um novo for enviado
    if (files && files.length > 0) {
      setActiveFile(files[0]);
      setServerDocReference(null); // Reset server reference for new file
    }

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

    try {
      const { aiService } = await import("@/lib/api");
      let aiResponse: ChatMessage;

      if (files && files.length > 0) {
        // Novo arquivo: enviar binário e obter referência do servidor
        const response = await aiService.analyzeDocument({
          file: files[0],
          prompt: content,
          provider: selectedPersona === "geral" ? undefined : selectedPersona,
        });

        // 🔥 CRÍTICO: Atualizar o ID da conversa ativa com o sessionId retornado
        if (response.sessionId) {
          setActiveConversation((prev) => 
            prev ? { ...prev, id: response.sessionId } : prev
          );
          // Também atualizar na lista de conversas
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.id === activeConversation?.id
                ? { ...conv, id: response.sessionId }
                : conv
            )
          );
        }

        // Após sucesso, armazenar referência do servidor para follow-ups
        if (response.documentId) {
          setServerDocReference(response.documentId.toString());
        }

        const extractedContent =
          response.answer?.markdown || response.content || "Análise concluída.";

        aiResponse = {
          id: Date.now().toString(),
          role: "assistant",
          content: extractedContent,
          persona: selectedPersona,
          createdAt: new Date().toISOString(),
        };
      } else if (serverDocReference) {
        // Follow-up: usar referência do servidor (sem reenviar arquivo)
        const response = await aiService.analyzeDocumentWithId({
          documentId: parseInt(serverDocReference),
          prompt: content,
          provider: selectedPersona === "geral" ? undefined : selectedPersona,
        });

        const extractedContent =
          response.answer?.markdown || response.content || "Análise concluída.";

        aiResponse = {
          id: Date.now().toString(),
          role: "assistant",
          content: extractedContent,
          persona: selectedPersona,
          createdAt: new Date().toISOString(),
        };
      } else {
        // Chat comum apenas se REALMENTE não houver contexto de documento
        const response = await aiService.chat({
          chatId: activeConversation.id,
          prompt: content,
          provider: selectedPersona === "geral" ? undefined : selectedPersona,
        });

        const extractedContent =
          response.answer?.markdown ||
          response.content ||
          response.response ||
          "Resposta recebida.";

        aiResponse = {
          id: Date.now().toString(),
          role: "assistant",
          content: extractedContent,
          persona: selectedPersona,
          createdAt: new Date().toISOString(),
        };
      }

      setMessages((prev) => {
        const newMessages = [...prev, aiResponse];
        // Update the active conversation with the new messages
        if (activeConversation && activeConversation.id !== 1) {
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.id === activeConversation.id
                ? { ...conv, messages: newMessages }
                : conv,
            ),
          );
        }
        return newMessages;
      });
    } catch (error) {
      console.error(
        "Erro detalhado:",
        (error as any)?.response?.data || (error as Error)?.message,
      );
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

  const handleNewChat = async () => {
    try {
      const { aiService } = await import("@/lib/api");
      const sessionFromServer = await aiService.createSession();

      setConversations((prev) => [sessionFromServer, ...prev]);
      setActiveConversation(sessionFromServer);
      setMessages([]);
      setActiveFile(null); // Reset active file for new conversation
      setServerDocReference(null); // Reset server reference for new conversation
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      console.error(`ERRO API (${status}):`, data || error.message);
    }
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    setIsLoading(true);
    try {
      const { aiService } = await import("@/lib/api");
      const sessionDetails = await aiService.getSession(conv.id);
      
      // Update the active conversation with details including messages
      setActiveConversation(sessionDetails);
      // Ensure we set messages from the fetched session
      setMessages(sessionDetails.messages || []);
    } catch (error) {
      console.error("Failed to load session messages", error);
      // Fallback
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
    setActiveFile(null); // Reset active file when switching conversations
    setServerDocReference(null); // Reset server reference when switching conversations
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
        {activeConversation && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">{activeConversation.title}</h2>
                <p className="text-xs text-muted-foreground">
                  Assistente de IA - MindForge
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
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeConversation ? (
            messages.length === 0 ? (
              <EmptyState onPromptClick={handleSendMessage} />
            ) : (
              messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))
            )
          ) : (
            <WelcomeState onNewChat={handleNewChat} />
          )}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {activeConversation && (
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        )}
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
    "Ajude-me a planejar meu cronograma de estudos para aprender TypeScript",
    "Quais são as melhores práticas para conteinerização com Docker?",
    "Crie um plano de projeto para construir uma API REST",
    "Resuma minhas anotações sobre design de sistemas",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Como posso ajudar você?</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Posso ajudar com gerenciamento de projetos, planejamento de estudos,
        organização de conhecimento e questões relacionadas a código.
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

function WelcomeState({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <Sparkles className="h-12 w-12 text-primary animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Bem-vindo ao MindForge AI</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Sua central de inteligência para projetos, estudos e análise de
        documentos. Selecione uma conversa ao lado ou comece uma nova.
      </p>
      <button
        onClick={onNewChat}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        Iniciar Nova Conversa
      </button>
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
