
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, DollarSign, Clock, Building, CheckCircle, X, Trophy } from 'lucide-react'

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

interface QuotationComparisonProps {
  quotations: Quotation[]
  onBack: () => void
  onAction: (quotationId: string, action: 'accept' | 'reject') => void
}

export function QuotationComparison({ quotations, onBack, onAction }: QuotationComparisonProps) {
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

  const getRecommendation = (quotations: Quotation[]) => {
    if (quotations.length === 0) return null

    // Find the best value (lowest cost / earliest delivery)
    const lowestCost = Math.min(...quotations.map(q => q.totalCost))
    const bestValue = quotations.find(q => q.totalCost === lowestCost)

    return bestValue
  }

  const recommendedQuotation = getRecommendation(quotations)

  if (quotations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay cotizaciones para comparar</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Comparación de Cotizaciones</h2>
          <p className="text-muted-foreground">
            Comparando {quotations.length} propuesta{quotations.length !== 1 ? 's' : ''} para {quotations[0]?.project.title}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Recommendation Card */}
      {recommendedQuotation && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Mejor Valor Recomendado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">
                  {recommendedQuotation.provider.companyName}
                </h4>
                <p className="text-sm text-green-700">
                  Mejor relación costo-beneficio con ${recommendedQuotation.totalCost.toLocaleString()} {recommendedQuotation.currency}
                </p>
              </div>
              {recommendedQuotation.status === 'PENDING' && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onAction(recommendedQuotation.id, 'accept')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aceptar Recomendada
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-medium text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <div>Proveedor</div>
            <div>Costo Total</div>
            <div>Timeline</div>
            <div>Acciones</div>
          </div>

          {/* Comparison Cards */}
          {quotations.map((quotation) => {
            const isRecommended = quotation.id === recommendedQuotation?.id
            const isExpiring = getDaysRemaining(quotation.validUntil) <= 3 && quotation.status === 'PENDING'

            return (
              <Card 
                key={quotation.id} 
                className={`${isRecommended ? 'border-green-300 bg-green-50/50' : ''} ${isExpiring ? 'border-orange-300' : ''}`}
              >
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Provider Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{quotation.provider.companyName}</h4>
                        {isRecommended && (
                          <Badge className="bg-green-100 text-green-800">
                            <Trophy className="h-3 w-3 mr-1" />
                            Recomendado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{quotation.provider.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {quotation.provider.industry}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Enviada: {formatDate(quotation.submittedAt)}
                      </div>
                      {isExpiring && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          Vence en {getDaysRemaining(quotation.validUntil)} días
                        </Badge>
                      )}
                    </div>

                    {/* Cost */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-xl font-bold text-green-600">
                        <DollarSign className="h-5 w-5" />
                        <span>{quotation.totalCost.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{quotation.currency}</p>
                      {quotation.totalCost === Math.min(...quotations.map(q => q.totalCost)) && (
                        <Badge variant="secondary" className="text-xs">
                          Menor costo
                        </Badge>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 font-medium">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{quotation.timeline}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Válida hasta: {formatDate(quotation.validUntil)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/cotizaciones/${quotation.id}`, '_blank')}
                        className="w-full"
                      >
                        Ver Detalles
                      </Button>

                      {quotation.status === 'PENDING' && (
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAction(quotation.id, 'reject')}
                            className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Rechazar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onAction(quotation.id, 'accept')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aceptar
                          </Button>
                        </div>
                      )}

                      {quotation.status === 'ACCEPTED' && (
                        <Badge className="bg-green-100 text-green-800 justify-center">
                          ✓ Aceptada
                        </Badge>
                      )}

                      {quotation.status === 'REJECTED' && (
                        <Badge className="bg-red-100 text-red-800 justify-center">
                          ✗ Rechazada
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Description Preview */}
                  <div>
                    <h5 className="font-medium text-sm mb-2">Descripción</h5>
                    <p className="text-sm text-muted-foreground">
                      {quotation.description.length > 200 
                        ? `${quotation.description.substring(0, 200)}...`
                        : quotation.description
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Comparison Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Comparación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Rango de Precios</h4>
              <p className="text-2xl font-bold text-primary">
                ${Math.min(...quotations.map(q => q.totalCost)).toLocaleString()} - 
                ${Math.max(...quotations.map(q => q.totalCost)).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Diferencia: ${(Math.max(...quotations.map(q => q.totalCost)) - Math.min(...quotations.map(q => q.totalCost))).toLocaleString()}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Proveedores</h4>
              <div className="space-y-1">
                {quotations.map(q => (
                  <p key={q.id} className="text-sm">
                    • {q.provider.companyName}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Estados</h4>
              <div className="space-y-1">
                <p className="text-sm">
                  Pendientes: {quotations.filter(q => q.status === 'PENDING').length}
                </p>
                <p className="text-sm">
                  Aceptadas: {quotations.filter(q => q.status === 'ACCEPTED').length}
                </p>
                <p className="text-sm">
                  Rechazadas: {quotations.filter(q => q.status === 'REJECTED').length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
