
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma-singleton'
import { z } from 'zod'


// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Validation schema for project creation
 */
const projectSchema = z.object({
  // Basic Info
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  requirements: z.string().min(20, 'Los requerimientos deben tener al menos 20 caracteres'),

  // Technical Details
  implementationType: z.enum(['new', 'upgrade', 'migration', 'optimization']),
  sapModules: z.array(z.string()).min(1, 'Debes seleccionar al menos un módulo SAP'),
  methodology: z.string(),
  cloudPreference: z.enum(['onPremise', 'cloud', 'hybrid', 'noPreference']),

  // Business Context
  industry: z.string().min(1, 'La industria es requerida'),
  businessProcesses: z.array(z.string()).min(1, 'Debes seleccionar al menos un proceso de negocio'),
  complianceRequirements: z.array(z.string()).optional(),
  integrationNeeds: z.array(z.string()).optional(),

  // Project Details
  budget: z.string(),
  timeline: z.string(),
  teamSize: z.string().optional(),
  location: z.object({
    country: z.string(),
    city: z.string(),
    isRemote: z.boolean()
  }),

  // Publication settings
  visibility: z.enum(['public', 'private', 'inviteOnly']).optional(),
  invitedProviders: z.array(z.string()).optional(),
  publishedAt: z.string().or(z.date()).optional()
})

/**
 * POST /api/projects/create
 *
 * Creates and optionally publishes a new SAP project.
 * Only accessible by CLIENT users.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // 2. Verify user is a client
    if (session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Solo clientes pueden crear proyectos' },
        { status: 403 }
      )
    }

    // 3. Parse and validate request body
    const body = await request.json()

    let validatedData
    try {
      validatedData = projectSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Datos de proyecto inválidos',
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          },
          { status: 400 }
        )
      }
      throw error
    }

    // 4. Create project in database
    const project = await prisma.project.create({
      data: {
        // Basic Info
        title: validatedData.title,
        description: validatedData.description,
        requirements: validatedData.requirements,

        // Technical Details
        implementationType: validatedData.implementationType,
        sapModules: validatedData.sapModules,
        methodology: validatedData.methodology,
        cloudPreference: validatedData.cloudPreference,

        // Business Context
        industry: validatedData.industry,
        businessProcesses: validatedData.businessProcesses,
        complianceRequirements: validatedData.complianceRequirements || [],
        integrationNeeds: validatedData.integrationNeeds || [],

        // Project Details
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        teamSize: validatedData.teamSize,
        country: validatedData.location.country,
        city: validatedData.location.city,
        isRemote: validatedData.location.isRemote,

        // Status and publication
        status: validatedData.publishedAt ? 'PUBLISHED' : 'DRAFT',
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,

        // Link to client
        clientId: session.user.id
      }
    })

    console.log('✅ [PROJECT-CREATE] Project created:', {
      id: project.id,
      title: project.title,
      status: project.status,
      clientId: session.user.id
    })

    // 5. Return success response
    return NextResponse.json(
      {
        success: true,
        message: project.status === 'PUBLISHED'
          ? 'Proyecto publicado exitosamente'
          : 'Proyecto guardado como borrador',
        projectId: project.id,
        project: {
          id: project.id,
          title: project.title,
          status: project.status,
          publishedAt: project.publishedAt
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ [PROJECT-CREATE] Error creating project:', error)

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Cliente no encontrado' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Error al crear el proyecto',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/projects/create
 *
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Project creation endpoint is working',
    timestamp: new Date().toISOString()
  })
}
