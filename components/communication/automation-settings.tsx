
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Zap, 
  Bot,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  Bell,
  Users,
  Filter,
  Play,
  Pause,
  Settings,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Calendar,
  Target
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface AutomationSettingsProps {
  userId: string
}

export function AutomationSettings({ userId }: AutomationSettingsProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [newWorkflowDialog, setNewWorkflowDialog] = useState(false)

  // Mock automation workflows
  const automationWorkflows = [
    {
      id: '1',
      name: 'Respuesta Automática - Nuevas Cotizaciones',
      description: 'Envía respuesta automática cuando se recibe una nueva solicitud de cotización',
      isActive: true,
      trigger: 'NEW_QUOTATION_REQUEST',
      actions: [
        { type: 'SEND_EMAIL', config: { template: 'quotation_received' } },
        { type: 'SEND_NOTIFICATION', config: { message: 'Nueva cotización recibida' } }
      ],
      lastRun: new Date(),
      runCount: 47,
      successRate: 98
    },
    {
      id: '2',
      name: 'Escalación de Proyectos Retrasados',
      description: 'Notifica al gerente cuando un proyecto supera la fecha límite',
      isActive: true,
      trigger: 'PROJECT_OVERDUE',
      actions: [
        { type: 'SEND_EMAIL', config: { template: 'project_overdue', recipients: ['manager@company.com'] } },
        { type: 'CREATE_TASK', config: { assignee: 'manager', priority: 'high' } }
      ],
      lastRun: new Date(Date.now() - 86400000),
      runCount: 12,
      successRate: 100
    },
    {
      id: '3',
      name: 'Recordatorio de Pagos Pendientes',
      description: 'Envía recordatorios automáticos 3 días antes del vencimiento de pagos',
      isActive: false,
      trigger: 'PAYMENT_REMINDER',
      actions: [
        { type: 'SEND_EMAIL', config: { template: 'payment_reminder' } },
        { type: 'SEND_SMS', config: { message: 'Recordatorio: Pago vence en 3 días' } }
      ],
      lastRun: null,
      runCount: 0,
      successRate: 0
    },
    {
      id: '4',
      name: 'Seguimiento de Hitos Completados',
      description: 'Actualiza automáticamente el progreso y notifica a stakeholders',
      isActive: true,
      trigger: 'MILESTONE_COMPLETED',
      actions: [
        { type: 'UPDATE_PROJECT_PROGRESS', config: {} },
        { type: 'SEND_NOTIFICATION', config: { message: 'Hito completado exitosamente' } },
        { type: 'GENERATE_REPORT', config: { type: 'progress_summary' } }
      ],
      lastRun: new Date(Date.now() - 3600000),
      runCount: 23,
      successRate: 95
    }
  ]

  // Mock smart responses
  const smartResponses = [
    {
      id: '1',
      trigger: 'greeting',
      keywords: ['hola', 'buenos días', 'buenas tardes', 'saludos'],
      response: 'Hola! Gracias por contactarnos. ¿En qué podemos ayudarte hoy?',
      isActive: true,
      category: 'general'
    },
    {
      id: '2',
      trigger: 'pricing_inquiry',
      keywords: ['precio', 'cotización', 'costo', 'tarifa'],
      response: 'Gracias por tu interés en nuestros servicios. Te conectaremos con un especialista para brindarte una cotización personalizada.',
      isActive: true,
      category: 'sales'
    },
    {
      id: '3',
      trigger: 'support_request',
      keywords: ['problema', 'error', 'ayuda', 'soporte'],
      response: 'Lamentamos escuchar sobre el inconveniente. Un miembro de nuestro equipo de soporte te contactará en las próximas 2 horas.',
      isActive: true,
      category: 'support'
    }
  ]

  const toggleWorkflow = async (workflowId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/automation/workflows/${workflowId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        toast.success(isActive ? 'Workflow activado' : 'Workflow pausado')
      }
    } catch (error) {
      toast.error('Error al actualizar workflow')
    }
  }

  const runWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/automation/workflows/${workflowId}/run`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Workflow ejecutado exitosamente')
      }
    } catch (error) {
      toast.error('Error al ejecutar workflow')
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-100'
    if (rate >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'NEW_QUOTATION_REQUEST': return <MessageSquare className="h-4 w-4" />
      case 'PROJECT_OVERDUE': return <AlertTriangle className="h-4 w-4" />
      case 'PAYMENT_REMINDER': return <Clock className="h-4 w-4" />
      case 'MILESTONE_COMPLETED': return <CheckCircle className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Automation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Automatización de Comunicación</h2>
          <p className="text-gray-600">
            Configura respuestas automáticas, workflows y escalaciones inteligentes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-800">
            {automationWorkflows.filter(w => w.isActive).length} workflows activos
          </Badge>
          <Dialog open={newWorkflowDialog} onOpenChange={setNewWorkflowDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Workflow</DialogTitle>
                <DialogDescription>
                  Configura un nuevo workflow de automatización
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre del Workflow</label>
                    <Input placeholder="Ej: Respuesta automática..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Evento Disparador</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar evento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW_MESSAGE">Nuevo mensaje</SelectItem>
                        <SelectItem value="NEW_PROJECT">Nuevo proyecto</SelectItem>
                        <SelectItem value="MILESTONE_DUE">Hito próximo a vencer</SelectItem>
                        <SelectItem value="PAYMENT_OVERDUE">Pago vencido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea placeholder="Describe qué hace este workflow..." rows={3} />
                </div>
                <div>
                  <label className="text-sm font-medium">Acciones</label>
                  <div className="space-y-2 mt-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Crear Notificación
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Enviar SMS
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Automation Tabs */}
      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="responses">Respuestas Automáticas</TabsTrigger>
          <TabsTrigger value="escalations">Escalaciones</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflows List */}
            <div className="lg:col-span-2 space-y-4">
              {automationWorkflows.map(workflow => (
                <Card key={workflow.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${workflow.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {getTriggerIcon(workflow.trigger)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{workflow.name}</h3>
                            <Badge className={workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {workflow.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                          
                          {/* Workflow Actions Preview */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-gray-500">Acciones:</span>
                            {workflow.actions.map((action, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {action.type.replace('_', ' ')}
                                </Badge>
                                {index < workflow.actions.length - 1 && (
                                  <ArrowRight className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Workflow Stats */}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Ejecutado:</span>
                              <p className="font-medium">{workflow.runCount} veces</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Última ejecución:</span>
                              <p className="font-medium">
                                {workflow.lastRun 
                                  ? format(workflow.lastRun, 'PPP', { locale: es })
                                  : 'Nunca'
                                }
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Tasa de éxito:</span>
                              <Badge className={getSuccessRateColor(workflow.successRate)}>
                                {workflow.successRate}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Switch
                          checked={workflow.isActive}
                          onCheckedChange={(checked) => toggleWorkflow(workflow.id, checked)}
                        />
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => runWorkflow(workflow.id)}
                            disabled={!workflow.isActive}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedWorkflow(workflow.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Estadísticas de Automatización
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {automationWorkflows.reduce((acc, w) => acc + w.runCount, 0)}
                      </div>
                      <p className="text-sm text-gray-600">Total de ejecuciones</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {automationWorkflows.filter(w => w.isActive).length}
                        </div>
                        <p className="text-xs text-gray-600">Workflows activos</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {Math.round(automationWorkflows.reduce((acc, w) => acc + w.successRate, 0) / automationWorkflows.length)}%
                        </div>
                        <p className="text-xs text-gray-600">Éxito promedio</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-sm mb-2">Próximas ejecuciones</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Recordatorio pagos</span>
                          <span className="text-gray-500">En 2h</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Reporte semanal</span>
                          <span className="text-gray-500">Mañana</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Horario de ejecución</p>
                        <p className="text-xs text-gray-600">24/7</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Notificar errores</p>
                        <p className="text-xs text-gray-600">Email cuando falle</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Logs detallados</p>
                        <p className="text-xs text-gray-600">Guardar historial</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Respuestas Automáticas Inteligentes</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Respuesta
                </Button>
              </div>
              <CardDescription>
                Configura respuestas automáticas basadas en palabras clave y contexto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartResponses.map(response => (
                  <div key={response.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{response.trigger.replace('_', ' ')}</h3>
                          <Badge variant="outline">{response.category}</Badge>
                          <Badge className={response.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {response.isActive ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">Palabras clave:</p>
                          <div className="flex flex-wrap gap-1">
                            {response.keywords.map(keyword => (
                              <Badge key={keyword} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm">{response.response}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Switch checked={response.isActive} />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          <div className="text-center text-gray-500 py-12">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Escalaciones Automáticas
            </h3>
            <p className="text-gray-600 mb-4">
              Configura reglas de escalación para diferentes escenarios
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Escalación
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Efectividad General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <p className="text-sm text-gray-600 mb-4">Tasa de éxito promedio</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Respuestas automáticas</span>
                      <span>98%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Workflows</span>
                      <span>92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Escalaciones</span>
                      <span>89%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Actividad Mensual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <p className="text-sm text-gray-600 mb-4">Ejecuciones este mes</p>
                  <div className="text-xs text-gray-500">
                    <span className="text-green-600">↑ 15%</span> vs mes anterior
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tiempo Ahorrado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">87h</div>
                  <p className="text-sm text-gray-600 mb-4">Horas ahorradas este mes</p>
                  <div className="text-xs text-gray-500">
                    Equivale a ~$2,610 USD
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
