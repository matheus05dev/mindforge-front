"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUp } from "lucide-react";

interface DocumentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DocumentUpload({
  open,
  onOpenChange,
  onSuccess,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aqui você implementaria o envio dos arquivos para a API
      // await documentsService.uploadFiles(files)

      onSuccess();
      onOpenChange(false);
      setFiles([]);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload dos arquivos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload de Documentos</DialogTitle>
            <DialogDescription>
              Selecione um ou mais arquivos para fazer upload.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="files">Selecione arquivos *</Label>
              <Input
                id="files"
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                required
                className="cursor-pointer"
              />
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium">Arquivos selecionados:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {files.map((file) => (
                      <li key={file.name} className="flex items-center gap-2">
                        <FileUp className="h-3 w-3" />
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || files.length === 0}>
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
