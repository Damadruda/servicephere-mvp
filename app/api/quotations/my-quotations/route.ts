
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma-singleton'


// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/quotations/my-quotations
 *
 * Returns all quotations submitted by the current provider.
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
        { error: 'Solo proveedores pueden acceder a sus cotizaciones' },
        { status: 403 }
      )
    }

    // 3. Get all quotations from this provider
    const quotations = await prisma.quotation.findMany({
      where: {
        providerId: session.user.id
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            client: {
              select: {
                id: true,
                name: true,
                clientProfile: {
                  select: {
                    companyName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    // 4. Transform data for frontend
    const transformedQuotations = quotations.map(quotation => ({
      id: quotation.id,
      title: `Cotización para ${quotation.project.title}`,
      description: quotation.description,
      totalCost: quotation.totalCost,
      currency: quotation.currency,
      timeline: quotation.timeline,
      methodology: quotation.methodology,
      status: quotation.status,
      submittedAt: quotation.submittedAt,
      project: {
        id: quotation.project.id,
        title: quotation.project.title,
        status: quotation.project.status,
        client: {
          id: quotation.project.client.id,
          name: quotation.project.client.clientProfile?.companyName || quotation.project.client.name
        }
      }
    }))

    return NextResponse.json(transformedQuotations)

  } catch (error) {
    console.error('❌ [MY-QUOTATIONS] Error fetching quotations:', error)
    return NextResponse.json(
      { error: 'Error al cargar cotizaciones' },
      { status: 500 }
    )
  }
}
