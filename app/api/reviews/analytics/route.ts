
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

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y', 'all']).optional().default('30d'),
  userType: z.enum(['CLIENT', 'PROVIDER', 'ALL']).optional().default('ALL')
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const { period, userType } = querySchema.parse(Object.fromEntries(searchParams))

    // Calcular fechas para el filtro
    let dateFilter: any = {}
    const now = new Date()
    
    switch (period) {
      case '7d':
        dateFilter.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        dateFilter.gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        dateFilter.gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        dateFilter.gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      case 'all':
        // Sin filtro de fecha
        break
    }

    const baseWhere: any = {
      ...(period !== 'all' && { createdAt: dateFilter }),
      status: { in: ['VERIFIED', 'APPROVED'] },
      visibility: 'PUBLIC'
    }

    // Filtrar por tipo de usuario target si se especifica
    if (userType !== 'ALL') {
      baseWhere.target = { userType }
    }

    // Obtener estadísticas generales
    const [
      totalReviews,
      avgRating,
      ratingDistribution,
      reviewsByType,
      topRatedUsers,
      recentTrends
    ] = await Promise.all([
      // Total de reviews
      getPrismaClient().review.count({ where: baseWhere }),
      
      // Rating promedio
      getPrismaClient().review.aggregate({
        where: baseWhere,
        _avg: { overallRating: true }
      }),
      
      // Distribución de ratings
      getPrismaClient().review.groupBy({
        by: ['overallRating'],
        where: baseWhere,
        _count: true,
        orderBy: { overallRating: 'desc' }
      }),
      
      // Reviews por tipo
      getPrismaClient().review.groupBy({
        by: ['reviewType'],
        where: baseWhere,
        _count: true
      }),
      
      // Usuarios mejor calificados
      getPrismaClient().userRating.findMany({
        where: {
          ...(userType !== 'ALL' && { user: { userType } }),
          totalReviewsReceived: { gt: 0 }
        },
        include: {
          user: {
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
          }
        },
        orderBy: [
          { averageRating: 'desc' },
          { totalReviewsReceived: 'desc' }
        ],
        take: 10
      }),
      
      // Tendencias recientes (últimos 30 días por semana)
      getPrismaClient().$queryRaw`
        SELECT 
          DATE_TRUNC('week', "createdAt") as week,
          COUNT(*)::integer as reviews,
          AVG("overallRating")::float as avg_rating
        FROM reviews 
        WHERE "status" IN ('VERIFIED', 'APPROVED')
          AND "visibility" = 'PUBLIC'
          AND "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('week', "createdAt")
        ORDER BY week DESC
      `
    ])

    // Estadísticas por módulos SAP más calificados (temporalmente deshabilitado por problema de SQL)
    const sapModulesStats: any[] = [
      // { module: 'FI', reviews: 10, avg_rating: 4.5 },
      // { module: 'CO', reviews: 8, avg_rating: 4.3 },
      // { module: 'MM', reviews: 6, avg_rating: 4.7 },
    ]

    // Estadísticas de moderación (solo para admin o superuser)
    let moderationStats = null
    
    // Por ahora, mostrar stats de moderación a todos los usuarios autenticados
    moderationStats = await getPrismaClient().review.groupBy({
      by: ['status'],
      where: {
        ...(period !== 'all' && { createdAt: dateFilter })
      },
      _count: true
    })

    return NextResponse.json({
      overview: {
        totalReviews,
        averageRating: avgRating._avg.overallRating || 0,
        period
      },
      ratingDistribution: ratingDistribution.reduce((acc, item) => {
        acc[item.overallRating] = item._count
        return acc
      }, {} as Record<number, number>),
      reviewsByType: reviewsByType.reduce((acc, item) => {
        acc[item.reviewType] = item._count
        return acc
      }, {} as Record<string, number>),
      topRatedUsers: topRatedUsers.map(rating => ({
        userId: rating.userId,
        name: rating.user.name,
        userType: rating.user.userType,
        companyName: rating.user.userType === 'CLIENT' 
          ? rating.user.clientProfile?.companyName
          : rating.user.providerProfile?.companyName,
        averageRating: rating.averageRating,
        totalReviews: rating.totalReviewsReceived,
        recommendationRate: rating.recommendationRate
      })),
      trends: recentTrends,
      sapModules: sapModulesStats,
      moderation: moderationStats.reduce((acc, item) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>)
    })

  } catch (error) {
    console.error('Error fetching review analytics:', error)

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
