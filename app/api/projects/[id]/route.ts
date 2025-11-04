
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

    const project = await getPrismaClient().project.findUnique({
      where: { id: params.id },
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
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Only allow providers to see published projects or clients to see their own projects
    if (project.status !== 'PUBLISHED' && project.clientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Project not accessible' },
        { status: 403 }
      )
    }

    const projectData = {
      id: project.id,
      title: project.title,
      description: project.description,
      requirements: project.requirements,
      industry: project.industry,
      sapModules: project.sapModules,
      budget: project.budget,
      timeline: project.timeline,
      implementationType: project.implementationType,
      cloudPreference: project.cloudPreference,
      businessProcesses: project.businessProcesses,
      complianceRequirements: project.complianceRequirements,
      integrationNeeds: project.integrationNeeds,
      client: {
        name: project.client.name,
        companyName: project.client.clientProfile?.companyName || 'N/A'
      }
    }

    return NextResponse.json({
      project: projectData
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
