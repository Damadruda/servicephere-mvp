/**
 * Endpoint de diagnóstico simple para verificar que las rutas API funcionan
 * Si este endpoint funciona pero NextAuth no, el problema es específico de NextAuth
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API routes are working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nextAuthConfigured: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'not configured'
  })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
