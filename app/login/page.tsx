
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Iniciar Sesión - Servicephere',
  description: 'Inicia sesión en tu cuenta de Servicephere'
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <Building2 className="h-8 w-8 text-primary" />
            <span>Service<span className="text-primary">phere</span></span>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede a tu cuenta para conectarte con el ecosistema SAP®
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded" />}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-primary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
