"use client"

import type { KnowledgeItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, MoreHorizontal, Hash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface KnowledgeCardProps {
  item: KnowledgeItem
  variant?: "grid" | "list"
  onClick?: () => void
}

const categoryColors: Record<string, string> = {
  Programming: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  DevOps: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Database: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Frontend: "bg-green-500/10 text-green-500 border-green-500/20",
  Architecture: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Tools: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

export function KnowledgeCard({ item, variant = "grid", onClick }: KnowledgeCardProps) {
  // Extract first paragraph as preview
  const preview = item.content
    .split("\n")
    .filter((line) => !line.startsWith("#") && !line.startsWith("```") && line.trim())
    .slice(0, 2)
    .join(" ")
    .slice(0, 120)

  if (variant === "list") {
    return (
      <div
        className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-all cursor-pointer"
        onClick={onClick}
      >
        <div className="rounded-md bg-primary/10 p-2.5">
          <FileText className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{item.title}</h3>
            <Badge variant="outline" className={cn("text-xs shrink-0", categoryColors[item.category])}>
              {item.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">{preview}...</p>
        </div>

        <div className="flex items-center gap-2">
          {item.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs gap-1">
              <Hash className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div
      className="group rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/5"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="outline" className={cn("text-xs", categoryColors[item.category])}>
            {item.category}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{preview}...</p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs gap-1">
            <Hash className="h-3 w-3" />
            {tag}
          </Badge>
        ))}
        {item.tags.length > 3 && (
          <Badge variant="secondary" className="text-xs">
            +{item.tags.length - 3}
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}
