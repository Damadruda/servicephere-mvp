
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { QuotationWizard } from '@/components/quotations/quotation-wizard'
import { Loader2, FileText, Calculator, Users, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface CreateQuotationPageProps {
  params: {
    projectId: string
  }
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

export default function CreateQuotationPage({ params }: CreateQuotationPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.user?.userType !== 'PROVIDER') {
      router.push('/dashboard')
      return
    }

    loadProject()
  }, [session, status, params.projectId])

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data.project)
      } else {
        throw new Error('Project not found')
      }
    } catch (error) {
      console.error('Error loading project:', error)
      toast.error('Error al cargar el proyecto')
      router.push('/oportunidades')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuotationComplete = (quotationId: string) => {
    toast.success('¡Cotización enviada exitosamente!')
    router.push(`/cotizaciones/${quotationId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Proyecto no encontrado</h1>
          <p className="text-gray-600 mb-4">El proyecto que buscas no existe o no está disponible.</p>
          <button 
            onClick={() => router.push('/oportunidades')}
            className="text-primary hover:underline"
          >
            Volver a oportunidades
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cotización SAP
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crea una propuesta profesional y detallada para el proyecto "{project.title}".
            Utiliza nuestros templates especializados en SAP.
          </p>
        </div>

        {/* Project Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Resumen del Proyecto</CardTitle>
            <CardDescription>
              Información clave del proyecto para tu cotización
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Cliente</h4>
                <p className="text-sm text-muted-foreground mb-4">{project.client.companyName}</p>
                
                <h4 className="font-medium mb-2">Industria</h4>
                <p className="text-sm text-muted-foreground mb-4">{project.industry}</p>
                
                <h4 className="font-medium mb-2">Presupuesto</h4>
                <p className="text-sm text-muted-foreground">{project.budget}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Timeline</h4>
                <p className="text-sm text-muted-foreground mb-4">{project.timeline}</p>
                
                <h4 className="font-medium mb-2">Tipo de Implementación</h4>
                <p className="text-sm text-muted-foreground mb-4 capitalize">{project.implementationType}</p>
                
                <h4 className="font-medium mb-2">Módulos SAP</h4>
                <div className="flex flex-wrap gap-1">
                  {project.sapModules.slice(0, 3).map((module) => (
                    <span key={module} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {module}
                    </span>
                  ))}
                  {project.sapModules.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      +{project.sapModules.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Calculator className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Cálculo Automático</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Templates con cálculos automáticos basados en módulos SAP seleccionados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Configuración de Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Herramientas para definir roles, experiencia y certificaciones del equipo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Propuesta Profesional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Genera propuestas completas con mejores prácticas de la industria SAP
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quotation Wizard */}
        <QuotationWizard 
          project={project}
          onComplete={handleQuotationComplete}
        />
      </main>
      
    </div>
  )
}
