"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { ChatMessage, AIPersona } from "@/lib/types";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessageBubble } from "./chat-message";
import { ChatInput } from "./chat-input";
import { PersonaSelector } from "./persona-selector";
import { ContentTools } from "./content-tools";
import { Sparkles } from "lucide-react";

import type { Conversation } from "@/lib/types";


import { useStore } from "@/lib/store";
import { X, FileText, PenTool, Eraser, CheckCircle2 } from "lucide-react";

interface ChatInterfaceProps {
  aiStyle?: "AGENT" | "THINKING"
  compact?: boolean
}

export function ChatInterface({ aiStyle = "AGENT", compact = false }: ChatInterfaceProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { aiContext, setAiContext } = useStore();
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
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

        // Check URL for session ID
        const urlSessionId = searchParams.get('id');
        if (urlSessionId) {
          const sessionId = parseInt(urlSessionId);
          if (!isNaN(sessionId)) {
            const existing = sessions.find((s: Conversation) => s.id === sessionId);
            if (existing) {
              handleSelectConversation(existing);
            } else {
              // Fetch from API if not in list
              try {
                const session = await aiService.getSession(sessionId);
                setActiveConversation(session);
                
                // Parse messages for URL restore
                const rawMessages = session.messages || [];
                const normalizedMessages = rawMessages.map((msg: any) => {
                  if (msg.role === "user" && String(msg.content).startsWith("Arquivo: ")) {
                    const match = String(msg.content).match(/^Arquivo: (.+?)\n/);
                    if (match && match[1] && (!msg.attachments || msg.attachments.length === 0)) {
                      msg.attachments = [{
                        name: match[1],
                        type: match[1].endsWith('.pdf') ? 'application/pdf' : 'text/plain',
                        size: 0
                      }];
                    }
                  }
                  if (msg.role === "assistant" && typeof msg.content === 'string' && msg.content.trim().startsWith('{')) {
                    try {
                      const parsed = JSON.parse(msg.content);
                      msg.content = parsed.answer?.markdown || parsed.answer?.text || parsed.content || parsed.response || msg.content;
                    } catch (e) {}
                  }
                  return msg;
                });
                
                setMessages(normalizedMessages);
                
                if (session.documentId) {
                  setServerDocReference(session.documentId);
                }
                // Add to conversations list if not present
                setConversations(prev => [session, ...prev]);
              } catch (e) {
                console.error("Could not load session from URL:", e);
                // Fallback to auto-select or new chat logic
                 if (compact && sessions.length > 0 && !activeConversation) {
                    handleSelectConversation(sessions[0])
                }
              }
            }
          }
        } else if (compact && sessions.length > 0 && !activeConversation) {
          // Auto-select most recent conversation in compact mode (only if no URL param)
          handleSelectConversation(sessions[0])
        }
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

        // 🔥 CRÍTICO: Buscar a sessão real do backend em vez de tentar atualizar a temporária
        if (response.sessionId) {
          const realSession = await aiService.getSession(response.sessionId);
          
          // Substituir a sessão temporária pela real
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.id === activeConversation?.id ? realSession : conv
            )
          );
          
          // Atualizar a conversa ativa
          // CLEANUP: If previous session was "Nova Conversa" and empty, delete it
          const previousSessionId = activeConversation?.id;
          const wasEmpty = activeConversation.title === "Nova Conversa" && (!messages || messages.length <= 1); // 1 because we just added user message locally

          setActiveConversation(realSession);
          router.replace(`${pathname}?id=${realSession.id}`);

          if (previousSessionId && wasEmpty && previousSessionId !== realSession.id) {
             console.log(">>> [FRONTEND] Cleaning up empty session:", previousSessionId);
             // Remove from UI list
             setConversations(prev => prev.filter(c => c.id !== previousSessionId));
             // Delete from backend
             aiService.deleteSession(previousSessionId).catch(err => console.error("Failed to cleanup session", err));
          }
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
        // Follow-up: usar Chat API stateful com documentId para manter consistência do chat
        console.log(">>> [FRONTEND] Document Chat Follow-up (Stateful)", { activeId: activeConversation.id, docId: serverDocReference });
        
        const response = await aiService.chat({
          chatId: activeConversation.id,
          prompt: content,
          documentId: serverDocReference, // Envia o ID do documento para manter contexto RAG
          provider: selectedPersona === "geral" ? undefined : selectedPersona,
        });

        // Se o backend retornou um ID de sessão (injetado pelo nosso fix), atualizamos o frontend
        if (response.sessionId && response.sessionId !== activeConversation.id) {
            console.log(">>> [FRONTEND] Atualizando SessionID:", response.sessionId);
            // Atualiza URL para refletir o ID real
            router.replace(`${pathname}?id=${response.sessionId}`);
            // Atualiza o objeto local para que o próximo envio use o ID correto
            activeConversation.id = response.sessionId;
        }

        const extractedContent =
          response.answer?.markdown || response.content || response.response || "Análise concluída.";

        aiResponse = {
          id: Date.now().toString(),
          role: "assistant",
          content: extractedContent,
          persona: selectedPersona,
          createdAt: new Date().toISOString(),
        };
      } else {
        // Chat comum apenas se REALMENTE não houver contexto de documento
        console.log(">>> [FRONTEND] Enviando mensagem para chat normal:", {
          chatId: activeConversation.id,
          prompt: content,
          provider: selectedPersona === "geral" ? undefined : selectedPersona,
        });
        
        const response = await aiService.chat({
          chatId: activeConversation.id,
          prompt: content,
          provider: selectedPersona === "geral" ? undefined : selectedPersona,
        });
        
        console.log(">>> [FRONTEND] Resposta recebida do chat:", response);

        // Se o backend retornou um ID de sessão, atualizamos o frontend (caso fosse uma sessão nova iniciada do zero)
        if (response.sessionId && response.sessionId !== activeConversation.id) {
            console.log(">>> [FRONTEND] Atualizando SessionID (Chat Normal):", response.sessionId);
            try {
              router.replace(`${pathname}?id=${response.sessionId}`);
              activeConversation.id = response.sessionId;
            } catch(e) { console.error("Erro ao atualizar URL/ID", e); }
        }

        // Try to extract content from various possible response formats
        let extractedContent = "Resposta recebida.";
        
        if (response.answer) {
          // If answer exists, prefer markdown, then text
          extractedContent = response.answer.markdown || response.answer.text || response.answer;
        } else if (response.content) {
          extractedContent = response.content;
        } else if (response.response) {
          extractedContent = response.response;
        } else if (typeof response === 'string') {
          // Sometimes the entire response is just a string
          extractedContent = response;
        }
        
        // If the content looks like stringified JSON, try to parse it
        if (typeof extractedContent === 'string' && extractedContent.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(extractedContent);
            extractedContent = parsed.answer?.markdown || parsed.answer?.text || parsed.content || parsed.response || extractedContent;
          } catch (e) {
            // If parsing fails, use the original content
            console.warn("Could not parse JSON response, using raw content");
          }
        }

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
      console.error("Erro ao enviar mensagem:", error);
      
      let errorMessage = "Desculpe, ocorreu um erro ao processar sua mensagem.";
      
      // Check for specific error types
      if (error && typeof error === 'object') {
        const err = error as any;
        
        if (err.message?.includes('vazia do servidor') || err.message?.includes('Unexpected end of JSON input')) {
          errorMessage = "O servidor retornou uma resposta vazia. Verifique se a API está configurada corretamente.";
        } else if (err.message?.includes('inválida do servidor')) {
          errorMessage = "O servidor retornou uma resposta inválida. Verifique os logs do backend.";
        } else if (err.status === 404) {
          errorMessage = "Endpoint não encontrado. Verifique se a API está rodando.";
        } else if (err.status === 500) {
          errorMessage = "Erro interno do servidor. Verifique os logs do backend.";
        } else if (err.message) {
          errorMessage = `Erro: ${err.message}`;
        }
      }
      
      const errorMessageObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessage,
        persona: selectedPersona,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
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
    if (isCreatingChat) return;
    setIsCreatingChat(true);
    try {
      console.log(">>> [FRONTEND] Criando nova sessão...");
      const { aiService } = await import("@/lib/api");
      const sessionFromServer = await aiService.createSession();
      
      console.log(">>> [FRONTEND] Sessão criada:", sessionFromServer);

      // Check if this session already exists to prevent duplicates
      const existingSession = conversations.find(c => c.id === sessionFromServer.id);
      if (!existingSession) {
        setConversations((prev) => [sessionFromServer, ...prev]);
      }
      
      setActiveConversation(sessionFromServer);
      router.replace(`${pathname}?id=${sessionFromServer.id}`);
      setMessages([]);
      setActiveFile(null); // Reset active file for new conversation
      setServerDocReference(null); // Reset server reference for new conversation
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      console.error(`ERRO API (${status}):`, data || error.message);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    router.replace(`${pathname}?id=${conv.id}`);
    
    // Reset context BEFORE loading new one
    setActiveFile(null);
    setServerDocReference(null);

    setIsLoading(true);
    try {
      const { aiService } = await import("@/lib/api");
      const sessionDetails = await aiService.getSession(conv.id);
      
      // Update the active conversation with details including messages
      setActiveConversation(sessionDetails);
      // Ensure we set messages from the fetched session
      const rawMessages = sessionDetails.messages || [];
      const normalizedMessages = rawMessages.map((msg: any) => {
        // 1. Restore file attachment UI for User messages
        if (msg.role === "user" && String(msg.content).startsWith("Arquivo: ")) {
          const match = String(msg.content).match(/^Arquivo: (.+?)\n/);
          if (match && match[1]) {
            // Reconstruct attachment if missing
            if (!msg.attachments || msg.attachments.length === 0) {
              msg.attachments = [{
                name: match[1],
                type: match[1].endsWith('.pdf') ? 'application/pdf' : 'text/plain',
                size: 0 // Unknown size, optional
              }];
            }
          }
        }
        
        // 2. Parse JSON Answer for Assistant messages
        if (msg.role === "assistant" && typeof msg.content === 'string' && msg.content.trim().startsWith('{')) {
          try {
             // Try to parse recursive JSON structure often returned by RAG
            const parsed = JSON.parse(msg.content);
            const extracted = parsed.answer?.markdown || parsed.answer?.text || parsed.content || parsed.response || msg.content;
            msg.content = extracted;
          } catch (e) {
            // Not JSON, keep as is
          }
        }
        return msg;
      });

      setMessages(normalizedMessages);

      // Restore document context if exists
      if (sessionDetails.documentId) {
        setServerDocReference(sessionDetails.documentId);
      }
    } catch (error) {
      console.error("Failed to load session messages", error);
      // Fallback
      setMessages([]);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="flex h-full gap-4">
      {/* Sidebar - Hidden in compact mode */}
      {!compact && (
        <ChatSidebar
            conversations={conversations}
            activeConversation={activeConversation}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col rounded-lg border border-border bg-card overflow-hidden">
        {/* Chat Header */}
        {activeConversation && !aiContext && (
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

        {/* Editor Context Actions */}
        {aiContext && (
            <div className="bg-accent/30 border-b border-border p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <FileText className="h-4 w-4" />
                        Contexto do Editor Ativo
                    </div>
                    <button onClick={() => setAiContext(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => handleSendMessage(`Continue escrevendo a partir deste texto:\n\n${aiContext}`)}
                        className="flex items-center gap-2 bg-background border border-border p-2 rounded-md hover:bg-accent text-xs text-left transition-colors"
                    >
                        <PenTool className="h-3.5 w-3.5 text-blue-500" />
                        Continuar escrevendo
                    </button>
                    <button 
                         onClick={() => handleSendMessage(`Resuma o seguinte texto:\n\n${aiContext}`)}
                        className="flex items-center gap-2 bg-background border border-border p-2 rounded-md hover:bg-accent text-xs text-left transition-colors"
                    >
                        <FileText className="h-3.5 w-3.5 text-orange-500" />
                        Resumir
                    </button>
                    <button 
                         onClick={() => handleSendMessage(`Corrija a gramática e ortografia deste texto:\n\n${aiContext}`)}
                        className="flex items-center gap-2 bg-background border border-border p-2 rounded-md hover:bg-accent text-xs text-left transition-colors"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        Corrigir gramática
                    </button>
                    <button 
                         onClick={() => handleSendMessage(`Melhore a escrita deste texto para torná-lo mais profissional:\n\n${aiContext}`)}
                        className="flex items-center gap-2 bg-background border border-border p-2 rounded-md hover:bg-accent text-xs text-left transition-colors"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                        Melhorar escrita
                    </button>
                </div>
                <div className="mt-3 text-[10px] text-muted-foreground text-center">
                    O contexto do editor será enviado junto com sua solicitação.
                </div>
            </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeConversation ? (
            messages.length === 0 ? (
              <EmptyState onPromptClick={handleSendMessage} hasContext={!!aiContext} />
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
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} placeholder="Pergunte algo sobre seu workspace..." />
        )}
      </div>
    </div>
  );
}

function EmptyState({
  onPromptClick,
  hasContext = false,
}: {
  onPromptClick: (prompt: string) => void;
  hasContext?: boolean;
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
      
      {!hasContext && (
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
      )}
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
