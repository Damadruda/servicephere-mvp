
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  requirements: z.string().min(10, 'Los requerimientos deben tener al menos 10 caracteres'),
  
  implementationType: z.enum(['new', 'upgrade', 'migration', 'optimization']),
  sapModules: z.array(z.string()).min(1, 'Debe seleccionar al menos un módulo SAP'),
  methodology: z.string(),
  cloudPreference: z.enum(['onPremise', 'cloud', 'hybrid', 'noPreference']),
  
  industry: z.string().min(1, 'Debe seleccionar una industria'),
  businessProcesses: z.array(z.string()),
  complianceRequirements: z.array(z.string()),
  integrationNeeds: z.array(z.string()),
  
  budget: z.string(),
  timeline: z.string(),
  teamSize: z.string(),
  location: z.object({
    country: z.string().min(1, 'El país es requerido'),
    city: z.string().optional(),
    isRemote: z.boolean()
  }),
  
  visibility: z.enum(['public', 'private', 'inviteOnly']),
  invitedProviders: z.array(z.string()).optional(),
  publishedAt: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    // Create the project
    const project = await prisma.project.create({
      data: {
        clientId: session.user.id,
        title: validatedData.title,
        description: validatedData.description,
        requirements: validatedData.requirements,
        
        industry: validatedData.industry,
        sapModules: validatedData.sapModules,
        methodology: validatedData.methodology,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        teamSize: validatedData.teamSize,
        
        // Technical details
        implementationType: validatedData.implementationType,
        cloudPreference: validatedData.cloudPreference,
        
        // Business context
        businessProcesses: validatedData.businessProcesses,
        complianceRequirements: validatedData.complianceRequirements,
        integrationNeeds: validatedData.integrationNeeds,
        
        country: validatedData.location.country,
        city: validatedData.location.city || '',
        isRemote: validatedData.location.isRemote,
        
        status: validatedData.visibility === 'public' ? 'PUBLISHED' : 'DRAFT',
        publishedAt: validatedData.visibility === 'public' ? new Date() : null
      }
    })

    // If project is published publicly, we might want to notify relevant providers
    if (validatedData.visibility === 'public') {
      // TODO: Implement notification system for matching providers
      console.log(`New project published: ${project.id}`)
    }

    return NextResponse.json(
      { 
        message: 'Proyecto creado exitosamente',
        projectId: project.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating project:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors.map(e => e.message).join(', ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
