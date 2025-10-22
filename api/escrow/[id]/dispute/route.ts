
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
    const { reason, evidence } = body

    // Verificar que la transacción existe
    const escrowTransaction = await prisma.escrowTransaction.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            quotation: {
              include: {
                project: true
              }
            }
          }
        }
      }
    })

    if (!escrowTransaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario está involucrado en la transacción
    if (escrowTransaction.payerId !== session.user.id && 
        escrowTransaction.payeeId !== session.user.id) {
      return NextResponse.json({ 
        error: 'Sin permisos para crear disputa en esta transacción' 
      }, { status: 403 })
    }

    // Verificar que la transacción está en un estado que permite disputas
    if (!['ESCROWED', 'PENDING'].includes(escrowTransaction.status)) {
      return NextResponse.json({ 
        error: 'No se pueden crear disputas para esta transacción' 
      }, { status: 400 })
    }

    // Crear la disputa
    const dispute = await prisma.dispute.create({
      data: {
        caseNumber: `CASE-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        status: 'OPEN',
        type: determineDisputeType(reason),
        priority: 'MEDIUM',
        amount: escrowTransaction.amount,
        currency: escrowTransaction.currency,
        reason: reason,
        createdBy: session.user.id,
        respondent: escrowTransaction.payerId === session.user.id ? escrowTransaction.payeeId : escrowTransaction.payerId,
        escrowTransactionId: escrowTransaction.id,
        expectedResolution: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días
        assignedAgent: 'Sistema Automático'
      }
    })

    // Crear mensaje inicial de la disputa
    await prisma.disputeMessage.create({
      data: {
        disputeId: dispute.id,
        senderId: session.user.id,
        content: reason,
        isFromAdmin: false
      }
    })

    // Si hay evidencia, crearla
    if (evidence && evidence.length > 0) {
      for (const evidenceItem of evidence) {
        await prisma.disputeEvidence.create({
          data: {
            disputeId: dispute.id,
            type: evidenceItem.type || 'document',
            filename: evidenceItem.filename,
            url: evidenceItem.url || '',
            uploadedBy: session.user.id
          }
        })
      }
    }

    // Actualizar el estado de la transacción
    await prisma.escrowTransaction.update({
      where: { id },
      data: {
        status: 'DISPUTED'
      }
    })

    // Notificar a la otra parte
    const otherPartyId = escrowTransaction.payerId === session.user.id ? 
                        escrowTransaction.payeeId : escrowTransaction.payerId

    await prisma.notification.create({
      data: {
        userId: otherPartyId,
        type: 'DISPUTE_CREATED',
        title: 'Nueva disputa creada',
        message: `Se ha creado una disputa para la transacción ${escrowTransaction.id}`,
        isRead: false
      }
    })

    // Log de la operación
    console.log(`Dispute created: ${dispute.id}, escrow: ${id}, by user: ${session.user.id}`)

    return NextResponse.json({
      success: true,
      dispute: dispute
    })

  } catch (error) {
    console.error('Error creating dispute:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

function determineDisputeType(reason: string): string {
  const lowerReason = reason.toLowerCase()
  
  if (lowerReason.includes('reembolso') || lowerReason.includes('refund')) {
    return 'REFUND_REQUEST'
  } else if (lowerReason.includes('calidad') || lowerReason.includes('quality')) {
    return 'QUALITY_ISSUE'
  } else if (lowerReason.includes('pago') || lowerReason.includes('payment')) {
    return 'PAYMENT_ISSUE'
  } else if (lowerReason.includes('contrato') || lowerReason.includes('contract')) {
    return 'CONTRACT_BREACH'
  } else {
    return 'OTHER'
  }
}
