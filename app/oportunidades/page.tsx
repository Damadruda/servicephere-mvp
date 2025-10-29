
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProjectOpportunities } from '@/components/quotations/project-opportunities'
import { Loader2, Target, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OportunidadesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

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

    setIsLoading(false)
  }, [session, status, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              <Target className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Oportunidades de Negocio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre proyectos SAP que coinciden con la experiencia y especialización de tu empresa. 
            Recibe un matching score basado en tu perfil de partner SAP.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Matching Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Los proyectos se ordenan por compatibilidad con el perfil y experiencia en SAP de la empresa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Información Detallada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Accede a assessment completo del cliente y detalles técnicos específicos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Award className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Propuesta Guiada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Templates específicos SAP te ayudan a crear propuestas profesionales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Opportunities Component */}
        <ProjectOpportunities />
      </main>
      
    </div>
  )
}
