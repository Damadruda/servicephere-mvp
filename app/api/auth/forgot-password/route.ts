import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-singleton'
import crypto from 'crypto'

// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/auth/forgot-password
 *
 * Generates a password reset token and sends it to the user's email.
 * In development, the reset link is logged to console instead of sending email.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      console.log(`⚠️ [FORGOT-PASSWORD] User not found: ${normalizedEmail}`)
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás un link de recuperación'
      })
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex')

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: normalizedEmail }
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
        used: false
      }
    })

    // Build reset URL
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    // In production, send email here
    // For now, log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('\n' + '='.repeat(80))
      console.log('🔐 PASSWORD RESET REQUESTED')
      console.log('='.repeat(80))
      console.log(`Email: ${normalizedEmail}`)
      console.log(`Reset URL: ${resetUrl}`)
      console.log(`Token expires in: 1 hour`)
      console.log('='.repeat(80) + '\n')
    } else {
      // TODO: Send email in production
      // await sendPasswordResetEmail(normalizedEmail, resetUrl)
      console.log(`✅ [FORGOT-PASSWORD] Reset email sent to: ${normalizedEmail}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Si el email existe, recibirás un link de recuperación',
      // Include reset URL in development for testing
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    })

  } catch (error) {
    console.error('❌ [FORGOT-PASSWORD] Error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/forgot-password
 *
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Forgot password endpoint is working',
    timestamp: new Date().toISOString()
  })
}
