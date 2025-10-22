
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertCircle, ArrowRight, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
  href?: string
  action?: () => void
}

export function SetupWizard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [onboardingStatus, setOnboardingStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOnboardingStatus()
  }, [])

  const fetchOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/onboarding/provider')
      if (response.ok) {
        const data = await response.json()
        setOnboardingStatus(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isOnboardingCompleted = onboardingStatus?.onboardingCompleted || false
  const approvalStatus = onboardingStatus?.approvalStatus || 'NOT_STARTED'

  // Si ya completó onboarding pero está pendiente de aprobación
  if (isOnboardingCompleted && approvalStatus === 'PENDING') {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">
                Perfil en Revisión
              </h3>
              <p className="text-yellow-700 text-sm">
                Tu onboarding está completo. Estamos verificando tu información 
                para activar tu cuenta de proveedor.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => router.push('/onboarding/confirmacion')}
            >
              Ver Estado
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Si ya está aprobado, mostrar mensaje de éxito
  if (approvalStatus === 'APPROVED') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">
                ¡Cuenta Activada!
              </h3>
              <p className="text-green-700 text-sm">
                Tu perfil de proveedor está activo y puedes comenzar a recibir 
                oportunidades de proyectos SAP.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Setup steps para proveedores que no han completado onboarding
  const steps: SetupStep[] = [
    {
      id: 'complete-profile',
      title: 'Completar Perfil de Proveedor',
      description: 'Información de empresa, certificaciones y portfolio',
      completed: false,
      required: true,
      href: '/onboarding/proveedor'
    },
    {
      id: 'verify-certifications',
      title: 'Verificar Certificaciones SAP',
      description: 'Subir y validar certificaciones del equipo',
      completed: false,
      required: true
    },
    {
      id: 'build-portfolio',
      title: 'Construir Portfolio',
      description: 'Agregar casos de éxito y proyectos anteriores',
      completed: false,
      required: true
    },
    {
      id: 'setup-notifications',
      title: 'Configurar Notificaciones',
      description: 'Preferencias de comunicación y alerts',
      completed: false,
      required: false
    }
  ]

  const completedSteps = steps.filter(step => step.completed).length
  const progress = (completedSteps / steps.length) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            Configuración de Cuenta
            <Badge variant="outline" className="ml-2">
              Proveedor SAP
            </Badge>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedSteps} de {steps.length} completado
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Completa tu perfil para comenzar a recibir oportunidades de proyectos SAP
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
              step.completed 
                ? 'border-green-200 bg-green-50'
                : step.required
                ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`flex-shrink-0 ${
                step.completed 
                  ? 'text-green-600' 
                  : step.required
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : step.required ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-current" />
                )}
              </div>
              <div>
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {step.required && !step.completed && (
                <Badge variant="outline" className="text-xs">
                  Requerido
                </Badge>
              )}
              
              {!step.completed && (
                <Button
                  size="sm"
                  variant={step.required ? "default" : "outline"}
                  onClick={() => {
                    if (step.href) {
                      router.push(step.href)
                    } else if (step.action) {
                      step.action()
                    }
                  }}
                >
                  {step.required ? 'Completar' : 'Configurar'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        
        {completedSteps === 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              🚀 ¡Bienvenido al marketplace de servicios SAP!
            </h4>
            <p className="text-blue-700 text-sm">
              Para comenzar a recibir oportunidades de proyectos, necesitas completar 
              tu perfil de proveedor. Este proceso toma aproximadamente 15-20 minutos.
            </p>
            <Button 
              className="mt-3"
              onClick={() => router.push('/onboarding/proveedor')}
            >
              Comenzar Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
