
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Building, DollarSign, Calendar, Users, FileText, Clock, Eye, CheckCircle, X, Edit, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Contract {
  id: string
  contractNumber: string
  title: string
  description: string
  totalValue: number
  currency: string
  status: 'DRAFT' | 'PENDING_SIGNATURES' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
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
  createdAt: string
}

interface ContractCardProps {
  contract: Contract
  userType: 'CLIENT' | 'PROVIDER'
  onAction: (contractId: string, action: string) => void
}

export function ContractCard({ contract, userType, onAction }: ContractCardProps) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
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

  const getProgressPercentage = () => {
    if (contract.status === 'DRAFT') return 25
    if (contract.status === 'PENDING_SIGNATURES') return 50
    if (contract.status === 'ACTIVE') return 75
    if (contract.status === 'COMPLETED') return 100
    return 0
  }

  const canSign = () => {
    if (contract.status !== 'PENDING_SIGNATURES') return false
    if (userType === 'CLIENT' && !contract.clientSigned) return true
    if (userType === 'PROVIDER' && !contract.providerSigned) return true
    return false
  }

  const getSignatureStatus = () => {
    const clientStatus = contract.clientSigned ? 'Firmado' : 'Pendiente'
    const providerStatus = contract.providerSigned ? 'Firmado' : 'Pendiente'
    
    return {
      client: clientStatus,
      provider: providerStatus,
      bothSigned: contract.clientSigned && contract.providerSigned
    }
  }

  const signatureStatus = getSignatureStatus()
  const isExpiring = contract.status === 'ACTIVE' && getDaysRemaining(contract.endDate) <= 30
  const isOverdue = contract.status === 'ACTIVE' && getDaysRemaining(contract.endDate) < 0

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isExpiring ? 'border-orange-300' : ''} ${isOverdue ? 'border-red-300' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <CardTitle className="text-lg">{contract.title}</CardTitle>
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
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>{contract.contractNumber}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{userType === 'CLIENT' ? contract.provider.companyName : contract.client.companyName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
              </div>
            </div>

            <CardDescription className="text-sm">
              <strong>Proyecto:</strong> {contract.project.title}
            </CardDescription>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1 text-2xl font-bold text-green-600 mb-1">
              <DollarSign className="h-6 w-6" />
              <span>{contract.totalValue.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground">{contract.currency}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progreso del Contrato</span>
            <span className="text-sm text-muted-foreground">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="w-full" />
        </div>

        {/* Signature Status */}
        {contract.status === 'PENDING_SIGNATURES' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800 mb-2">Estado de Firmas</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Cliente:</span>
                <Badge className={contract.clientSigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {signatureStatus.client}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Proveedor:</span>
                <Badge className={contract.providerSigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {signatureStatus.provider}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {expanded && (
          <>
            <Separator className="mb-4" />
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Descripción</h4>
                <p className="text-muted-foreground">{contract.description}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Información del Cliente</h4>
                  <p className="text-muted-foreground">
                    <strong>{contract.client.companyName}</strong><br />
                    Contacto: {contract.client.name}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Información del Proveedor</h4>
                  <p className="text-muted-foreground">
                    <strong>{contract.provider.companyName}</strong><br />
                    Consultor: {contract.provider.name}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Ver menos' : 'Ver más detalles'}
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/contratos/${contract.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Completo
            </Button>

            {contract.status === 'DRAFT' && userType === 'CLIENT' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction(contract.id, 'edit')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}

            {canSign() && (
              <Button
                size="sm"
                onClick={() => onAction(contract.id, 'sign')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Firmar Contrato
              </Button>
            )}

            {contract.status === 'ACTIVE' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/contratos/${contract.id}/seguimiento`)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Seguimiento
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction(contract.id, 'download')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </>
            )}

            {contract.status === 'DRAFT' && userType === 'CLIENT' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction(contract.id, 'cancel')}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
