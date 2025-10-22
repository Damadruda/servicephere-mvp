
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Mail, Phone, FileText, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function OnboardingConfirmationPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOnboardingStatus()
  }, [])

  const fetchOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding/provider')
      if (response.ok) {
        const data = await response.json()
        setOnboardingData(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    router.push('/login')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">Cargando...</div>
        </main>
        <Footer />
      </div>
    )
  }

  const verificationSteps = [
    {
      id: 'email',
      title: 'Confirmación por Email',
      description: 'Te hemos enviado un email de confirmación',
      status: 'completed',
      icon: Mail,
      time: 'Inmediato'
    },
    {
      id: 'auto-verification',
      title: 'Verificación Automática',
      description: 'Validación de certificaciones SAP y documentos',
      status: 'in-progress',
      icon: FileText,
      time: '1-2 horas'
    },
    {
      id: 'portfolio-review',
      title: 'Revisión de Portfolio',
      description: 'Validación manual de proyectos y referencias',
      status: 'pending',
      icon: Star,
      time: '2-3 días'
    },
    {
      id: 'final-approval',
      title: 'Aprobación Final',
      description: 'Revisión administrativa y activación de cuenta',
      status: 'pending',
      icon: CheckCircle,
      time: '1 día'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Header */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              >
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                ¡Onboarding Completado!
              </h1>
              <p className="text-green-700 mb-4">
                Tu solicitud ha sido enviada exitosamente. Estamos revisando tu información 
                para activar tu perfil de proveedor SAP.
              </p>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                ID: {onboardingData?.provider?.id?.slice(0, 8)}...
              </Badge>
            </CardContent>
          </Card>

          {/* Verification Process */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Proceso de Verificación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {verificationSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : step.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{step.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {step.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        {step.status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {step.status === 'in-progress' && (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        )}
                        {step.status === 'pending' && (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Mientras Esperás</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                  <div className="text-sm">
                    <strong>Revisa tu email</strong> para confirmar la dirección
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                  <div className="text-sm">
                    <strong>Prepara documentos</strong> adicionales si es necesario
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                  <div className="text-sm">
                    <strong>Familiarízate</strong> con la plataforma
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">onboarding@sapmarketplace.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Horarios: Lunes a Viernes, 9:00 - 18:00 (GMT-5)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estimated Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Timeline Estimado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Tiempo Total de Aprobación
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Basado en nuestros promedios actuales
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-800">3-5 días</div>
                    <div className="text-sm text-blue-600">días hábiles</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="flex-1 sm:flex-none"
            >
              Ir al Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/ayuda')}
              className="flex-1 sm:flex-none"
            >
              Centro de Ayuda
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = 'mailto:onboarding@sapmarketplace.com'}
              className="flex-1 sm:flex-none"
            >
              Contactar Soporte
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
