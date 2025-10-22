
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProjectBasicInfo } from './project-basic-info'
import { ProjectTechnicalDetails } from './project-technical-details'
import { ProjectBusinessContext } from './project-business-context'
import { ProjectPreview } from './project-preview'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export interface ProjectCreationData {
  // Basic Info
  title: string
  description: string
  requirements: string
  
  // Technical Details
  implementationType: 'new' | 'upgrade' | 'migration' | 'optimization'
  sapModules: string[]
  methodology: string
  cloudPreference: 'onPremise' | 'cloud' | 'hybrid' | 'noPreference'
  
  // Business Context
  industry: string
  businessProcesses: string[]
  complianceRequirements: string[]
  integrationNeeds: string[]
  
  // Project Details
  budget: string
  timeline: string
  teamSize: string
  location: {
    country: string
    city: string
    isRemote: boolean
  }
  
  // Publication settings
  visibility: 'public' | 'private' | 'inviteOnly'
  invitedProviders?: string[]
  publishedAt?: Date
}

interface ProjectCreationWizardProps {
  initialData?: any
  onComplete: (projectId: string) => void
}

const steps = [
  { id: 1, title: 'Información Básica', description: 'Título y descripción del proyecto' },
  { id: 2, title: 'Detalles Técnicos', description: 'Especificaciones SAP y metodología' },
  { id: 3, title: 'Contexto de Negocio', description: 'Industria, procesos y requerimientos' },
  { id: 4, title: 'Vista Previa', description: 'Revisar y publicar proyecto' }
]

export function ProjectCreationWizard({ initialData, onComplete }: ProjectCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [projectData, setProjectData] = useState<ProjectCreationData>({
    // Initialize with assessment data if available
    title: '',
    description: '',
    requirements: '',
    implementationType: initialData?.implementationType || 'new',
    sapModules: initialData?.interestedModules || [],
    methodology: 'SAP Activate',
    cloudPreference: initialData?.cloudPreference || 'noPreference',
    industry: initialData?.industry || '',
    businessProcesses: initialData?.businessProcesses || [],
    complianceRequirements: initialData?.complianceRequirements || [],
    integrationNeeds: initialData?.integrationNeeds || [],
    budget: initialData?.budgetRange || '',
    timeline: initialData?.projectTimeline || '',
    teamSize: initialData?.teamAvailability || '',
    location: {
      country: initialData?.country || '',
      city: initialData?.city || '',
      isRemote: false
    },
    visibility: 'public'
  })
  
  const progress = (currentStep / steps.length) * 100

  const updateProjectData = (updates: Partial<ProjectCreationData>) => {
    setProjectData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      await publishProject()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const publishProject = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectData,
          publishedAt: new Date()
        })
      })

      if (response.ok) {
        const { projectId } = await response.json()
        onComplete(projectId)
      } else {
        throw new Error('Error al crear el proyecto')
      }
    } catch (error) {
      console.error('Error publishing project:', error)
      toast.error('Error al publicar el proyecto. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectBasicInfo
            data={projectData}
            onUpdate={updateProjectData}
            initialData={initialData}
          />
        )
      case 2:
        return (
          <ProjectTechnicalDetails
            data={projectData}
            onUpdate={updateProjectData}
            initialData={initialData}
          />
        )
      case 3:
        return (
          <ProjectBusinessContext
            data={projectData}
            onUpdate={updateProjectData}
            initialData={initialData}
          />
        )
      case 4:
        return (
          <ProjectPreview
            data={projectData}
            onUpdate={updateProjectData}
          />
        )
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return projectData.title && projectData.description && projectData.requirements
      case 2:
        return projectData.sapModules.length > 0 && projectData.implementationType
      case 3:
        return projectData.industry && projectData.businessProcesses.length > 0
      case 4:
        return true
      default:
        return false
    }
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
            Paso {currentStep} de {steps.length}
          </div>
        </div>
        
        <Progress value={progress} className="w-full" />
        
        {/* Steps indicator */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
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
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-muted" />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Show assessment data notice */}
        {initialData && currentStep === 1 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">
              ✨ Datos de tu Assessment SAP Disponibles
            </h4>
            <p className="text-sm text-blue-700">
              Hemos pre-completado algunos campos basándose en tu assessment anterior. 
              Puedes modificar cualquier información según las necesidades específicas de este proyecto.
            </p>
          </div>
        )}

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
                Publicando...
              </div>
            ) : currentStep === steps.length ? (
              'Publicar Proyecto'
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
