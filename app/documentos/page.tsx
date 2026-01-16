import { AppShell } from "@/components/layout/app-shell";
import { DocumentsList } from "@/components/documents/documents-list";
import { DocumentUploadClient } from "@/components/documents/document-upload-client";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

export default function DocumentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Documentos
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus arquivos e documentos.
            </p>
          </div>
          <DocumentUploadClient />
        </div>

        {/* Documents List */}
        <DocumentsList />
      </div>
    </AppShell>
  );
}
