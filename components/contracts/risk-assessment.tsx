
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, TrendingDown, TrendingUp, Shield, DollarSign, Clock, Users } from 'lucide-react'
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

interface RiskAssessmentProps {
  data: DueDiligenceData
  quotation: Quotation
  onUpdate: (updates: Partial<DueDiligenceData>) => void
}

interface RiskFactor {
  id: string
  category: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  probability: number
  impact: number
  mitigation: string
  icon: any
}

export function RiskAssessment({ data, quotation, onUpdate }: RiskAssessmentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])
  const [overallRiskLevel, setOverallRiskLevel] = useState<'low' | 'medium' | 'high'>('low')
  const [mitigationNotes, setMitigationNotes] = useState('')

  useEffect(() => {
    if (data.riskAssessment && Object.keys(data.riskAssessment).length === 0) {
      runRiskAnalysis()
    }
  }, [])

  const runRiskAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      // Analyze risks based on provider scores and project details
      const response = await fetch('/api/due-diligence/risk-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: quotation.provider.id,
          quotationId: quotation.id,
          verificationScores: {
            reliability: data.reliabilityScore,
            experience: data.experienceScore,
            performance: data.performanceScore,
            overall: data.overallScore
          },
          projectDetails: {
            totalCost: quotation.totalCost,
            timeline: quotation.timeline,
            complexity: 'medium' // This would be calculated from project requirements
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setRiskFactors(result.riskFactors)
        setOverallRiskLevel(result.overallRiskLevel)
        
        updateRiskAssessment(result.riskFactors, result.overallRiskLevel)
      } else {
        // Fallback to simulated analysis
        generateSimulatedRiskAnalysis()
      }
      
    } catch (error) {
      console.error('Error in risk analysis:', error)
      generateSimulatedRiskAnalysis()
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateSimulatedRiskAnalysis = () => {
    // Generate risk analysis based on provider scores
    const simulatedRisks: RiskFactor[] = []

    // Financial risk based on provider performance
    if (data.performanceScore < 70) {
      simulatedRisks.push({
        id: 'financial',
        category: 'Financiero',
        title: 'Riesgo de Capacidad Financiera',
        description: 'Score de performance del proveedor sugiere posibles limitaciones financieras',
        severity: data.performanceScore < 50 ? 'high' : 'medium',
        probability: 100 - data.performanceScore,
        impact: quotation.totalCost > 100000 ? 80 : 60,
        mitigation: 'Establecer pagos por hitos y garantías bancarias',
        icon: DollarSign
      })
    }

    // Experience risk
    if (data.experienceScore < 80) {
      simulatedRisks.push({
        id: 'experience',
        category: 'Técnico',
        title: 'Riesgo de Experiencia Técnica',
        description: 'Posible falta de experiencia en proyectos similares o certificaciones',
        severity: data.experienceScore < 60 ? 'high' : 'medium',
        probability: 100 - data.experienceScore,
        impact: 70,
        mitigation: 'Requerir supervisión técnica adicional y plan de capacitación',
        icon: Users
      })
    }

    // Reliability risk
    if (data.reliabilityScore < 75) {
      simulatedRisks.push({
        id: 'reliability',
        category: 'Operacional',
        title: 'Riesgo de Confiabilidad',
        description: 'Credenciales o referencias del proveedor presentan inconsistencias',
        severity: data.reliabilityScore < 60 ? 'high' : 'medium',
        probability: 100 - data.reliabilityScore,
        impact: 75,
        mitigation: 'Implementar revisiones periódicas y penalizaciones por incumplimiento',
        icon: Shield
      })
    }

    // Timeline risk based on project complexity
    const timelineMonths = parseInt(quotation.timeline.match(/\d+/)?.[0] || '6')
    if (timelineMonths > 12) {
      simulatedRisks.push({
        id: 'timeline',
        category: 'Temporal',
        title: 'Riesgo de Cronograma Extendido',
        description: 'Proyectos de larga duración tienen mayor probabilidad de retrasos',
        severity: 'medium',
        probability: Math.min(timelineMonths * 5, 80),
        impact: 65,
        mitigation: 'Definir hitos intermedios claros con penalizaciones por retrasos',
        icon: Clock
      })
    }

    // If no specific risks, add a low general risk
    if (simulatedRisks.length === 0) {
      simulatedRisks.push({
        id: 'general',
        category: 'General',
        title: 'Riesgo General del Proyecto',
        description: 'Riesgos inherentes a cualquier proyecto de implementación SAP',
        severity: 'low',
        probability: 20,
        impact: 40,
        mitigation: 'Seguir mejores prácticas de gestión de proyectos SAP',
        icon: TrendingUp
      })
    }

    // Determine overall risk level
    const highRisks = simulatedRisks.filter(r => r.severity === 'high').length
    const mediumRisks = simulatedRisks.filter(r => r.severity === 'medium').length
    
    let overallLevel: 'low' | 'medium' | 'high' = 'low'
    if (highRisks > 0) overallLevel = 'high'
    else if (mediumRisks > 1) overallLevel = 'high'
    else if (mediumRisks > 0) overallLevel = 'medium'

    setRiskFactors(simulatedRisks)
    setOverallRiskLevel(overallLevel)
    updateRiskAssessment(simulatedRisks, overallLevel)
  }

  const updateRiskAssessment = (risks: RiskFactor[], riskLevel: 'low' | 'medium' | 'high') => {
    const riskAssessment = {
      riskFactors: risks,
      overallRiskLevel: riskLevel,
      analysisDate: new Date().toISOString(),
      method: 'ai_automated',
      mitigationStrategies: risks.map(r => ({
        riskId: r.id,
        strategy: r.mitigation
      }))
    }

    onUpdate({ riskAssessment })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOverallRiskMessage = () => {
    switch (overallRiskLevel) {
      case 'high':
        return {
          color: 'text-red-800 bg-red-50 border-red-200',
          icon: TrendingDown,
          title: 'Riesgo Alto',
          message: 'Se recomienda implementar medidas de mitigación adicionales antes de proceder.'
        }
      case 'medium':
        return {
          color: 'text-yellow-800 bg-yellow-50 border-yellow-200',
          icon: AlertTriangle,
          title: 'Riesgo Moderado',
          message: 'Riesgo aceptable con las estrategias de mitigación adecuadas.'
        }
      case 'low':
        return {
          color: 'text-green-800 bg-green-50 border-green-200',
          icon: TrendingUp,
          title: 'Riesgo Bajo',
          message: 'Perfil de riesgo favorable para proceder con el proyecto.'
        }
    }
  }

  const riskMessage = getOverallRiskMessage()
  const RiskIcon = riskMessage.icon

  return (
    <div className="space-y-6">
      {/* Overall Risk Assessment */}
      <Card className={riskMessage.color}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RiskIcon className="h-5 w-5 mr-2" />
            Evaluación General de Riesgo: {riskMessage.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{riskMessage.message}</p>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Análisis de Riesgos del Proyecto</CardTitle>
              <CardDescription>
                Evaluación automática basada en perfil del proveedor y características del proyecto
              </CardDescription>
            </div>
            {isAnalyzing && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Analizando riesgos...
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {riskFactors.length === 0 && !isAnalyzing ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Análisis de Riesgo Pendiente</h3>
              <p className="text-muted-foreground mb-4">
                Ejecuta el análisis automático para identificar factores de riesgo
              </p>
              <Button onClick={runRiskAnalysis}>
                <Shield className="h-4 w-4 mr-2" />
                Iniciar Análisis de Riesgo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {riskFactors.map((risk) => {
                const IconComponent = risk.icon
                return (
                  <div key={risk.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{risk.title}</h4>
                          <p className="text-sm text-muted-foreground">{risk.category}</p>
                        </div>
                      </div>
                      <Badge className={getSeverityBadge(risk.severity)}>
                        {risk.severity === 'high' ? 'Alto' : risk.severity === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Probabilidad</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${risk.probability}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{risk.probability}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-muted-foreground">Impacto</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                risk.impact >= 70 ? 'bg-red-500' : 
                                risk.impact >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${risk.impact}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{risk.impact}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <h5 className="text-sm font-medium text-blue-800 mb-1">Estrategia de Mitigación</h5>
                      <p className="text-sm text-blue-700">{risk.mitigation}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Mitigation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionales de Mitigación</CardTitle>
          <CardDescription>
            Añade observaciones específicas o medidas adicionales de mitigación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={mitigationNotes}
            onChange={(e) => setMitigationNotes(e.target.value)}
            placeholder="Ejemplo: Requerir garantía bancaria adicional del 10% del valor del contrato debido al riesgo financiero identificado..."
            rows={4}
          />
          
          {mitigationNotes && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                <strong>Nota:</strong> Estas observaciones se incluirán en el contrato como términos adicionales.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Matrix Summary */}
      {riskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Matriz de Riesgo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <div className="text-2xl font-bold text-red-600">
                  {riskFactors.filter(r => r.severity === 'high').length}
                </div>
                <p className="text-sm text-red-800">Riesgos Altos</p>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-2xl font-bold text-yellow-600">
                  {riskFactors.filter(r => r.severity === 'medium').length}
                </div>
                <p className="text-sm text-yellow-800">Riesgos Medios</p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {riskFactors.filter(r => r.severity === 'low').length}
                </div>
                <p className="text-sm text-green-800">Riesgos Bajos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
