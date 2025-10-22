
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

    const quotations = await prisma.quotation.findMany({
      where: {
        providerId: session.user.id
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            industry: true,
            budget: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    // Convert Decimal to number for JSON serialization
    const serializedQuotations = quotations.map(quotation => ({
      ...quotation,
      totalCost: Number(quotation.totalCost)
    }))

    return NextResponse.json(serializedQuotations)
  } catch (error) {
    console.error('Error fetching provider quotations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
