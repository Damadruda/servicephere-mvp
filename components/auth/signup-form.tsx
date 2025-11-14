

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, User, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type UserType = 'CLIENT' | 'PROVIDER'

export function SignupForm() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    password: '',
    name: '',
    
    // Profile info
    companyName: '',
    industry: '',
    country: '',
    city: '',
    description: '',
    website: '',
    
    // Client specific
    contactTitle: '',
    companySize: ''
  })

  const router = useRouter()

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userType) {
      toast.error('Por favor selecciona el tipo de usuario')
      return
    }

    setIsLoading(true)

    try {
      const submitData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userType: userType,
        companyName: formData.companyName || undefined,
        industry: formData.industry || undefined,
        country: formData.country || undefined,
        city: formData.city || undefined,
        description: formData.description || undefined,
        contactTitle: formData.contactTitle || undefined,
        companySize: formData.companySize || undefined
      }

      console.log('📝 [SIGNUP-FORM] Enviando datos de registro:', submitData)

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        console.log('✅ [SIGNUP-FORM] Registro exitoso, iniciando login automático...')
        toast.success('¡Cuenta creada exitosamente! Iniciando sesión...')

        // Pequeña espera para asegurar que la transacción de BD se haya completado
        await new Promise(resolve => setTimeout(resolve, 500))

        // Login automático usando las credenciales recién registradas
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: '/dashboard'
        })

        console.log('📋 [SIGNUP-FORM] Resultado de login automático:', {
          ok: signInResult?.ok,
          error: signInResult?.error,
          status: signInResult?.status,
          url: signInResult?.url
        })

        if (signInResult?.ok) {
          console.log('✅ [SIGNUP-FORM] Login automático exitoso, redirigiendo a dashboard...')
          toast.success('¡Bienvenido a ServiceSphere!')
          
          // Usar window.location para forzar recarga completa y asegurar que la sesión esté establecida
          // Esto evita problemas de timing con el middleware y router
          window.location.href = '/dashboard'
        } else {
          console.error('❌ [SIGNUP-FORM] Error en login automático:', {
            error: signInResult?.error,
            status: signInResult?.status,
            details: 'El login automático falló después del registro exitoso'
          })
          // Si el login automático falla, redirigir al login manual
          toast.info('Cuenta creada. Por favor inicia sesión.')
          router.push('/login?registered=true')
        }
      } else {
        console.error('❌ [SIGNUP-FORM] Error en registro:', data)
        
        // Mostrar errores de validación específicos si están disponibles
        if (data.fieldErrors) {
          console.error('❌ [SIGNUP-FORM] Errores de validación:', data.fieldErrors)
          const errorMessages = Object.entries(data.fieldErrors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ')
          toast.error(`Errores de validación: ${errorMessages}`)
        } else if (data.details && Array.isArray(data.details)) {
          console.error('❌ [SIGNUP-FORM] Detalles de error:', data.details)
          const firstError = data.details[0]
          toast.error(`${firstError.path.join('.')}: ${firstError.message}`)
        } else {
          toast.error(data.error || 'Error al crear la cuenta')
        }
      }
    } catch (error) {
      console.error('❌ [SIGNUP-FORM] Excepción en signup:', error)
      toast.error('Error al crear la cuenta. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">¿Qué describe mejor tu situación?</h3>
          <p className="text-sm text-muted-foreground">
            Selecciona el tipo de cuenta que necesitas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              userType === 'CLIENT' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setUserType('CLIENT')}
          >
            <CardHeader className="text-center">
              <Building className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Soy una empresa</CardTitle>
              <CardDescription>
                Necesito implementar o mejorar mi sistema SAP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Publicar proyectos SAP</li>
                <li>• Recibir cotizaciones</li>
                <li>• Encontrar consultores certificados</li>
                <li>• Gestionar implementaciones</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              userType === 'PROVIDER' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setUserType('PROVIDER')}
          >
            <CardHeader className="text-center">
              <User className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Soy consultor/partner</CardTitle>
              <CardDescription>
                Ofrezco servicios de consultoría SAP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mostrar certificaciones SAP</li>
                <li>• Crear portfolio de proyectos</li>
                <li>• Responder a oportunidades</li>
                <li>• Generar nuevos clientes</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={() => setStep(2)} 
          className="w-full" 
          disabled={!userType}
        >
          Continuar
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Type Summary */}
      <div className="bg-primary/10 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {userType === 'CLIENT' ? (
              <Building className="h-5 w-5 text-primary" />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
            <span className="font-medium">
              {userType === 'CLIENT' ? 'Registrándose como Empresa' : 'Registrándose como Consultor/Partner'}
            </span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)}>
            Cambiar
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email corporativo</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="juan@empresa.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Información de la Empresa</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nombre de la empresa</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Acme Corp"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industria</Label>
            <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona industria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturing">Manufactura</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="finance">Financiero</SelectItem>
                <SelectItem value="healthcare">Salud</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="automotive">Automotriz</SelectItem>
                <SelectItem value="technology">Tecnología</SelectItem>
                <SelectItem value="consulting">Consultoría</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="México"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Ciudad de México"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe tu empresa y sus necesidades..."
            rows={3}
          />
        </div>

        {userType === 'CLIENT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactTitle">Cargo</Label>
              <Input
                id="contactTitle"
                value={formData.contactTitle}
                onChange={(e) => handleInputChange('contactTitle', e.target.value)}
                placeholder="CTO"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companySize">Tamaño de empresa</Label>
              <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Pequeña (1-50 empleados)</SelectItem>
                  <SelectItem value="Medium">Mediana (51-200 empleados)</SelectItem>
                  <SelectItem value="Large">Grande (201-1000 empleados)</SelectItem>
                  <SelectItem value="Enterprise">Empresa (1000+ empleados)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <Button type="button" variant="outline" onClick={() => setStep(1)}>
          Anterior
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Creando cuenta...</span>
            </div>
          ) : (
            'Crear Cuenta'
          )}
        </Button>
      </div>
    </form>
  )
}
