
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProjectCreationWizard } from '@/components/projects/project-creation-wizard'
import { Loader2, FileText, Lightbulb, Target, CheckCircle } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { toast } from 'sonner'

export default function NuevoProyectoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [clientAssessment, setClientAssessment] = useState(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.user?.userType !== 'CLIENT') {
      router.push('/dashboard')
      return
    }

    // Load client assessment data if available
    loadClientAssessment()
  }, [session, status, router])

  const loadClientAssessment = async () => {
    try {
      const response = await fetch('/api/onboarding/client-assessment')
      if (response.ok) {
        const data = await response.json()
        setClientAssessment(data)
      }
    } catch (error) {
      console.error('Error loading client assessment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Publicar Nuevo Proyecto SAP
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crea una descripción detallada de tu proyecto para conectar con los mejores consultores SAP.
            {clientAssessment && ' Usaremos tu assessment previo para acelerar el proceso.'}
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Lightbulb className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Recomendaciones Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Aprovechamos tu assessment SAP para pre-llenar campos relevantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Matching Preciso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Tu proyecto llegará solo a consultores especializados en tus necesidades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Proceso Guiado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Te ayudamos paso a paso para crear una descripción completa y atractiva
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Creation Wizard */}
        <ProjectCreationWizard 
          initialData={clientAssessment}
          onComplete={(projectId) => {
            toast.success('¡Proyecto publicado exitosamente!')
            router.push(`/proyectos/${projectId}`)
          }}
        />
      </main>
      
      <Footer />
    </div>
  )
}
