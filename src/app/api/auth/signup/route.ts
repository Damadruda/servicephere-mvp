// app/api/signup/route.ts
// VERSIÓN SIMPLIFICADA Y FUNCIONAL - Reemplaza el archivo actual

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma-singleton' // Usar el nuevo singleton

// Configuración para Vercel
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('📝 [SIGNUP] Iniciando proceso de registro...')
  
  try {
    // 1. Obtener y validar datos básicos
    const body = await request.json()
    console.log('📥 [SIGNUP] Datos recibidos:', {
      email: body.email,
      userType: body.userType,
      companyName: body.companyName
    })
    
    // Validación básica
    if (!body.email || !body.password || !body.name || !body.userType) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Faltan campos requeridos',
          required: ['email', 'password', 'name', 'userType']
        },
        { status: 400 }
      )
    }
    
    // Validar email formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'El email no es válido'
        },
        { status: 400 }
      )
    }
    
    // Validar longitud de contraseña
    if (body.password.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        },
        { status: 400 }
      )
    }
    
    // 2. Verificar si el usuario ya existe
    console.log('🔍 [SIGNUP] Verificando si el usuario existe...')
    
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: body.email.toLowerCase().trim() }
      })
    } catch (dbError) {
      console.error('❌ [SIGNUP] Error verificando usuario:', dbError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Error de conexión a la base de datos',
          details: 'No se puede conectar a la base de datos. Verifica la configuración.'
        },
        { status: 503 }
      )
    }
    
    if (existingUser) {
      console.log('⚠️ [SIGNUP] Usuario ya existe:', body.email)
      return NextResponse.json(
        { 
          success: false,
          error: 'Ya existe una cuenta con este email'
        },
        { status: 400 }
      )
    }
    
    // 3. Hash de la contraseña
    console.log('🔐 [SIGNUP] Generando hash de contraseña...')
    const hashedPassword = await bcrypt.hash(body.password, 12)
    
    // 4. Crear usuario y perfil en una transacción
    console.log('💾 [SIGNUP] Creando usuario en la base de datos...')
    
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Crear usuario
        const newUser = await tx.user.create({
          data: {
            email: body.email.toLowerCase().trim(),
            password: hashedPassword,
            name: body.name.trim(),
            userType: body.userType,
            isVerified: true // Por ahora, auto-verificar
          }
        })
        
        console.log('✅ [SIGNUP] Usuario creado:', newUser.id)
        
        // Crear perfil según tipo
        if (body.userType === 'CLIENT') {
          const clientProfile = await tx.clientProfile.create({
            data: {
              userId: newUser.id,
              companyName: body.companyName || 'Sin especificar',
              industry: body.industry || 'other',
              country: body.country || 'México',
              city: body.city || 'Ciudad de México',
              companySize: body.companySize || 'Medium',
              contactName: body.name.trim(),
              contactTitle: body.contactTitle || 'Sin especificar',
              description: body.description || ''
            }
          })
          console.log('✅ [SIGNUP] Perfil de cliente creado:', clientProfile.id)
        } else if (body.userType === 'PROVIDER') {
          const providerProfile = await tx.providerProfile.create({
            data: {
              userId: newUser.id,
              companyName: body.companyName || 'Sin especificar',
              description: body.description || 'Proveedor de servicios SAP',
              country: body.country || 'México',
              city: body.city || 'Ciudad de México',
              employeeCount: '11-50',
              contactName: body.name.trim(),
              isPartner: false,
              verified: false,
              approvalStatus: 'NOT_STARTED',
              sapSpecializations: [],
              targetIndustries: []
            }
          })
          console.log('✅ [SIGNUP] Perfil de proveedor creado:', providerProfile.id)
        }
        
        return newUser
      })
      
      console.log('✅ [SIGNUP] Registro completado exitosamente')
      
      // Respuesta exitosa
      return NextResponse.json(
        {
          success: true,
          message: '¡Cuenta creada exitosamente!',
          user: {
            id: result.id,
            email: result.email,
            name: result.name,
            userType: result.userType
          }
        },
        { status: 201 }
      )
      
    } catch (transactionError: any) {
      console.error('❌ [SIGNUP] Error en transacción:', transactionError)
      
      // Manejo de errores específicos de Prisma
      if (transactionError.code === 'P2002') {
        return NextResponse.json(
          { 
            success: false,
            error: 'El email ya está registrado'
          },
          { status: 400 }
        )
      }
      
      if (transactionError.code === 'P2003') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Error de integridad de datos',
            details: 'Hay un problema con las relaciones de datos'
          },
          { status: 400 }
        )
      }
      
      // Error genérico de base de datos
      return NextResponse.json(
        { 
          success: false,
          error: 'Error al crear la cuenta',
          details: transactionError.message
        },
        { status: 500 }
      )
    }
    
  } catch (error: any) {
    console.error('❌ [SIGNUP] Error inesperado:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// Endpoint de verificación de salud
export async function GET(request: NextRequest) {
  try {
    // Verificar conexión a base de datos
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'ok',
      message: 'Signup endpoint is working',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
