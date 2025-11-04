
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


export async function GET(request: NextRequest) {
  try {
    const providers = await getPrismaClient().providerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        certifications: {
          where: {
            isVerified: true
          }
        },
        competencies: {
          where: {
            isVerified: true
          }
        },
        specializations: {
          where: {
            isVerified: true
          }
        }
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalProjects: 'desc' }
      ]
    })

    // Convert Float to number for JSON serialization
    const serializedProviders = providers.map(provider => ({
      ...provider,
      averageRating: Number(provider.averageRating)
    }))

    return NextResponse.json(serializedProviders)
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
