'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [resetUrl, setResetUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // In development, show the reset URL
        if (data.resetUrl) {
          setResetUrl(data.resetUrl)
        }
        toast.success('Solicitud enviada exitosamente')
      } else {
        toast.error(data.error || 'Error al procesar la solicitud')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al enviar la solicitud')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Solicitud Enviada</CardTitle>
            <CardDescription>
              Si el email existe en nuestro sistema, recibirás un enlace para recuperar tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Email:</strong> {email}
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Revisa tu bandeja de entrada y también la carpeta de spam.
                El enlace expira en 1 hora.
              </p>
            </div>

            {/* Show reset URL in development */}
            {resetUrl && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  🔧 Modo Desarrollo
                </p>
                <p className="text-xs text-yellow-700 mb-2">
                  El envío de emails no está configurado. Usa este enlace:
                </p>
                <a
                  href={resetUrl}
                  className="text-xs text-blue-600 hover:text-blue-800 break-all underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resetUrl}
                </a>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline">
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Login
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsSuccess(false)
                  setEmail('')
                  setResetUrl('')
                }}
              >
                Enviar otra solicitud
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <p className="text-sm text-muted-foreground">
                Te enviaremos un enlace de recuperación a este email
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </div>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Enlace de Recuperación
                </>
              )}
            </Button>

            <div className="text-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Login
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
