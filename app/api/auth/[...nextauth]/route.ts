/**
 * NextAuth API Route Handler for Next.js 14 App Router
 * 
 * This route handles all NextAuth.js authentication endpoints:
 * - GET /api/auth/session - Get current session
 * - POST /api/auth/signin - Sign in
 * - POST /api/auth/signout - Sign out
 * - GET /api/auth/providers - Get available providers
 * - GET /api/auth/csrf - Get CSRF token
 * - POST /api/auth/callback/:provider - OAuth callback
 * - And other NextAuth.js endpoints
 * 
 * IMPORTANT: This file must be at app/api/auth/[...nextauth]/route.ts
 * The [...nextauth] folder name is critical for NextAuth to catch all routes
 * 
 * FIX: Using NextAuth handlers export pattern for Next.js 14 App Router
 * This pattern ensures proper route registration and avoids 404 errors
 */

import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Log route initialization (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [NEXTAUTH ROUTE] Initializing NextAuth handler at /api/auth/[...nextauth]')
  console.log('🔧 [NEXTAUTH ROUTE] NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
  console.log('🔧 [NEXTAUTH ROUTE] NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')
}

// Initialize NextAuth with options
// CRITICAL: This must be done correctly for App Router
const handler = NextAuth(authOptions as NextAuthOptions)

// Export handlers using named exports with explicit aliasing
// This pattern is more reliable for Next.js 14.2+ App Router
export { handler as GET, handler as POST }

// Runtime configuration
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
