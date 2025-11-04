
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const chatSessions = await getPrismaClient().chatSession.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { lastActivity: 'desc' }
    })

    return NextResponse.json({
      success: true,
      sessions: chatSessions
    })

  } catch (error) {
    console.error('Error loading chat sessions:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error cargando conversaciones' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { sessionName, language } = await request.json()

    const chatSession = await getPrismaClient().chatSession.create({
      data: {
        userId: session.user.id,
        sessionName: sessionName || `Consulta SAP - ${new Date().toLocaleDateString()}`,
        language: language || 'es'
      },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      session: chatSession
    })

  } catch (error) {
    console.error('Error creating chat session:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error creando conversación' 
    }, { status: 500 })
  }
}
