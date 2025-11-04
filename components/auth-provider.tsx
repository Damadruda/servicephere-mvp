
'use client'

import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Log AuthProvider initialization in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [AUTH PROVIDER] Mounted and ready')
      console.log('🔐 [AUTH PROVIDER] basePath: /api/auth')
    }
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
      // CRITICAL: Handle fetch errors gracefully
      refetchWhenOffline={false}
      // Add error handling
      onError={(error) => {
        console.error('[AUTH PROVIDER ERROR]', error)
        // Don't crash the app on auth errors
      }}
    >
      {children}
    </SessionProvider>
  )
}
