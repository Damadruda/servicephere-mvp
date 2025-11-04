
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id || session.user.userType !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const [totalQuotations, acceptedQuotations, contracts, providerProfile, reviews] = await Promise.all([
      getPrismaClient().quotation.count({
        where: { providerId: session.user.id }
      }),
      getPrismaClient().quotation.count({
        where: { 
          providerId: session.user.id,
          status: 'ACCEPTED'
        }
      }),
      getPrismaClient().contract.findMany({
        where: { providerId: session.user.id },
        select: { totalValue: true }
      }),
      getPrismaClient().providerProfile.findUnique({
        where: { userId: session.user.id },
        select: { averageRating: true }
      }),
      getPrismaClient().review.count({
        where: { targetId: session.user.id }
      })
    ])

    const totalEarnings = contracts.reduce((sum, contract) => 
      sum + Number(contract.totalValue), 0)

    const averageRating = providerProfile?.averageRating || 0

    return NextResponse.json({
      totalQuotations,
      acceptedQuotations,
      totalEarnings,
      averageRating: Number(averageRating),
      profileViews: reviews * 5 // Mock calculation for profile views
    })
  } catch (error) {
    console.error('Error fetching provider stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
