
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    conversationId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { conversationId } = params
    
    // Verificar que el usuario tiene acceso a la conversación
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        project: true
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 })
    }

    // Verificar acceso
    const hasAccess = conversation.clientId === session.user.id || 
                     conversation.providerId === session.user.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Sin acceso a la conversación' }, { status: 403 })
    }

    // Obtener mensajes
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Marcar mensajes como leídos
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return NextResponse.json(messages)

  } catch (error) {
    console.error('Error fetching messages:', error)
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

    const { conversationId } = params
    const body = await request.json()
    const { content, messageType = 'TEXT', attachmentUrl } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 })
    }

    // Verificar acceso a la conversación
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 })
    }

    const hasAccess = conversation.clientId === session.user.id || 
                     conversation.providerId === session.user.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Sin acceso a la conversación' }, { status: 403 })
    }

    // Determinar el receptor
    const receiverId = conversation.clientId === session.user.id ? 
                      conversation.providerId : 
                      conversation.clientId

    // Crear mensaje
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        receiverId,
        content,
        messageType,
        attachmentUrl
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Actualizar la conversación
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    // Crear notificación para el receptor
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE_RECEIVED' as const,
        title: 'Nuevo mensaje',
        message: `Has recibido un nuevo mensaje de ${session.user.name}`,
        data: {
          conversationId,
          messageId: message.id,
          senderId: session.user.id,
          senderName: session.user.name
        }
      }
    })

    return NextResponse.json({ success: true, message })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
