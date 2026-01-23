"use client"

import { useEffect, useState } from "react"
import { studiesService } from "@/lib/api/services/studies.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ExternalLink, BookOpen, Video, FileText, Loader2, Map } from "lucide-react"

export function GeneratedRoadmapList({ refreshTrigger }: { refreshTrigger: number }) {
  const [roadmaps, setRoadmaps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoadmaps()
  }, [refreshTrigger])

  async function loadRoadmaps() {
    try {
      setLoading(true)
      const data = await studiesService.getAllRoadmaps()
      setRoadmaps(data)
    } catch (error) {
      console.error("Failed to load roadmaps", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Nenhum plano de estudos ainda</h3>
        <p className="text-muted-foreground">Gere seu primeiro roadmap com IA para começar!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      {roadmaps.map((roadmap) => (
        <Card key={roadmap.id} className="overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {roadmap.title}
                </CardTitle>
                <CardDescription className="mt-2">{roadmap.description}</CardDescription>
              </div>
              <Badge variant="outline">{roadmap.targetAudience}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {roadmap.items.map((item: any) => (
                <AccordionItem key={item.id} value={`item-${item.id}`}>
                  <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {item.orderIndex}
                      </div>
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 bg-muted/10">
                    <div className="pl-12 space-y-4">
                      <p className="text-sm text-foreground/80">{item.description}</p>
                      
                      {item.resources && item.resources.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Recursos Recomendados
                          </h4>
                          <div className="grid gap-2">
                            {item.resources.map((res: any, idx: number) => (
                              <a
                                key={idx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-md border bg-background hover:bg-muted transition-colors group"
                              >
                                <div className="p-2 rounded bg-primary/5 text-primary group-hover:bg-primary/10">
                                  {res.url.includes("youtube") ? <Video className="h-4 w-4" /> : 
                                   res.url.includes("pdf") ? <FileText className="h-4 w-4" /> : 
                                   <BookOpen className="h-4 w-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{res.title}</div>
                                  <div className="text-xs text-muted-foreground truncate opacity-70">
                                    {new URL(res.url).hostname}
                                  </div>
                                </div>
                                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
