
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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
    const session = await getServerSession()
    
    if (!session?.user?.id || session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const [totalProjects, activeProjects, pendingQuotations, contracts] = await Promise.all([
      getPrismaClient().project.count({
        where: { clientId: session.user.id }
      }),
      getPrismaClient().project.count({
        where: { 
          clientId: session.user.id,
          status: { in: ['PUBLISHED', 'IN_PROGRESS'] }
        }
      }),
      getPrismaClient().quotation.count({
        where: {
          project: { clientId: session.user.id },
          status: 'PENDING'
        }
      }),
      getPrismaClient().contract.findMany({
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
