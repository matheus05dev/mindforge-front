import { FileText, FolderKanban, GraduationCap, MessageSquare, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Activity {
  id: string
  type: "project" | "study" | "knowledge" | "chat" | "task"
  title: string
  description: string
  time: string
}

const iconMap = {
  project: FolderKanban,
  study: GraduationCap,
  knowledge: FileText,
  chat: MessageSquare,
  task: CheckCircle2,
}

const colorMap = {
  project: "text-blue-500 bg-blue-500/10",
  study: "text-amber-500 bg-amber-500/10",
  knowledge: "text-green-500 bg-green-500/10",
  chat: "text-primary bg-primary/10",
  task: "text-emerald-500 bg-emerald-500/10",
}

interface RecentActivityProps {
  activities?: Activity[]
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Atividade Recente</h3>
        <p className="text-sm text-muted-foreground">Suas últimas atualizações</p>
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>
        ) : (
          activities.map((activity) => {
            const Icon = iconMap[activity.type]
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-accent/50 cursor-pointer"
              >
                <div className={cn("rounded-md p-2", colorMap[activity.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
