
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Target, 
  Clock,
  BarChart3,
  PieChart,
  Download,
  Share,
  AlertTriangle,
  CheckCircle2,
  Activity
} from 'lucide-react'
import { format, subDays, subWeeks, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts'

interface ProgressReportingProps {
  contract: any
}

export function ProgressReporting({ contract }: ProgressReportingProps) {
  const [reportPeriod, setReportPeriod] = useState('month')
  const [reportType, setReportType] = useState('overview')

  // Mock data - would come from API
  const progressData = [
    { date: '2024-01-01', progress: 10, budget: 20 },
    { date: '2024-01-15', progress: 25, budget: 35 },
    { date: '2024-02-01', progress: 40, budget: 50 },
    { date: '2024-02-15', progress: 60, budget: 65 },
    { date: '2024-03-01', progress: 75, budget: 80 },
    { date: '2024-03-15', progress: 85, budget: 90 }
  ]

  const milestoneStatusData = [
    { name: 'Completados', value: 8, color: '#10b981' },
    { name: 'En Progreso', value: 3, color: '#3b82f6' },
    { name: 'Pendientes', value: 2, color: '#f59e0b' },
    { name: 'Retrasados', value: 1, color: '#ef4444' }
  ]

  const budgetData = [
    { category: 'Desarrollo', planned: 50000, spent: 42000 },
    { category: 'Testing', planned: 20000, spent: 18500 },
    { category: 'Deployment', planned: 15000, spent: 12000 },
    { category: 'Support', planned: 10000, spent: 8000 }
  ]

  const teamPerformanceData = [
    { name: 'Juan Pérez', tasksCompleted: 12, onTime: 92 },
    { name: 'María González', tasksCompleted: 10, onTime: 88 },
    { name: 'Carlos Rodriguez', tasksCompleted: 14, onTime: 95 },
    { name: 'Ana Torres', tasksCompleted: 8, onTime: 85 }
  ]

  const totalMilestones = contract.milestones?.milestones?.length || 0
  const completedMilestones = contract.milestoneUpdates?.filter((m: any) => 
    m.status === 'COMPLETED'
  ).length || 0
  const overallProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  const daysUntilDeadline = Math.ceil(
    (new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const totalBudget = budgetData.reduce((acc, item) => acc + item.planned, 0)
  const spentBudget = budgetData.reduce((acc, item) => acc + item.spent, 0)
  const budgetProgress = (spentBudget / totalBudget) * 100

  const exportReport = (type: 'pdf' | 'excel') => {
    // Implement export logic
    console.log(`Exporting ${type} report`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reportes de Progreso</h2>
          <p className="text-gray-600">
            Análisis detallado del avance y rendimiento del proyecto
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedMilestones} de {totalMilestones} hitos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Utilizado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(budgetProgress)}%</div>
            <Progress value={budgetProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              ${spentBudget.toLocaleString()} de ${totalBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días Restantes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysUntilDeadline > 0 ? daysUntilDeadline : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Hasta: {format(new Date(contract.endDate), 'PPP', { locale: es })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado General</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallProgress >= 90 ? 'Excelente' : 
               overallProgress >= 70 ? 'Bueno' :
               overallProgress >= 50 ? 'Regular' : 'Necesita atención'}
            </div>
            <Badge className={
              overallProgress >= 90 ? 'bg-green-100 text-green-800' :
              overallProgress >= 70 ? 'bg-blue-100 text-blue-800' :
              overallProgress >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              {contract.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="budget">Presupuesto</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendencia de Progreso
                </CardTitle>
                <CardDescription>
                  Comparación entre progreso real y planificado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'MMM d', { locale: es })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'PPP', { locale: es })}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="progress" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Progreso Real"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="budget" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Progreso Planificado"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Milestone Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Estado de Hitos
                </CardTitle>
                <CardDescription>
                  Distribución del estado actual de los hitos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={milestoneStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {milestoneStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Logros Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    ✅ Completado hito "Configuración inicial"
                  </div>
                  <div className="text-sm text-gray-600">
                    ✅ Aprobada documentación técnica
                  </div>
                  <div className="text-sm text-gray-600">
                    ✅ Implementación base finalizada
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Riesgos Identificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    ⚠️ Posible retraso en testing
                  </div>
                  <div className="text-sm text-gray-600">
                    ⚠️ Dependencia externa crítica
                  </div>
                  <div className="text-sm text-gray-600">
                    ⚠️ Recursos limitados para QA
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Próximos Hitos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    📅 Testing integrado - 15 Mar
                  </div>
                  <div className="text-sm text-gray-600">
                    📅 Capacitación usuarios - 22 Mar
                  </div>
                  <div className="text-sm text-gray-600">
                    📅 Go-live preparación - 29 Mar
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progreso por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Desarrollo</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Testing</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Documentación</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Capacitación</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Velocity del Equipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tasksCompleted" fill="#3b82f6" name="Tareas Completadas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Presupuestario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="planned" fill="#e5e7eb" name="Planificado" />
                    <Bar dataKey="spent" fill="#3b82f6" name="Gastado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento del Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformanceData.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge className="bg-green-100 text-green-800">
                        {member.onTime}% puntualidad
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Tareas completadas: {member.tasksCompleted}</span>
                      <span>Eficiencia: Alta</span>
                    </div>
                    <Progress value={member.onTime} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
