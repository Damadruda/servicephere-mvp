
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const contractId = formData.get('contractId') as string
    const category = formData.get('category') as string

    if (!file) {
      return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
    }

    if (!contractId) {
      return NextResponse.json({ error: 'contractId requerido' }, { status: 400 })
    }

    // Verificar acceso al contrato
    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
    }

    const hasAccess = contract.clientId === session.user.id || 
                     contract.providerId === session.user.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Sin acceso al contrato' }, { status: 403 })
    }

    // Validar archivo
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Archivo muy grande (máximo 10MB)' }, { status: 400 })
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    // TODO: Implement actual file upload to cloud storage (S3, etc.)
    // For now, we'll just simulate the upload
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name}`
    const fileUrl = `/uploads/${fileName}` // This would be the actual cloud URL

    // Save document metadata to database
    // Note: You would need to create a Document model in your schema for this
    const document = {
      id: `doc_${Date.now()}`,
      contractId,
      name: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      category: category || 'other',
      uploadedById: session.user.id,
      url: fileUrl,
      status: 'uploaded',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Create notification
    const recipientId = contract.clientId === session.user.id ? 
                       contract.providerId : 
                       contract.clientId

    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'PROJECT_UPDATE' as const,
        title: 'Nuevo documento subido',
        message: `Se ha subido un nuevo documento: ${file.name}`,
        data: {
          contractId,
          documentId: document.id,
          documentName: file.name,
          category
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      document,
      message: 'Documento subido exitosamente'
    })

  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contractId')

    if (!contractId) {
      return NextResponse.json({ error: 'contractId requerido' }, { status: 400 })
    }

    // Verificar acceso al contrato
    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
    }

    const hasAccess = contract.clientId === session.user.id || 
                     contract.providerId === session.user.id

    if (!hasAccess) {
      return NextResponse.json({ error: 'Sin acceso al contrato' }, { status: 403 })
    }

    // TODO: Fetch documents from database
    // For now, return mock data
    const documents = [
      {
        id: '1',
        contractId,
        name: 'Contrato_Firmado.pdf',
        originalName: 'Contrato_Firmado.pdf',
        category: 'contracts',
        size: 2457600, // 2.4 MB
        mimeType: 'application/pdf',
        uploadedById: session.user.id,
        url: '/uploads/contract.pdf',
        status: 'approved',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ]

    return NextResponse.json({ documents })

  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
