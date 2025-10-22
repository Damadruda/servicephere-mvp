
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id || session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const [totalProjects, activeProjects, pendingQuotations, contracts] = await Promise.all([
      prisma.project.count({
        where: { clientId: session.user.id }
      }),
      prisma.project.count({
        where: { 
          clientId: session.user.id,
          status: { in: ['PUBLISHED', 'IN_PROGRESS'] }
        }
      }),
      prisma.quotation.count({
        where: {
          project: { clientId: session.user.id },
          status: 'PENDING'
        }
      }),
      prisma.contract.findMany({
        where: { clientId: session.user.id },
        select: { totalValue: true }
      })
    ])

    const totalSpent = contracts.reduce((sum, contract) => 
      sum + Number(contract.totalValue), 0)

    return NextResponse.json({
      totalProjects,
      activeProjects,
      pendingQuotations,
      totalSpent
    })
  } catch (error) {
    console.error('Error fetching client stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
