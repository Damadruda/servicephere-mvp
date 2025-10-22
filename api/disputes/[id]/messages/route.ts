
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params

    // Verificar que la disputa existe y el usuario tiene acceso
    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!dispute) {
      return NextResponse.json({ error: 'Disputa no encontrada' }, { status: 404 })
    }

    // Verificar permisos
    if (dispute.createdBy !== session.user.id && 
        dispute.respondent !== session.user.id &&
        (session.user as any).userType !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Sin permisos para ver esta disputa' 
      }, { status: 403 })
    }

    return NextResponse.json({
      messages: dispute.messages
    })

  } catch (error) {
    console.error('Error fetching dispute messages:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
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
    const { message } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Mensaje no puede estar vacío' }, { status: 400 })
    }

    // Verificar que la disputa existe y el usuario tiene acceso
    const dispute = await prisma.dispute.findUnique({
      where: { id }
    })

    if (!dispute) {
      return NextResponse.json({ error: 'Disputa no encontrada' }, { status: 404 })
    }

    // Verificar permisos
    if (dispute.createdBy !== session.user.id && 
        dispute.respondent !== session.user.id &&
        (session.user as any).userType !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Sin permisos para enviar mensajes en esta disputa' 
      }, { status: 403 })
    }

    // No permitir mensajes en disputas cerradas
    if (dispute.status === 'RESOLVED' || dispute.status === 'CLOSED') {
      return NextResponse.json({ 
        error: 'No se pueden enviar mensajes en disputas cerradas' 
      }, { status: 400 })
    }

    // Crear el mensaje
    const disputeMessage = await prisma.disputeMessage.create({
      data: {
        disputeId: id,
        senderId: session.user.id,
        content: message.trim(),
        isFromAdmin: (session.user as any).userType === 'ADMIN'
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Actualizar la fecha de última actualización de la disputa
    await prisma.dispute.update({
      where: { id },
      data: { updatedAt: new Date() }
    })

    // Notificar a las otras partes involucradas
    const recipients = []
    if (dispute.createdBy !== session.user.id) recipients.push(dispute.createdBy)
    if (dispute.respondent !== session.user.id) recipients.push(dispute.respondent)

    for (const recipientId of recipients) {
      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'DISPUTE_MESSAGE',
          title: `Nuevo mensaje en disputa ${dispute.caseNumber}`,
          message: `${session.user.name || session.user.email} ha enviado un nuevo mensaje`,
          isRead: false
        }
      })
    }

    // Log de la operación
    console.log(`Message added to dispute ${dispute.caseNumber} by user ${session.user.id}`)

    return NextResponse.json({
      success: true,
      message: disputeMessage
    })

  } catch (error) {
    console.error('Error adding dispute message:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
