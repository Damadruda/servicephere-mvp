
import { Suspense } from 'react'
import { SignupForm } from '@/components/auth/signup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Registro - Servicephere',
  description: 'Crea tu cuenta en Servicephere'
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <Building2 className="h-8 w-8 text-primary" />
            <span>Service<span className="text-primary">phere</span></span>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>
              Únete a Servicephere, el marketplace líder en servicios SAP®
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded" />}>
              <SignupForm />
            </Suspense>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
