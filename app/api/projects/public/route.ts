
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            clientProfile: {
              select: {
                companyName: true,
                industry: true
              }
            }
          }
        },
        _count: {
          select: {
            quotations: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching public projects:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
