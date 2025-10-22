
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Building, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Users, 
  Download, 
  Edit,
  AlertTriangle 
} from 'lucide-react'
import { toast } from 'sonner'

interface ContractDetail {
  id: string
  contractNumber: string
  title: string
  description: string
  totalValue: number
  currency: string
  status: string
  startDate: string
  endDate: string
  clientSigned: boolean
  providerSigned: boolean
  client: {
    name: string
    companyName: string
  }
  provider: {
    name: string
    companyName: string
  }
  project: {
    title: string
  }
  milestones: any[]
  payments: any[]
  contractTerms: any
  createdAt: string
}

interface ContractDetailsProps {
  contract: ContractDetail
  userType: 'CLIENT' | 'PROVIDER'
  onUpdate: () => void
}

export function ContractDetails({ contract, userType, onUpdate }: ContractDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysRemaining = (dateString: string) => {
    const days = Math.ceil((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'PENDING_SIGNATURES': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-300'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300'
      case 'EXPIRED': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Borrador'
      case 'PENDING_SIGNATURES': return 'Pendiente Firmas'
      case 'ACTIVE': return 'Activo'
      case 'COMPLETED': return 'Completado'
      case 'CANCELLED': return 'Cancelado'
      case 'EXPIRED': return 'Expirado'
      default: return status
    }
  }

  const handleSignContract = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/contracts/${contract.id}/sign`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Contrato firmado exitosamente')
        onUpdate()
      } else {
        throw new Error('Failed to sign contract')
      }
    } catch (error) {
      console.error('Error signing contract:', error)
      toast.error('Error al firmar el contrato')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadContract = () => {
    // This would download the contract as PDF
    toast.info('Descargando contrato...')
  }

  const canSign = () => {
    if (contract.status !== 'PENDING_SIGNATURES') return false
    if (userType === 'CLIENT' && !contract.clientSigned) return true
    if (userType === 'PROVIDER' && !contract.providerSigned) return true
    return false
  }

  const isExpiring = contract.status === 'ACTIVE' && getDaysRemaining(contract.endDate) <= 30
  const isOverdue = contract.status === 'ACTIVE' && getDaysRemaining(contract.endDate) < 0

  return (
    <div className="space-y-6">
      {/* Contract Header */}
      <Card className={`${isExpiring ? 'border-orange-300' : ''} ${isOverdue ? 'border-red-300' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3">
                <span>{contract.title}</span>
                <Badge className={getStatusColor(contract.status)}>
                  {getStatusLabel(contract.status)}
                </Badge>
                {isExpiring && (
                  <Badge variant="destructive" className="animate-pulse">
                    Vence en {getDaysRemaining(contract.endDate)} días
                  </Badge>
                )}
                {isOverdue && (
                  <Badge variant="destructive">
                    Vencido hace {Math.abs(getDaysRemaining(contract.endDate))} días
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                Contrato #{contract.contractNumber} • Creado el {formatDate(contract.createdAt)}
              </CardDescription>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                ${contract.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">{contract.currency}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground mb-4">{contract.description}</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Building className="h-4 w-4 mr-2 text-primary" />
                Información del Cliente
              </h4>
              <p className="text-sm">
                <strong>{contract.client.companyName}</strong><br />
                Contacto: {contract.client.name}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                Información del Proveedor
              </h4>
              <p className="text-sm">
                <strong>{contract.provider.companyName}</strong><br />
                Consultor: {contract.provider.name}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Cronograma
              </h4>
              <p className="text-sm">
                <strong>Inicio:</strong> {formatDate(contract.startDate)}<br />
                <strong>Fin:</strong> {formatDate(contract.endDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature Status */}
      {contract.status === 'PENDING_SIGNATURES' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Estado de Firmas Digitales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <h4 className="font-medium">Cliente</h4>
                  <p className="text-sm text-muted-foreground">{contract.client.companyName}</p>
                </div>
                <Badge className={contract.clientSigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {contract.clientSigned ? 'Firmado' : 'Pendiente'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <h4 className="font-medium">Proveedor</h4>
                  <p className="text-sm text-muted-foreground">{contract.provider.companyName}</p>
                </div>
                <Badge className={contract.providerSigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {contract.providerSigned ? 'Firmado' : 'Pendiente'}
                </Badge>
              </div>
            </div>
            
            {canSign() && (
              <div className="mt-4 text-center">
                <Button 
                  onClick={handleSignContract}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Firmando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Firmar Contrato
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contract Terms */}
      {contract.contractTerms && (
        <Card>
          <CardHeader>
            <CardTitle>Términos del Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract.contractTerms.warranties && (
                <div>
                  <h4 className="font-medium mb-2">Garantías</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {contract.contractTerms.warranties.map((warranty: string, index: number) => (
                      <li key={index}>{warranty}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {contract.contractTerms.slaTerms && (
                <div>
                  <h4 className="font-medium mb-2">Términos de SLA</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Tiempo de Respuesta:</strong> {contract.contractTerms.slaTerms.responseTime}
                    </div>
                    <div>
                      <strong>Tiempo de Resolución:</strong> {contract.contractTerms.slaTerms.resolutionTime}
                    </div>
                    <div>
                      <strong>Disponibilidad:</strong> {contract.contractTerms.slaTerms.availability}
                    </div>
                  </div>
                </div>
              )}
              
              {contract.contractTerms.penaltyClauses && (
                <div>
                  <h4 className="font-medium mb-2">Cláusulas de Penalización</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {contract.contractTerms.penaltyClauses.map((clause: string, index: number) => (
                      <li key={index}>{clause}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestones */}
      {contract.milestones && contract.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hitos del Proyecto</CardTitle>
            <CardDescription>
              Seguimiento de entregables y progreso del proyecto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract.milestones.map((milestone: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{milestone.name}</h4>
                    <Badge variant="outline">
                      {formatDate(milestone.startDate)} - {formatDate(milestone.endDate)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                  
                  {milestone.deliverables && milestone.deliverables.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-1">Entregables:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {milestone.deliverables.map((deliverable: string, i: number) => (
                          <li key={i}>{deliverable}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments */}
      {contract.payments && contract.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cronograma de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract.payments.map((payment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{payment.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Vence: {formatDate(payment.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      ${payment.amount.toLocaleString()} {payment.currency}
                    </div>
                    <Badge className={
                      payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      payment.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {payment.status === 'PAID' ? 'Pagado' :
                       payment.status === 'OVERDUE' ? 'Vencido' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={handleDownloadContract}>
          <Download className="h-4 w-4 mr-2" />
          Descargar PDF
        </Button>
        
        {contract.status === 'DRAFT' && userType === 'CLIENT' && (
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar Contrato
          </Button>
        )}
      </div>
    </div>
  )
}
