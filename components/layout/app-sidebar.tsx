"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronDown,
  Plus,
  Search,
  Command,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Kanban,
  FileText,
  Calendar,
  Map,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useStore } from "@/lib/store"

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const { workspaces, currentWorkspace, setCurrentWorkspace, isAgentMode } = useStore()

  // Navegação baseada na workspace atual
  const getNavItems = () => {
    const knowledgeTitle = isAgentMode ? "Memória do Agente" : "Base de Conhecimento";

    switch (currentWorkspace.type) {
      case "geral":
        return [
          { title: "Dashboard", href: "/", icon: LayoutDashboard },
          { title: "Kanban Geral", href: "/kanban", icon: Kanban },
          { title: "Projetos", href: "/projects", icon: FolderKanban }, // Assuming projects is /projects too, checking context
          { title: "Estudos", href: "/studies", icon: GraduationCap },
          { title: knowledgeTitle, href: "/knowledge", icon: BookOpen },
        ]
      case "estudos": // Keep workspace type id as 'estudos'
        return [
          { title: "Visão Geral", href: "/studies", icon: LayoutDashboard },
          { title: "Meus Estudos", href: "/studies/courses", icon: GraduationCap },
          { title: "Roadmap", href: "/studies/roadmap", icon: Map },
          { title: "Anotações", href: "/studies/notes", icon: FileText },
          { title: "Agenda de Estudos", href: "/studies/agenda", icon: Calendar },
          { title: knowledgeTitle, href: "/knowledge", icon: BookOpen },
        ]
      case "projetos":
        return [
          { title: "Visão Geral", href: "/projetos", icon: LayoutDashboard },
          { title: "Kanban Geral", href: "/kanban", icon: Kanban },
          { title: "Kanban por Projeto", href: "/projetos/kanban", icon: Kanban },
          { title: "Todos os Projetos", href: "/projetos/lista", icon: FolderKanban },
          { title: "Roadmap", href: "/projetos/roadmap", icon: Map },
          { title: "Agenda de Compromissos", href: "/projetos/agenda", icon: Calendar },
          { title: knowledgeTitle, href: "/knowledge", icon: BookOpen },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  const bottomNavItems = [
    { title: "Chat com IA", href: "/chat", icon: MessageSquare },
    { title: "Documentos", href: "/documentos", icon: FileText },
    { title: "Configurações", href: "/configuracoes", icon: Settings },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Workspace Selector */}
        <div className="flex h-14 items-center border-b border-border px-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                  <span className="text-lg">{currentWorkspace.icon}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{currentWorkspace.name}</TooltipContent>
            </Tooltip>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-10 w-full items-center justify-between gap-2 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currentWorkspace.icon}</span>
                    <span className="font-medium">{currentWorkspace.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => setCurrentWorkspace(workspace)}
                    className={cn("flex items-center gap-2", currentWorkspace.id === workspace.id && "bg-accent")}
                  >
                    <span>{workspace.icon}</span>
                    <div className="flex flex-col">
                      <span>{workspace.name}</span>
                      <span className="text-xs text-muted-foreground">{workspace.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Busca Rápida */}
        {!collapsed && (
          <div className="px-3 py-2">
            <Button
              variant="outline"
              className="flex h-9 w-full items-center justify-between gap-2 bg-background/50 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="text-sm">Buscar...</span>
              </div>
              <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </Button>
          </div>
        )}

        {/* Navegação Principal */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="mb-2 h-10 w-10">
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Buscar (⌘K)</TooltipContent>
            </Tooltip>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                        <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="icon"
                        className={cn("relative h-10 w-10", isActive && "bg-primary/10 text-primary")}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "flex h-10 w-full items-center justify-start gap-3",
                    isActive && "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Acesso Rápido IA */}
        {!collapsed && (
          <div className="px-3 py-2">
            <Link href="/chat">
              <Button className="flex h-10 w-full items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20">
                <Sparkles className="h-4 w-4" />
                <span>Perguntar à IA</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Navegação Inferior */}
        <div className="mt-auto border-t border-border px-3 py-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="icon"
                        className={cn("h-10 w-10", isActive && "bg-primary/10 text-primary")}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "flex h-10 w-full items-center justify-start gap-3",
                    isActive && "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            )
          })}

          {/* Toggle Sidebar */}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={onToggle}
            className={cn("mt-2", collapsed ? "h-10 w-10" : "flex h-10 w-full items-center justify-start gap-3")}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Recolher</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
