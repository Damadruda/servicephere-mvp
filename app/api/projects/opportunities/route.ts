
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma-singleton'


// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/projects/opportunities
 *
 * Returns published projects that are available for providers to quote on.
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
        { error: 'Solo proveedores pueden acceder a las oportunidades' },
        { status: 403 }
      )
    }

    // 3. Get published projects that the provider hasn't quoted on yet
    const opportunities = await prisma.project.findMany({
      where: {
        status: 'PUBLISHED',
        // Exclude projects where this provider already has a quotation
        quotations: {
          none: {
            providerId: session.user.id
          }
        }
      },
      include: {
        client: {
          include: {
            clientProfile: {
              select: {
                companyName: true
              }
            }
          }
        },
        quotations: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 50 // Limit to 50 most recent opportunities
    })

    // 4. Transform data for frontend
    const transformedOpportunities = opportunities.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      industry: project.industry,
      sapModules: project.sapModules,
      budget: project.budget,
      timeline: project.timeline,
      country: project.country,
      city: project.city,
      isRemote: project.isRemote,
      publishedAt: project.publishedAt,
      client: {
        id: project.client.id,
        name: project.client.clientProfile?.companyName || project.client.name
      },
      quotationCount: project.quotations.length
    }))

    return NextResponse.json(transformedOpportunities)

  } catch (error) {
    console.error('❌ [OPPORTUNITIES] Error fetching opportunities:', error)
    return NextResponse.json(
      { error: 'Error al cargar oportunidades' },
      { status: 500 }
    )
  }
}
