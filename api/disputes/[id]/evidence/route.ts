
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params

    // Verificar que la disputa existe y el usuario tiene acceso
    const dispute = await prisma.dispute.findUnique({
      where: { id }
    })

    if (!dispute) {
      return NextResponse.json({ error: 'Disputa no encontrada' }, { status: 404 })
    }

    // Verificar permisos
    if (dispute.createdBy !== session.user.id && 
        dispute.respondent !== session.user.id) {
      return NextResponse.json({ 
        error: 'Sin permisos para subir evidencia en esta disputa' 
      }, { status: 403 })
    }

    // No permitir evidencia en disputas cerradas
    if (dispute.status === 'RESOLVED' || dispute.status === 'CLOSED') {
      return NextResponse.json({ 
        error: 'No se puede subir evidencia en disputas cerradas' 
      }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'document'

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar tamaño del archivo (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'El archivo es demasiado grande (máximo 10MB)' 
      }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4', 'video/avi']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no permitido' 
      }, { status: 400 })
    }

    // En producción, aquí subirías el archivo a cloud storage (S3, etc.)
    const fileUrl = await uploadFile(file, `disputes/${id}`)

    // Crear registro de evidencia
    const evidence = await prisma.disputeEvidence.create({
      data: {
        disputeId: id,
        type: type,
        filename: file.name,
        url: fileUrl,
        size: file.size,
        mimeType: file.type,
        uploadedBy: session.user.id
      }
    })

    // Actualizar la disputa
    await prisma.dispute.update({
      where: { id },
      data: { updatedAt: new Date() }
    })

    // Notificar a la otra parte
    const otherPartyId = dispute.createdBy === session.user.id ? dispute.respondent : dispute.createdBy
    
    await prisma.notification.create({
      data: {
        userId: otherPartyId,
        type: 'DISPUTE_EVIDENCE',
        title: `Nueva evidencia en disputa ${dispute.caseNumber}`,
        message: `Se ha subido nueva evidencia: ${file.name}`,
        isRead: false
      }
    })

    // Log de la operación
    console.log(`Evidence uploaded to dispute ${dispute.caseNumber}: ${file.name}`)

    return NextResponse.json({
      success: true,
      evidence: evidence
    })

  } catch (error) {
    console.error('Error uploading dispute evidence:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Función simulada para subir archivos
async function uploadFile(file: File, folder: string): Promise<string> {
  // En producción, aquí integrarías con tu servicio de cloud storage
  
  // Simular subida
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const url = `/uploads/${folder}/${filename}`
  
  // En un sistema real, aquí guardarías el archivo físicamente
  console.log(`File uploaded: ${file.name} -> ${url}`)
  
  return url
}
