/**
 * Endpoint de diagnóstico para NextAuth
 * Verifica la configuración de NextAuth sin ejecutar la autenticación
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const diagnostics = {
    success: true,
    message: 'NextAuth diagnostics endpoint',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'configured' : 'NOT CONFIGURED',
      nextAuthUrl: process.env.NEXTAUTH_URL || 'not set (auto-detection enabled)',
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'NOT CONFIGURED',
    },
    routes: {
      thisEndpoint: '/api/auth/diagnostics',
      nextAuthEndpoint: '/api/auth/[...nextauth]',
      expectedRoutes: [
        '/api/auth/signin',
        '/api/auth/signout',
        '/api/auth/session',
        '/api/auth/providers',
        '/api/auth/csrf',
      ]
    },
    recommendations: []
  }

  // Agregar recomendaciones basadas en la configuración
  if (!process.env.NEXTAUTH_SECRET) {
    diagnostics.recommendations.push('⚠️ NEXTAUTH_SECRET no está configurado. Esto es CRÍTICO para producción.')
  }

  if (!process.env.NEXTAUTH_URL) {
    diagnostics.recommendations.push('ℹ️ NEXTAUTH_URL no está configurado. NextAuth usará auto-detección.')
  }

  if (!process.env.DATABASE_URL) {
    diagnostics.recommendations.push('⚠️ DATABASE_URL no está configurado. La autenticación no funcionará.')
  }

  return NextResponse.json(diagnostics, { status: 200 })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
