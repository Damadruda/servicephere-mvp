
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Shield, CheckCircle, AlertCircle, Clock, Award, Building, Users, Star } from 'lucide-react'
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

interface ProviderVerificationProps {
  data: DueDiligenceData
  quotation: Quotation
  onUpdate: (updates: Partial<DueDiligenceData>) => void
}

interface VerificationCheck {
  id: string
  name: string
  description: string
  status: 'pending' | 'checking' | 'verified' | 'failed'
  score: number
  details?: string
  icon: any
}

export function ProviderVerification({ data, quotation, onUpdate }: ProviderVerificationProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [checks, setChecks] = useState<VerificationCheck[]>([
    {
      id: 'credentials',
      name: 'Verificación de Credenciales',
      description: 'Validación de identidad y información corporativa',
      status: 'pending',
      score: 0,
      icon: Shield
    },
    {
      id: 'certifications',
      name: 'Certificaciones SAP',
      description: 'Verificación de certificaciones y vigencia',
      status: 'pending',
      score: 0,
      icon: Award
    },
    {
      id: 'references',
      name: 'Referencias de Cliente',
      description: 'Validación de proyectos y referencias anteriores',
      status: 'pending',
      score: 0,
      icon: Users
    },
    {
      id: 'financial',
      name: 'Estado Financiero',
      description: 'Evaluación de solvencia y capacidad financiera',
      status: 'pending',
      score: 0,
      icon: Building
    },
    {
      id: 'legal',
      name: 'Cumplimiento Legal',
      description: 'Verificación de documentos legales y licencias',
      status: 'pending',
      score: 0,
      icon: CheckCircle
    }
  ])

  useEffect(() => {
    // Auto-start verification if not already done
    if (data.overallScore === 0 && !isRunning) {
      setTimeout(() => runVerification(), 1000)
    }
  }, [])

  const runVerification = async () => {
    setIsRunning(true)
    
    try {
      // Simulate AI-powered verification process
      for (let i = 0; i < checks.length; i++) {
        const check = checks[i]
        
        setChecks(prevChecks => 
          prevChecks.map(c => 
            c.id === check.id ? { ...c, status: 'checking' as const } : c
          )
        )

        // Call AI verification API
        const response = await fetch('/api/due-diligence/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            providerId: quotation.provider.id,
            checkType: check.id,
            providerData: {
              name: quotation.provider.name,
              companyName: quotation.provider.companyName,
              email: quotation.provider.email
            }
          })
        })

        const result = await response.json()
        
        setChecks(prevChecks => 
          prevChecks.map(c => 
            c.id === check.id 
              ? { 
                  ...c, 
                  status: result.success ? 'verified' : 'failed',
                  score: result.score || 0,
                  details: result.details
                } 
              : c
          )
        )

        // Wait between checks for better UX
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // Calculate overall scores
      const updatedChecks = await new Promise<VerificationCheck[]>(resolve => {
        setChecks(prevChecks => {
          resolve(prevChecks)
          return prevChecks
        })
      })

      calculateScores(updatedChecks)
      
    } catch (error) {
      console.error('Error running verification:', error)
      toast.error('Error en la verificación automática')
    } finally {
      setIsRunning(false)
    }
  }

  const calculateScores = (verificationChecks: VerificationCheck[]) => {
    const credentialsScore = verificationChecks.find(c => c.id === 'credentials')?.score || 0
    const certificationsScore = verificationChecks.find(c => c.id === 'certifications')?.score || 0
    const referencesScore = verificationChecks.find(c => c.id === 'references')?.score || 0
    const financialScore = verificationChecks.find(c => c.id === 'financial')?.score || 0
    const legalScore = verificationChecks.find(c => c.id === 'legal')?.score || 0

    const reliabilityScore = Math.round((credentialsScore + legalScore) / 2)
    const experienceScore = Math.round((certificationsScore + referencesScore) / 2)
    const performanceScore = Math.round((financialScore + referencesScore) / 2)
    const overallScore = Math.round((reliabilityScore + experienceScore + performanceScore) / 3)

    const verificationDetails = {
      checks: verificationChecks.map(check => ({
        name: check.name,
        status: check.status,
        score: check.score,
        details: check.details
      })),
      timestamp: new Date().toISOString(),
      method: 'ai_automated'
    }

    onUpdate({
      credentialsVerified: credentialsScore >= 70,
      certificationsValid: certificationsScore >= 70,
      referencesChecked: referencesScore >= 60,
      financialStatusOk: financialScore >= 60,
      legalComplianceOk: legalScore >= 80,
      reliabilityScore,
      experienceScore,
      performanceScore,
      overallScore,
      verificationDetails
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'checking': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'checking': return <Clock className="h-5 w-5 text-blue-600 animate-spin" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
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

  return (
    <div className="space-y-6">
      {/* Provider Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Información del Proveedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm"><strong>Empresa:</strong> {quotation.provider.companyName}</p>
              <p className="text-sm"><strong>Consultor:</strong> {quotation.provider.name}</p>
              <p className="text-sm"><strong>Email:</strong> {quotation.provider.email}</p>
            </div>
            <div>
              <p className="text-sm"><strong>Propuesta:</strong> {quotation.title}</p>
              <p className="text-sm"><strong>Valor:</strong> ${quotation.totalCost.toLocaleString()} {quotation.currency}</p>
              <p className="text-sm"><strong>Timeline:</strong> {quotation.timeline}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Progress */}
      {data.overallScore > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Resultados de Verificación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(data.reliabilityScore)}`}>
                  {data.reliabilityScore}
                </div>
                <p className="text-sm text-muted-foreground">Confiabilidad</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(data.experienceScore)}`}>
                  {data.experienceScore}
                </div>
                <p className="text-sm text-muted-foreground">Experiencia</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(data.performanceScore)}`}>
                  {data.performanceScore}
                </div>
                <p className="text-sm text-muted-foreground">Performance</p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(data.overallScore)}`}>
                  {data.overallScore}
                </div>
                <p className="text-sm text-muted-foreground">Score General</p>
                <Badge className={getScoreBadge(data.overallScore)} variant="secondary">
                  {data.overallScore >= 80 ? 'Excelente' : 
                   data.overallScore >= 60 ? 'Bueno' : 'Requiere atención'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Checks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verificaciones Automáticas</CardTitle>
              <CardDescription>
                Sistema de IA que valida credenciales y capacidades del proveedor
              </CardDescription>
            </div>
            {!isRunning && data.overallScore === 0 && (
              <Button onClick={runVerification}>
                <Shield className="h-4 w-4 mr-2" />
                Iniciar Verificación
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check) => {
              const IconComponent = check.icon
              return (
                <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      {getStatusIcon(check.status)}
                    </div>
                    <div>
                      <h4 className="font-medium">{check.name}</h4>
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                      {check.details && (
                        <p className="text-xs text-muted-foreground mt-1">{check.details}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {check.status === 'checking' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                      </div>
                    )}
                    
                    {(check.status === 'verified' || check.status === 'failed') && (
                      <div className="flex items-center space-x-2">
                        <div className={`text-lg font-bold ${getStatusColor(check.status)}`}>
                          {check.score}
                        </div>
                        <div className="text-sm text-muted-foreground">/100</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {data.overallScore > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.overallScore >= 80 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Proveedor Altamente Recomendado</h4>
                      <p className="text-sm text-green-700">
                        Excelente puntuación general. Este proveedor cumple con todos los estándares 
                        de calidad y puede proceder con confianza al proceso de contratación.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {data.overallScore >= 60 && data.overallScore < 80 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Proveedor Confiable con Observaciones</h4>
                      <p className="text-sm text-yellow-700">
                        Puntuación aceptable. Se recomienda revisar los puntos de menor puntuación 
                        y considerar términos adicionales en el contrato.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {data.overallScore < 60 && data.overallScore > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Proveedor Requiere Evaluación Adicional</h4>
                      <p className="text-sm text-red-700">
                        La puntuación indica riesgos potenciales. Se recomienda una evaluación manual 
                        adicional antes de proceder con la contratación.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
