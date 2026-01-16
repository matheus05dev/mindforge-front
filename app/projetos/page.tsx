import { Suspense } from "react"
import { ProjetosContent } from "@/components/projetos/projetos-content"
import { AppShell } from "@/components/layout/app-shell"

export default function ProjetosPage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <ProjetosContent />
      </Suspense>
    </AppShell>
  )
}
