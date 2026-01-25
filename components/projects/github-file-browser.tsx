"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, FileCode, ChevronRight, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { githubService, type GitHubFileTree } from "@/lib/api/services/github.service"
import { toast } from "sonner"

interface GitHubFileBrowserProps {
  owner: string
  repo: string
  onFileSelect: (filePath: string) => void
  selectedFile?: string
}

interface TreeNode extends GitHubFileTree {
  children?: TreeNode[]
  isExpanded?: boolean
}

export function GitHubFileBrowser({ owner, repo, onFileSelect, selectedFile }: GitHubFileBrowserProps) {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadRootTree()
  }, [owner, repo])

  const loadRootTree = async () => {
    setIsLoading(true)
    try {
      const data = await githubService.getRepoTree(owner, repo)
      setTree(data)
    } catch (error: any) {
      console.error("Erro ao carregar árvore de arquivos:", JSON.stringify(error, null, 2))
      if (error.response) {
          console.error("Detalhes do erro:", error.response.data)
      }
      toast.error("Erro ao carregar arquivos do repositório")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDirectory = async (path: string) => {
    // If expanding, check if we need to load children
    if (!expandedDirs.has(path)) {
      // Find the node in the tree
      const findNode = (nodes: TreeNode[]): TreeNode | null => {
        for (const node of nodes) {
          if (node.path === path) return node
          if (node.children) {
            const found = findNode(node.children)
            if (found) return found
          }
        }
        return null
      }

      const node = findNode(tree)
      if (node && !node.children) {
        // Need to load children
        try {
          const children = await githubService.getRepoTree(owner, repo, path)
          // Update tree with new children
          setTree(prevTree => {
            const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
              return nodes.map(n => {
                if (n.path === path) {
                  return { ...n, children: children as TreeNode[] }
                }
                if (n.children) {
                  return { ...n, children: updateNodes(n.children) }
                }
                return n
              })
            }
            return updateNodes(prevTree)
          })
        } catch (error) {
          console.error("Erro ao carregar subpasta:", error)
          toast.error("Erro ao abrir pasta")
          return // Don't expand if failed
        }
      }
    }

    setExpandedDirs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedDirs.has(node.path)
    const isSelected = selectedFile === node.path
    const paddingLeft = `${level * 1.5}rem`

    if (node.type === "dir") {
      return (
        <div key={node.path}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-8 px-2 font-normal",
              isExpanded && "bg-accent"
            )}
            style={{ paddingLeft }}
            onClick={() => toggleDirectory(node.path)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
            )}
            <Folder className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
            <span className="truncate">{node.path.split("/").pop()}</span>
          </Button>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    // File node
    const fileName = node.path.split("/").pop() || ""
    const isCodeFile = /\.(js|ts|jsx|tsx|py|java|cpp|c|go|rs|rb|php|cs|swift|kt)$/i.test(fileName)

    return (
      <Button
        key={node.path}
        variant="ghost"
        className={cn(
          "w-full justify-start h-8 px-2 font-normal",
          isSelected && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft }}
        onClick={() => onFileSelect(node.path)}
      >
        <FileCode className={cn(
          "h-4 w-4 mr-2 shrink-0",
          isCodeFile ? "text-green-500" : "text-muted-foreground"
        )} />
        <span className="truncate">{fileName}</span>
        {node.size && (
          <span className="ml-auto text-xs text-muted-foreground">
            {(node.size / 1024).toFixed(1)}KB
          </span>
        )}
      </Button>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Folder className="h-12 w-12 mb-2 opacity-50" />
        <p>Nenhum arquivo encontrado</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[500px] w-full rounded-md border">
      <div className="p-2">
        {tree.map(node => renderTreeNode(node))}
      </div>
    </ScrollArea>
  )
}
