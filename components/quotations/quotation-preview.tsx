
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { QuotationData } from './quotation-wizard'
import { FileText, Users, DollarSign, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  requirements: string
  industry: string
  sapModules: string[]
  budget: string
  timeline: string
  implementationType: string
  cloudPreference: string
  businessProcesses: string[]
  complianceRequirements: string[]
  integrationNeeds: string[]
  client: {
    name: string
    companyName: string
  }
}

interface QuotationPreviewProps {
  data: QuotationData
  project: Project
  onUpdate: (updates: Partial<QuotationData>) => void
}

export function QuotationPreview({ data, project }: QuotationPreviewProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCompletionScore = () => {
    let score = 0
    let maxScore = 0

    // Basic Info (30%)
    maxScore += 30
    if (data.title) score += 10
    if (data.description) score += 10
    if (data.approach) score += 10

    // Technical (25%)
    maxScore += 25
    if (data.methodology) score += 5
    if (data.technicalProposal.implementationApproach) score += 10
    if (data.milestones.length > 0) score += 10

    // Team and Costs (25%)
    maxScore += 25
    if (data.teamComposition.length > 0) score += 15
    if (data.totalCost > 0) score += 10

    // Terms (20%)
    maxScore += 20
    if (data.deliverables.length > 0) score += 10
    if (data.paymentTerms) score += 5
    if (data.assumptions) score += 5

    return Math.round((score / maxScore) * 100)
  }

  const completionScore = getCompletionScore()

  return (
    <div className="space-y-8">
      {/* Completion Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Estado de Completitud: {completionScore}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <p className="text-sm text-blue-700">
              {completionScore >= 80 
                ? '¡Excelente! Tu cotización está lista para enviar.' 
                : completionScore >= 60
                ? 'Buen progreso. Completa algunos campos más para mejorar la calidad.'
                : 'Necesitas completar más información antes de enviar.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quotation Preview */}
      <Card className="border-2">
        <CardHeader className="bg-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">{data.title}</CardTitle>
              <CardDescription className="mt-2 text-base">
                Para: {project.client.companyName}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Válida hasta</div>
              <div className="font-medium">{formatDate(data.validUntil)}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 mt-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Descripción de la Propuesta
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          <Separator />

          {/* Approach */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Enfoque y Metodología</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Metodología:</span>
                <Badge variant="secondary">{data.methodology}</Badge>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {data.approach}
              </p>
            </div>
          </div>

          <Separator />

          {/* Technical Proposal */}
          {data.technicalProposal.implementationApproach && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Propuesta Técnica</h3>
                <div className="space-y-4">
                  {data.technicalProposal.implementationApproach && (
                    <div>
                      <h4 className="font-medium mb-2">Enfoque de Implementación</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {data.technicalProposal.implementationApproach}
                      </p>
                    </div>
                  )}
                  
                  {data.technicalProposal.architectureOverview && (
                    <div>
                      <h4 className="font-medium mb-2">Arquitectura</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {data.technicalProposal.architectureOverview}
                      </p>
                    </div>
                  )}

                  {data.technicalProposal.riskMitigation && (
                    <div>
                      <h4 className="font-medium mb-2">Mitigación de Riesgos</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {data.technicalProposal.riskMitigation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Milestones */}
          {data.milestones.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Hitos del Proyecto
                </h3>
                <div className="space-y-3">
                  {data.milestones.map((milestone, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{milestone.name}</h4>
                        <Badge variant="outline">{milestone.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      {milestone.dependencies.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Depende de: {milestone.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Team Composition */}
          {data.teamComposition.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Equipo del Proyecto
                </h3>
                <div className="space-y-3">
                  {data.teamComposition.map((member, index) => (
                    <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded">
                      <div>
                        <h4 className="font-medium">{member.role}</h4>
                        <p className="text-sm text-muted-foreground">{member.experience}</p>
                        {member.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.certifications.map((cert, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{member.allocation}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${member.cost.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Cost Breakdown */}
          {data.costBreakdown.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  Desglose de Costos
                </h3>
                <div className="space-y-3">
                  {data.costBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{item.category}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="font-medium">
                        ${item.cost.toLocaleString()} {item.currency}
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">Total del Proyecto</h4>
                      <div className="text-2xl font-bold text-primary">
                        ${data.totalCost.toLocaleString()} {data.currency}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Deliverables */}
          {data.deliverables.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Entregables</h3>
                <div className="grid gap-2">
                  {data.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Services */}
          <div className="grid md:grid-cols-2 gap-6">
            {data.includedServices.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-800 mb-3">✓ Servicios Incluidos</h4>
                <div className="space-y-1">
                  {data.includedServices.map((service, index) => (
                    <div key={index} className="text-sm text-green-700 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {data.excludedServices.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-800 mb-3">✗ Servicios NO Incluidos</h4>
                <div className="space-y-1">
                  {data.excludedServices.map((service, index) => (
                    <div key={index} className="text-sm text-red-700 flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Terms */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Términos de Pago</h4>
              <p className="text-sm text-muted-foreground">{data.paymentTerms}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Timeline del Proyecto</h4>
              <p className="text-sm text-muted-foreground">{data.timeline}</p>
            </div>
          </div>

          {/* Assumptions */}
          {data.assumptions && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Asunciones del Proyecto</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {data.assumptions}
                </p>
              </div>
            </>
          )}

          {/* Risks */}
          {data.risks.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Riesgos Identificados
                </h4>
                <div className="space-y-2">
                  {data.risks.map((risk, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <span className="text-muted-foreground">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Final Checks */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">
            ✅ Lista de Verificación Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.title ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.title ? 'text-green-700' : 'text-gray-600'}>
                  Título profesional definido
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.description ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.description ? 'text-green-700' : 'text-gray-600'}>
                  Descripción personalizada
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.teamComposition.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.teamComposition.length > 0 ? 'text-green-700' : 'text-gray-600'}>
                  Equipo definido
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.totalCost > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.totalCost > 0 ? 'text-green-700' : 'text-gray-600'}>
                  Costos calculados
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.deliverables.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.deliverables.length > 0 ? 'text-green-700' : 'text-gray-600'}>
                  Entregables especificados
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.paymentTerms ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.paymentTerms ? 'text-green-700' : 'text-gray-600'}>
                  Términos de pago definidos
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.milestones.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.milestones.length > 0 ? 'text-green-700' : 'text-gray-600'}>
                  Cronograma con hitos
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.assumptions ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.assumptions ? 'text-green-700' : 'text-gray-600'}>
                  Asunciones documentadas
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
