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
 * CRITICAL: This file must be at app/api/auth/[...nextauth]/route.ts
 * The [...nextauth] folder name is required for NextAuth to catch all auth routes
 * 
 * OPTIMIZED: Using NextAuth v4 pattern for App Router
 * This ensures proper route registration in Next.js 14.2+ and Vercel
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Log route file loading (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 [NEXTAUTH ROUTE] Loading NextAuth route handler...')
  console.log('🚀 [NEXTAUTH ROUTE] File: app/api/auth/[...nextauth]/route.ts')
  console.log('🚀 [NEXTAUTH ROUTE] Timestamp:', new Date().toISOString())
}

// Initialize NextAuth handler with configuration
// CRITICAL: This creates both GET and POST handlers for all auth endpoints
const handler = NextAuth(authOptions)

// Log handler creation (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('✅ [NEXTAUTH ROUTE] NextAuth handler created successfully')
  console.log('✅ [NEXTAUTH ROUTE] Handler type:', typeof handler)
}

// Export the handler as both GET and POST
// IMPORTANT: NextAuth requires both methods to handle different auth operations
export { handler as GET, handler as POST }

// Route segment configuration
// IMPORTANT: These tell Next.js how to handle this route
export const runtime = 'nodejs'        // Use Node.js runtime (not Edge)
export const dynamic = 'force-dynamic'  // Always render dynamically (never static)
export const revalidate = 0            // Never cache (always fresh)

// Log configuration (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('⚙️ [NEXTAUTH ROUTE] Route configuration:')
  console.log('   - runtime:', runtime)
  console.log('   - dynamic:', dynamic)
  console.log('   - revalidate:', revalidate)
  console.log('🎉 [NEXTAUTH ROUTE] Route initialization complete!')
}
