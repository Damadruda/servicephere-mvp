
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
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get contracts based on user type
    let contracts
    
    if (session.user.userType === 'CLIENT') {
      contracts = await getPrismaClient().contract.findMany({
        where: {
          clientId: session.user.id
        },
        include: {
          quotation: {
            include: {
              project: {
                select: {
                  title: true
                }
              }
            }
          },
          client: {
            select: {
              name: true,
              clientProfile: {
                select: {
                  companyName: true
                }
              }
            }
          },
          provider: {
            select: {
              name: true,
              providerProfile: {
                select: {
                  companyName: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      contracts = await getPrismaClient().contract.findMany({
        where: {
          providerId: session.user.id
        },
        include: {
          quotation: {
            include: {
              project: {
                select: {
                  title: true
                }
              }
            }
          },
          client: {
            select: {
              name: true,
              clientProfile: {
                select: {
                  companyName: true
                }
              }
            }
          },
          provider: {
            select: {
              name: true,
              providerProfile: {
                select: {
                  companyName: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    const contractsData = contracts.map(contract => ({
      id: contract.id,
      contractNumber: contract.contractNumber,
      title: contract.title,
      description: contract.description,
      totalValue: Number(contract.totalValue),
      currency: contract.currency,
      status: contract.status,
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      clientSigned: contract.clientSigned,
      providerSigned: contract.providerSigned,
      client: {
        name: contract.client.name,
        companyName: contract.client.clientProfile?.companyName || 'N/A'
      },
      provider: {
        name: contract.provider.name,
        companyName: contract.provider.providerProfile?.companyName || 'N/A'
      },
      project: {
        title: contract.quotation.project.title
      },
      createdAt: contract.createdAt.toISOString()
    }))

    return NextResponse.json({
      contracts: contractsData
    })
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
