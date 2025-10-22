
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
    const { 
      userId,
      type,
      escrowTransactionId,
      reason,
      evidence = []
    } = body

    // Verificar que el userId coincida con la sesión
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })
    }

    // Verificar que existe la transacción de escrow
    const escrowTransaction = await prisma.escrowTransaction.findUnique({
      where: { id: escrowTransactionId },
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
      return NextResponse.json({ 
        error: 'Transacción de escrow no encontrada' 
      }, { status: 404 })
    }

    // Verificar que el usuario está involucrado en la transacción
    if (escrowTransaction.payerId !== userId && 
        escrowTransaction.payeeId !== userId) {
      return NextResponse.json({ 
        error: 'Sin permisos para crear disputa en esta transacción' 
      }, { status: 403 })
    }

    // Generar número de caso único
    const currentYear = new Date().getFullYear()
    const disputeCount = await prisma.dispute.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`)
        }
      }
    })
    const caseNumber = `CASE-${currentYear}-${(disputeCount + 1).toString().padStart(3, '0')}`

    // Determinar prioridad basada en el monto
    let priority = 'MEDIUM'
    if (escrowTransaction.amount > 50000) priority = 'HIGH'
    else if (escrowTransaction.amount < 5000) priority = 'LOW'

    // Crear la disputa
    const dispute = await prisma.dispute.create({
      data: {
        caseNumber: caseNumber,
        status: 'OPEN',
        type: type,
        priority: priority,
        amount: escrowTransaction.amount,
        currency: escrowTransaction.currency,
        reason: reason,
        createdBy: userId,
        respondent: escrowTransaction.payerId === userId ? escrowTransaction.payeeId : escrowTransaction.payerId,
        escrowTransactionId: escrowTransactionId,
        expectedResolution: new Date(Date.now() + getResolutionDays(priority) * 24 * 60 * 60 * 1000),
        assignedAgent: assignAgent(priority)
      }
    })

    // Crear mensaje inicial
    await prisma.disputeMessage.create({
      data: {
        disputeId: dispute.id,
        senderId: userId,
        content: reason,
        isFromAdmin: false
      }
    })

    // Subir evidencia si existe
    if (evidence.length > 0) {
      for (const evidenceItem of evidence) {
        await prisma.disputeEvidence.create({
          data: {
            disputeId: dispute.id,
            type: evidenceItem.type || 'document',
            filename: evidenceItem.filename,
            url: evidenceItem.url || '',
            uploadedBy: userId
          }
        })
      }
    }

    // Actualizar estado de la transacción de escrow
    await prisma.escrowTransaction.update({
      where: { id: escrowTransactionId },
      data: { status: 'DISPUTED' }
    })

    // Notificar a la otra parte
    const otherPartyId = escrowTransaction.payerId === userId ? 
                        escrowTransaction.payeeId : escrowTransaction.payerId

    await prisma.notification.create({
      data: {
        userId: otherPartyId,
        type: 'DISPUTE_CREATED',
        title: 'Nueva disputa creada',
        message: `Se ha creado la disputa ${caseNumber} para la transacción relacionada con "${escrowTransaction.contract?.quotation?.project?.title || 'proyecto'}"`,
        isRead: false
      }
    })

    // Notificar a administradores (en producción, esto sería más sofisticado)
    const admins = await prisma.user.findMany({
      where: { userType: 'ADMIN' },
      select: { id: true }
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'DISPUTE_ASSIGNED',
          title: `Nueva disputa asignada: ${caseNumber}`,
          message: `Disputa de ${type} por ${escrowTransaction.amount} ${escrowTransaction.currency}`,
          isRead: false
        }
      })
    }

    // Log de la operación
    console.log(`Dispute created: ${caseNumber}, type: ${type}, amount: ${escrowTransaction.amount}`)

    return NextResponse.json({
      success: true,
      dispute: {
        id: dispute.id,
        caseNumber: dispute.caseNumber,
        status: dispute.status,
        type: dispute.type,
        priority: dispute.priority,
        expectedResolution: dispute.expectedResolution
      }
    })

  } catch (error) {
    console.error('Error creating dispute:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

function getResolutionDays(priority: string): number {
  switch (priority) {
    case 'HIGH': return 5
    case 'MEDIUM': return 10
    case 'LOW': return 15
    default: return 10
  }
}

function assignAgent(priority: string): string {
  // En producción, esto sería más sofisticado con balanceo de carga real
  const agents = {
    'HIGH': ['María González', 'Carlos Rodríguez'],
    'MEDIUM': ['Ana Torres', 'Luis Mendez', 'Patricia Silva'],
    'LOW': ['Miguel Castro', 'Laura Díaz', 'Roberto Vega']
  }
  
  const availableAgents = agents[priority as keyof typeof agents] || agents['MEDIUM']
  return availableAgents[Math.floor(Math.random() * availableAgents.length)]
}
