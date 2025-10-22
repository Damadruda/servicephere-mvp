
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const responseSchema = z.object({
  response: z.string().min(10).max(1000)
})

export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { reviewId } = params
    const body = await request.json()
    const { response } = responseSchema.parse(body)

    // Verificar que el review existe y el usuario es el target
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        reviewer: { select: { name: true } },
        target: { select: { name: true } }
      }
    })

    if (!review) {
      return NextResponse.json({ error: 'Review no encontrado' }, { status: 404 })
    }

    if (review.targetId !== session.user.id) {
      return NextResponse.json({ 
        error: 'Solo puedes responder a reviews sobre ti' 
      }, { status: 403 })
    }

    if (review.response) {
      return NextResponse.json({ 
        error: 'Ya has respondido a este review' 
      }, { status: 400 })
    }

    // Actualizar el review con la respuesta
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        response,
        respondedAt: new Date()
      },
      include: {
        reviewer: {
          select: { name: true, userType: true }
        },
        target: {
          select: { name: true, userType: true }
        },
        project: {
          select: { title: true }
        }
      }
    })

    return NextResponse.json(updatedReview)

  } catch (error) {
    console.error('Error responding to review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Respuesta inválida', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
