
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { amount } = body

    // Verificar que la transacción existe y el usuario tiene permisos
    const escrowTransaction = await prisma.escrowTransaction.findUnique({
      where: { id },
      include: {
        contract: true,
        payer: true,
        payee: true
      }
    })

    if (!escrowTransaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario es el pagador (cliente) o tiene permisos de admin
    if (escrowTransaction.payerId !== session.user.id && (session.user as any).userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Sin permisos para liberar fondos' }, { status: 403 })
    }

    // Verificar que la transacción está en estado ESCROWED
    if (escrowTransaction.status !== 'ESCROWED') {
      return NextResponse.json({ 
        error: 'Solo se pueden liberar fondos en estado de escrow' 
      }, { status: 400 })
    }

    const releaseAmount = amount || escrowTransaction.amount

    // Actualizar el estado de la transacción
    const updatedTransaction = await prisma.escrowTransaction.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        escrowCompletedAt: new Date(),
        releasedAmount: releaseAmount
      }
    })

    // Actualizar el balance del wallet del beneficiario
    await prisma.wallet.upsert({
      where: { userId: escrowTransaction.payeeId },
      update: {
        balance: {
          increment: releaseAmount - escrowTransaction.platformFee - escrowTransaction.paymentProcessingFee
        }
      },
      create: {
        userId: escrowTransaction.payeeId,
        balance: releaseAmount - escrowTransaction.platformFee - escrowTransaction.paymentProcessingFee,
        currency: escrowTransaction.currency,
        frozenAmount: 0
      }
    })

    // Reducir el monto congelado en el wallet del pagador
    await prisma.wallet.update({
      where: { userId: escrowTransaction.payerId },
      data: {
        frozenAmount: {
          decrement: escrowTransaction.amount
        }
      }
    })

    // Crear notificación para el beneficiario
    await prisma.notification.create({
      data: {
        userId: escrowTransaction.payeeId,
        type: 'PAYMENT_RECEIVED',
        title: 'Fondos liberados del escrow',
        message: `Se han liberado ${releaseAmount} de la transacción ${escrowTransaction.id}`,
        isRead: false
      }
    })

    // Log de la operación
    console.log(`Escrow released: ${id}, amount: ${releaseAmount}, by user: ${session.user.id}`)

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
      releasedAmount: releaseAmount
    })

  } catch (error) {
    console.error('Error releasing escrow:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
