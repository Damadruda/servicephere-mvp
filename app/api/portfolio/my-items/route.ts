
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id || session.user.userType !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // First get the provider profile
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!providerProfile) {
      return NextResponse.json([])
    }

    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        providerId: providerProfile.id,
        isPublic: true
      },
      orderBy: {
        endDate: 'desc'
      }
    })

    return NextResponse.json(portfolioItems)
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
