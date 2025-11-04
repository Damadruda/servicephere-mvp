
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { messageId, feedback } = await request.json()

    // Verificar que el mensaje existe y pertenece a una sesión del usuario
    const message = await getPrismaClient().chatMessage.findFirst({
      where: {
        id: messageId,
        session: {
          userId: session.user.id
        }
      }
    })

    if (!message) {
      return NextResponse.json({ error: 'Mensaje no encontrado' }, { status: 404 })
    }

    // Actualizar el mensaje con el feedback
    await getPrismaClient().chatMessage.update({
      where: { id: messageId },
      data: { feedback }
    })

    // Registrar feedback en analytics si es rating numérico
    const rating = parseInt(feedback)
    if (!isNaN(rating) && rating >= 1 && rating <= 5) {
      await getPrismaClient().chatAnalytics.create({
        data: {
          userId: session.user.id,
          sessionId: message.sessionId,
          queryType: 'FEEDBACK',
          queryCategory: 'User Rating',
          resolution: 'COMPLETED',
          userSatisfaction: rating
        }
      }).catch(err => console.error('Error saving feedback analytics:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback registrado correctamente'
    })

  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error registrando feedback' 
    }, { status: 500 })
  }
}
