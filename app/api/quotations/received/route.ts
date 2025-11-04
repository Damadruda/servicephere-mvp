
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
    
    if (!session || session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all quotations for projects owned by this client
    const quotations = await getPrismaClient().quotation.findMany({
      where: {
        project: {
          clientId: session.user.id
        }
      },
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            providerProfile: {
              select: {
                companyName: true,
                website: true
              }
            }
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    const quotationsData = quotations.map(quotation => ({
      id: quotation.id,
      title: quotation.title,
      description: quotation.description,
      totalCost: quotation.totalCost,
      currency: quotation.currency,
      timeline: quotation.timeline,
      status: quotation.status,
      submittedAt: quotation.submittedAt.toISOString(),
      validUntil: quotation.validUntil.toISOString(),
      project: {
        id: quotation.project.id,
        title: quotation.project.title
      },
      provider: {
        id: quotation.provider.id,
        name: quotation.provider.name,
        companyName: quotation.provider.providerProfile?.companyName || 'N/A',
        industry: 'SAP Consulting', // Default value since we don't have industry in ProviderProfile
        website: quotation.provider.providerProfile?.website
      }
    }))

    return NextResponse.json({
      quotations: quotationsData
    })
  } catch (error) {
    console.error('Error fetching received quotations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
