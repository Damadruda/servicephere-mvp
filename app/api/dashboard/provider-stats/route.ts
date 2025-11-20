
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma-singleton'


// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/dashboard/provider-stats
 *
 * Returns dashboard statistics for the current provider.
 * Only accessible by PROVIDER users.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Verify authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // 2. Verify user is a provider
    if (session.user.userType !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'Solo proveedores pueden acceder a las estadísticas' },
        { status: 403 }
      )
    }

    // 3. Get provider profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!providerProfile) {
      return NextResponse.json(
        { error: 'Perfil de proveedor no encontrado' },
        { status: 404 }
      )
    }

    // 4. Get all quotations statistics
    const quotations = await prisma.quotation.findMany({
      where: {
        providerId: session.user.id
      },
      select: {
        status: true,
        totalCost: true,
        currency: true
      }
    })

    const totalQuotations = quotations.length
    const acceptedQuotations = quotations.filter(q => q.status === 'ACCEPTED').length

    // Calculate total earnings (sum of accepted quotations)
    // Note: This is simplified - in production you'd want to normalize currency
    const totalEarnings = quotations
      .filter(q => q.status === 'ACCEPTED')
      .reduce((sum, q) => sum + q.totalCost.toNumber(), 0)

    // 5. Get average rating from reviews
    const reviewsReceived = await prisma.review.findMany({
      where: {
        targetId: session.user.id
      },
      select: {
        communicationRating: true,
        technicalRating: true,
        timelinessRating: true,
        professionalismRating: true,
        overallRating: true
      }
    })

    let averageRating = 0
    if (reviewsReceived.length > 0) {
      const totalRating = reviewsReceived.reduce((sum, review) => {
        return sum + (review.overallRating || 0)
      }, 0)
      averageRating = totalRating / reviewsReceived.length
    }

    // 6. Profile views - TODO: Implement view tracking in future
    const profileViews = 0

    // 7. Return stats
    const stats = {
      totalQuotations,
      acceptedQuotations,
      totalEarnings,
      averageRating,
      profileViews,
      // Additional useful stats
      pendingQuotations: quotations.filter(q => q.status === 'PENDING').length,
      rejectedQuotations: quotations.filter(q => q.status === 'REJECTED').length,
      reviewCount: reviewsReceived.length
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('❌ [PROVIDER-STATS] Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error al cargar estadísticas' },
      { status: 500 }
    )
  }
}
