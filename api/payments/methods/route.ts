
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // En producción, aquí obtendrías los métodos de pago desde tu procesador de pagos
    // Por ahora, devolvemos métodos mock
    const paymentMethods = [
      {
        id: 'card_1',
        type: 'credit_card',
        brand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        isVerified: true,
        nickname: 'Tarjeta Principal'
      }
    ]

    return NextResponse.json({ paymentMethods })

  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, type, ...methodData } = body

    // Verificar que el userId coincida con la sesión
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })
    }

    // En producción, aquí registrarías el método de pago con tu procesador
    const result = await registerPaymentMethod(type, methodData)

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Error al registrar método de pago' 
      }, { status: 400 })
    }

    // Crear notificación
    await prisma.notification.create({
      data: {
        userId,
        type: 'PAYMENT_METHOD_ADDED',
        title: 'Método de pago agregado',
        message: `Se ha agregado exitosamente tu ${getMethodTypeName(type)}`,
        isRead: false
      }
    })

    return NextResponse.json({
      success: true,
      paymentMethod: result.paymentMethod
    })

  } catch (error) {
    console.error('Error adding payment method:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Función simulada para registrar métodos de pago
async function registerPaymentMethod(type: string, methodData: any) {
  // En producción, aquí integrarías con Stripe, PayPal, etc.
  
  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simular una pequeña probabilidad de fallo
  if (Math.random() < 0.05) { // 5% de probabilidad de fallo
    return {
      success: false,
      error: 'No se pudo verificar la información del método de pago'
    }
  }

  const paymentMethodId = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return {
    success: true,
    paymentMethod: {
      id: paymentMethodId,
      type: type,
      ...methodData,
      isVerified: true,
      createdAt: new Date()
    }
  }
}

function getMethodTypeName(type: string): string {
  const types: { [key: string]: string } = {
    'credit_card': 'tarjeta de crédito',
    'bank_account': 'cuenta bancaria',
    'digital_wallet': 'wallet digital'
  }
  return types[type] || 'método de pago'
}
