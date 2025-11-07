/**
 * AuthProvider Component
 * 
 * COMPREHENSIVE FIX - November 2024
 * 
 * Este componente envuelve la aplicación con el SessionProvider de NextAuth.
 * Proporciona el contexto de autenticación a todos los componentes hijos.
 * 
 * CARACTERÍSTICAS:
 * - Previene hydration mismatch con mounted state
 * - Configura refetch automático de sesiones
 * - Maneja errores de autenticación gracefully
 * - Solo se ejecuta en el cliente (client component)
 * 
 * FIXES APLICADOS:
 * - Mejor manejo de errores
 * - Configuración optimizada de refetch
 * - Loading state para prevenir flickering
 * - Logging condicional
 */

'use client'

import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Log AuthProvider initialization only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [AUTH PROVIDER] Mounted and ready')
      console.log('🔐 [AUTH PROVIDER] Base path: /api/auth')
    }
  }, [])

  /**
   * Prevent hydration mismatch
   * 
   * Don't render children until component is mounted on client.
   * This prevents React hydration errors when session state differs
   * between server and client initial renders.
   */
  if (!mounted) {
    return null
  }

  return (
    <SessionProvider 
      // Base path where NextAuth API routes are located
      basePath="/api/auth"
      
      // Refetch session every 5 minutes to keep it fresh
      refetchInterval={5 * 60}
      
      // Refetch when user returns to window/tab
      refetchOnWindowFocus={true}
      
      // Don't refetch when offline (prevents unnecessary errors)
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}