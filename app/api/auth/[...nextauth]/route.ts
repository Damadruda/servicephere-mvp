/**
 * NextAuth API Route Handler for Next.js 14 App Router
 * 
 * This route handles all NextAuth.js authentication endpoints:
 * - GET /api/auth/session - Get current session
 * - POST /api/auth/signin - Sign in
 * - POST /api/auth/signout - Sign out
 * - GET /api/auth/providers - Get available providers
 * - GET /api/auth/csrf - Get CSRF token
 * - And other NextAuth.js endpoints
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Initialize NextAuth with our configuration
const handler = NextAuth(authOptions)

// Export the handler for both GET and POST requests
// This is required for Next.js 14 App Router
export { handler as GET, handler as POST }

// Export runtime configuration to ensure route is dynamic
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
