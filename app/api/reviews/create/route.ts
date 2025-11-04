
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'


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


const createReviewSchema = z.object({
  projectId: z.string().cuid(),
  targetUserId: z.string().cuid(),
  reviewType: z.enum(['CLIENT_TO_PROVIDER', 'PROVIDER_TO_CLIENT']),
  overallRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5).optional(),
  qualityRating: z.number().min(1).max(5).optional(),
  timelinessRating: z.number().min(1).max(5).optional(),
  professionalismRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
  technicalRating: z.number().min(1).max(5).optional(),
  title: z.string().max(100).optional(),
  comment: z.string().min(10).max(2000),
  pros: z.array(z.string().max(200)).max(10).optional(),
  cons: z.array(z.string().max(200)).max(10).optional(),
  wouldRecommend: z.boolean(),
  quotationId: z.string().cuid().optional(),
  contractId: z.string().cuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    // Verificar que el proyecto existe y el usuario está involucrado
    const project = await getPrismaClient().project.findUnique({
      where: { id: validatedData.projectId },
      include: {
        quotations: {
          where: {
            OR: [
              { providerId: session.user.id },
              { providerId: validatedData.targetUserId }
            ]
          },
          include: {
            contract: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario puede crear este review
    const canReview = project.clientId === session.user.id || 
                     project.quotations.some(q => q.providerId === session.user.id)

    if (!canReview) {
      return NextResponse.json({ 
        error: 'No tienes autorización para crear un review en este proyecto' 
      }, { status: 403 })
    }

    // Verificar que el proyecto ha sido completado
    if (project.status !== 'COMPLETED') {
      return NextResponse.json({ 
        error: 'Solo puedes crear reviews para proyectos completados' 
      }, { status: 400 })
    }

    // Verificar que no existe ya un review del mismo tipo para este proyecto
    const existingReview = await getPrismaClient().review.findFirst({
      where: {
        projectId: validatedData.projectId,
        reviewerId: session.user.id,
        targetId: validatedData.targetUserId,
        reviewType: validatedData.reviewType
      }
    })

    if (existingReview) {
      return NextResponse.json({ 
        error: 'Ya has creado un review para esta persona en este proyecto' 
      }, { status: 400 })
    }

    // Obtener información del contrato para metadatos
    const contract = project.quotations[0]?.contract
    const projectValue = validatedData.quotationId ? 
      (project.quotations.find(q => q.id === validatedData.quotationId)?.totalCost ? 
        parseFloat(project.quotations.find(q => q.id === validatedData.quotationId)?.totalCost.toString() || '0') : null
      ) : null
    const projectDuration = contract?.createdAt && project.updatedAt 
      ? Math.ceil((project.updatedAt.getTime() - contract.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Crear el review
    const review = await getPrismaClient().review.create({
      data: {
        projectId: validatedData.projectId,
        reviewerId: session.user.id,
        targetId: validatedData.targetUserId,
        reviewType: validatedData.reviewType,
        overallRating: validatedData.overallRating,
        communicationRating: validatedData.communicationRating,
        qualityRating: validatedData.qualityRating,
        timelinessRating: validatedData.timelinessRating,
        professionalismRating: validatedData.professionalismRating,
        valueRating: validatedData.valueRating,
        technicalRating: validatedData.technicalRating,
        title: validatedData.title,
        comment: validatedData.comment,
        pros: validatedData.pros || [],
        cons: validatedData.cons || [],
        wouldRecommend: validatedData.wouldRecommend,
        quotationId: validatedData.quotationId,
        contractId: validatedData.contractId,
        projectValue,
        projectDuration,
        sapModules: project.sapModules,
        isVerified: true, // Auto-verificado porque viene de proyecto completado
        verifiedAt: new Date(),
        verificationMethod: 'PROJECT_COMPLETION',
        status: 'VERIFIED'
      },
      include: {
        reviewer: {
          select: { name: true, email: true, userType: true }
        },
        target: {
          select: { name: true, email: true, userType: true }
        },
        project: {
          select: { title: true }
        }
      }
    })

    // Actualizar las estadísticas de ratings del usuario target
    await updateUserRatings(validatedData.targetUserId)

    return NextResponse.json(review, { status: 201 })

  } catch (error) {
    console.error('Error creating review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Datos inválidos', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

async function updateUserRatings(userId: string) {
  try {
    // Obtener todas las reviews del usuario
    const reviews = await getPrismaClient().review.findMany({
      where: {
        targetId: userId,
        status: { in: ['VERIFIED', 'APPROVED'] },
        visibility: 'PUBLIC'
      }
    })

    if (reviews.length === 0) return

    // Calcular promedios
    const totalReviews = reviews.length
    const averageRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews
    
    const avgCommunication = reviews.filter(r => r.communicationRating).length > 0 
      ? reviews.reduce((sum, r) => sum + (r.communicationRating || 0), 0) / reviews.filter(r => r.communicationRating).length
      : 0

    const avgQuality = reviews.filter(r => r.qualityRating).length > 0
      ? reviews.reduce((sum, r) => sum + (r.qualityRating || 0), 0) / reviews.filter(r => r.qualityRating).length
      : 0

    const avgTimeliness = reviews.filter(r => r.timelinessRating).length > 0
      ? reviews.reduce((sum, r) => sum + (r.timelinessRating || 0), 0) / reviews.filter(r => r.timelinessRating).length
      : 0

    const avgProfessionalism = reviews.filter(r => r.professionalismRating).length > 0
      ? reviews.reduce((sum, r) => sum + (r.professionalismRating || 0), 0) / reviews.filter(r => r.professionalismRating).length
      : 0

    const avgValue = reviews.filter(r => r.valueRating).length > 0
      ? reviews.reduce((sum, r) => sum + (r.valueRating || 0), 0) / reviews.filter(r => r.valueRating).length
      : 0

    const avgTechnical = reviews.filter(r => r.technicalRating).length > 0
      ? reviews.reduce((sum, r) => sum + (r.technicalRating || 0), 0) / reviews.filter(r => r.technicalRating).length
      : 0

    // Contar distribución de estrellas
    const fiveStarCount = reviews.filter(r => r.overallRating === 5).length
    const fourStarCount = reviews.filter(r => r.overallRating === 4).length
    const threeStarCount = reviews.filter(r => r.overallRating === 3).length
    const twoStarCount = reviews.filter(r => r.overallRating === 2).length
    const oneStarCount = reviews.filter(r => r.overallRating === 1).length

    // Calcular tasa de recomendación
    const recommendationRate = (reviews.filter(r => r.wouldRecommend).length / totalReviews) * 100

    // Contar reviews verificadas
    const verifiedReviewsCount = reviews.filter(r => r.isVerified).length

    // Actualizar o crear UserRating
    await getPrismaClient().userRating.upsert({
      where: { userId },
      update: {
        averageRating,
        totalReviewsReceived: totalReviews,
        avgCommunication,
        avgQuality,
        avgTimeliness,
        avgProfessionalism,
        avgValue,
        avgTechnical,
        recommendationRate,
        fiveStarCount,
        fourStarCount,
        threeStarCount,
        twoStarCount,
        oneStarCount,
        verifiedReviewsCount,
        lastReviewAt: new Date(),
        updatedAt: new Date()
      },
      create: {
        userId,
        averageRating,
        totalReviewsReceived: totalReviews,
        avgCommunication,
        avgQuality,
        avgTimeliness,
        avgProfessionalism,
        avgValue,
        avgTechnical,
        recommendationRate,
        fiveStarCount,
        fourStarCount,
        threeStarCount,
        twoStarCount,
        oneStarCount,
        verifiedReviewsCount,
        lastReviewAt: new Date()
      }
    })

  } catch (error) {
    console.error('Error updating user ratings:', error)
  }
}
