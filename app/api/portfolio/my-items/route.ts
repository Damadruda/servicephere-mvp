
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.userType !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // First get the provider profile
    const providerProfile = await getPrismaClient().providerProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!providerProfile) {
      return NextResponse.json([])
    }

    const portfolioItems = await getPrismaClient().portfolioItem.findMany({
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
