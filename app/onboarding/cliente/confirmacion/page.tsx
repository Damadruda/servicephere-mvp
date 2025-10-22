
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home } from 'lucide-react'

export default function ClientOnboardingConfirmationPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Onboarding Completado!</CardTitle>
          <CardDescription>
            Tu perfil ha sido configurado exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Serás redirigido automáticamente a tu dashboard en unos segundos...
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Ir al Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
