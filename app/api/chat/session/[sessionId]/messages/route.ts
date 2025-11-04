
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'



// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Lazy initialization de PrismaClient para evitar ejecución en build time
let prisma: PrismaClient | null = null

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

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
    const chatSession = await getPrismaClient().chatSession.findFirst({
      where: {
        id: params.sessionId,
        userId: session.user.id
      }
    })

    if (!chatSession) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    const messages = await getPrismaClient().chatMessage.findMany({
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
