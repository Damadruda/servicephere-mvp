/**
 * Authentication Health Check Endpoint
 * 
 * This endpoint provides a simple health check to verify that:
 * 1. The API is accessible
 * 2. The auth directory routing is working
 * 3. The environment variables are configured
 * 
 * Access: https://www.servicephere.com/api/auth/health
 * 
 * This is a lightweight alternative to the diagnostic endpoint
 * for quick health checks.
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const timestamp = new Date().toISOString()
  
  console.log('[AUTH HEALTH] Health check requested at:', timestamp)
  
  const health = {
    status: 'healthy',
    timestamp,
    service: 'NextAuth API',
    route: '/api/auth/health',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasDatabase: !!process.env.DATABASE_URL,
    },
    routes: {
      health: '✅ /api/auth/health',
      diagnostic: '📊 /api/auth/diagnostic',
      session: '🔐 /api/auth/session',
      signin: '🔑 /api/auth/signin',
    },
    message: 'NextAuth API is operational',
  }
  
  console.log('[AUTH HEALTH] Responding with health status:', health.status)
  
  return NextResponse.json(health, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
