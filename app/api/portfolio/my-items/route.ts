
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma-singleton'


// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/portfolio/my-items
 *
 * Returns all portfolio items for the current provider.
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
        { error: 'Solo proveedores pueden acceder a su portfolio' },
        { status: 403 }
      )
    }

    // 3. Get all portfolio items from this provider
    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        provider: {
          userId: session.user.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 4. Transform data for frontend
    const transformedItems = portfolioItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      industry: item.industry,
      sapModules: item.sapModules,
      projectValue: item.projectValue,
      duration: item.duration,
      methodology: item.methodology,
      outcome: item.outcome,
      technologies: item.technologies,
      teamSize: item.teamSize,
      role: item.role,
      challenges: item.challenges,
      isPublic: item.isPublic,
      createdAt: item.createdAt
    }))

    return NextResponse.json(transformedItems)

  } catch (error) {
    console.error('❌ [MY-PORTFOLIO] Error fetching portfolio items:', error)
    return NextResponse.json(
      { error: 'Error al cargar items del portfolio' },
      { status: 500 }
    )
  }
}
