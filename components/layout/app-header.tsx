"use client"

import { usePathname } from "next/navigation"
import { ChevronRight, Bell, User, LogOut, Settings, HelpCircle, Sparkles, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useStore } from "@/lib/store"

export function AppHeader() {
  const pathname = usePathname()
  const { currentWorkspace, toggleAINotes, isAgentMode, toggleAgentMode } = useStore()

  const pathTitles: Record<string, string> = {
    "/": "Dashboard",
    "/kanban": "Kanban Geral",
    "/projetos": "Projetos",
    "/projetos/kanban": "Kanban por Projeto",
    "/projetos/lista": "Lista de Projetos",
    "/projetos/roadmap": "Roadmap de Projetos",
    "/projetos/agenda": "Agenda de Compromissos",
    "/estudos": "Estudos",
    "/studies": "Estudos",
    "/studies/subjects": "Matérias",
    "/estudos/cursos": "Meus Estudos",
    "/estudos/roadmap": "Roadmap de Estudos",
    "/estudos/anotacoes": "Anotações",
    "/estudos/agenda": "Agenda",
    "/knowledge": isAgentMode ? "Memória do Agente" : "Base de Conhecimento",
    "/documentos": "Documentos",
    "/chat": "Chat com IA",
    "/configuracoes": "Configurações",
  }

  // Construir breadcrumbs do pathname
  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbs = [
    { title: currentWorkspace.name, href: "/" },
    ...pathSegments.map((segment, index) => ({
      title: pathTitles[`/${pathSegments.slice(0, index + 1).join("/")}`] || segment,
      href: `/${pathSegments.slice(0, index + 1).join("/")}`,
    })),
  ]

  const notifications = [
    {
      id: 1,
      title: "🚀 MindForge Versão 1.0",
      description: "Esta é a versão oficial do MindForge.",
      time: "Sistema",
      href: null,
    },
    {
      id: 2,
      title: "📂 Repositório API Backend",
      description: "Acesse o código fonte do servidor no GitHub.",
      time: "GitHub",
      href: "https://github.com/matheus05dev/mindforge-api",
    },
    {
      id: 3,
      title: "🎨 Repositório Frontend",
      description: "Acesse o código fonte da interface no GitHub.",
      time: "GitHub",
      href: "https://github.com/matheus05dev/mindforge-front",
    },
  ]

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <span
              className={
                index === breadcrumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              }
            >
              {crumb.title}
            </span>
          </div>
        ))}
      </nav>

      {/* Ações do Lado Direito */}
      <div className="flex items-center gap-2">
        {/* Agent Mode Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleAgentMode} 
          title={isAgentMode ? "Desativar Modo Agente" : "Ativar Modo Agente"}
          className={isAgentMode ? "bg-primary/10 text-primary" : ""}
        >
            <Bot className="h-4 w-4" /> 
        </Button>

        {/* AI Notes Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleAINotes} title="MindForge AI Notes">
            <Sparkles className="h-4 w-4 text-primary" />
        </Button>

        {/* Notificações */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {notifications.length}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <h4 className="font-semibold">Notificações</h4>
            </div>
            <div className="max-h-80 overflow-auto">
              {notifications.map((notification) => {
                const Content = (
                  <div className="flex flex-col gap-1 border-b border-border px-4 py-3 last:border-0 hover:bg-accent/50 cursor-pointer">
                    <span className="text-sm font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.description}</span>
                    <span className="text-[10px] text-primary/70">{notification.time}</span>
                  </div>
                )

                if (notification.href) {
                  return (
                    <a key={notification.id} href={notification.href} target="_blank" rel="noopener noreferrer">
                      {Content}
                    </a>
                  )
                }

                return <div key={notification.id}>{Content}</div>
              })}
            </div>
            <div className="border-t border-border px-4 py-2">
              <Button variant="ghost" size="sm" className="w-full">
                Ver todas as notificações
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Usuário</span>
                <span className="text-xs text-muted-foreground">usuario@exemplo.com</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Ajuda e Suporte
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
