import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-singleton'
import bcrypt from 'bcryptjs'

// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/auth/reset-password
 *
 * Validates the reset token and updates the user's password.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    // Validate inputs
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      )
    }

    // Check if token is already used
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'Este token ya ha sido utilizado' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { error: 'Este token ha expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      })
    ])

    console.log(`✅ [RESET-PASSWORD] Password reset successful for: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    })

  } catch (error) {
    console.error('❌ [RESET-PASSWORD] Error:', error)
    return NextResponse.json(
      { error: 'Error al resetear la contraseña' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/reset-password?token=xxx
 *
 * Validates if a reset token is valid (for UI display purposes)
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token no proporcionado' },
        { status: 400 }
      )
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json({
        valid: false,
        error: 'Token inválido'
      })
    }

    if (resetToken.used) {
      return NextResponse.json({
        valid: false,
        error: 'Token ya utilizado'
      })
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({
        valid: false,
        error: 'Token expirado'
      })
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.email
    })

  } catch (error) {
    console.error('❌ [RESET-PASSWORD-VALIDATE] Error:', error)
    return NextResponse.json(
      { valid: false, error: 'Error al validar token' },
      { status: 500 }
    )
  }
}
