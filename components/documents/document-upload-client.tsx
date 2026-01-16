"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { DocumentUpload } from "./document-upload";
import { DocumentCreate } from "./document-create";

export function DocumentUploadClient() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSuccess = () => {
    // Aqui você pode recarregar dados se necessário
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsUploadOpen(true)}
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      <DocumentUpload
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onSuccess={handleSuccess}
      />
      <DocumentCreate
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
