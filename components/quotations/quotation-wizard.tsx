
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { QuotationBasicInfo } from './quotation-basic-info'
import { QuotationTechnicalProposal } from './quotation-technical-proposal'
import { QuotationTeamAndCosts } from './quotation-team-and-costs'
import { QuotationTermsAndDeliverables } from './quotation-terms-and-deliverables'
import { QuotationPreview } from './quotation-preview'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export interface QuotationData {
  // Basic Info
  title: string
  description: string
  approach: string
  
  // Technical Proposal
  methodology: string
  technicalProposal: {
    implementationApproach: string
    architectureOverview: string
    riskMitigation: string
    qualityAssurance: string
    dataStrategy: string
  }
  deliverables: string[]
  milestones: Array<{
    name: string
    description: string
    duration: string
    dependencies: string[]
  }>
  
  // Team and Costs
  teamComposition: Array<{
    role: string
    experience: string
    certifications: string[]
    allocation: string
    cost: number
  }>
  costBreakdown: Array<{
    category: string
    description: string
    cost: number
    currency: string
  }>
  totalCost: number
  currency: string
  
  // Terms and Conditions
  timeline: string
  paymentTerms: string
  includedServices: string[]
  excludedServices: string[]
  assumptions: string
  risks: string[]
  validUntil: Date
  
  // Additional Information
  companyPresentation: string
  similarProjects: Array<{
    title: string
    client: string
    modules: string[]
    duration: string
    teamSize: string
  }>
  certifications: string[]
}

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

interface QuotationWizardProps {
  project: Project
  onComplete: (quotationId: string) => void
}

const steps = [
  { id: 1, title: 'Información Básica', description: 'Título, descripción y enfoque' },
  { id: 2, title: 'Propuesta Técnica', description: 'Metodología y arquitectura' },
  { id: 3, title: 'Equipo y Costos', description: 'Composición de equipo y presupuesto' },
  { id: 4, title: 'Términos y Entregables', description: 'Condiciones comerciales' },
  { id: 5, title: 'Vista Previa', description: 'Revisar y enviar cotización' }
]

export function QuotationWizard({ project, onComplete }: QuotationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [quotationData, setQuotationData] = useState<QuotationData>({
    // Initialize with project-based defaults
    title: `Propuesta SAP para ${project.client.companyName}`,
    description: '',
    approach: '',
    methodology: 'SAP Activate',
    technicalProposal: {
      implementationApproach: '',
      architectureOverview: '',
      riskMitigation: '',
      qualityAssurance: '',
      dataStrategy: ''
    },
    deliverables: [],
    milestones: [],
    teamComposition: [],
    costBreakdown: [],
    totalCost: 0,
    currency: 'USD',
    timeline: project.timeline,
    paymentTerms: '30% inicio, 40% entregables intermedios, 30% go-live',
    includedServices: [],
    excludedServices: [],
    assumptions: '',
    risks: [],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    companyPresentation: '',
    similarProjects: [],
    certifications: []
  })
  
  const progress = (currentStep / steps.length) * 100

  const updateQuotationData = (updates: Partial<QuotationData>) => {
    setQuotationData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      await submitQuotation()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitQuotation = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/quotations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          ...quotationData
        })
      })

      if (response.ok) {
        const { quotationId } = await response.json()
        onComplete(quotationId)
      } else {
        throw new Error('Error al crear la cotización')
      }
    } catch (error) {
      console.error('Error submitting quotation:', error)
      toast.error('Error al enviar la cotización. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuotationBasicInfo
            data={quotationData}
            project={project}
            onUpdate={updateQuotationData}
          />
        )
      case 2:
        return (
          <QuotationTechnicalProposal
            data={quotationData}
            project={project}
            onUpdate={updateQuotationData}
          />
        )
      case 3:
        return (
          <QuotationTeamAndCosts
            data={quotationData}
            project={project}
            onUpdate={updateQuotationData}
          />
        )
      case 4:
        return (
          <QuotationTermsAndDeliverables
            data={quotationData}
            project={project}
            onUpdate={updateQuotationData}
          />
        )
      case 5:
        return (
          <QuotationPreview
            data={quotationData}
            project={project}
            onUpdate={updateQuotationData}
          />
        )
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return quotationData.title && quotationData.description && quotationData.approach
      case 2:
        return quotationData.methodology && quotationData.technicalProposal.implementationApproach
      case 3:
        return quotationData.teamComposition.length > 0 && quotationData.totalCost > 0
      case 4:
        return quotationData.deliverables.length > 0 && quotationData.paymentTerms
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-xl">
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1]?.description}
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            Paso {currentStep} de {steps.length}
          </div>
        </div>
        
        <Progress value={progress} className="w-full" />
        
        {/* Steps indicator */}
        <div className="flex justify-between mt-4 overflow-x-auto">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1 min-w-0' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id}
              </div>
              <div className="ml-2 text-sm min-w-0">
                <div className={`truncate ${currentStep >= step.id ? 'font-medium' : 'text-muted-foreground'}`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-muted min-w-[20px]" />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {renderCurrentStep()}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </div>
            ) : currentStep === steps.length ? (
              'Enviar Cotización'
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
