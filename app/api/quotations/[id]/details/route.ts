
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

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const quotation = await getPrismaClient().quotation.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: {
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
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            providerProfile: {
              select: {
                companyName: true
              }
            }
          }
        }
      }
    })

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const canAccess = quotation.project.clientId === session.user.id || 
                     quotation.providerId === session.user.id

    if (!canAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to access this quotation' },
        { status: 403 }
      )
    }

    const quotationData = {
      id: quotation.id,
      title: quotation.title,
      description: quotation.description,
      totalCost: quotation.totalCost,
      currency: quotation.currency,
      timeline: quotation.timeline,
      project: {
        id: quotation.project.id,
        title: quotation.project.title,
        companyName: quotation.project.client.clientProfile?.companyName || 'N/A'
      },
      provider: {
        id: quotation.provider.id,
        name: quotation.provider.name,
        email: quotation.provider.email,
        companyName: quotation.provider.providerProfile?.companyName || 'N/A'
      }
    }

    return NextResponse.json({
      quotation: quotationData
    })
  } catch (error) {
    console.error('Error fetching quotation details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
