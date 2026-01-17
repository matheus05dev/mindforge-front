"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatInputProps {
  onSend: (content: string, files?: File[]) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(
        input.replace(/^\s+|\s+$/g, ""), // Remove only leading/trailing whitespace, preserve internal line breaks
        selectedFiles.length > 0 ? selectedFiles : undefined
      );
      setInput("");
      setSelectedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setIsFileDialogOpen(false);
    }
  };

  const handleAttachClick = () => {
    setIsFileDialogOpen(true);
  };

  const handleConfirmFiles = () => {
    setIsFileDialogOpen(false);
    // Os arquivos já foram selecionados e podem ser enviados junto com a mensagem
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="border-t border-border p-4">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your workspace..."
              className="min-h-[48px] max-h-[200px] resize-none pr-24 bg-background"
              disabled={isLoading}
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
                onClick={handleAttachClick}
                title="Anexar arquivos"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 shrink-0"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Sparkles className="h-5 w-5 animate-pulse" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Arquivos selecionados */}
        {selectedFiles.length > 0 && (
          <div className="mt-2 p-2 bg-muted/50 rounded-md">
            <p className="text-xs font-medium mb-2 text-muted-foreground">
              Arquivos anexados:
            </p>
            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs bg-background rounded px-2 py-1"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </form>

      {/* Dialog para selecionar arquivos */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Anexar Arquivos</DialogTitle>
            <DialogDescription>
              Selecione um ou mais arquivos para anexar à sua mensagem.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFileDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmFiles}
              disabled={selectedFiles.length === 0}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
