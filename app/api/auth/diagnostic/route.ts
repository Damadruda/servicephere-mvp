/**
 * NextAuth Diagnostic Endpoint
 * 
 * This endpoint provides comprehensive diagnostic information about the
 * NextAuth configuration and deployment status.
 * 
 * Access: https://www.servicephere.com/api/auth/diagnostic
 * 
 * This helps identify configuration issues without exposing sensitive data.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Try to get session to verify NextAuth is working
    const session = await getServerSession(authOptions)
    
    // Gather diagnostic information
    const diagnostics = {
      timestamp: new Date().toISOString(),
      status: '✅ Diagnostic endpoint working',
      
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV || 'not set',
      },
      
      nextAuthConfig: {
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthUrl: process.env.NEXTAUTH_URL || 'not set (using auto-detection)',
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
        hasDatabase: !!process.env.DATABASE_URL,
      },
      
      session: {
        hasSession: !!session,
        isAuthenticated: !!session?.user,
        userEmail: session?.user?.email || null,
      },
      
      routes: {
        currentRoute: '/api/auth/diagnostic',
        expectedNextAuthRoute: '/api/auth/[...nextauth]',
        testRoute: '/api/auth/test',
      },
      
      recommendations: [] as string[],
    }
    
    // Add recommendations based on diagnostics
    if (!process.env.NEXTAUTH_SECRET) {
      diagnostics.recommendations.push(
        '⚠️ NEXTAUTH_SECRET is not set. Generate one with: openssl rand -base64 32'
      )
    }
    
    if (!process.env.NEXTAUTH_URL) {
      diagnostics.recommendations.push(
        '⚠️ NEXTAUTH_URL is not set. Set it to: https://www.servicephere.com'
      )
    }
    
    if (!process.env.DATABASE_URL) {
      diagnostics.recommendations.push(
        '⚠️ DATABASE_URL is not set. Configure your PostgreSQL connection string.'
      )
    }
    
    if (diagnostics.recommendations.length === 0) {
      diagnostics.recommendations.push(
        '✅ All required environment variables are configured!'
      )
    }
    
    return NextResponse.json(diagnostics, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // Return error details for debugging
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: '❌ Diagnostic endpoint encountered an error',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
      note: 'This error indicates a problem with the NextAuth configuration or dependencies',
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
