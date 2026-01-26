"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Mail, Key, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"

export default function PerfilPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  
  // Password Change State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmationPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirmation: false,
  })

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirmation') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  // Check if password change is available (GitHub users might not have a password set initially)
  // Backend handles empty password logic, but for UI we might want to change labels
  const isSocialLogin = user && (!user.name || user.name.includes("GitHub")); // Approximate check, ideally backend flags this

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (passwords.newPassword !== passwords.confirmationPassword) {
      toast.error("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      await apiClient.request("/api/auth/change-password", { // Using request directly or could add to client
        method: "PATCH",
        body: JSON.stringify(passwords)
      })
      
      toast.success("Senha atualizada com sucesso!")
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmationPassword: "",
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Erro ao atualizar senha")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  if (!user) {
      return (
          <AppShell>
              <div className="flex items-center justify-center h-full">Carregando perfil...</div>
          </AppShell>
      )
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e segurança</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Cartão de Informações Pessoais */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>Usuário MindForge</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Conta</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {user.role || "USER"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cartão de Segurança (Troca de Senha) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Segurança
              </CardTitle>
              <CardDescription>Atualize sua senha de acesso</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="currentPassword" 
                        name="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        className="pl-9 pr-10" 
                        placeholder={isSocialLogin ? "Deixe em branco se for GitHub" : "Sua senha atual"}
                        value={passwords.currentPassword}
                        onChange={handleChange}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('current')}
                    >
                        {showPasswords.current ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPasswords.current ? 'Hide password' : 'Show password'}</span>
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Se você logou com GitHub e nunca definiu uma senha, pode deixar este campo em branco para definir uma nova senha.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="newPassword" 
                        name="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        className="pl-9 pr-10" 
                        placeholder="Nova senha forte"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('new')}
                    >
                        {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPasswords.new ? 'Hide password' : 'Show password'}</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmationPassword">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="confirmationPassword" 
                        name="confirmationPassword"
                        type={showPasswords.confirmation ? "text" : "password"}
                        className="pl-9 pr-10" 
                        placeholder="Repita a nova senha"
                        value={passwords.confirmationPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('confirmation')}
                    >
                        {showPasswords.confirmation ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPasswords.confirmation ? 'Hide password' : 'Show password'}</span>
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Atualizando..." : "Atualizar Senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
