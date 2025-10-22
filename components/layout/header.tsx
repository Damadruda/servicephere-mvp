
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { User, MessageSquare, Bell, Bot } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { UserMenu } from './user-menu'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full glass border-b">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-40 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-32 w-96 flex-shrink-0">
              <Image
                src="/servicephere-logo-specs.png"
                alt="Servicephere"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/servicios" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Explorar Servicios
            </Link>
            <Link 
              href="/proyectos" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Ver Proyectos
            </Link>
            {session && (
              <>
                <Link 
                  href="/reviews" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Reviews
                </Link>
                <Link 
                  href="/comunicacion" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Comunicación
                </Link>
                <Link 
                  href="/chatbot" 
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center space-x-1"
                >
                  <Bot className="h-4 w-4" />
                  <span>Asistente SAP®</span>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : session ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/comunicacion">
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/notificaciones">
                    <Bell className="h-4 w-4" />
                  </Link>
                </Button>
                <UserMenu />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/registro">Registro</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
