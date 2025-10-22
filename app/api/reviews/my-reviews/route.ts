
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  type: z.enum(['given', 'received', 'all']).optional().default('all'),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional().default('10'),
  status: z.enum(['PENDING', 'VERIFIED', 'APPROVED', 'REJECTED', 'HIDDEN', 'FLAGGED', 'ALL']).optional().default('ALL'),
  sortBy: z.enum(['newest', 'oldest', 'rating_high', 'rating_low']).optional().default('newest')
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const { type, page, limit, status, sortBy } = querySchema.parse(Object.fromEntries(searchParams))

    // Construir filtros base
    let where: any = {}

    if (type === 'given') {
      where.reviewerId = session.user.id
    } else if (type === 'received') {
      where.targetId = session.user.id
    } else {
      where.OR = [
        { reviewerId: session.user.id },
        { targetId: session.user.id }
      ]
    }

    if (status !== 'ALL') {
      where.status = status
    }

    // Configurar ordenamiento
    let orderBy: any
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'rating_high':
        orderBy = { overallRating: 'desc' }
        break
      case 'rating_low':
        orderBy = { overallRating: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Paginación
    const skip = (page - 1) * limit

    // Obtener reviews
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          reviewer: {
            select: {
              name: true,
              userType: true,
              clientProfile: {
                select: { companyName: true }
              },
              providerProfile: {
                select: { companyName: true }
              }
            }
          },
          target: {
            select: {
              name: true,
              userType: true,
              clientProfile: {
                select: { companyName: true }
              },
              providerProfile: {
                select: { companyName: true }
              }
            }
          },
          project: {
            select: {
              title: true,
              sapModules: true,
              industry: true,
              status: true
            }
          },
          reviewVotes: {
            where: { userId: session.user.id },
            select: { isHelpful: true }
          },
          _count: {
            select: {
              reviewVotes: true,
              reviewReports: true
            }
          }
        }
      }),
      
      prisma.review.count({ where })
    ])

    // Obtener estadísticas del usuario
    const [givenStats, receivedStats] = await Promise.all([
      prisma.review.groupBy({
        by: ['status'],
        where: { reviewerId: session.user.id },
        _count: true
      }),
      
      prisma.review.groupBy({
        by: ['overallRating'],
        where: { 
          targetId: session.user.id,
          status: { in: ['VERIFIED', 'APPROVED'] }
        },
        _count: true
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      reviews: reviews.map(review => ({
        ...review,
        isMyReview: review.reviewerId === session.user.id,
        reviewerCompany: review.reviewer.userType === 'CLIENT' 
          ? review.reviewer.clientProfile?.companyName
          : review.reviewer.providerProfile?.companyName,
        targetCompany: review.target.userType === 'CLIENT'
          ? review.target.clientProfile?.companyName
          : review.target.providerProfile?.companyName,
        myVote: review.reviewVotes[0]?.isHelpful,
        totalVotes: review._count.reviewVotes,
        reportCount: review._count.reviewReports
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      stats: {
        given: givenStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count
          return acc
        }, {} as Record<string, number>),
        receivedDistribution: receivedStats.reduce((acc, stat) => {
          acc[stat.overallRating] = stat._count
          return acc
        }, {} as Record<number, number>)
      }
    })

  } catch (error) {
    console.error('Error fetching my reviews:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Parámetros inválidos', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
