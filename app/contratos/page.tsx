
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContractsManagement } from '@/components/contracts/contracts-management'
import { Loader2, FileText, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContratosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
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
            Gestión de Contratos SAP
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Administra todos tus contratos SAP en un solo lugar. Sigue el progreso, 
            gestiona pagos y mantén el control completo de tus proyectos.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Contratos Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Contratos generados automáticamente con términos específicos para proyectos SAP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Seguimiento en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Monitoreo automático del progreso y alertas de hitos y pagos pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Gestión de Hitos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Validación de entregables y aprobación de pagos por hitos completados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contracts Management Component */}
        <ContractsManagement />
      </main>
      
      <Footer />
    </div>
  )
}
