
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteParams {
  params: {
    sessionId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que la sesión pertenece al usuario
    const chatSession = await prisma.chatSession.findFirst({
      where: {
        id: params.sessionId,
        userId: session.user.id
      }
    })

    if (!chatSession) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        sessionId: params.sessionId
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      success: true,
      messages: messages
    })

  } catch (error) {
    console.error('Error loading chat messages:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error cargando mensajes' 
    }, { status: 500 })
  }
}
