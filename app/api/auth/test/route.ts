/**
 * NextAuth Test Route
 * 
 * This is a simple test endpoint to verify that:
 * 1. API routes are working in the app/api/auth directory
 * 2. The auth folder structure is correct
 * 3. TypeScript compilation is working
 * 
 * Access: https://www.servicephere.com/api/auth/test
 * 
 * If this route works but /api/auth/session doesn't, it means
 * there's an issue with the [...nextauth] catch-all route specifically.
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: '✅ API routes in app/api/auth are working!',
    timestamp: new Date().toISOString(),
    info: {
      route: '/api/auth/test',
      method: 'GET',
      framework: 'Next.js 14 App Router',
      note: 'If you can see this, the app/api/auth directory is properly configured'
    },
    nextSteps: [
      'Verify /api/auth/session endpoint',
      'Check /api/auth/providers endpoint',
      'Test /api/auth/csrf endpoint',
      'Ensure NEXTAUTH_URL and NEXTAUTH_SECRET are set in Vercel'
    ]
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
