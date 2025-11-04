
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'


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


const voteSchema = z.object({
  isHelpful: z.boolean()
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
    const { isHelpful } = voteSchema.parse(body)

    // Verificar que el review existe
    const review = await getPrismaClient().review.findUnique({
      where: { id: reviewId },
      select: { id: true, reviewerId: true, targetId: true }
    })

    if (!review) {
      return NextResponse.json({ error: 'Review no encontrado' }, { status: 404 })
    }

    // No permitir votar en reviews propios
    if (review.reviewerId === session.user.id || review.targetId === session.user.id) {
      return NextResponse.json({ 
        error: 'No puedes votar en reviews donde estás involucrado' 
      }, { status: 403 })
    }

    // Crear o actualizar el voto
    const existingVote = await getPrismaClient().reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: session.user.id
        }
      }
    })

    let vote
    if (existingVote) {
      // Actualizar voto existente
      vote = await getPrismaClient().reviewVote.update({
        where: { id: existingVote.id },
        data: { isHelpful }
      })
    } else {
      // Crear nuevo voto
      vote = await getPrismaClient().reviewVote.create({
        data: {
          reviewId,
          userId: session.user.id,
          isHelpful
        }
      })
    }

    // Actualizar contadores en el review
    const [helpfulCount, unhelpfulCount] = await Promise.all([
      getPrismaClient().reviewVote.count({
        where: { reviewId, isHelpful: true }
      }),
      getPrismaClient().reviewVote.count({
        where: { reviewId, isHelpful: false }
      })
    ])

    await getPrismaClient().review.update({
      where: { id: reviewId },
      data: {
        helpfulVotes: helpfulCount,
        unhelpfulVotes: unhelpfulCount
      }
    })

    return NextResponse.json({
      vote,
      helpfulVotes: helpfulCount,
      unhelpfulVotes: unhelpfulCount
    })

  } catch (error) {
    console.error('Error voting on review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Voto inválido', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
