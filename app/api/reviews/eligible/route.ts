
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener proyectos completados donde el usuario está involucrado
    // y que aún no han sido calificados
    const eligibleProjects = await prisma.project.findMany({
      where: {
        status: 'COMPLETED',
        OR: [
          { clientId: session.user.id },
          { 
            quotations: {
              some: { 
                providerId: session.user.id,
                status: 'ACCEPTED'
              }
            }
          }
        ],
        // Excluir proyectos ya calificados por este usuario
        NOT: {
          reviews: {
            some: {
              reviewerId: session.user.id
            }
          }
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            userType: true,
            clientProfile: {
              select: { companyName: true }
            }
          }
        },
        quotations: {
          where: { status: 'ACCEPTED' },
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                userType: true,
                providerProfile: {
                  select: { companyName: true }
                }
              }
            },
            contract: {
              select: {
                id: true,
                status: true
              }
            }
          }
        },
        reviews: {
          where: {
            reviewerId: session.user.id
          },
          select: {
            id: true,
            targetId: true,
            reviewType: true
          }
        }
      }
    })

    // Procesar proyectos para determinar qué reviews son elegibles
    const eligibleReviews = eligibleProjects.flatMap(project => {
      const reviews = []
      const userIsClient = project.clientId === session.user.id
      const acceptedQuotation = project.quotations?.[0] // Asumiendo una cotización aceptada por proyecto

      if (userIsClient && acceptedQuotation) {
        // Cliente puede calificar al proveedor
        const providerId = acceptedQuotation.providerId
        const alreadyReviewed = project.reviews?.some((r: any) => 
          r.targetId === providerId && r.reviewType === 'CLIENT_TO_PROVIDER'
        ) || false

        if (!alreadyReviewed) {
          reviews.push({
            projectId: project.id,
            projectTitle: project.title,
            projectCompletedAt: project.updatedAt.toISOString(), // Usando updatedAt como proxy para completedAt
            targetUserId: providerId,
            targetName: acceptedQuotation.provider.name,
            targetCompany: acceptedQuotation.provider.providerProfile?.companyName,
            reviewType: 'CLIENT_TO_PROVIDER' as const,
            contractId: acceptedQuotation.contract?.id,
            quotationId: acceptedQuotation.id,
            projectValue: parseFloat(acceptedQuotation.totalCost.toString()),
            sapModules: project.sapModules,
            industry: project.industry
          })
        }
      } else if (!userIsClient && acceptedQuotation && acceptedQuotation.providerId === session.user.id) {
        // Proveedor puede calificar al cliente
        const clientId = project.clientId
        const alreadyReviewed = project.reviews?.some((r: any) => 
          r.targetId === clientId && r.reviewType === 'PROVIDER_TO_CLIENT'
        ) || false

        if (!alreadyReviewed) {
          reviews.push({
            projectId: project.id,
            projectTitle: project.title,
            projectCompletedAt: project.updatedAt.toISOString(), // Usando updatedAt como proxy para completedAt
            targetUserId: clientId,
            targetName: project.client.name,
            targetCompany: project.client.clientProfile?.companyName,
            reviewType: 'PROVIDER_TO_CLIENT' as const,
            contractId: acceptedQuotation.contract?.id,
            quotationId: acceptedQuotation.id,
            projectValue: parseFloat(acceptedQuotation.totalCost.toString()),
            sapModules: project.sapModules,
            industry: project.industry
          })
        }
      }

      return reviews
    })

    // Obtener estadísticas adicionales
    const totalEligible = eligibleReviews.length
    const totalCompleted = await prisma.review.count({
      where: { reviewerId: session.user.id }
    })

    return NextResponse.json({
      eligibleReviews,
      stats: {
        totalEligible,
        totalCompleted,
        completionRate: totalCompleted + totalEligible > 0 
          ? (totalCompleted / (totalCompleted + totalEligible)) * 100 
          : 0
      }
    })

  } catch (error) {
    console.error('Error fetching eligible reviews:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
