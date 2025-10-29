
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ReceivedQuotations } from '@/components/quotations/received-quotations'
import { Loader2, Mail, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CotizacionesRecibidasPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cotizaciones Recibidas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revisa y compara las propuestas de los consultores SAP. 
            Evalúa cada cotización y selecciona la mejor opción para tu proyecto.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Comparación Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Herramientas para comparar propuestas lado a lado y tomar decisiones informadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Comunicación Directa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Conecta directamente con los proveedores para aclarar dudas sobre sus propuestas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Gestión Centralizada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Todas tus cotizaciones organizadas en un solo lugar con seguimiento de estados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Received Quotations Component */}
        <ReceivedQuotations />
      </main>
      
    </div>
  )
}
