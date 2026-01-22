"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { SubjectNotes } from "@/components/studies/subject-notes"
import { studiesService } from "@/lib/api"
import type { Subject } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SubjectNotesPage() {
  const params = useParams()
  const subjectId = Number(params.id)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSubject() {
      try {
        const data = await studiesService.getSubjectById(subjectId)
        setSubject(data)
      } catch (error) {
        console.error("Erro ao carregar matéria:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSubject()
  }, [subjectId])

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/estudos/anotacoes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {loading ? "Carregando..." : subject?.name}
              <span className="text-muted-foreground font-normal text-lg">/ Notas</span>
            </h1>
          </div>
        </div>

        <SubjectNotes subjectId={subjectId} />
      </div>
    </AppShell>
  )
}
