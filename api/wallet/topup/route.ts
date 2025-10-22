
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, amount, paymentMethodId, currency = 'USD' } = body

    // Verificar que el userId coincida con la sesión
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })
    }

    // Validar el monto
    if (!amount || amount <= 0 || amount > 100000) {
      return NextResponse.json({ 
        error: 'Monto inválido (debe estar entre $1 y $100,000)' 
      }, { status: 400 })
    }

    // Calcular fees (1% del monto)
    const processingFee = Math.max(amount * 0.01, 1) // Mínimo $1
    const totalAmount = amount + processingFee

    // En un sistema real, aquí procesarías el pago con la pasarela
    // Por ahora simularemos un pago exitoso
    const paymentProcessingResult = await processPayment(paymentMethodId, totalAmount, currency)
    
    if (!paymentProcessingResult.success) {
      return NextResponse.json({ 
        error: paymentProcessingResult.error || 'Error al procesar pago' 
      }, { status: 400 })
    }

    // Crear o actualizar wallet
    const wallet = await prisma.wallet.upsert({
      where: { userId },
      update: {
        balance: {
          increment: amount
        },
        updatedAt: new Date()
      },
      create: {
        userId,
        balance: amount,
        currency,
        frozenAmount: 0
      }
    })

    // Crear registro de transacción de wallet
    const walletTransaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount: amount,
        fee: processingFee,
        currency: currency,
        description: `Recarga desde ${getPaymentMethodName(paymentMethodId)}`,
        status: 'COMPLETED',
        externalTransactionId: paymentProcessingResult.transactionId
      }
    })

    // Crear notificación
    await prisma.notification.create({
      data: {
        userId,
        type: 'WALLET_TOPUP',
        title: 'Wallet recargado exitosamente',
        message: `Se han agregado ${amount} ${currency} a tu wallet`,
        isRead: false
      }
    })

    // Log de la operación
    console.log(`Wallet topup: ${amount} ${currency} for user ${userId}`)

    return NextResponse.json({
      success: true,
      wallet: {
        balance: wallet.balance,
        currency: wallet.currency
      },
      transaction: walletTransaction,
      processingFee: processingFee
    })

  } catch (error) {
    console.error('Error topping up wallet:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Función simulada para procesar pagos
async function processPayment(paymentMethodId: string, amount: number, currency: string) {
  // En producción, aquí integrarías con Stripe, PayPal, etc.
  
  // Simular una pequeña probabilidad de fallo
  if (Math.random() < 0.02) { // 2% de probabilidad de fallo
    return {
      success: false,
      error: 'Pago rechazado por el banco emisor'
    }
  }

  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount,
    currency: currency,
    processingTime: new Date()
  }
}

function getPaymentMethodName(paymentMethodId: string): string {
  // En producción, buscarías en la base de datos
  const methods: { [key: string]: string } = {
    'card_1': 'tarjeta terminada en 4242',
    'bank_1': 'cuenta bancaria terminada en 6789',
    'paypal_1': 'PayPal'
  }
  return methods[paymentMethodId] || 'método de pago'
}
