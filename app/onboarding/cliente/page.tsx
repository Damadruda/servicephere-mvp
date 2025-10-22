
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ClientOnboardingWizard } from '@/components/onboarding/client-onboarding-wizard'
import { Loader2, Users, Target, Zap, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ClientOnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Target className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a SAP Marketplace!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Completa tu perfil y descubre las mejores soluciones SAP para tu empresa. 
            Nuestro assessment inteligente te ayudará a definir tus necesidades específicas.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Assessment Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Evaluamos tus procesos actuales y necesidades específicas para recomendarte las mejores soluciones SAP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Matching Preciso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Te conectamos con consultores certificados que tienen experiencia específica en tu industria
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Resultados Garantizados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Trabajamos con partners verificados y certificados por SAP para asegurar el éxito de tu proyecto
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Wizard */}
        <ClientOnboardingWizard />
      </div>
    </div>
  )
}
