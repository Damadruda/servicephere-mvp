
import { NextRequest, NextResponse } from 'next/server'
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

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional().default('10'),
  reviewType: z.enum(['CLIENT_TO_PROVIDER', 'PROVIDER_TO_CLIENT', 'ALL']).optional().default('ALL'),
  rating: z.string().transform(Number).pipe(z.number().min(1).max(5)).optional(),
  verified: z.enum(['true', 'false', 'all']).optional().default('all'),
  sortBy: z.enum(['newest', 'oldest', 'rating_high', 'rating_low', 'helpful']).optional().default('newest')
})

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    
    const { userId } = params
    const { page, limit, reviewType, rating, verified, sortBy } = query

    // Construir filtros
    const where: any = {
      targetId: userId,
      visibility: 'PUBLIC',
      status: { in: ['VERIFIED', 'APPROVED'] }
    }

    if (reviewType !== 'ALL') {
      where.reviewType = reviewType
    }

    if (rating) {
      where.overallRating = rating
    }

    if (verified === 'true') {
      where.isVerified = true
    } else if (verified === 'false') {
      where.isVerified = false
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
      case 'helpful':
        orderBy = { helpfulVotes: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Paginación
    const skip = (page - 1) * limit

    // Obtener reviews con información relacionada
    const [reviews, totalCount, userRating] = await Promise.all([
      getPrismaClient().review.findMany({
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
          project: {
            select: {
              title: true,
              sapModules: true,
              industry: true
            }
          },
          reviewVotes: {
            select: {
              isHelpful: true
            }
          },
          _count: {
            select: {
              reviewVotes: true,
              reviewReports: true
            }
          }
        }
      }),
      
      getPrismaClient().review.count({ where }),
      
      getPrismaClient().userRating.findUnique({
        where: { userId }
      })
    ])

    // Obtener estadísticas de rating
    const ratingStats = await getPrismaClient().review.groupBy({
      by: ['overallRating'],
      where: {
        targetId: userId,
        visibility: 'PUBLIC',
        status: { in: ['VERIFIED', 'APPROVED'] }
      },
      _count: true
    })

    // Formatear estadísticas
    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    }

    ratingStats.forEach(stat => {
      ratingDistribution[stat.overallRating as keyof typeof ratingDistribution] = stat._count
    })

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      reviews: reviews.map(review => ({
        ...review,
        reviewerCompany: review.reviewer.userType === 'CLIENT' 
          ? review.reviewer.clientProfile?.companyName
          : review.reviewer.providerProfile?.companyName,
        helpfulVotesCount: review.reviewVotes.filter(v => v.isHelpful).length,
        unhelpfulVotesCount: review.reviewVotes.filter(v => !v.isHelpful).length,
        totalVotes: review._count.reviewVotes,
        reportCount: review._count.reviewReports
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      },
      userRating,
      ratingDistribution,
      filters: {
        reviewType,
        rating,
        verified,
        sortBy
      }
    })

  } catch (error) {
    console.error('Error fetching user reviews:', error)

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
