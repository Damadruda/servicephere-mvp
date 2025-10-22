
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Building, DollarSign, Clock, Calendar, CheckCircle, X, Eye, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Quotation {
  id: string
  title: string
  description: string
  totalCost: number
  currency: string
  timeline: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  submittedAt: string
  validUntil: string
  project: {
    id: string
    title: string
  }
  provider: {
    id: string
    name: string
    companyName: string
    industry: string
    website?: string
  }
}

interface QuotationCardProps {
  quotation: Quotation
  isSelected: boolean
  onSelect: () => void
  onAction: (quotationId: string, action: 'accept' | 'reject') => void
}

export function QuotationCard({ quotation, isSelected, onSelect, onAction }: QuotationCardProps) {
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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente'
      case 'ACCEPTED': return 'Aceptada'
      case 'REJECTED': return 'Rechazada'
      default: return status
    }
  }

  const daysRemaining = getDaysRemaining(quotation.validUntil)
  const isExpiring = daysRemaining <= 3 && quotation.status === 'PENDING'

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''} ${isExpiring ? 'border-orange-300' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="mt-1"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <CardTitle className="text-lg">{quotation.title}</CardTitle>
                <Badge className={getStatusColor(quotation.status)}>
                  {getStatusLabel(quotation.status)}
                </Badge>
                {isExpiring && (
                  <Badge variant="destructive" className="animate-pulse">
                    Vence en {daysRemaining} día{daysRemaining !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{quotation.provider.companyName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Enviada: {formatDate(quotation.submittedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Válida hasta: {formatDate(quotation.validUntil)}</span>
                </div>
              </div>

              <CardDescription className="text-sm">
                <strong>Para:</strong> {quotation.project.title}
              </CardDescription>
              
              <CardDescription className="text-sm mt-1">
                {expanded ? quotation.description : `${quotation.description.substring(0, 150)}...`}
              </CardDescription>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1 text-2xl font-bold text-green-600 mb-1">
              <DollarSign className="h-6 w-6" />
              <span>{quotation.totalCost.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground">{quotation.currency}</div>
            <div className="text-sm text-muted-foreground mt-1">{quotation.timeline}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Provider info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Consultor:</span>
            <span className="text-sm">{quotation.provider.name}</span>
            {quotation.provider.industry && (
              <Badge variant="outline" className="text-xs">
                {quotation.provider.industry}
              </Badge>
            )}
          </div>
          
          {quotation.provider.website && (
            <a 
              href={quotation.provider.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Ver sitio web
            </a>
          )}
        </div>

        {expanded && (
          <>
            <Separator className="mb-4" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Descripción completa:</strong></p>
              <p className="whitespace-pre-wrap">{quotation.description}</p>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Ver menos</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Ver más detalles</span>
              </>
            )}
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/cotizaciones/${quotation.id}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver completa
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/mensajes?provider=${quotation.provider.id}`, '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contactar
            </Button>

            {quotation.status === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction(quotation.id, 'reject')}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAction(quotation.id, 'accept')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aceptar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
