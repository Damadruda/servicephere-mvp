
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma-singleton'
import { z } from 'zod'


// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


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
    const project = await prisma.project.findUnique({
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
    const existingReview = await prisma.review.findFirst({
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
    const review = await prisma.review.create({
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
    const reviews = await prisma.review.findMany({
      where: {
        targetId: userId,
        status: { in: ['VERIFIED', 'APPROVED'] },
        visibility: 'PUBLIC'
      }
    })

    if (reviews.length === 0) return

    // Single-pass aggregation - calculate all metrics in one loop (PERFORMANCE FIX)
    const stats = reviews.reduce((acc, review) => {
      // Overall rating
      acc.overallSum += review.overallRating

      // Individual rating sums and counts
      if (review.communicationRating) {
        acc.commSum += review.communicationRating
        acc.commCount++
      }
      if (review.qualityRating) {
        acc.qualitySum += review.qualityRating
        acc.qualityCount++
      }
      if (review.timelinessRating) {
        acc.timelinessSum += review.timelinessRating
        acc.timelinessCount++
      }
      if (review.professionalismRating) {
        acc.profSum += review.professionalismRating
        acc.profCount++
      }
      if (review.valueRating) {
        acc.valueSum += review.valueRating
        acc.valueCount++
      }
      if (review.technicalRating) {
        acc.techSum += review.technicalRating
        acc.techCount++
      }

      // Star distribution
      switch(review.overallRating) {
        case 5: acc.fiveStarCount++; break
        case 4: acc.fourStarCount++; break
        case 3: acc.threeStarCount++; break
        case 2: acc.twoStarCount++; break
        case 1: acc.oneStarCount++; break
      }

      // Recommendation and verification
      if (review.wouldRecommend) acc.recommendCount++
      if (review.isVerified) acc.verifiedCount++

      return acc
    }, {
      overallSum: 0,
      commSum: 0, commCount: 0,
      qualitySum: 0, qualityCount: 0,
      timelinessSum: 0, timelinessCount: 0,
      profSum: 0, profCount: 0,
      valueSum: 0, valueCount: 0,
      techSum: 0, techCount: 0,
      fiveStarCount: 0, fourStarCount: 0, threeStarCount: 0, twoStarCount: 0, oneStarCount: 0,
      recommendCount: 0, verifiedCount: 0
    })

    // Calculate final averages
    const totalReviews = reviews.length
    const averageRating = stats.overallSum / totalReviews
    const avgCommunication = stats.commCount > 0 ? stats.commSum / stats.commCount : 0
    const avgQuality = stats.qualityCount > 0 ? stats.qualitySum / stats.qualityCount : 0
    const avgTimeliness = stats.timelinessCount > 0 ? stats.timelinessSum / stats.timelinessCount : 0
    const avgProfessionalism = stats.profCount > 0 ? stats.profSum / stats.profCount : 0
    const avgValue = stats.valueCount > 0 ? stats.valueSum / stats.valueCount : 0
    const avgTechnical = stats.techCount > 0 ? stats.techSum / stats.techCount : 0
    const recommendationRate = (stats.recommendCount / totalReviews) * 100

    const fiveStarCount = stats.fiveStarCount
    const fourStarCount = stats.fourStarCount
    const threeStarCount = stats.threeStarCount
    const twoStarCount = stats.twoStarCount
    const oneStarCount = stats.oneStarCount
    const verifiedReviewsCount = stats.verifiedCount

    // Actualizar o crear UserRating
    await prisma.userRating.upsert({
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
