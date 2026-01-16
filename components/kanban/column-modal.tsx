"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (columnData: { title: string; color: string }) => void;
}

const colorOptions = [
  { value: "bg-zinc-500", label: "Cinza", hex: "#71717a" },
  { value: "bg-blue-500", label: "Azul", hex: "#3b82f6" },
  { value: "bg-amber-500", label: "Âmbar", hex: "#f59e0b" },
  { value: "bg-green-500", label: "Verde", hex: "#22c55e" },
  { value: "bg-red-500", label: "Vermelho", hex: "#ef4444" },
  { value: "bg-purple-500", label: "Roxo", hex: "#a855f7" },
  { value: "bg-pink-500", label: "Rosa", hex: "#ec4899" },
];

export function ColumnModal({ open, onOpenChange, onSave }: ColumnModalProps) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("bg-blue-500");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setColor("bg-blue-500");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      onSave({
        title: title.trim(),
        color,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao criar coluna:", error);
      alert("Erro ao criar coluna");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Coluna</DialogTitle>
            <DialogDescription>
              Adicione uma nova coluna ao seu quadro Kanban.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="column-title">Título da Coluna *</Label>
              <Input
                id="column-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Em Revisão, Testes..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="column-color">Cor</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="column-color">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: option.hex }}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? "Criando..." : "Criar Coluna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
