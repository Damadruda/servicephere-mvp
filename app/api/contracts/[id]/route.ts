
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
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
            id: true,
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
            id: true,
            name: true,
            providerProfile: {
              select: {
                companyName: true
              }
            }
          }
        },
        payments: {
          orderBy: {
            dueDate: 'asc'
          }
        },
        milestoneUpdates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      )
    }

    // Check permissions
    const canAccess = contract.clientId === session.user.id || 
                     contract.providerId === session.user.id

    if (!canAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to access this contract' },
        { status: 403 }
      )
    }

    const contractData = {
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
      milestones: contract.milestones,
      payments: contract.payments.map(payment => ({
        id: payment.id,
        amount: Number(payment.amount),
        currency: payment.currency,
        description: payment.description,
        dueDate: payment.dueDate.toISOString(),
        paidDate: payment.paidDate?.toISOString(),
        status: payment.status
      })),
      contractTerms: contract.contractTerms,
      createdAt: contract.createdAt.toISOString()
    }

    return NextResponse.json({
      contract: contractData
    })
  } catch (error) {
    console.error('Error fetching contract details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
