/**
 * Auth Utilities Module
 * 
 * This module provides helper functions for authentication
 * throughout the application using NextAuth v4.
 * 
 * Note: For App Router, the main NextAuth handler is defined
 * directly in app/api/auth/[...nextauth]/route.ts
 * 
 * This file exports utility functions for:
 * - Getting current session in server components
 * - Programmatic sign in/out
 * - Type definitions
 */

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Log initialization (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔐 [AUTH UTILS] Auth utilities module loaded')
  console.log('🔐 [AUTH UTILS] Environment:', process.env.NODE_ENV)
  console.log('🔐 [AUTH UTILS] NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'auto-detect')
  console.log('🔐 [AUTH UTILS] NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET ✅' : 'NOT SET ❌')
}

/**
 * Get the current session in Server Components
 * 
 * Usage:
 * ```tsx
 * import { auth } from '@/auth'
 * 
 * export default async function Page() {
 *   const session = await auth()
 *   if (!session) return <div>Not authenticated</div>
 *   return <div>Welcome {session.user.name}</div>
 * }
 * ```
 */
export async function auth() {
  return await getServerSession(authOptions)
}

// Export the auth options for use in API routes
export { authOptions }

// Export types for use in the application
export type { Session } from 'next-auth'