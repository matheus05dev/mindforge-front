"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Play } from "lucide-react"
import { studiesService } from "@/lib/api"
import type { Quiz } from "@/lib/api/types"
import { QuizPlayer } from "./quiz-player"

interface SubjectQuizzesProps {
  subjectId: number
}

export function SubjectQuizzes({ subjectId }: SubjectQuizzesProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  useEffect(() => {
    loadQuizzes()
  }, [subjectId])

  async function loadQuizzes() {
    try {
      const data = await studiesService.getQuizzesBySubject(subjectId)
      setQuizzes(data)
    } catch (error) {
      console.error("Erro ao carregar quizzes:", error)
    }
  }

  async function handleDelete(quizId: number) {
    if (confirm("Deseja realmente excluir este quiz?")) {
      try {
        await studiesService.deleteQuiz(quizId)
        loadQuizzes()
      } catch (error) {
        console.error("Erro ao deletar quiz:", error)
      }
    }
  }

  async function handlePlayQuiz(quizId: number) {
    try {
      const quiz = await studiesService.getQuizById(quizId)
      setSelectedQuiz(quiz)
    } catch (error) {
      console.error("Erro ao carregar quiz:", error)
    }
  }

  if (selectedQuiz) {
    return <QuizPlayer quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Quizzes</h2>
        <Button disabled>
          <Plus className="w-4 h-4 mr-2" />
          Novo Quiz (Em breve)
        </Button>
      </div>

      <div className="grid gap-4">
        {quizzes.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <p>Nenhum quiz disponível ainda.</p>
            <p className="text-sm mt-2">Crie quizzes para testar seus conhecimentos!</p>
          </Card>
        ) : (
          quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  {quiz.description && (
                    <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>📝 {quiz.questionCount} questões</span>
                    <span>
                      {quiz.difficulty === "EASY" && "🟢 Fácil"}
                      {quiz.difficulty === "MEDIUM" && "🟡 Médio"}
                      {quiz.difficulty === "HARD" && "🔴 Difícil"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handlePlayQuiz(quiz.id)}>
                    <Play className="w-4 h-4 mr-2" />
                    Fazer Quiz
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(quiz.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
