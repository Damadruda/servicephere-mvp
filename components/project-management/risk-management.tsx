
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Target,
  Calendar,
  User
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface RiskManagementProps {
  contractId: string
}

export function RiskManagement({ contractId }: RiskManagementProps) {
  const [newRiskDialog, setNewRiskDialog] = useState(false)
  const [editRiskDialog, setEditRiskDialog] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<any>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock risks data - would come from API
  const [risks] = useState([
    {
      id: '1',
      title: 'Retraso en aprobaciones del cliente',
      description: 'Las aprobaciones de los entregables por parte del cliente pueden tomar más tiempo del estimado',
      category: 'schedule',
      severity: 'high',
      probability: 70,
      impact: 8,
      riskScore: 56,
      status: 'active',
      owner: 'Juan Pérez',
      identifiedDate: new Date('2024-01-15'),
      mitigationPlan: 'Establecer cronograma de revisiones con fechas límite claras',
      contingencyPlan: 'Tener recursos adicionales listos para acelerar entregas',
      lastReview: new Date('2024-03-01'),
      nextReview: new Date('2024-03-15')
    },
    {
      id: '2',
      title: 'Dependencia de sistema legacy crítico',
      description: 'El sistema legacy tiene vulnerabilidades de seguridad que pueden afectar la integración',
      category: 'technical',
      severity: 'critical',
      probability: 45,
      impact: 9,
      riskScore: 41,
      status: 'active',
      owner: 'María González',
      identifiedDate: new Date('2024-01-20'),
      mitigationPlan: 'Actualización de seguridad del sistema legacy antes de la integración',
      contingencyPlan: 'Implementar capa de abstracción adicional',
      lastReview: new Date('2024-02-28'),
      nextReview: new Date('2024-03-12')
    },
    {
      id: '3',
      title: 'Recursos de testing limitados',
      description: 'El equipo de QA tiene capacidad limitada para el volumen de testing requerido',
      category: 'resource',
      severity: 'medium',
      probability: 60,
      impact: 6,
      riskScore: 36,
      status: 'mitigated',
      owner: 'Carlos Rodriguez',
      identifiedDate: new Date('2024-02-01'),
      mitigationPlan: 'Contratar recursos externos de testing',
      contingencyPlan: 'Priorizar casos de prueba críticos',
      lastReview: new Date('2024-03-05'),
      nextReview: new Date('2024-03-20')
    }
  ])

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'schedule', label: 'Cronograma' },
    { value: 'technical', label: 'Técnico' },
    { value: 'resource', label: 'Recursos' },
    { value: 'budget', label: 'Presupuesto' },
    { value: 'quality', label: 'Calidad' },
    { value: 'external', label: 'Externo' }
  ]

  const severityLevels = [
    { value: 'all', label: 'Todas las severidades' },
    { value: 'low', label: 'Bajo' },
    { value: 'medium', label: 'Medio' },
    { value: 'high', label: 'Alto' },
    { value: 'critical', label: 'Crítico' }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800'
      case 'mitigated': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'monitoring': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'schedule': return <Calendar className="h-4 w-4" />
      case 'technical': return <Shield className="h-4 w-4" />
      case 'resource': return <User className="h-4 w-4" />
      case 'budget': return <Target className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = searchTerm === '' || 
      risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || risk.category === filterCategory
    const matchesSeverity = filterSeverity === 'all' || risk.severity === filterSeverity

    return matchesSearch && matchesCategory && matchesSeverity
  })

  const riskMatrix = [
    { impact: 'Muy Alto', probability: [1, 2, 3, 4, 5] },
    { impact: 'Alto', probability: [1, 2, 3, 4, 5] },
    { impact: 'Medio', probability: [1, 2, 3, 4, 5] },
    { impact: 'Bajo', probability: [1, 2, 3, 4, 5] },
    { impact: 'Muy Bajo', probability: [1, 2, 3, 4, 5] }
  ]

  const getRiskColor = (probability: number, impact: number) => {
    const score = probability * impact / 10
    if (score >= 4) return 'bg-red-500'
    if (score >= 3) return 'bg-orange-500'
    if (score >= 2) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const activeRisks = risks.filter(r => r.status === 'active').length
  const mitigatedRisks = risks.filter(r => r.status === 'mitigated').length
  const avgRiskScore = risks.reduce((acc, r) => acc + r.riskScore, 0) / risks.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Riesgos</h2>
          <p className="text-gray-600">
            Identifica, evalúa y mitiga los riesgos del proyecto
          </p>
        </div>
        <Dialog open={newRiskDialog} onOpenChange={setNewRiskDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Riesgo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Riesgo</DialogTitle>
              <DialogDescription>
                Registra un nuevo riesgo identificado en el proyecto
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Título del Riesgo</Label>
                  <Input placeholder="Ej: Retraso en entregas..." />
                </div>
                <div>
                  <Label>Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Descripción</Label>
                <Textarea placeholder="Describe el riesgo en detalle..." rows={3} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Severidad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.slice(1).map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Probabilidad (%)</Label>
                  <Input type="number" min="0" max="100" placeholder="50" />
                </div>
                <div>
                  <Label>Impacto (1-10)</Label>
                  <Input type="number" min="1" max="10" placeholder="5" />
                </div>
              </div>

              <div>
                <Label>Plan de Mitigación</Label>
                <Textarea placeholder="Acciones para reducir el riesgo..." rows={2} />
              </div>

              <div>
                <Label>Plan de Contingencia</Label>
                <Textarea placeholder="Qué hacer si el riesgo se materializa..." rows={2} />
              </div>

              <div>
                <Label>Responsable</Label>
                <Input placeholder="Nombre del responsable" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewRiskDialog(false)}>
                Cancelar
              </Button>
              <Button>Agregar Riesgo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Riesgos Activos</p>
                <p className="text-xl font-bold">{activeRisks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mitigados</p>
                <p className="text-xl font-bold">{mitigatedRisks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Score Promedio</p>
                <p className="text-xl font-bold">{Math.round(avgRiskScore)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Riesgos</p>
                <p className="text-xl font-bold">{risks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Management Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Riesgos</TabsTrigger>
          <TabsTrigger value="matrix">Matriz de Riesgos</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar riesgos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Risk List */}
          <div className="space-y-4">
            {filteredRisks.map(risk => (
              <Card key={risk.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getCategoryIcon(risk.category)}
                        <h3 className="font-semibold text-lg">{risk.title}</h3>
                        <Badge className={getSeverityColor(risk.severity)}>
                          {risk.severity}
                        </Badge>
                        <Badge className={getStatusColor(risk.status)}>
                          {risk.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{risk.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Probabilidad</p>
                          <Progress value={risk.probability} className="mb-1" />
                          <p className="text-xs text-gray-500">{risk.probability}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Impacto</p>
                          <Progress value={risk.impact * 10} className="mb-1" />
                          <p className="text-xs text-gray-500">{risk.impact}/10</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Score de Riesgo</p>
                          <Progress value={risk.riskScore} className="mb-1" />
                          <p className="text-xs text-gray-500">{risk.riskScore}/100</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Plan de Mitigación:</h4>
                          <p className="text-sm text-gray-600">{risk.mitigationPlan}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Plan de Contingencia:</h4>
                          <p className="text-sm text-gray-600">{risk.contingencyPlan}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                        <span>Responsable: {risk.owner}</span>
                        <span>Próxima revisión: {format(risk.nextReview, 'PPP', { locale: es })}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Riesgos</CardTitle>
              <CardDescription>
                Visualización de riesgos por probabilidad e impacto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Alto Riesgo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Medio-Alto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Medio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Bajo Riesgo</span>
                  </div>
                </div>

                {/* Risk Matrix */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-gray-50">Impacto / Probabilidad</th>
                        <th className="border p-2 bg-gray-50">Muy Baja (1)</th>
                        <th className="border p-2 bg-gray-50">Baja (2)</th>
                        <th className="border p-2 bg-gray-50">Media (3)</th>
                        <th className="border p-2 bg-gray-50">Alta (4)</th>
                        <th className="border p-2 bg-gray-50">Muy Alta (5)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskMatrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="border p-2 bg-gray-50 font-medium">
                            {row.impact} ({5 - rowIndex})
                          </td>
                          {row.probability.map((prob, colIndex) => {
                            const cellRisks = risks.filter(r => 
                              Math.round(r.probability / 20) === prob && 
                              Math.round(r.impact / 2) === (5 - rowIndex)
                            )
                            return (
                              <td 
                                key={colIndex} 
                                className={`border p-2 h-20 ${getRiskColor(prob, 5 - rowIndex)} text-white text-xs`}
                              >
                                {cellRisks.map(risk => (
                                  <div key={risk.id} className="truncate mb-1">
                                    {risk.title}
                                  </div>
                                ))}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(1).map(category => {
                    const count = risks.filter(r => r.category === category.value).length
                    const percentage = (count / risks.length) * 100
                    return (
                      <div key={category.value}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category.label}</span>
                          <span>{count} riesgos</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Severidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {severityLevels.slice(1).map(level => {
                    const count = risks.filter(r => r.severity === level.value).length
                    const percentage = (count / risks.length) * 100
                    return (
                      <div key={level.value}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{level.label}</span>
                          <span>{count} riesgos</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
