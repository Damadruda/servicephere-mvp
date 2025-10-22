

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo administradores pueden ver analytics completos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (user?.userType !== 'ADMIN') {
      // Usuarios regulares solo ven sus propias métricas
      const userAnalytics = await getUserAnalytics(session.user.id)
      return NextResponse.json({
        success: true,
        data: userAnalytics
      })
    }

    // Analytics completos para administradores
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    const type = searchParams.get('type') || 'overview'

    let analytics: any = {}

    if (type === 'overview') {
      analytics = await getOverviewAnalytics(period)
    } else if (type === 'queries') {
      analytics = await getQueryAnalytics(period)
    } else if (type === 'satisfaction') {
      analytics = await getSatisfactionAnalytics(period)
    } else if (type === 'resolution') {
      analytics = await getResolutionAnalytics(period)
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      period
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error obteniendo analytics' 
    }, { status: 500 })
  }
}

async function getUserAnalytics(userId: string) {
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [totalQueries, avgSatisfaction, sessionsCount, resolutionStats] = await Promise.all([
    // Total de consultas del usuario
    prisma.chatAnalytics.count({
      where: {
        userId,
        date: { gte: last30Days }
      }
    }),

    // Satisfacción promedio
    prisma.chatAnalytics.aggregate({
      where: {
        userId,
        userSatisfaction: { not: null },
        date: { gte: last30Days }
      },
      _avg: { userSatisfaction: true },
      _count: { userSatisfaction: true }
    }),

    // Número de sesiones
    prisma.chatSession.count({
      where: {
        userId,
        createdAt: { gte: last30Days }
      }
    }),

    // Stats de resolución
    prisma.chatAnalytics.groupBy({
      by: ['resolution'],
      where: {
        userId,
        date: { gte: last30Days }
      },
      _count: true
    })
  ])

  return {
    totalQueries,
    sessionsCount,
    avgSatisfaction: avgSatisfaction._avg.userSatisfaction || 0,
    satisfactionRatings: avgSatisfaction._count.userSatisfaction || 0,
    resolutionStats: resolutionStats.reduce((acc, stat) => ({
      ...acc,
      [stat.resolution]: stat._count
    }), {})
  }
}

async function getOverviewAnalytics(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [totalQueries, totalSessions, avgResponseTime, uniqueUsers] = await Promise.all([
    prisma.chatAnalytics.count({
      where: { date: { gte: startDate } }
    }),

    prisma.chatSession.count({
      where: { createdAt: { gte: startDate } }
    }),

    prisma.chatAnalytics.aggregate({
      where: { 
        responseTime: { not: null },
        date: { gte: startDate }
      },
      _avg: { responseTime: true }
    }),

    prisma.chatAnalytics.findMany({
      where: { 
        userId: { not: null },
        date: { gte: startDate }
      },
      select: { userId: true },
      distinct: ['userId']
    })
  ])

  return {
    totalQueries,
    totalSessions,
    avgResponseTime: avgResponseTime._avg.responseTime || 0,
    uniqueUsers: uniqueUsers.length,
    queriesPerSession: totalSessions > 0 ? (totalQueries / totalSessions).toFixed(2) : 0
  }
}

async function getQueryAnalytics(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [queryTypes, queryCategories, dailyQueries] = await Promise.all([
    prisma.chatAnalytics.groupBy({
      by: ['queryType'],
      where: { date: { gte: startDate } },
      _count: true,
      orderBy: { _count: { queryType: 'desc' } }
    }),

    prisma.chatAnalytics.groupBy({
      by: ['queryCategory'],
      where: { date: { gte: startDate } },
      _count: true,
      orderBy: { _count: { queryCategory: 'desc' } }
    }),

    prisma.$queryRaw`
      SELECT DATE(date) as day, COUNT(*) as count
      FROM chat_analytics 
      WHERE date >= ${startDate}
      GROUP BY DATE(date)
      ORDER BY day
    `
  ])

  return {
    queryTypes: queryTypes.map(q => ({ type: q.queryType, count: q._count })),
    queryCategories: queryCategories.map(q => ({ category: q.queryCategory, count: q._count })),
    dailyQueries
  }
}

async function getSatisfactionAnalytics(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [avgSatisfaction, satisfactionDistribution] = await Promise.all([
    prisma.chatAnalytics.aggregate({
      where: { 
        userSatisfaction: { not: null },
        date: { gte: startDate }
      },
      _avg: { userSatisfaction: true },
      _count: { userSatisfaction: true }
    }),

    prisma.chatAnalytics.groupBy({
      by: ['userSatisfaction'],
      where: { 
        userSatisfaction: { not: null },
        date: { gte: startDate }
      },
      _count: true,
      orderBy: { userSatisfaction: 'asc' }
    })
  ])

  return {
    avgSatisfaction: avgSatisfaction._avg.userSatisfaction || 0,
    totalRatings: avgSatisfaction._count.userSatisfaction || 0,
    distribution: satisfactionDistribution.map(s => ({ 
      rating: s.userSatisfaction, 
      count: s._count 
    }))
  }
}

async function getResolutionAnalytics(period: string) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [resolutionStats, avgResponseTime] = await Promise.all([
    prisma.chatAnalytics.groupBy({
      by: ['resolution'],
      where: { date: { gte: startDate } },
      _count: true
    }),

    prisma.chatAnalytics.groupBy({
      by: ['resolution'],
      where: { 
        responseTime: { not: null },
        date: { gte: startDate }
      },
      _avg: { responseTime: true }
    })
  ])

  const resolutionWithTime = resolutionStats.map(stat => {
    const timeData = avgResponseTime.find(t => t.resolution === stat.resolution)
    return {
      resolution: stat.resolution,
      count: stat._count,
      avgResponseTime: timeData?._avg.responseTime || 0
    }
  })

  return {
    resolutionStats: resolutionWithTime,
    totalQueries: resolutionStats.reduce((sum, stat) => sum + stat._count, 0)
  }
}
