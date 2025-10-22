
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ClientOnboardingData } from './client-onboarding-wizard'
import { CheckCircle, Star, Calendar, DollarSign, Users, ArrowRight, Download, Lightbulb } from 'lucide-react'

interface OnboardingCompleteProps {
  data: ClientOnboardingData
  onFinish: () => void
}

export function OnboardingComplete({ data, onFinish }: OnboardingCompleteProps) {
  const recommendations = data.aiRecommendations

  const handleDownloadReport = () => {
    // Create a comprehensive report
    const reportData = {
      companyProfile: {
        urgencyLevel: data.urgencyLevel,
        implementationType: data.implementationType,
        sapExperience: data.sapExperience
      },
      currentSituation: {
        systems: data.currentSystemsUsed,
        painPoints: data.painPoints,
        goals: data.primaryGoals
      },
      technicalRequirements: {
        currentModules: data.currentSapModules,
        interestedModules: data.interestedModules,
        cloudPreference: data.cloudPreference
      },
      projectDetails: {
        timeline: data.projectTimeline,
        budget: data.budgetRange,
        teamAvailability: data.teamAvailability
      },
      businessContext: {
        processes: data.businessProcesses,
        compliance: data.complianceRequirements,
        integrations: data.integrationNeeds,
        successCriteria: data.successCriteria
      },
      aiRecommendations: recommendations
    }

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sap-assessment-report.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Assessment Completado!
        </h1>
        <p className="text-lg text-gray-600">
          Hemos analizado tus necesidades y generado recomendaciones personalizadas
        </p>
      </div>

      {/* AI Recommendations */}
      {recommendations && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Recomendaciones Personalizadas</CardTitle>
            </div>
            <CardDescription>
              Basadas en tu assessment y mejores prácticas de la industria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recommended Modules */}
            <div>
              <h4 className="font-semibold mb-2">Módulos SAP Recomendados</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.recommendedModules?.map((module) => (
                  <Badge key={module} className="bg-primary/10 text-primary hover:bg-primary/20">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Implementation Approach */}
            <div>
              <h4 className="font-semibold mb-2">Enfoque de Implementación</h4>
              <p className="text-sm text-gray-600">
                {recommendations.implementationApproach}
              </p>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold mb-2">Timeline Estimado</h4>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">{recommendations.estimatedTimeline}</span>
              </div>
            </div>

            {/* Key Considerations */}
            <div>
              <h4 className="font-semibold mb-2">Consideraciones Clave</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {recommendations.keyConsiderations?.map((consideration, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Project Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Resumen del Proyecto</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Tipo de Proyecto</p>
              <p className="text-sm text-muted-foreground capitalize">{data.implementationType}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Urgencia</p>
              <Badge variant={data.urgencyLevel === 'high' ? 'destructive' : data.urgencyLevel === 'medium' ? 'default' : 'secondary'}>
                {data.urgencyLevel === 'high' && 'Alta'}
                {data.urgencyLevel === 'medium' && 'Media'}
                {data.urgencyLevel === 'low' && 'Baja'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Experiencia SAP</p>
              <p className="text-sm text-muted-foreground capitalize">{data.sapExperience}</p>
            </div>
          </CardContent>
        </Card>

        {/* Budget & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Presupuesto & Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Presupuesto</p>
              <p className="text-sm text-muted-foreground">{data.budgetRange}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Timeline</p>
              <p className="text-sm text-muted-foreground">{data.projectTimeline}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Disponibilidad del Equipo</p>
              <p className="text-sm text-muted-foreground">{data.teamAvailability}</p>
            </div>
          </CardContent>
        </Card>

        {/* Team & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Próximos Pasos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">✅ Assessment completado</p>
              <p className="text-sm">🔍 Búsqueda de consultores</p>
              <p className="text-sm">📋 Publicar proyecto</p>
              <p className="text-sm">💬 Recibir cotizaciones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Modules & Processes */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Módulos de Interés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.interestedModules.slice(0, 8).map((module) => (
                <Badge key={module} variant="outline">
                  {module}
                </Badge>
              ))}
              {data.interestedModules.length > 8 && (
                <Badge variant="secondary">
                  +{data.interestedModules.length - 8} más
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procesos Prioritarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.businessProcesses.slice(0, 6).map((process) => (
                <Badge key={process} variant="outline">
                  {process}
                </Badge>
              ))}
              {data.businessProcesses.length > 6 && (
                <Badge variant="secondary">
                  +{data.businessProcesses.length - 6} más
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownloadReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Descargar Reporte Completo
        </Button>
        <Button onClick={onFinish} size="lg">
          Ir al Dashboard
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">¿Qué sigue?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-blue-700">
            <p className="text-sm">
              <strong>1. Revisa tu dashboard:</strong> Encontrarás consultores recomendados basados en tu assessment
            </p>
            <p className="text-sm">
              <strong>2. Publica tu proyecto:</strong> Usa las recomendaciones para crear una descripción detallada
            </p>
            <p className="text-sm">
              <strong>3. Evalúa propuestas:</strong> Recibe cotizaciones de consultores certificados
            </p>
            <p className="text-sm">
              <strong>4. Inicia tu proyecto:</strong> Selecciona el mejor partner y comienza tu implementación SAP
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
