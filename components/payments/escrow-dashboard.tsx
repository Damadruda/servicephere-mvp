
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Lock, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Unlock,
  RefreshCw,
  FileText,
  Calendar,
  DollarSign,
  Users,
  Timer,
  ArrowRight
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface EscrowDashboardProps {
  userId: string
  transactions: any[]
}

export function EscrowDashboard({ userId, transactions }: EscrowDashboardProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [actionDialog, setActionDialog] = useState<string | null>(null)

  // Filter escrow transactions
  const escrowTransactions = transactions.filter(t => t.status === 'ESCROWED')
  const completedEscrows = transactions.filter(t => 
    t.status === 'COMPLETED' && t.escrowCompletedAt
  )

  const totalEscrowAmount = escrowTransactions.reduce((sum, t) => sum + t.amount, 0)

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getEscrowProgress = (transaction: any) => {
    if (!transaction.milestones || transaction.milestones.length === 0) return 0
    const completedMilestones = transaction.milestones.filter((m: any) => m.isCompleted).length
    return (completedMilestones / transaction.milestones.length) * 100
  }

  const releaseEscrow = async (transactionId: string, amount?: number) => {
    try {
      const response = await fetch(`/api/escrow/${transactionId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })

      if (response.ok) {
        toast.success('Fondos liberados exitosamente')
        setActionDialog(null)
        // Refresh data
      } else {
        toast.error('Error al liberar fondos')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const disputeEscrow = async (transactionId: string, reason: string) => {
    try {
      const response = await fetch(`/api/escrow/${transactionId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })

      if (response.ok) {
        toast.success('Disputa creada exitosamente')
        setActionDialog(null)
      } else {
        toast.error('Error al crear disputa')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  return (
    <div className="space-y-6">
      {/* Escrow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total en Escrow</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalEscrowAmount)}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Lock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Escrows Activos</p>
                <p className="text-xl font-bold">{escrowTransactions.length}</p>
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
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-xl font-bold">{completedEscrows.length}</p>
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
                <p className="text-sm text-gray-600">En Disputa</p>
                <p className="text-xl font-bold">
                  {transactions.filter(t => t.disputes.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Escrows */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Escrows Activos
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-800">
              Protección Total: {formatCurrency(totalEscrowAmount)}
            </Badge>
          </div>
          <CardDescription>
            Fondos protegidos hasta la finalización exitosa de los proyectos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {escrowTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay escrows activos
              </h3>
              <p className="text-gray-600">
                Los fondos aparecerán aquí cuando se creen nuevos contratos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {escrowTransactions.map((transaction: any) => {
                const progress = getEscrowProgress(transaction)
                const daysInEscrow = Math.floor(
                  (new Date().getTime() - new Date(transaction.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                )
                
                return (
                  <div key={transaction.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {transaction.contract?.quotation?.project?.title || 'Proyecto SAP'}
                          </h3>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Lock className="h-3 w-3 mr-1" />
                            En Escrow
                          </Badge>
                          {transaction.disputes.length > 0 && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              En Disputa
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(transaction.amount, transaction.currency)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {transaction.payer.name} → {transaction.payee.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(transaction.createdAt), 'PPP', { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            <span>{daysInEscrow} días en escrow</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progreso del Proyecto</span>
                            <span className="text-sm text-gray-600">{Math.round(progress)}% completado</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* Milestones */}
                        {transaction.milestones && transaction.milestones.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Hitos del Proyecto:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {transaction.milestones.slice(0, 4).map((milestone: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  {milestone.isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-gray-400" />
                                  )}
                                  <span className={milestone.isCompleted ? 'text-green-700' : 'text-gray-600'}>
                                    {milestone.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Auto-release info */}
                        {transaction.autoReleaseDate && (
                          <Alert className="mb-4">
                            <Clock className="h-4 w-4" />
                            <AlertDescription>
                              Los fondos se liberarán automáticamente el{' '}
                              <strong>
                                {format(new Date(transaction.autoReleaseDate), 'PPP', { locale: es })}
                              </strong>
                              {' '}si no hay disputas activas.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-6">
                        <Dialog open={selectedTransaction?.id === transaction.id} onOpenChange={() => setSelectedTransaction(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Escrow</DialogTitle>
                              <DialogDescription>
                                Información completa de la transacción protegida
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTransaction && (
                              <div className="space-y-6">
                                {/* Transaction Details */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="text-sm text-gray-600">Monto Total</p>
                                    <p className="font-semibold text-lg">
                                      {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Fee de Plataforma</p>
                                    <p className="font-semibold">
                                      {formatCurrency(selectedTransaction.platformFee)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Fee de Procesamiento</p>
                                    <p className="font-semibold">
                                      {formatCurrency(selectedTransaction.paymentProcessingFee)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Monto Neto</p>
                                    <p className="font-semibold text-green-600">
                                      {formatCurrency(
                                        selectedTransaction.amount - 
                                        selectedTransaction.platformFee - 
                                        selectedTransaction.paymentProcessingFee
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                  {userId === selectedTransaction.payerId && (
                                    <>
                                      {progress >= 100 && (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button className="flex-1">
                                              <Unlock className="h-4 w-4 mr-2" />
                                              Liberar Fondos
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Liberar Fondos del Escrow</DialogTitle>
                                              <DialogDescription>
                                                ¿Confirmas que el proyecto se completó satisfactoriamente?
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <Alert>
                                                <CheckCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                  Se liberarán {formatCurrency(selectedTransaction.amount)} 
                                                  al proveedor. Esta acción no se puede deshacer.
                                                </AlertDescription>
                                              </Alert>
                                              <div className="flex gap-3">
                                                <Button 
                                                  onClick={() => releaseEscrow(selectedTransaction.id)}
                                                  className="flex-1"
                                                >
                                                  Confirmar Liberación
                                                </Button>
                                                <Button variant="outline" className="flex-1">
                                                  Cancelar
                                                </Button>
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      )}
                                      <Button 
                                        variant="outline" 
                                        onClick={() => disputeEscrow(selectedTransaction.id, 'Cliente solicita disputa')}
                                        className="flex-1"
                                      >
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Crear Disputa
                                      </Button>
                                    </>
                                  )}
                                  
                                  {userId === selectedTransaction.payeeId && (
                                    <Button 
                                      variant="outline" 
                                      onClick={() => disputeEscrow(selectedTransaction.id, 'Proveedor solicita disputa')}
                                      className="flex-1"
                                    >
                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                      Solicitar Liberación
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {userId === transaction.payerId && progress >= 100 && (
                          <Button 
                            size="sm"
                            onClick={() => releaseEscrow(transaction.id)}
                          >
                            <Unlock className="h-4 w-4 mr-2" />
                            Liberar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Escrow Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Protecciones de Escrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Fondos Seguros</p>
                  <p className="text-sm text-gray-600">
                    Los pagos se mantienen seguros hasta la finalización del proyecto
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Liberación Automática</p>
                  <p className="text-sm text-gray-600">
                    Los fondos se liberan automáticamente al completar hitos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Sistema de Disputas</p>
                  <p className="text-sm text-gray-600">
                    Proceso estructurado para resolver conflictos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Reembolso Garantizado</p>
                  <p className="text-sm text-gray-600">
                    Protección total en caso de incumplimiento
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Próximas Liberaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {escrowTransactions
                .filter(t => t.autoReleaseDate)
                .sort((a, b) => new Date(a.autoReleaseDate).getTime() - new Date(b.autoReleaseDate).getTime())
                .slice(0, 4)
                .map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.contract?.quotation?.project?.title || 'Proyecto'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(transaction.autoReleaseDate), 'MMM dd', { locale: es })}
                      </p>
                      <p className="text-xs text-gray-600">Auto-liberación</p>
                    </div>
                  </div>
                ))}
              
              {escrowTransactions.filter(t => t.autoReleaseDate).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay liberaciones automáticas programadas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
