
import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(request: NextRequest) {
  try {
    const projects = await getPrismaClient().project.findMany({
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
