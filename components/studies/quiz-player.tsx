"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import type { Quiz, QuizQuestion } from "@/lib/api/types"

interface QuizPlayerProps {
  quiz: Quiz
  onClose: () => void
}

export function QuizPlayer({ quiz, onClose }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const questions = quiz.questions || []
  const currentQuestion = questions[currentIndex]

  function handleAnswer(optionIndex: number) {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optionIndex
    setAnswers(newAnswers)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  function calculateScore() {
    let correct = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++
    })
    return { correct, total: questions.length, percentage: (correct / questions.length) * 100 }
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Resultado do Quiz</h2>
          <div className="text-4xl font-bold text-primary mb-2">
            {score.correct}/{score.total}
          </div>
          <p className="text-muted-foreground mb-4">
            Você acertou {score.percentage.toFixed(0)}% das questões
          </p>
          <Progress value={score.percentage} className="mb-6" />
        </Card>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const options = JSON.parse(q.options)
            const userAnswer = answers[idx]
            const isCorrect = userAnswer === q.correctAnswer

            return (
              <Card key={idx} className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{q.question}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      {options.map((opt: string, optIdx: number) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded ${
                            optIdx === q.correctAnswer
                              ? "bg-green-100 text-green-900"
                              : optIdx === userAnswer
                                ? "bg-red-100 text-red-900"
                                : ""
                          }`}
                        >
                          {opt}
                          {optIdx === q.correctAnswer && " ✓"}
                          {optIdx === userAnswer && optIdx !== q.correctAnswer && " ✗"}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="mt-2 text-sm text-muted-foreground italic">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return <div>Nenhuma questão disponível</div>
  }

  const options = JSON.parse(currentQuestion.options)
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <span className="text-sm text-muted-foreground">
          Questão {currentIndex + 1} de {questions.length}
        </span>
      </div>

      <Progress value={progress} />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
        <div className="space-y-2">
          {options.map((option: string, idx: number) => (
            <Button
              key={idx}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3"
              onClick={() => handleAnswer(idx)}
            >
              {option}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
