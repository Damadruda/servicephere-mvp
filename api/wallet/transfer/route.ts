
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
    const { userId, amount, recipientEmail, note, currency = 'USD' } = body

    // Verificar que el userId coincida con la sesión
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })
    }

    // Validar el monto
    if (!amount || amount <= 0 || amount > 50000) {
      return NextResponse.json({ 
        error: 'Monto inválido (debe estar entre $1 y $50,000)' 
      }, { status: 400 })
    }

    // Buscar al destinatario por email
    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmail }
    })

    if (!recipient) {
      return NextResponse.json({ 
        error: 'El usuario destinatario no existe en la plataforma' 
      }, { status: 404 })
    }

    // No permitir auto-transferencias
    if (recipient.id === userId) {
      return NextResponse.json({ 
        error: 'No puedes transferir fondos a ti mismo' 
      }, { status: 400 })
    }

    // Obtener wallet del remitente
    const senderWallet = await prisma.wallet.findUnique({
      where: { userId }
    })

    if (!senderWallet) {
      return NextResponse.json({ error: 'Wallet no encontrado' }, { status: 404 })
    }

    // Calcular fees (1% del monto, mínimo $1)
    const transferFee = Math.max(amount * 0.01, 1)
    const totalDeduction = amount + transferFee

    const availableBalance = senderWallet.balance - senderWallet.frozenAmount
    if (totalDeduction > availableBalance) {
      return NextResponse.json({ 
        error: `Fondos insuficientes. Disponible: ${availableBalance} ${currency}, se requieren: ${totalDeduction} ${currency}` 
      }, { status: 400 })
    }

    // Usar transacción de base de datos para garantizar atomicidad
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar wallet del remitente (deducir)
      const updatedSenderWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: totalDeduction
          },
          updatedAt: new Date()
        }
      })

      // Crear o actualizar wallet del destinatario (agregar)
      const recipientWallet = await tx.wallet.upsert({
        where: { userId: recipient.id },
        update: {
          balance: {
            increment: amount
          },
          updatedAt: new Date()
        },
        create: {
          userId: recipient.id,
          balance: amount,
          currency: currency,
          frozenAmount: 0
        }
      })

      // Crear registro de transacción para el remitente
      const senderTransaction = await tx.walletTransaction.create({
        data: {
          walletId: senderWallet.id,
          type: 'TRANSFER_OUT',
          amount: amount,
          fee: transferFee,
          currency: currency,
          description: note || `Transferencia a ${recipient.name || recipientEmail}`,
          status: 'COMPLETED',
          relatedUserId: recipient.id
        }
      })

      // Crear registro de transacción para el destinatario
      const recipientTransaction = await tx.walletTransaction.create({
        data: {
          walletId: recipientWallet.id,
          type: 'TRANSFER_IN',
          amount: amount,
          fee: 0,
          currency: currency,
          description: note || `Transferencia de ${session.user.name || session.user.email}`,
          status: 'COMPLETED',
          relatedUserId: userId
        }
      })

      return {
        senderWallet: updatedSenderWallet,
        recipientWallet,
        senderTransaction,
        recipientTransaction
      }
    })

    // Crear notificaciones
    await Promise.all([
      // Notificación al remitente
      prisma.notification.create({
        data: {
          userId,
          type: 'TRANSFER_SENT',
          title: 'Transferencia enviada',
          message: `Has transferido ${amount} ${currency} a ${recipient.name || recipientEmail}`,
          isRead: false
        }
      }),
      // Notificación al destinatario
      prisma.notification.create({
        data: {
          userId: recipient.id,
          type: 'TRANSFER_RECEIVED',
          title: 'Transferencia recibida',
          message: `Has recibido ${amount} ${currency} de ${session.user.name || session.user.email}${note ? `. Nota: ${note}` : ''}`,
          isRead: false
        }
      })
    ])

    // Log de la operación
    console.log(`Wallet transfer: ${amount} ${currency} from ${userId} to ${recipient.id}`)

    return NextResponse.json({
      success: true,
      transfer: {
        amount: amount,
        currency: currency,
        recipient: {
          name: recipient.name,
          email: recipient.email
        },
        fee: transferFee,
        note: note
      },
      senderBalance: result.senderWallet.balance,
      transactionId: result.senderTransaction.id
    })

  } catch (error) {
    console.error('Error processing transfer:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
