
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { DueDiligenceWizard } from '@/components/contracts/due-diligence-wizard'
import { Loader2, Shield, Search, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface SelectionPageProps {
  params: {
    quotationId: string
  }
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

export default function SelectionPage({ params }: SelectionPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [quotation, setQuotation] = useState<Quotation | null>(null)

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

    loadQuotation()
  }, [session, status, params.quotationId])

  const loadQuotation = async () => {
    try {
      const response = await fetch(`/api/quotations/${params.quotationId}/details`)
      if (response.ok) {
        const data = await response.json()
        setQuotation(data.quotation)
      } else {
        throw new Error('Quotation not found')
      }
    } catch (error) {
      console.error('Error loading quotation:', error)
      toast.error('Error al cargar la cotización')
      router.push('/cotizaciones/recibidas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDueDiligenceComplete = (contractId: string) => {
    toast.success('¡Due Diligence completado exitosamente!')
    router.push(`/contratos/${contractId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!quotation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cotización no encontrada</h1>
          <p className="text-gray-600 mb-4">La cotización que buscas no existe o no tienes acceso a ella.</p>
          <button 
            onClick={() => router.push('/cotizaciones/recibidas')}
            className="text-primary hover:underline"
          >
            Volver a cotizaciones
          </button>
        </div>
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
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Proceso de Selección y Due Diligence
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verificación automática de credenciales y generación de contrato inteligente 
            para la propuesta de <strong>{quotation.provider.companyName}</strong>.
          </p>
        </div>

        {/* Quotation Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Resumen de la Cotización Seleccionada</CardTitle>
            <CardDescription>
              Detalles de la propuesta que procederá al proceso de contratación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Proveedor</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>{quotation.provider.companyName}</strong><br />
                  Consultor: {quotation.provider.name}<br />
                  Email: {quotation.provider.email}
                </p>
                
                <h4 className="font-medium mb-2">Proyecto</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {quotation.project.title}<br />
                  Para: {quotation.project.companyName}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Propuesta</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>{quotation.title}</strong><br />
                  {quotation.description.substring(0, 100)}...
                </p>
                
                <h4 className="font-medium mb-2">Inversión</h4>
                <p className="text-lg font-bold text-green-600">
                  ${quotation.totalCost.toLocaleString()} {quotation.currency}
                </p>
                <p className="text-sm text-muted-foreground">
                  Timeline: {quotation.timeline}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Search className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Due Diligence Automático</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Verificación automática de credenciales, certificaciones y referencias del proveedor
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Contratos Inteligentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Generación automática de contratos con términos específicos de SAP
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
                Workflow completo desde verificación hasta firma digital del contrato
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Due Diligence Wizard */}
        <DueDiligenceWizard 
          quotation={quotation}
          onComplete={handleDueDiligenceComplete}
        />
      </main>
      
      <Footer />
    </div>
  )
}
