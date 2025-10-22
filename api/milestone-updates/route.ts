
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
    const { contractId, milestoneId, progressPercent, status, notes, deliverables, attachments } = body

    // Verificar que el usuario tiene acceso al contrato
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        quotation: {
          include: {
            project: true,
            provider: true
          }
        }
      }
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
    }

    // Verificar acceso del usuario
    const hasAccess = contract.clientId === session.user.id || 
                     contract.providerId === session.user.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Sin acceso al contrato' }, { status: 403 })
    }

    // Buscar si ya existe una actualización para este hito
    const existingUpdate = await prisma.milestoneUpdate.findFirst({
      where: {
        contractId,
        milestoneId
      }
    })

    // Obtener información del milestone
    const milestonesData = contract.milestones as any
    const milestone = milestonesData?.milestones?.find((m: any) => m.id === milestoneId)
    
    let milestoneUpdate

    if (existingUpdate) {
      // Actualizar el registro existente
      milestoneUpdate = await prisma.milestoneUpdate.update({
        where: { id: existingUpdate.id },
        data: {
          progressPercent: Math.min(Math.max(progressPercent, 0), 100),
          status,
          notes,
          deliverables: deliverables || [],
          attachments: attachments || [],
          ...(status === 'COMPLETED' && { completedAt: new Date() })
        }
      })
    } else {
      // Crear nuevo registro
      milestoneUpdate = await prisma.milestoneUpdate.create({
        data: {
          contractId,
          milestoneId,
          milestoneName: milestone?.name || 'Hito sin nombre',
          description: milestone?.description,
          progressPercent: Math.min(Math.max(progressPercent, 0), 100),
          status,
          notes,
          deliverables: deliverables || [],
          attachments: attachments || [],
          ...(status === 'COMPLETED' && { completedAt: new Date() })
        }
      })
    }

    // Crear notificación para el cliente y proveedor
    const notificationData = [
      {
        userId: contract.clientId,
        type: 'PROJECT_UPDATE' as const,
        title: 'Actualización de Hito',
        message: `Se ha actualizado el hito "${milestone?.name || 'Hito sin nombre'}" del proyecto`,
        data: {
          contractId,
          milestoneId,
          status,
          progress: progressPercent
        }
      },
      {
        userId: contract.providerId,
        type: 'PROJECT_UPDATE' as const,
        title: 'Actualización de Hito',
        message: `Se ha actualizado el hito "${milestone?.name || 'Hito sin nombre'}" del proyecto`,
        data: {
          contractId,
          milestoneId,
          status,
          progress: progressPercent
        }
      }
    ]

    // Filtrar para no enviar notificación al usuario que hizo la actualización
    const filteredNotifications = notificationData.filter(n => n.userId !== session.user.id)
    
    if (filteredNotifications.length > 0) {
      await prisma.notification.createMany({
        data: filteredNotifications
      })
    }

    return NextResponse.json({ 
      success: true, 
      milestoneUpdate 
    })

  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contractId')

    if (!contractId) {
      return NextResponse.json({ error: 'contractId requerido' }, { status: 400 })
    }

    // Verificar acceso al contrato
    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
    }

    const hasAccess = contract.clientId === session.user.id || 
                     contract.providerId === session.user.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Sin acceso al contrato' }, { status: 403 })
    }

    const milestoneUpdates = await prisma.milestoneUpdate.findMany({
      where: { contractId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ milestoneUpdates })

  } catch (error) {
    console.error('Error fetching milestone updates:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
