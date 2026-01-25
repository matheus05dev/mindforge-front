"use client"

import { useState, useEffect, useMemo } from "react"
import { useApi } from "@/lib/hooks/use-api"
import { studiesService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import type { StudySession } from "@/lib/api/types"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, startOfWeek, endOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StudySessionForm } from "./study-session-form"

export function StudiesCalendar() {
  const { data: subjects, loading, execute } = useApi()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  useEffect(() => {
    execute(() => studiesService.getAllSubjects({ size: 1000 })).then((data) => {
      const subjects = data?.content
      if (subjects) {
        const allSessions: StudySession[] = []
        subjects.forEach((subject) => {
          if (subject.studySessions) {
            allSessions.push(
              ...subject.studySessions.map((session) => ({
                ...session,
                subjectName: subject.name,
              }))
            )
          }
        })
        setSessions(allSessions)
      }
    })
  }, [execute])

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, StudySession[]>()
    sessions.forEach((session) => {
      const dateKey = format(parseISO(session.startTime), "yyyy-MM-dd")
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)!.push(session)
    })
    return map
  }, [sessions])

  const selectedDateSessions = selectedDate
    ? sessionsByDate.get(format(selectedDate, "yyyy-MM-dd")) || []
    : []

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando sessões...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {sessions.length} {sessions.length === 1 ? "sessão" : "sessões"} registradas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Sessão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Sessão de Estudo</DialogTitle>
                <DialogDescription>
                  Registre uma nova sessão de estudo para acompanhar seu progresso.
                </DialogDescription>
              </DialogHeader>
              <StudySessionForm
                onSuccess={() => {
                  setIsFormOpen(false)
                  execute(() => studiesService.getAllSubjects({ size: 1000 })).then((data) => {
                    const subjects = data?.content
                    if (subjects) {
                      const allSessions: StudySession[] = []
                      subjects.forEach((subject) => {
                        if (subject.studySessions) {
                          allSessions.push(
                            ...subject.studySessions.map((session) => ({
                              ...session,
                              subjectName: subject.name,
                            }))
                          )
                        }
                      })
                      setSessions(allSessions)
                    }
                  })
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="rounded-lg border border-border bg-card">
        {/* Dias da Semana */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dias do Mês */}
        <div className="grid grid-cols-7">
          {daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd")
            const daySessions = sessionsByDate.get(dateKey) || []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "min-h-[100px] p-2 border-r border-b border-border last:border-r-0 hover:bg-accent/50 transition-colors text-left",
                  !isCurrentMonth && "text-muted-foreground/50 bg-muted/20",
                  isToday && "bg-primary/10 border-primary/30",
                  isSelected && "bg-primary/20 border-primary"
                )}
              >
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    isToday && "text-primary font-semibold"
                  )}
                >
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {daySessions.slice(0, 3).map((session) => {
                    const sessionDate = parseISO(session.startTime)
                    return (
                      <div
                        key={session.id}
                        className="text-xs rounded px-1.5 py-0.5 bg-primary/20 text-primary border border-primary/30 truncate"
                        title={`${session.subjectName} - ${format(sessionDate, "HH:mm")}`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {format(sessionDate, "HH:mm")}
                        </div>
                        <div className="truncate">{session.subjectName}</div>
                      </div>
                    )
                  })}
                  {daySessions.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{daySessions.length - 3} mais
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sessões do Dia Selecionado */}
      {selectedDate && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Sessões de {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedDateSessions.length}{" "}
                {selectedDateSessions.length === 1 ? "sessão" : "sessões"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
              Fechar
            </Button>
          </div>

          {selectedDateSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma sessão registrada para este dia.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateSessions.map((session) => {
                const sessionDate = parseISO(session.startTime)
                const durationHours = Math.floor(session.durationMinutes / 60)
                const durationMinutes = session.durationMinutes % 60

                return (
                  <div
                    key={session.id}
                    className="rounded-lg border border-border bg-muted/30 p-4 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold">{session.subjectName || "Assunto"}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {format(sessionDate, "HH:mm")} -{" "}
                          {format(
                            new Date(sessionDate.getTime() + session.durationMinutes * 60000),
                            "HH:mm"
                          )}
                        </p>
                        {session.notes && (
                          <p className="text-sm text-foreground">{session.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {durationHours > 0 && `${durationHours}h `}
                          {durationMinutes > 0 && `${durationMinutes}min`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
