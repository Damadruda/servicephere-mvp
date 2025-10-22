
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

    // Obtener la factura
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        issuedBy: { select: { name: true, email: true } },
        issuedTo: { select: { name: true, email: true } }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario tiene permisos para enviar esta factura
    if (invoice.issuedById !== session.user.id) {
      return NextResponse.json({ 
        error: 'Sin permisos para enviar esta factura' 
      }, { status: 403 })
    }

    // Verificar que la factura se puede enviar
    if (!['DRAFT', 'PENDING'].includes(invoice.status)) {
      return NextResponse.json({ 
        error: 'Esta factura no se puede enviar' 
      }, { status: 400 })
    }

    // Simular envío de email
    const emailResult = await sendInvoiceEmail(invoice)
    
    if (!emailResult.success) {
      return NextResponse.json({ 
        error: 'Error al enviar el email' 
      }, { status: 500 })
    }

    // Actualizar el estado de la factura
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'PENDING',
        sentAt: new Date()
      }
    })

    // Crear notificación para el destinatario
    if (invoice.issuedToId) {
      await prisma.notification.create({
        data: {
          userId: invoice.issuedToId,
          type: 'INVOICE_RECEIVED',
          title: 'Factura enviada por email',
          message: `La factura ${invoice.number} ha sido enviada a tu email`,
          isRead: false
        }
      })
    }

    // Log de la operación
    console.log(`Invoice sent: ${invoice.number}, to: ${invoice.issuedTo?.email}`)

    return NextResponse.json({
      success: true,
      message: 'Factura enviada exitosamente',
      sentAt: updatedInvoice.sentAt
    })

  } catch (error) {
    console.error('Error sending invoice:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Función simulada para enviar emails de factura
async function sendInvoiceEmail(invoice: any) {
  // En producción, aquí integrarías con un servicio de email como SendGrid, SES, etc.
  
  console.log(`Sending invoice email:
    From: ${invoice.issuedBy.email}
    To: ${invoice.issuedTo?.email}
    Subject: Factura ${invoice.number}
    Amount: ${invoice.amount} ${invoice.currency}
  `)

  // Simular procesamiento
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simular una pequeña probabilidad de fallo
  if (Math.random() < 0.02) { // 2% de probabilidad de fallo
    return {
      success: false,
      error: 'Dirección de email no válida'
    }
  }

  return {
    success: true,
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
