"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  History, 
  ArrowRightCircle,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { apiClient as api } from "@/lib/api/client"

interface DecisionMetrics {
  totalDecisions: number
  acceptedCount: number
  proposedCount: number
  rejectedCount: number
  deprecatedCount: number
  acceptanceRate: number
  volatilityScore: number
}

interface DecisionMetricsDashboardProps {
  projectId: number
}

export function DecisionMetricsDashboard({ projectId }: DecisionMetricsDashboardProps) {
  const [metrics, setMetrics] = useState<DecisionMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true)
        const data = await api.get<DecisionMetrics>(`/api/projects/${projectId}/decisions/metrics`)
        setMetrics(data)
      } catch (error) {
        console.error("Failed to load metrics", error)
        try {
          if (typeof error === 'object' && error !== null) {
            console.error("Metrics error details:", JSON.stringify(error, null, 2))
          }
        } catch (e) {
          console.error("Could not serialize metrics error")
        }
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [projectId])

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-pulse">
        <div className="h-24 bg-muted rounded-xl" />
        <div className="h-24 bg-muted rounded-xl" />
        <div className="h-24 bg-muted rounded-xl" />
      </div>
    )
  }

  const chartData = [
    { name: "Aceitas", value: metrics.acceptedCount, fill: "#22c55e" },
    { name: "Rejeitadas", value: metrics.rejectedCount, fill: "#ef4444" },
    { name: "Deprecadas", value: metrics.deprecatedCount, fill: "#6b7280" },
    { name: "Propostas", value: metrics.proposedCount, fill: "#3b82f6" },
  ]

  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Acceptance Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aceitação</CardTitle>
            {metrics.acceptanceRate > 0.7 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
                <TrendingDown className="h-4 w-4 text-yellow-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.acceptanceRate * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Das decisões propostas foram aceitas
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Volatility */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volatilidade de Plano</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.volatilityScore * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de mudança (Rejeitadas + Deprecadas)
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total Decisions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Decisões</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDecisions}</div>
            <p className="text-xs text-muted-foreground">
              Registros no histórico
            </p>
          </CardContent>
        </Card>
      </div>

       {/* Chart Section - Conditionally rendered if there is data */}
       {metrics.totalDecisions > 0 && (
          <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
                <CardDescription>Como as decisões estão evoluindo no projeto</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={12} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
       )}
    </div>
  )
}
