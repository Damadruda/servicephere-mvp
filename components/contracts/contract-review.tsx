
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Shield, CheckCircle, AlertCircle, Users, Calendar, DollarSign, Download, Send } from 'lucide-react'
import { DueDiligenceData } from './due-diligence-wizard'
import { toast } from 'sonner'

interface Quotation {
  id: string
  title: string
  description: string
  totalCost: number
  currency: string
  timeline: string
  project: {
    id: string
    title: string
    companyName: string
  }
  provider: {
    id: string
    name: string
    companyName: string
    email: string
  }
}

interface ContractReviewProps {
  data: DueDiligenceData
  quotation: Quotation
  onUpdate: (updates: Partial<DueDiligenceData>) => void
}

export function ContractReview({ data, quotation, onUpdate }: ContractReviewProps) {
  const [approvedSections, setApprovedSections] = useState<string[]>([])
  const [finalNotes, setFinalNotes] = useState('')
  const [isReadyToSign, setIsReadyToSign] = useState(false)

  const contractSections = [
    {
      id: 'basic_info',
      title: 'Información Básica del Contrato',
      icon: FileText,
      content: {
        'Título del Proyecto': quotation.title,
        'Cliente': quotation.project.companyName,
        'Proveedor': quotation.provider.companyName,
        'Consultor Principal': quotation.provider.name,
        'Valor Total': `$${quotation.totalCost.toLocaleString()} ${quotation.currency}`,
        'Duración Estimada': quotation.timeline
      }
    },
    {
      id: 'verification_results',
      title: 'Resultados de Verificación',
      icon: Shield,
      content: {
        'Score General': `${data.overallScore}/100`,
        'Confiabilidad': `${data.reliabilityScore}/100`,
        'Experiencia': `${data.experienceScore}/100`,
        'Performance': `${data.performanceScore}/100`,
        'Credenciales Verificadas': data.credentialsVerified ? 'Sí' : 'No',
        'Certificaciones Válidas': data.certificationsValid ? 'Sí' : 'No'
      }
    },
    {
      id: 'payment_schedule',
      title: 'Cronograma de Pagos',
      icon: DollarSign,
      content: data.paymentSchedule ? data.paymentSchedule.reduce((acc: any, payment: any, index: number) => {
        acc[`Pago ${index + 1}`] = `${payment.percentage}% - $${payment.amount.toLocaleString()} ${quotation.currency}`
        return acc
      }, {}) : {}
    },
    {
      id: 'project_timeline',
      title: 'Cronograma del Proyecto',
      icon: Calendar,
      content: {
        'Fecha de Inicio': data.startDate ? new Date(data.startDate).toLocaleDateString('es-ES') : 'No definida',
        'Fecha de Finalización': data.endDate ? new Date(data.endDate).toLocaleDateString('es-ES') : 'No definida',
        'Hitos Principales': data.milestones ? `${data.milestones.length} hitos definidos` : 'No definidos'
      }
    },
    {
      id: 'risk_assessment',
      title: 'Evaluación de Riesgos',
      icon: AlertCircle,
      content: data.riskAssessment ? {
        'Nivel de Riesgo General': data.riskAssessment.overallRiskLevel === 'high' ? 'Alto' :
                                   data.riskAssessment.overallRiskLevel === 'medium' ? 'Medio' : 'Bajo',
        'Factores de Riesgo Identificados': data.riskAssessment.riskFactors ? 
          `${data.riskAssessment.riskFactors.length} riesgos analizados` : 'Sin análisis',
        'Estrategias de Mitigación': 'Incluidas en el contrato'
      } : {}
    }
  ]

  const handleSectionApproval = (sectionId: string, approved: boolean) => {
    if (approved) {
      setApprovedSections(prev => [...prev.filter(id => id !== sectionId), sectionId])
    } else {
      setApprovedSections(prev => prev.filter(id => id !== sectionId))
    }
    
    // Check if ready to sign
    const totalSections = contractSections.length
    const approvedCount = approved ? 
      approvedSections.length + (approvedSections.includes(sectionId) ? 0 : 1) :
      approvedSections.length - (approvedSections.includes(sectionId) ? 1 : 0)
    
    setIsReadyToSign(approvedCount === totalSections)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const generateContractPreview = () => {
    // This would generate a PDF preview of the contract
    toast.info('Generando vista previa del contrato...')
  }

  const downloadContract = () => {
    // This would download the contract as PDF
    toast.info('Descargando contrato en PDF...')
  }

  return (
    <div className="space-y-6">
      {/* Contract Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Contrato SAP Generado</CardTitle>
          <CardDescription>
            Revisión final antes de proceder con la firma digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg border">
              <div className={`text-2xl font-bold ${getScoreColor(data.overallScore)}`}>
                {data.overallScore}
              </div>
              <p className="text-sm text-muted-foreground">Score del Proveedor</p>
              <Badge className={getScoreBadge(data.overallScore)} variant="secondary">
                {data.overallScore >= 80 ? 'Excelente' : 
                 data.overallScore >= 60 ? 'Bueno' : 'Requiere atención'}
              </Badge>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-primary">
                ${quotation.totalCost.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Valor del Contrato</p>
              <Badge variant="outline">{quotation.currency}</Badge>
            </div>

            <div className="p-4 bg-white rounded-lg border">
              <div className={`text-2xl font-bold ${
                data.riskAssessment?.overallRiskLevel 
                  ? getRiskLevelColor(data.riskAssessment.overallRiskLevel)
                  : 'text-gray-600'
              }`}>
                {data.riskAssessment?.overallRiskLevel === 'high' ? 'Alto' :
                 data.riskAssessment?.overallRiskLevel === 'medium' ? 'Medio' : 
                 data.riskAssessment?.overallRiskLevel === 'low' ? 'Bajo' : 'N/A'}
              </div>
              <p className="text-sm text-muted-foreground">Nivel de Riesgo</p>
              <Badge variant="outline">
                {data.riskAssessment?.riskFactors ? 
                  `${data.riskAssessment.riskFactors.length} factores` : 
                  'Sin análisis'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Sections Review */}
      <Card>
        <CardHeader>
          <CardTitle>Revisión de Secciones del Contrato</CardTitle>
          <CardDescription>
            Revisa y aprueba cada sección del contrato antes de finalizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {contractSections.map((section, index) => {
              const IconComponent = section.icon
              const isApproved = approvedSections.includes(section.id)
              
              return (
                <div key={section.id} className="border rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">{section.title}</h4>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={section.id}
                          checked={isApproved}
                          onCheckedChange={(checked) => handleSectionApproval(section.id, checked as boolean)}
                        />
                        <label htmlFor={section.id} className="text-sm cursor-pointer">
                          {isApproved ? 'Aprobado' : 'Pendiente de revisión'}
                        </label>
                        {isApproved && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                    
                    {Object.keys(section.content).length > 0 && (
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        {Object.entries(section.content).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {index < contractSections.length - 1 && <Separator />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Final Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Finales</CardTitle>
          <CardDescription>
            Añade cualquier observación o requisito adicional antes de la firma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={finalNotes}
            onChange={(e) => setFinalNotes(e.target.value)}
            placeholder="Ejemplo: Se requiere una reunión de kick-off en las oficinas del cliente antes del inicio del proyecto..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Approval Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Aprobación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span>Progreso de Revisión:</span>
            <span className="font-medium">
              {approvedSections.length} de {contractSections.length} secciones aprobadas
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(approvedSections.length / contractSections.length) * 100}%` }}
            />
          </div>
          
          {isReadyToSign ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">¡Contrato listo para firma!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Todas las secciones han sido revisadas y aprobadas. El contrato puede proceder a la fase de firma digital.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Revisión pendiente</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Por favor, revisa y aprueba todas las secciones antes de proceder con la firma.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between space-x-4">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateContractPreview}>
            <FileText className="h-4 w-4 mr-2" />
            Vista Previa
          </Button>
          <Button variant="outline" onClick={downloadContract}>
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
        
        <div className="text-right">
          {!isReadyToSign && (
            <p className="text-sm text-muted-foreground mb-2">
              Aprueba todas las secciones para habilitar la creación del contrato
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
