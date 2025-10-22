
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const providers = await prisma.providerProfile.findMany({
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
