
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const projects = await prisma.project.findMany({
      where: {
        clientId: session.user.id
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            clientProfile: true
          }
        },
        _count: {
          select: {
            quotations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Convert BigInt values if any exist
    const serializedProjects = projects.map(project => ({
      ...project,
      // Handle any potential BigInt conversions here if needed
    }))

    return NextResponse.json(serializedProjects)
  } catch (error) {
    console.error('Error fetching user projects:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
