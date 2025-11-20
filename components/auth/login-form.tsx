
'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { toast } from 'sonner'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'
  const isRegistered = searchParams?.get('registered') === 'true'

// Mostrar mensaje si el usuario viene del registro
useEffect(() => {
  if (isRegistered) {
    toast.success('¡Registro exitoso! Ahora inicia sesión con tus credenciales')
  }
}, [isRegistered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log('🔐 [LOGIN-FORM] Iniciando proceso de login...')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      })

      console.log('📋 [LOGIN-FORM] Resultado de signIn:', result)

      if (result?.error) {
        console.error('❌ [LOGIN-FORM] Error en login:', result.error)
        toast.error('Credenciales inválidas. Por favor verifica tu email y contraseña.')
      } else if (result?.ok) {
        console.log('✅ [LOGIN-FORM] Login exitoso, redirigiendo a:', callbackUrl)
        toast.success('¡Bienvenido de vuelta!')
        
        // Forzar redirección
        router.push(callbackUrl)
        router.refresh()
      } else {
        console.error('⚠️ [LOGIN-FORM] Resultado inesperado:', result)
        toast.error('Error inesperado al iniciar sesión')
      }
    } catch (error) {
      console.error('❌ [LOGIN-FORM] Excepción en login:', error)
      toast.error('Error al iniciar sesión. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@empresa.com"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Iniciando sesión...</span>
          </div>
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar Sesión
          </>
        )}
      </Button>

      <div className="text-center">
        <a
          href="/recuperar-contrasena"
          className="text-sm text-primary hover:text-primary/80 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  )
}