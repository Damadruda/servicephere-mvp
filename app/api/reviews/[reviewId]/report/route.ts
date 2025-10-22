
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const reportSchema = z.object({
  reason: z.enum([
    'INAPPROPRIATE_CONTENT',
    'FAKE_REVIEW', 
    'SPAM',
    'HARASSMENT',
    'MISLEADING_INFO',
    'CONFLICT_OF_INTEREST',
    'DUPLICATE_REVIEW',
    'OFF_TOPIC',
    'OTHER'
  ]),
  description: z.string().max(500).optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { reviewId } = params
    const body = await request.json()
    const { reason, description } = reportSchema.parse(body)

    // Verificar que el review existe
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, reviewerId: true, targetId: true, reportCount: true }
    })

    if (!review) {
      return NextResponse.json({ error: 'Review no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario no ha reportado ya este review
    const existingReport = await prisma.reviewReport.findFirst({
      where: {
        reviewId,
        reporterId: session.user.id
      }
    })

    if (existingReport) {
      return NextResponse.json({ 
        error: 'Ya has reportado este review' 
      }, { status: 400 })
    }

    // Crear el reporte
    const report = await prisma.reviewReport.create({
      data: {
        reviewId,
        reporterId: session.user.id,
        reason,
        description
      }
    })

    // Actualizar contadores del review
    const newReportCount = review.reportCount + 1
    const shouldFlag = newReportCount >= 3 // Flag automático después de 3 reportes

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        reportCount: newReportCount,
        isReported: true,
        reportReasons: {
          push: reason
        },
        // Flag automático si hay muchos reportes
        ...(shouldFlag && {
          status: 'FLAGGED',
          moderationFlags: {
            push: 'AUTO_FLAGGED_MULTIPLE_REPORTS'
          }
        })
      }
    })

    return NextResponse.json({
      report,
      message: shouldFlag 
        ? 'Review reportado y marcado para moderación automática'
        : 'Review reportado exitosamente'
    })

  } catch (error) {
    console.error('Error reporting review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Datos de reporte inválidos', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
