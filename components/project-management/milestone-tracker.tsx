
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Upload, 
  Calendar,
  Target,
  FileText,
  User
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface MilestoneTrackerProps {
  contract: any
}

export function MilestoneTracker({ contract }: MilestoneTrackerProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [newProgress, setNewProgress] = useState(0)
  const [updateNotes, setUpdateNotes] = useState('')
  const [newStatus, setNewStatus] = useState('')

  const milestones = contract.milestones?.milestones || []
  const milestoneUpdates = contract.milestoneUpdates || []

  const getMilestoneUpdate = (milestoneId: string) => {
    return milestoneUpdates.find((update: any) => update.milestoneId === milestoneId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DELAYED': return 'bg-red-100 text-red-800 border-red-200'
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4" />
      case 'DELAYED': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleUpdateMilestone = async () => {
    try {
      const response = await fetch('/api/milestone-updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contractId: contract.id,
          milestoneId: selectedMilestone,
          progressPercent: newProgress,
          status: newStatus,
          notes: updateNotes
        })
      })

      if (response.ok) {
        toast.success('Hito actualizado exitosamente')
        setUpdateDialogOpen(false)
        setNewProgress(0)
        setUpdateNotes('')
        setNewStatus('')
        setSelectedMilestone(null)
        // Refresh page or update state
        window.location.reload()
      } else {
        toast.error('Error al actualizar el hito')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const openUpdateDialog = (milestoneId: string) => {
    const update = getMilestoneUpdate(milestoneId)
    setSelectedMilestone(milestoneId)
    setNewProgress(update?.progressPercent || 0)
    setNewStatus(update?.status || 'NOT_STARTED')
    setUpdateNotes(update?.notes || '')
    setUpdateDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Hitos</h2>
          <p className="text-gray-600">
            Seguimiento detallado del progreso de cada hito del proyecto
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-xl font-bold">
                  {milestoneUpdates.filter((m: any) => m.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-xl font-bold">
                  {milestoneUpdates.filter((m: any) => m.status === 'IN_PROGRESS').length}
                </p>
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
                <p className="text-sm text-gray-600">Retrasados</p>
                <p className="text-xl font-bold">
                  {milestoneUpdates.filter((m: any) => m.status === 'DELAYED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">{milestones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="in_progress">En Progreso</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
          <TabsTrigger value="delayed">Retrasados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {milestones.map((milestone: any) => {
            const update = getMilestoneUpdate(milestone.id)
            const status = update?.status || 'NOT_STARTED'
            const progress = update?.progressPercent || 0
            const isOverdue = new Date(milestone.dueDate) < new Date() && status !== 'COMPLETED'

            return (
              <Card key={milestone.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3">
                        {milestone.name}
                        {isOverdue && <Badge variant="destructive">Retrasado</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {milestone.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(status)}
                          {status}
                        </div>
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openUpdateDialog(milestone.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Actualizar
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Key Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Fecha límite:</span>
                      <span className="font-medium">
                        {format(new Date(milestone.dueDate), 'PPP', { locale: es })}
                      </span>
                    </div>
                    
                    {milestone.budget && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Presupuesto:</span>
                        <span className="font-medium">${milestone.budget.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {milestone.responsiblePerson && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Responsable:</span>
                        <span className="font-medium">{milestone.responsiblePerson}</span>
                      </div>
                    )}
                  </div>

                  {/* Deliverables */}
                  {milestone.deliverables && milestone.deliverables.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Entregables:</h4>
                      <ul className="space-y-1">
                        {milestone.deliverables.map((deliverable: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes */}
                  {update?.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Notas:</h4>
                      <p className="text-sm text-gray-600">{update.notes}</p>
                    </div>
                  )}

                  {/* Attachments */}
                  {update?.attachments && update.attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Documentos adjuntos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {update.attachments.map((attachment: string, index: number) => (
                          <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                            <FileText className="h-3 w-3" />
                            {attachment.split('/').pop()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>

      {/* Update Milestone Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Actualizar Hito</DialogTitle>
            <DialogDescription>
              Actualiza el progreso y estado del hito seleccionado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Progreso (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOT_STARTED">No Iniciado</SelectItem>
                    <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                    <SelectItem value="PENDING_APPROVAL">Pendiente de Aprobación</SelectItem>
                    <SelectItem value="COMPLETED">Completado</SelectItem>
                    <SelectItem value="DELAYED">Retrasado</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas de Actualización</Label>
              <Textarea
                id="notes"
                placeholder="Describe el progreso, problemas encontrados, próximos pasos..."
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Progress value={newProgress} className="h-2" />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateMilestone}>
              Guardar Actualización
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
