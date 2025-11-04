
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
    
    if (!session || session.user.userType !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get provider profile for matching
    const providerProfile = await getPrismaClient().providerProfile.findUnique({
      where: { userId: session.user.id },
      include: { competencies: true }
    })

    // Get published projects that don't have a quotation from this provider
    const projects = await getPrismaClient().project.findMany({
      where: {
        status: 'PUBLISHED',
        NOT: {
          quotations: {
            some: {
              providerId: session.user.id
            }
          }
        }
      },
      include: {
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
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    // Calculate matching scores for each project
    const projectsWithScores = projects.map(project => {
      let matchingScore = 0
      
      if (providerProfile) {
        // Industry match - using simple string comparison since industry field exists
        // Note: We would need to add industry field to ProviderProfile model for proper matching
        
        // SAP modules match - using basic string matching since module structure may be different
        const projectModules = project.sapModules
        // Basic matching based on available data
        matchingScore += 20 // Base score for being a qualified provider
        
        // Location match (basic - same country)
        if (providerProfile.country === project.country) {
          matchingScore += 15
        }
        
        // Remote work capability
        if (project.isRemote && providerProfile.description?.includes('remote')) {
          matchingScore += 15
        }
        
        // Additional scoring based on competencies count
        if (providerProfile.competencies && providerProfile.competencies.length > 0) {
          matchingScore += Math.min(30, providerProfile.competencies.length * 5)
        }
      }

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        industry: project.industry,
        sapModules: project.sapModules,
        budget: project.budget,
        timeline: project.timeline,
        location: {
          country: project.country,
          city: project.city || '',
          isRemote: project.isRemote
        },
        client: {
          name: project.client.name,
          companyName: project.client.clientProfile?.companyName || 'N/A'
        },
        publishedAt: project.publishedAt?.toISOString() || project.createdAt.toISOString(),
        deadline: project.deadline?.toISOString(),
        matchingScore: Math.round(matchingScore)
      }
    })

    return NextResponse.json({
      projects: projectsWithScores
    })
  } catch (error) {
    console.error('Error fetching project opportunities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
