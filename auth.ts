/**
 * Standalone NextAuth Configuration Module
 * 
 * This module provides a centralized NextAuth configuration that can be
 * imported throughout the application. This approach is recommended for
 * Next.js 14 App Router applications.
 * 
 * Benefits:
 * - Centralized configuration
 * - Better type safety
 * - Easier testing
 * - More reliable routing
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Log initialization (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔐 [AUTH MODULE] Initializing NextAuth module...')
  console.log('🔐 [AUTH MODULE] Environment:', process.env.NODE_ENV)
  console.log('🔐 [AUTH MODULE] NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'auto-detect')
  console.log('🔐 [AUTH MODULE] NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET ✅' : 'NOT SET ❌')
}

// Initialize NextAuth with configuration
// This creates handlers and helper functions that can be used throughout the app
const nextAuth = NextAuth(authOptions)

// Export the handlers for use in the API route
export const { handlers, auth, signIn, signOut } = nextAuth

// Log successful initialization
if (process.env.NODE_ENV === 'development') {
  console.log('✅ [AUTH MODULE] NextAuth handlers initialized successfully')
}

// Export types for use in the application
export type { Session } from 'next-auth'