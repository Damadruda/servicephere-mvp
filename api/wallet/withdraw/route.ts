
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
    const { userId, amount, accountId, currency = 'USD' } = body

    // Verificar que el userId coincida con la sesión
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })
    }

    // Obtener wallet del usuario
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    })

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet no encontrado' }, { status: 404 })
    }

    // Validar el monto
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })
    }

    const availableBalance = wallet.balance - wallet.frozenAmount
    if (amount > availableBalance) {
      return NextResponse.json({ 
        error: `Fondos insuficientes. Disponible: ${availableBalance} ${currency}` 
      }, { status: 400 })
    }

    // Calcular fees (fee fijo de $5 para retiros)
    const withdrawalFee = 5
    const totalDeduction = amount + withdrawalFee

    if (totalDeduction > availableBalance) {
      return NextResponse.json({ 
        error: `Fondos insuficientes para cubrir fees. Se requieren ${totalDeduction} ${currency}` 
      }, { status: 400 })
    }

    // En un sistema real, aquí procesarías el retiro con la institución financiera
    const withdrawalResult = await processWithdrawal(accountId, amount, currency)
    
    if (!withdrawalResult.success) {
      return NextResponse.json({ 
        error: withdrawalResult.error || 'Error al procesar retiro' 
      }, { status: 400 })
    }

    // Actualizar balance del wallet
    const updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: totalDeduction
        },
        updatedAt: new Date()
      }
    })

    // Crear registro de transacción de wallet
    const walletTransaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'WITHDRAWAL',
        amount: amount,
        fee: withdrawalFee,
        currency: currency,
        description: `Retiro a ${getAccountName(accountId)}`,
        status: 'PROCESSING', // Los retiros generalmente tardan en procesarse
        externalTransactionId: withdrawalResult.transactionId
      }
    })

    // Crear notificación
    await prisma.notification.create({
      data: {
        userId,
        type: 'WALLET_WITHDRAWAL',
        title: 'Retiro procesado',
        message: `Tu retiro de ${amount} ${currency} está siendo procesado. Llegará en 1-3 días hábiles.`,
        isRead: false
      }
    })

    // Log de la operación
    console.log(`Wallet withdrawal: ${amount} ${currency} for user ${userId}`)

    return NextResponse.json({
      success: true,
      wallet: {
        balance: updatedWallet.balance,
        currency: updatedWallet.currency
      },
      transaction: walletTransaction,
      withdrawalFee: withdrawalFee,
      estimatedArrival: '1-3 días hábiles'
    })

  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Función simulada para procesar retiros
async function processWithdrawal(accountId: string, amount: number, currency: string) {
  // En producción, aquí integrarías con servicios bancarios
  
  // Simular una pequeña probabilidad de fallo
  if (Math.random() < 0.03) { // 3% de probabilidad de fallo
    return {
      success: false,
      error: 'Cuenta bancaria no válida o temporalmente no disponible'
    }
  }

  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    success: true,
    transactionId: `wtd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount,
    currency: currency,
    estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
    processingTime: new Date()
  }
}

function getAccountName(accountId: string): string {
  // En producción, buscarías en la base de datos
  const accounts: { [key: string]: string } = {
    'bank_1': 'Bank of America ••••6789',
    'bank_2': 'Chase ••••1234',
    'paypal_1': 'PayPal'
  }
  return accounts[accountId] || 'cuenta bancaria'
}
