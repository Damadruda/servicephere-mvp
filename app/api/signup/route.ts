
// ARCHIVO CORREGIDO: app/api/signup/route.ts
// Este archivo reemplaza el actual /app/api/signup/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

// Esquema de validación corregido con campos requeridos
const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  userType: z.enum(['CLIENT', 'PROVIDER'], {
    required_error: 'Tipo de usuario requerido'
  }),
  // Campos REQUERIDOS (coinciden con el esquema de Prisma)
  companyName: z.string().min(2, 'El nombre de la empresa es requerido'),
  country: z.string().min(2, 'El país es requerido'),
  city: z.string().min(2, 'La ciudad es requerida'),
  // Campos opcionales
  industry: z.enum([
    'manufacturing',
    'retail', 
    'finance',
    'healthcare',
    'utilities',
    'automotive',
    'technology',
    'consulting',
    'other'
  ]).optional(),
  companySize: z.enum(['Small', 'Medium', 'Large', 'Enterprise']).optional(),
  contactTitle: z.string().optional(),
  description: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received signup data:', body)
    
    // Código de test user solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      if (!body.userType && (body.name === 'Test User' || body.email?.includes('test'))) {
        body.userType = 'CLIENT'
        console.log('Auto-assigned CLIENT userType for test user')
      }
    }
    
    // Validar datos con Zod
    const validatedData = signupSchema.parse(body)

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 400 }
      )
    }

    // Hash de la contraseña (CORREGIDO: usar método asíncrono)
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Crear usuario básico primero
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        userType: validatedData.userType,
        // CAMBIAR A FALSE para implementar verificación por email
        isVerified: false,
      }
    })

    // Crear perfil según el tipo de usuario
    if (validatedData.userType === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
          companyName: validatedData.companyName,
          industry: validatedData.industry || 'other',
          country: validatedData.country,
          city: validatedData.city,
          companySize: validatedData.companySize || 'Medium',
          contactName: validatedData.name,
          contactTitle: validatedData.contactTitle || 'Sin especificar',
          description: validatedData.description || 'Empresa cliente de SAP Marketplace'
        }
      })
    } else {
      await prisma.providerProfile.create({
        data: {
          userId: user.id,
          companyName: validatedData.companyName,
          description: validatedData.description || 'Proveedor de servicios SAP',
          country: validatedData.country,
          city: validatedData.city,
          employeeCount: '11-50',
          website: '',
          contactName: validatedData.name,
          contactTitle: validatedData.contactTitle || 'Consultor SAP',
          isPartner: false,
          verified: true,
          sapSpecializations: ['SAP Consulting'],
          targetIndustries: [validatedData.industry || 'technology'],
        }
      })
    }

    // TODO: Enviar email de verificación aquí (implementar más tarde)
    // await sendVerificationEmail(user.email, verificationToken)

    console.log('✅ [SIGNUP] Usuario creado exitosamente:', user.email)

    return NextResponse.json({
      success: true,
      message: '¡Registro exitoso! Iniciando sesión...',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating user:', error)

    // Manejo de errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Datos de registro inválidos',
        details: error.errors
      }, { status: 400 })
    }

    // Manejo de errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Error de constraint único (email duplicado)
      if (error.code === 'P2002') {
        return NextResponse.json({
          error: 'Ya existe una cuenta con este email'
        }, { status: 400 })
      }
      
      // Error de foreign key
      if (error.code === 'P2003') {
        return NextResponse.json({
          error: 'Error de integridad de datos'
        }, { status: 400 })
      }

      // Error de registro no encontrado
      if (error.code === 'P2025') {
        return NextResponse.json({
          error: 'Registro no encontrado'
        }, { status: 404 })
      }
    }

    // Error de conexión a la base de datos
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({
        error: 'Error de conexión a la base de datos. Por favor, intenta más tarde.'
      }, { status: 503 })
    }

    // Error genérico
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}
