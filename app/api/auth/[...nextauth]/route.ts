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
 * REFACTORED: Now using standalone auth module for better reliability
 * This pattern ensures proper route registration in Next.js 14.2+ and Vercel
 */

// Log route file loading (module-level, runs once)
console.log('🚀 [NEXTAUTH ROUTE] Loading NextAuth route handler...')
console.log('🚀 [NEXTAUTH ROUTE] File: app/api/auth/[...nextauth]/route.ts')
console.log('🚀 [NEXTAUTH ROUTE] Timestamp:', new Date().toISOString())

// Import handlers from the centralized auth module
import { handlers } from '@/auth'

// Log handlers import
console.log('✅ [NEXTAUTH ROUTE] Handlers imported from @/auth module')

// Extract GET and POST handlers
const { GET, POST } = handlers

// Log handler extraction
console.log('✅ [NEXTAUTH ROUTE] GET and POST handlers extracted')
console.log('✅ [NEXTAUTH ROUTE] GET handler type:', typeof GET)
console.log('✅ [NEXTAUTH ROUTE] POST handler type:', typeof POST)

// Export the handlers
// CRITICAL: These must be named exports matching HTTP methods
export { GET, POST }

// Log successful export
console.log('✅ [NEXTAUTH ROUTE] Handlers exported successfully')

// Route segment configuration
// IMPORTANT: These tell Next.js how to handle this route
export const runtime = 'nodejs'      // Use Node.js runtime (not Edge)
export const dynamic = 'force-dynamic' // Always render dynamically (never static)
export const revalidate = 0           // Never cache (always fresh)

// Log configuration
console.log('⚙️ [NEXTAUTH ROUTE] Route configuration:')
console.log('   - runtime:', runtime)
console.log('   - dynamic:', dynamic)
console.log('   - revalidate:', revalidate)

console.log('🎉 [NEXTAUTH ROUTE] Route initialization complete!')
