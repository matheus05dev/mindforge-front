"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Play, Pause, Square, Timer, Save } from "lucide-react"
import { studiesService } from "@/lib/api"
import type { Subject } from "@/lib/api/types"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface StudyTimerProps {
  subjects: Subject[]
  onSessionLogged: () => void
}

export function StudyTimer({ subjects, onSessionLogged }: StudyTimerProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("")
  const [status, setStatus] = useState<"IDLE" | "RUNNING" | "PAUSED" | "FINISHED">("IDLE")
  const [seconds, setSeconds] = useState(0)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (status === "RUNNING") {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status])

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (!selectedSubjectId) {
      alert("Selecione uma matéria para começar.")
      return
    }
    setStatus("RUNNING")
  }

  const handlePause = () => setStatus("PAUSED")

  const handleStop = () => {
    setStatus("FINISHED")
  }

  const handleReset = () => {
    setStatus("IDLE")
    setSeconds(0)
    setNotes("")
  }

  const handleSaveSession = async () => {
    try {
      setIsSubmitting(true)
      const durationMinutes = Math.ceil(seconds / 60)
      
      // Prevent saving extremely short sessions accidentally, but allow 1 min
      if (durationMinutes < 1 && seconds < 10) {
        if(!confirm("A sessão foi muito curta. Deseja salvar mesmo assim?")) {
           setIsSubmitting(false)
           return
        }
      }

      await studiesService.logSession(Number(selectedSubjectId), {
        startTime: new Date(Date.now() - seconds * 1000).toISOString(), // Aproximado
        durationMinutes: durationMinutes || 1, // Minimo 1 min
        notes: notes
      })

      onSessionLogged()
      handleReset()
    } catch (error) {
      console.error("Erro ao salvar sessão:", error)
      alert("Erro ao salvar sessão.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full h-full flex flex-col justify-between border-primary/20 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Cronômetro de Estudo
        </CardTitle>
        <CardDescription>Foque nos seus estudos e registre seu progresso.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 flex-1 flex flex-col">
        {/* Subject Selection */}
        <div className="space-y-2">
          <Label>O que vamos estudar agora?</Label>
          <Select 
            value={selectedSubjectId} 
            onValueChange={setSelectedSubjectId} 
            disabled={status === "RUNNING" || status === "PAUSED"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma matéria..." />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((sub) => (
                <SelectItem key={sub.id} value={sub.id.toString()}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timer Display */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-6xl font-mono font-bold tracking-wider tabular-nums text-foreground/90">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Notes (Only visible when finished or paused/running if desired, here showing always for simplicity or only when finished?) */}
        {status === "FINISHED" && (
           <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
             <Label>Notas da Sessão</Label>
             <Textarea 
               placeholder="O que você aprendeu hoje?" 
               value={notes} 
               onChange={(e) => setNotes(e.target.value)}
             />
           </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {status === "IDLE" && (
            <Button size="lg" className="w-full text-lg h-12" onClick={handleStart} disabled={!selectedSubjectId}>
              <Play className="mr-2 h-5 w-5" /> Iniciar Foco
            </Button>
          )}

          {status === "RUNNING" && (
            <>
              <Button size="lg" variant="outline" className="flex-1" onClick={handlePause}>
                <Pause className="mr-2 h-5 w-5" /> Pausar
              </Button>
              <Button size="lg" variant="destructive" className="flex-1" onClick={handleStop}>
                <Square className="mr-2 h-5 w-5" /> Parar
              </Button>
            </>
          )}

          {status === "PAUSED" && (
            <>
              <Button size="lg" className="flex-1" onClick={handleStart}>
                <Play className="mr-2 h-5 w-5" /> Retomar
              </Button>
              <Button size="lg" variant="destructive" className="flex-1" onClick={handleStop}>
                <Square className="mr-2 h-5 w-5" /> Parar
              </Button>
            </>
          )}

          {status === "FINISHED" && (
            <div className="flex gap-2 w-full">
               <Button variant="ghost" onClick={handleReset} disabled={isSubmitting}>
                 Descartar
               </Button>
               <Button className="flex-1" onClick={handleSaveSession} disabled={isSubmitting}>
                 <Save className="mr-2 h-4 w-4" /> Salvar Sessão
               </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
