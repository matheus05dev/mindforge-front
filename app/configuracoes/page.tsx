"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { Moon, Sun, Github } from "lucide-react"
import { useEffect, useState } from "react"
import { API_ENDPOINTS } from "@/lib/api/config"
import { useAuthStore } from "@/lib/auth-store"

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  /* Existing imports */
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGithubConnect = () => {
    // Redirecionar para o endpoint de conexão do GitHub
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${API_ENDPOINTS.githubConnect}`
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e integrações</p>
        </div>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência da aplicação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              {mounted && (
                <RadioGroup value={theme} onValueChange={setTheme}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                      <Sun className="h-4 w-4" />
                      Claro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                      <Moon className="h-4 w-4" />
                      Escuro
                    </Label>
                  </div>
                </RadioGroup>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Integrações */}
        <Card>
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
            <CardDescription>Conecte seus serviços para análise de repositórios com IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-background p-2">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">GitHub</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.isGithubConnected ? "Conta conectada para análise de repositórios" : "Conecte sua conta GitHub para análise de repositórios com IA"}
                  </p>
                </div>
              </div>
              {user?.isGithubConnected ? (
                <Button variant="outline" disabled className="text-green-500 border-green-500/50 bg-green-500/5">
                  Conectado
                </Button>
              ) : (
                <Button onClick={handleGithubConnect} variant="outline">
                  Conectar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

