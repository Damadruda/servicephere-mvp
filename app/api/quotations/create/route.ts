
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createQuotationSchema = z.object({
  projectId: z.string(),
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  approach: z.string().min(50, 'El enfoque debe tener al menos 50 caracteres'),
  
  methodology: z.string(),
  technicalProposal: z.object({
    implementationApproach: z.string(),
    architectureOverview: z.string().optional(),
    riskMitigation: z.string().optional(),
    qualityAssurance: z.string().optional(),
    dataStrategy: z.string().optional()
  }),
  deliverables: z.array(z.string()),
  milestones: z.array(z.object({
    name: z.string(),
    description: z.string(),
    duration: z.string(),
    dependencies: z.array(z.string())
  })),
  
  teamComposition: z.array(z.object({
    role: z.string(),
    experience: z.string(),
    certifications: z.array(z.string()),
    allocation: z.string(),
    cost: z.number()
  })),
  costBreakdown: z.array(z.object({
    category: z.string(),
    description: z.string(),
    cost: z.number(),
    currency: z.string()
  })),
  totalCost: z.number().min(1, 'El costo total debe ser mayor a 0'),
  currency: z.string(),
  
  timeline: z.string(),
  paymentTerms: z.string(),
  includedServices: z.array(z.string()),
  excludedServices: z.array(z.string()),
  assumptions: z.string().optional(),
  risks: z.array(z.string()),
  validUntil: z.string().transform(str => new Date(str)),
  
  companyPresentation: z.string().optional(),
  similarProjects: z.array(z.object({
    title: z.string(),
    client: z.string(),
    modules: z.array(z.string()),
    duration: z.string(),
    teamSize: z.string()
  })).optional(),
  certifications: z.array(z.string()).optional()
})

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createQuotationSchema.parse(body)

    // Check if project exists and is published
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      select: { id: true, status: true }
    })

    if (!project || project.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Project not found or not available' },
        { status: 404 }
      )
    }

    // Check if provider already has a quotation for this project
    const existingQuotation = await prisma.quotation.findUnique({
      where: {
        projectId_providerId: {
          projectId: validatedData.projectId,
          providerId: session.user.id
        }
      }
    })

    if (existingQuotation) {
      return NextResponse.json(
        { error: 'Ya tienes una cotización para este proyecto' },
        { status: 400 }
      )
    }

    // Create the quotation
    const quotation = await prisma.quotation.create({
      data: {
        projectId: validatedData.projectId,
        providerId: session.user.id,
        title: validatedData.title,
        description: validatedData.description,
        approach: validatedData.approach,
        timeline: validatedData.timeline,
        totalCost: validatedData.totalCost,
        currency: validatedData.currency,
        methodology: validatedData.methodology,
        paymentTerms: validatedData.paymentTerms,
        includedServices: validatedData.includedServices,
        excludedServices: validatedData.excludedServices,
        assumptions: validatedData.assumptions || '',
        risks: validatedData.risks,
        validUntil: validatedData.validUntil,
        
        // JSON fields
        costBreakdown: validatedData.costBreakdown,
        teamComposition: validatedData.teamComposition,
        technicalProposal: validatedData.technicalProposal,
        deliverables: validatedData.deliverables,
        milestones: validatedData.milestones,
        
        // Additional data
        companyPresentation: validatedData.companyPresentation,
        similarProjects: validatedData.similarProjects || [],
        certifications: validatedData.certifications || [],
        
        status: 'PENDING'
      }
    })

    return NextResponse.json(
      { 
        message: 'Cotización creada exitosamente',
        quotationId: quotation.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating quotation:', error)
    
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
