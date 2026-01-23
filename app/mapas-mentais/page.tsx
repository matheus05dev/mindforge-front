"use client";

import { AppShell } from "@/components/layout/app-shell";
import { MindMapBoard } from "@/components/mind-map/board";

export default function MindMapPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between mb-4 px-4 pt-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Mapas Mentais
            </h1>
            <p className="text-muted-foreground">
              Organize suas ideias e pensamentos visualmente.
            </p>
          </div>
        </div>
        <div className="flex-1 border rounded-lg m-4 overflow-hidden bg-background shadow-sm">
           <MindMapBoard />
        </div>
      </div>
    </AppShell>
  );
}
