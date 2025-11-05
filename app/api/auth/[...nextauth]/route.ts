/**
 * NextAuth API Route Handler for Next.js 14 App Router
 * 
 * COMPREHENSIVE FIX - November 2024
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
 * CRITICAL REQUIREMENTS:
 * 1. File must be at: app/api/auth/[...nextauth]/route.ts
 * 2. Folder name [...nextauth] catches all /api/auth/* routes
 * 3. Must export both GET and POST handlers
 * 4. Must use dynamic rendering (no static generation)
 * 5. Must work with Vercel deployment and custom domains
 * 
 * FIXES APPLIED:
 * - Proper App Router compatibility for Next.js 14.2+
 * - Correct route segment configuration
 * - Safe initialization (no build-time execution)
 * - Vercel and custom domain support
 * - Enhanced error handling
 */

import NextAuth from 'next-auth'
import type { NextRequest } from 'next/server'
import { authOptions } from '@/lib/auth'

/**
 * Initialize NextAuth handler
 * 
 * This must be done at module level to ensure proper route registration.
 * The handler is created once and reused for all requests.
 * 
 * IMPORTANT: NextAuth automatically handles:
 * - Session management
 * - CSRF protection
 * - Cookie handling
 * - Route matching for all /api/auth/* endpoints
 */
const handler = NextAuth(authOptions)

/**
 * GET Handler
 * 
 * Handles:
 * - GET /api/auth/session - Returns current session
 * - GET /api/auth/providers - Returns available auth providers
 * - GET /api/auth/csrf - Returns CSRF token
 * - GET /api/auth/signin - Renders sign-in page (if custom page not set)
 * - Other GET requests to /api/auth/*
 */
export async function GET(req: NextRequest, context: any) {
  try {
    return await handler(req, context)
  } catch (error) {
    console.error('[NEXTAUTH GET ERROR]', error)
    // Return error in proper format for NextAuth clients
    return new Response(
      JSON.stringify({ 
        error: 'NextAuth GET handler error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

/**
 * POST Handler
 * 
 * Handles:
 * - POST /api/auth/signin/credentials - Sign in with credentials
 * - POST /api/auth/signout - Sign out
 * - POST /api/auth/callback/:provider - OAuth callback
 * - Other POST requests to /api/auth/*
 */
export async function POST(req: NextRequest, context: any) {
  try {
    return await handler(req, context)
  } catch (error) {
    console.error('[NEXTAUTH POST ERROR]', error)
    // Return error in proper format for NextAuth clients
    return new Response(
      JSON.stringify({ 
        error: 'NextAuth POST handler error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

/**
 * Route Segment Configuration
 * 
 * These configuration options tell Next.js how to handle this route:
 * 
 * - runtime: 'nodejs' - Use Node.js runtime (not Edge)
 *   NextAuth requires Node.js runtime for full functionality
 * 
 * - dynamic: 'force-dynamic' - Never use static generation
 *   Authentication routes MUST be dynamic to handle user sessions
 * 
 * - revalidate: 0 - Never use cached responses
 *   Sessions must always be fresh, never cached
 * 
 * CRITICAL: These settings ensure NextAuth works correctly in production
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Development logging
 * 
 * Only logs in development mode to help with debugging.
 * Does not execute during build time.
 */
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  // Only log on server side
  console.log('✅ [NEXTAUTH] Route handler loaded')
  console.log('   - Path: app/api/auth/[...nextauth]/route.ts')
  console.log('   - Runtime:', runtime)
  console.log('   - Dynamic:', dynamic)
}
