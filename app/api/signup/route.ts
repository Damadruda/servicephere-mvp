
// ARCHIVO CORREGIDO: app/api/signup/route.ts
// Este archivo reemplaza el actual /app/api/signup/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { Prisma } from '@prisma/client'


// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Lazy initialization de PrismaClient para evitar ejecución en build time
let prisma: PrismaClient | null = null

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}


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
    console.log('📥 [SIGNUP-API] Received signup data:', JSON.stringify(body, null, 2))
    
    // Código de test user solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      if (!body.userType && (body.name === 'Test User' || body.email?.includes('test'))) {
        body.userType = 'CLIENT'
        console.log('🔧 [SIGNUP-API] Auto-assigned CLIENT userType for test user')
      }
    }
    
    console.log('🔍 [SIGNUP-API] Validating data against schema...')
    // Validar datos con Zod
    const validatedData = signupSchema.parse(body)
    console.log('✅ [SIGNUP-API] Validation successful')

    // Verificar si el usuario ya existe
    const existingUser = await getPrismaClient().user.findUnique({
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
    const user = await getPrismaClient().user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        userType: validatedData.userType,
        // Set to TRUE by default until email verification is implemented
        isVerified: true,
      }
    })

    // Crear perfil según el tipo de usuario
    if (validatedData.userType === 'CLIENT') {
      await getPrismaClient().clientProfile.create({
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
      await getPrismaClient().providerProfile.create({
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
    console.error('❌ [SIGNUP-API] Error creating user:', error)

    // Manejo de errores de validación de Zod
    if (error instanceof z.ZodError) {
      console.error('❌ [SIGNUP-API] Validation failed:', JSON.stringify(error.errors, null, 2))
      
      // Crear mensajes de error más legibles
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach(err => {
        const field = err.path.join('.')
        fieldErrors[field] = err.message
      })
      
      console.error('❌ [SIGNUP-API] Field errors:', fieldErrors)
      
      return NextResponse.json({
        error: 'Datos de registro inválidos',
        details: error.errors,
        fieldErrors: fieldErrors
      }, { status: 400 })
    }

    // Manejo de errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('❌ [SIGNUP-API] Prisma error code:', error.code)
      
      // Error de constraint único (email duplicado)
      if (error.code === 'P2002') {
        console.error('❌ [SIGNUP-API] Duplicate email detected')
        return NextResponse.json({
          error: 'Ya existe una cuenta con este email'
        }, { status: 400 })
      }
      
      // Error de foreign key
      if (error.code === 'P2003') {
        console.error('❌ [SIGNUP-API] Foreign key constraint failed')
        return NextResponse.json({
          error: 'Error de integridad de datos'
        }, { status: 400 })
      }

      // Error de registro no encontrado
      if (error.code === 'P2025') {
        console.error('❌ [SIGNUP-API] Record not found')
        return NextResponse.json({
          error: 'Registro no encontrado'
        }, { status: 404 })
      }
    }

    // Error de conexión a la base de datos
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('❌ [SIGNUP-API] Database connection error')
      return NextResponse.json({
        error: 'Error de conexión a la base de datos. Por favor, intenta más tarde.'
      }, { status: 503 })
    }

    // Error genérico
    console.error('❌ [SIGNUP-API] Unknown error type:', error)
    return NextResponse.json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
