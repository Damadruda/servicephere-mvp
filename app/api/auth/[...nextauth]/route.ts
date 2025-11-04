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
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Log route initialization (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [NEXTAUTH ROUTE] Initializing NextAuth handler at /api/auth/[...nextauth]')
  console.log('🔧 [NEXTAUTH ROUTE] Runtime:', 'nodejs')
  console.log('🔧 [NEXTAUTH ROUTE] Dynamic:', 'force-dynamic')
}

// Initialize NextAuth with our configuration
const handler = NextAuth(authOptions)

// Export the handler for both GET and POST requests
// This is REQUIRED for Next.js 14 App Router
export { handler as GET, handler as POST }

// Export runtime configuration to ensure route is dynamic
// nodejs runtime is required for NextAuth database operations
export const runtime = 'nodejs'

// Force dynamic rendering to prevent static optimization
// This ensures the route always runs on the server
export const dynamic = 'force-dynamic'

// Prevent caching of auth responses
export const revalidate = 0
