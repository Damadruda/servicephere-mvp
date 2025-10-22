
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertTriangle, 
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Upload,
  Eye,
  User,
  Calendar,
  DollarSign,
  Scale,
  Gavel,
  Users,
  Search,
  Filter
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface DisputeCenterProps {
  userId: string
}

export function DisputeCenter({ userId }: DisputeCenterProps) {
  const [createDisputeDialog, setCreateDisputeDialog] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [disputeFilter, setDisputeFilter] = useState('all')

  // Mock dispute data
  const disputes = [
    {
      id: 'DISP-2024-001',
      status: 'OPEN',
      type: 'REFUND_REQUEST',
      amount: 5000,
      currency: 'USD',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      expectedResolution: new Date('2024-02-15'),
      priority: 'HIGH',
      createdBy: userId,
      respondent: 'provider123',
      escrowTransaction: {
        id: 'ESCROW-001',
        contract: {
          quotation: {
            project: { title: 'Implementación SAP S/4HANA' }
          }
        }
      },
      reason: 'El proveedor no cumplió con los hitos acordados en el timeline establecido',
      evidence: [
        { type: 'document', name: 'contrato_firmado.pdf', uploadedAt: new Date('2024-01-15') },
        { type: 'screenshot', name: 'evidencia_incumplimiento.png', uploadedAt: new Date('2024-01-16') }
      ],
      messages: [
        {
          id: '1',
          sender: 'Cliente',
          content: 'El proveedor no ha entregado los módulos acordados según el cronograma.',
          createdAt: new Date('2024-01-15'),
          isFromAdmin: false
        },
        {
          id: '2',
          sender: 'Administrador',
          content: 'Hemos contactado al proveedor para obtener su versión de los hechos.',
          createdAt: new Date('2024-01-18'),
          isFromAdmin: true
        }
      ],
      resolution: null,
      assignedAgent: 'María González',
      caseNumber: 'CASE-2024-001'
    },
    {
      id: 'DISP-2024-002',
      status: 'UNDER_REVIEW',
      type: 'QUALITY_ISSUE',
      amount: 3000,
      currency: 'USD',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
      expectedResolution: new Date('2024-02-10'),
      priority: 'MEDIUM',
      createdBy: 'client456',
      respondent: userId,
      escrowTransaction: {
        id: 'ESCROW-002',
        contract: {
          quotation: {
            project: { title: 'Desarrollo de Reports SAP' }
          }
        }
      },
      reason: 'Los reports entregados no cumplen con las especificaciones técnicas',
      evidence: [
        { type: 'document', name: 'especificaciones.pdf', uploadedAt: new Date('2024-01-10') },
        { type: 'video', name: 'demo_problema.mp4', uploadedAt: new Date('2024-01-12') }
      ],
      messages: [
        {
          id: '1',
          sender: 'Cliente',
          content: 'Los reports no muestran los datos correctamente filtrados.',
          createdAt: new Date('2024-01-10'),
          isFromAdmin: false
        },
        {
          id: '2',
          sender: 'Proveedor',
          content: 'Estamos revisando el problema y trabajando en una solución.',
          createdAt: new Date('2024-01-12'),
          isFromAdmin: false
        }
      ],
      resolution: null,
      assignedAgent: 'Carlos Rodríguez',
      caseNumber: 'CASE-2024-002'
    },
    {
      id: 'DISP-2024-003',
      status: 'RESOLVED',
      type: 'PAYMENT_ISSUE',
      amount: 2500,
      currency: 'USD',
      createdAt: new Date('2023-12-20'),
      updatedAt: new Date('2024-01-05'),
      expectedResolution: new Date('2024-01-05'),
      priority: 'LOW',
      createdBy: 'client789',
      respondent: userId,
      escrowTransaction: {
        id: 'ESCROW-003',
        contract: {
          quotation: {
            project: { title: 'Consultoría SAP ECC' }
          }
        }
      },
      reason: 'Problema con la liberación automática de fondos',
      evidence: [
        { type: 'email', name: 'comunicacion_cliente.pdf', uploadedAt: new Date('2023-12-20') }
      ],
      messages: [
        {
          id: '1',
          sender: 'Cliente',
          content: 'Los fondos no se han liberado automáticamente tras completar el proyecto.',
          createdAt: new Date('2023-12-20'),
          isFromAdmin: false
        }
      ],
      resolution: {
        type: 'FUNDS_RELEASED',
        description: 'Se liberaron los fondos manualmente tras verificar la finalización del proyecto.',
        resolvedAt: new Date('2024-01-05'),
        resolvedBy: 'Sistema Automático'
      },
      assignedAgent: 'Ana Torres',
      caseNumber: 'CASE-2023-087'
    }
  ]

  const filteredDisputes = disputes.filter(dispute => {
    if (disputeFilter === 'all') return true
    if (disputeFilter === 'open') return dispute.status === 'OPEN'
    if (disputeFilter === 'review') return dispute.status === 'UNDER_REVIEW'
    if (disputeFilter === 'resolved') return dispute.status === 'RESOLVED'
    if (disputeFilter === 'mine') return dispute.createdBy === userId
    return true
  })

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800'
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800'
      case 'RESOLVED': return 'bg-green-100 text-green-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDisputeTypeIcon = (type: string) => {
    switch (type) {
      case 'REFUND_REQUEST': return <DollarSign className="h-4 w-4" />
      case 'QUALITY_ISSUE': return <AlertTriangle className="h-4 w-4" />
      case 'PAYMENT_ISSUE': return <Clock className="h-4 w-4" />
      case 'CONTRACT_BREACH': return <FileText className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const createDispute = async (disputeData: any) => {
    try {
      const response = await fetch('/api/disputes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...disputeData })
      })

      if (response.ok) {
        toast.success('Disputa creada exitosamente')
        setCreateDisputeDialog(false)
      } else {
        toast.error('Error al crear disputa')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const addMessage = async (disputeId: string, message: string) => {
    try {
      const response = await fetch(`/api/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })

      if (response.ok) {
        toast.success('Mensaje enviado')
      } else {
        toast.error('Error al enviar mensaje')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const uploadEvidence = async (disputeId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('disputeId', disputeId)

    try {
      const response = await fetch(`/api/disputes/${disputeId}/evidence`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast.success('Evidencia subida exitosamente')
      } else {
        toast.error('Error al subir evidencia')
      }
    } catch (error) {
      toast.error('Error al subir archivo')
    }
  }

  // Calculate statistics
  const totalDisputes = disputes.length
  const openDisputes = disputes.filter(d => d.status === 'OPEN').length
  const resolvedDisputes = disputes.filter(d => d.status === 'RESOLVED').length
  const averageResolutionTime = 7 // Mock data - in production calculate from resolved disputes

  return (
    <div className="space-y-6">
      {/* Dispute Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Scale className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Disputas</p>
                <p className="text-xl font-bold">{totalDisputes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Abiertas</p>
                <p className="text-xl font-bold">{openDisputes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resueltas</p>
                <p className="text-xl font-bold">{resolvedDisputes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className="text-xl font-bold">{averageResolutionTime} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dispute Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Centro de Disputas
            </CardTitle>
            <Dialog open={createDisputeDialog} onOpenChange={setCreateDisputeDialog}>
              <DialogTrigger asChild>
                <Button>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Nueva Disputa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Disputa</DialogTitle>
                  <DialogDescription>
                    Reporta un problema con una transacción o contrato
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="disputeType">Tipo de Disputa</Label>
                    <select id="disputeType" className="w-full p-2 border rounded-md mt-1">
                      <option value="REFUND_REQUEST">Solicitud de reembolso</option>
                      <option value="QUALITY_ISSUE">Problema de calidad</option>
                      <option value="PAYMENT_ISSUE">Problema de pago</option>
                      <option value="CONTRACT_BREACH">Incumplimiento de contrato</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="transactionId">ID de Transacción</Label>
                    <Input
                      id="transactionId"
                      placeholder="ESCROW-001"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reason">Descripción del Problema</Label>
                    <Textarea
                      id="reason"
                      placeholder="Describe detalladamente el problema..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Evidencia (Opcional)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Sube documentos, capturas de pantalla o archivos relevantes
                      </p>
                      <Button variant="outline" size="sm">
                        Seleccionar Archivos
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Todas las disputas son revisadas por nuestro equipo especializado. 
                      El tiempo promedio de resolución es de 5-10 días hábiles.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={() => createDispute({})}
                    className="w-full"
                  >
                    Crear Disputa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filter Tabs */}
          <Tabs value={disputeFilter} onValueChange={setDisputeFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todas ({disputes.length})</TabsTrigger>
              <TabsTrigger value="mine">
                Mis Disputas ({disputes.filter(d => d.createdBy === userId).length})
              </TabsTrigger>
              <TabsTrigger value="open">
                Abiertas ({disputes.filter(d => d.status === 'OPEN').length})
              </TabsTrigger>
              <TabsTrigger value="review">
                En Revisión ({disputes.filter(d => d.status === 'UNDER_REVIEW').length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resueltas ({disputes.filter(d => d.status === 'RESOLVED').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Disputes List */}
          <div className="space-y-4">
            {filteredDisputes.map(dispute => (
              <div key={dispute.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getDisputeTypeIcon(dispute.type)}
                        <h3 className="font-semibold">#{dispute.caseNumber}</h3>
                      </div>
                      <Badge className={getStatusBadgeClass(dispute.status)}>
                        {dispute.status === 'OPEN' ? 'Abierta' :
                         dispute.status === 'UNDER_REVIEW' ? 'En Revisión' :
                         dispute.status === 'RESOLVED' ? 'Resuelta' : dispute.status}
                      </Badge>
                      <Badge className={getPriorityBadgeClass(dispute.priority)}>
                        {dispute.priority === 'HIGH' ? 'Alta' :
                         dispute.priority === 'MEDIUM' ? 'Media' : 
                         dispute.priority === 'LOW' ? 'Baja' : dispute.priority}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3">
                      {dispute.escrowTransaction.contract.quotation.project.title}
                    </p>
                    
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {dispute.reason}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>Monto: {formatCurrency(dispute.amount, dispute.currency)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Creada: {format(new Date(dispute.createdAt), 'PPP', { locale: es })}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>Agente: {dispute.assignedAgent}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          Resolución: {format(new Date(dispute.expectedResolution), 'PPP', { locale: es })}
                        </span>
                      </div>
                    </div>

                    {/* Progress for non-resolved disputes */}
                    {dispute.status !== 'RESOLVED' && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">Progreso de la Disputa</span>
                          <span className="text-xs text-gray-600">
                            {dispute.status === 'OPEN' ? '25%' : 
                             dispute.status === 'UNDER_REVIEW' ? '75%' : '100%'}
                          </span>
                        </div>
                        <Progress 
                          value={dispute.status === 'OPEN' ? 25 : 
                                 dispute.status === 'UNDER_REVIEW' ? 75 : 100} 
                          className="h-2" 
                        />
                      </div>
                    )}

                    {/* Resolution info for resolved disputes */}
                    {dispute.resolution && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Disputa Resuelta
                          </span>
                        </div>
                        <p className="text-sm text-green-700">{dispute.resolution.description}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Resuelta el {format(new Date(dispute.resolution.resolvedAt), 'PPP', { locale: es })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Disputa #{dispute.caseNumber}</DialogTitle>
                          <DialogDescription>
                            Detalles completos y comunicación de la disputa
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Dispute Summary */}
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">Información de la Disputa</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Estado:</span>
                                  <Badge className={getStatusBadgeClass(dispute.status)}>
                                    {dispute.status}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Prioridad:</span>
                                  <Badge className={getPriorityBadgeClass(dispute.priority)}>
                                    {dispute.priority}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Monto:</span>
                                  <span>{formatCurrency(dispute.amount, dispute.currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Agente asignado:</span>
                                  <span>{dispute.assignedAgent}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Cronología</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Creada:</span>
                                  <span>{format(new Date(dispute.createdAt), 'PPP', { locale: es })}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Última actualización:</span>
                                  <span>{format(new Date(dispute.updatedAt), 'PPP', { locale: es })}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Resolución esperada:</span>
                                  <span>{format(new Date(dispute.expectedResolution), 'PPP', { locale: es })}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Reason */}
                          <div>
                            <h4 className="font-semibold mb-2">Descripción del Problema</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {dispute.reason}
                            </p>
                          </div>

                          {/* Evidence */}
                          {dispute.evidence.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3">Evidencia Adjunta</h4>
                              <div className="grid grid-cols-2 gap-3">
                                {dispute.evidence.map((evidence, index) => (
                                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{evidence.name}</p>
                                      <p className="text-xs text-gray-600">
                                        Subido el {format(new Date(evidence.uploadedAt), 'PPP', { locale: es })}
                                      </p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Messages */}
                          <div>
                            <h4 className="font-semibold mb-3">Comunicación</h4>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {dispute.messages.map(message => (
                                <div key={message.id} className={`
                                  flex gap-3 p-3 rounded-lg
                                  ${message.isFromAdmin ? 'bg-blue-50' : 'bg-gray-50'}
                                `}>
                                  <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                    ${message.isFromAdmin ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}
                                  `}>
                                    {message.sender.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-sm">{message.sender}</span>
                                      <span className="text-xs text-gray-500">
                                        {format(new Date(message.createdAt), 'PPP HH:mm', { locale: es })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{message.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Add Message Form */}
                            {dispute.status !== 'RESOLVED' && (
                              <div className="mt-4 space-y-3">
                                <Textarea
                                  placeholder="Escribe tu mensaje..."
                                  rows={3}
                                />
                                <div className="flex gap-3">
                                  <Button 
                                    onClick={() => addMessage(dispute.id, 'Nuevo mensaje')}
                                    className="flex-1"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Enviar Mensaje
                                  </Button>
                                  <Button variant="outline">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Adjuntar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {dispute.createdBy === userId && dispute.status !== 'RESOLVED' && (
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Responder
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredDisputes.length === 0 && (
              <div className="text-center py-12">
                <Scale className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay disputas {disputeFilter !== 'all' ? disputeFilter : ''}
                </h3>
                <p className="text-gray-600 mb-4">
                  {disputeFilter === 'all' 
                    ? 'No tienes disputas registradas'
                    : 'No se encontraron disputas con este filtro'
                  }
                </p>
                {disputeFilter === 'all' && (
                  <Button onClick={() => setCreateDisputeDialog(true)}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Crear Primera Disputa
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dispute Process Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Proceso de Resolución de Disputas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Reportar</h4>
              <p className="text-sm text-gray-600">
                Describe el problema y adjunta evidencia relevante
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">2. Revisión</h4>
              <p className="text-sm text-gray-600">
                Nuestro equipo revisa el caso y contacta a las partes
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">3. Mediación</h4>
              <p className="text-sm text-gray-600">
                Facilitamos la comunicación para encontrar una solución
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">4. Resolución</h4>
              <p className="text-sm text-gray-600">
                Se implementa la solución acordada o decisión final
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
