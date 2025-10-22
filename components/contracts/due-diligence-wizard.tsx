
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProviderVerification } from './provider-verification'
import { RiskAssessment } from './risk-assessment'
import { ContractGeneration } from './contract-generation'
import { ContractReview } from './contract-review'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export interface DueDiligenceData {
  // Verification results
  credentialsVerified: boolean
  certificationsValid: boolean
  referencesChecked: boolean
  financialStatusOk: boolean
  legalComplianceOk: boolean
  
  // Scores
  reliabilityScore: number
  experienceScore: number
  performanceScore: number
  overallScore: number
  
  // Details
  verificationDetails: any
  referenceContacts: any[]
  certificationDetails: any
  riskAssessment: any
  
  // Contract data
  contractTerms: any
  paymentSchedule: any[]
  milestones: any[]
  startDate: string
  endDate: string
}

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

interface DueDiligenceWizardProps {
  quotation: Quotation
  onComplete: (contractId: string) => void
}

const steps = [
  { id: 1, title: 'Verificación del Proveedor', description: 'Credenciales y certificaciones' },
  { id: 2, title: 'Evaluación de Riesgos', description: 'Análisis financiero y legal' },
  { id: 3, title: 'Generación de Contrato', description: 'Términos y condiciones' },
  { id: 4, title: 'Revisión y Aprobación', description: 'Validación final y firma' }
]

export function DueDiligenceWizard({ quotation, onComplete }: DueDiligenceWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [dueDiligenceData, setDueDiligenceData] = useState<DueDiligenceData>({
    credentialsVerified: false,
    certificationsValid: false,
    referencesChecked: false,
    financialStatusOk: false,
    legalComplianceOk: false,
    reliabilityScore: 0,
    experienceScore: 0,
    performanceScore: 0,
    overallScore: 0,
    verificationDetails: {},
    referenceContacts: [],
    certificationDetails: {},
    riskAssessment: {},
    contractTerms: {},
    paymentSchedule: [],
    milestones: [],
    startDate: '',
    endDate: ''
  })
  
  const progress = (currentStep / steps.length) * 100

  const updateDueDiligenceData = (updates: Partial<DueDiligenceData>) => {
    setDueDiligenceData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      await completeDueDiligence()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeDueDiligence = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/contracts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotationId: quotation.id,
          dueDiligenceData
        })
      })

      if (response.ok) {
        const { contractId } = await response.json()
        onComplete(contractId)
      } else {
        throw new Error('Error al crear el contrato')
      }
    } catch (error) {
      console.error('Error completing due diligence:', error)
      toast.error('Error al completar el proceso. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProviderVerification
            data={dueDiligenceData}
            quotation={quotation}
            onUpdate={updateDueDiligenceData}
          />
        )
      case 2:
        return (
          <RiskAssessment
            data={dueDiligenceData}
            quotation={quotation}
            onUpdate={updateDueDiligenceData}
          />
        )
      case 3:
        return (
          <ContractGeneration
            data={dueDiligenceData}
            quotation={quotation}
            onUpdate={updateDueDiligenceData}
          />
        )
      case 4:
        return (
          <ContractReview
            data={dueDiligenceData}
            quotation={quotation}
            onUpdate={updateDueDiligenceData}
          />
        )
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return dueDiligenceData.overallScore >= 70 // Minimum score to proceed
      case 2:
        return dueDiligenceData.riskAssessment && Object.keys(dueDiligenceData.riskAssessment).length > 0
      case 3:
        return dueDiligenceData.contractTerms && Object.keys(dueDiligenceData.contractTerms).length > 0
      case 4:
        return true // Final review, always can proceed to finish
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
                Procesando...
              </div>
            ) : currentStep === steps.length ? (
              'Finalizar y Crear Contrato'
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
