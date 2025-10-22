
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ClientBasicInfo } from './client-basic-info'
import { SapAssessment } from './sap-assessment'
import { BusinessObjectives } from './business-objectives'
import { OnboardingComplete } from './onboarding-complete'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export interface ClientOnboardingData {
  // Basic Info
  currentSystemsUsed: string[]
  painPoints: string[]
  primaryGoals: string[]
  urgencyLevel: 'low' | 'medium' | 'high'
  
  // SAP Assessment
  sapExperience: 'none' | 'basic' | 'intermediate' | 'advanced'
  currentSapModules: string[]
  interestedModules: string[]
  implementationType: 'new' | 'upgrade' | 'migration' | 'optimization'
  
  // Business Context
  businessProcesses: string[]
  complianceRequirements: string[]
  integrationNeeds: string[]
  cloudPreference: 'onPremise' | 'cloud' | 'hybrid' | 'noPreference'
  
  // Project Details
  projectTimeline: string
  budgetRange: string
  teamAvailability: string
  successCriteria: string[]
  
  // AI Recommendations (will be filled by AI)
  aiRecommendations?: {
    recommendedModules: string[]
    implementationApproach: string
    estimatedTimeline: string
    keyConsiderations: string[]
    suggestedPartners: string[]
  }
}

const steps = [
  { id: 1, title: 'Información Básica', description: 'Tu situación actual' },
  { id: 2, title: 'Assessment SAP', description: 'Evaluación técnica' },
  { id: 3, title: 'Objetivos de Negocio', description: 'Metas y prioridades' },
  { id: 4, title: 'Finalizar', description: 'Recomendaciones personalizadas' }
]

export function ClientOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<ClientOnboardingData>({
    currentSystemsUsed: [],
    painPoints: [],
    primaryGoals: [],
    urgencyLevel: 'medium',
    sapExperience: 'none',
    currentSapModules: [],
    interestedModules: [],
    implementationType: 'new',
    businessProcesses: [],
    complianceRequirements: [],
    integrationNeeds: [],
    cloudPreference: 'noPreference',
    projectTimeline: '',
    budgetRange: '',
    teamAvailability: '',
    successCriteria: []
  })
  
  const router = useRouter()
  const progress = (currentStep / steps.length) * 100

  const updateOnboardingData = (updates: Partial<ClientOnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      await completeOnboarding()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    setIsLoading(true)
    
    try {
      // First, get AI recommendations based on the assessment
      const aiResponse = await fetch('/api/onboarding/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData)
      })

      const aiRecommendations = await aiResponse.json()

      // Then save the complete onboarding data
      const response = await fetch('/api/onboarding/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...onboardingData,
          aiRecommendations: aiRecommendations.recommendations
        })
      })

      if (response.ok) {
        // Move to completion step
        setCurrentStep(steps.length)
        setOnboardingData(prev => ({ 
          ...prev, 
          aiRecommendations: aiRecommendations.recommendations 
        }))
        toast.success('¡Onboarding completado exitosamente!')
      } else {
        throw new Error('Error al completar el onboarding')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast.error('Error al completar el onboarding. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientBasicInfo
            data={onboardingData}
            onUpdate={updateOnboardingData}
          />
        )
      case 2:
        return (
          <SapAssessment
            data={onboardingData}
            onUpdate={updateOnboardingData}
          />
        )
      case 3:
        return (
          <BusinessObjectives
            data={onboardingData}
            onUpdate={updateOnboardingData}
          />
        )
      case 4:
        return (
          <OnboardingComplete
            data={onboardingData}
            onFinish={() => router.push('/dashboard')}
          />
        )
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.currentSystemsUsed.length > 0 && 
               onboardingData.painPoints.length > 0 && 
               onboardingData.primaryGoals.length > 0
      case 2:
        return onboardingData.sapExperience && onboardingData.implementationType
      case 3:
        return onboardingData.businessProcesses.length > 0 && 
               onboardingData.projectTimeline && 
               onboardingData.budgetRange
      default:
        return true
    }
  }

  if (currentStep === steps.length) {
    return renderCurrentStep()
  }

  return (
    <Card className="max-w-4xl mx-auto">
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
            Paso {currentStep} de {steps.length - 1}
          </div>
        </div>
        
        <Progress value={progress} className="w-full" />
        
        {/* Steps indicator */}
        <div className="flex justify-between mt-4">
          {steps.slice(0, -1).map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 2 ? 'flex-1' : ''
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
              <div className="ml-2 text-sm">
                <div className={currentStep >= step.id ? 'font-medium' : 'text-muted-foreground'}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 2 && (
                <div className="flex-1 h-0.5 mx-4 bg-muted" />
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
            ) : currentStep === steps.length - 1 ? (
              'Finalizar Assessment'
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
