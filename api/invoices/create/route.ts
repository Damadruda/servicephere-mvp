
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

    const body = await request.json()
    const { 
      userId,
      clientId,
      escrowTransactionId,
      amount,
      currency = 'USD',
      description,
      items = [],
      dueDate,
      notes,
      isDraft = false
    } = body

    // Verificar que el userId coincida con la sesión
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })
    }

    // Generar número de factura único
    const currentYear = new Date().getFullYear()
    const invoiceCount = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`)
        }
      }
    })
    const invoiceNumber = `INV-${currentYear}-${(invoiceCount + 1).toString().padStart(3, '0')}`

    // Calcular subtotal y impuestos
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0) || amount
    const taxRate = 0.1 // 10% tax rate (ajustar según regulaciones locales)
    const taxAmount = subtotal * taxRate
    const totalAmount = subtotal + taxAmount

    // Crear la factura
    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        status: isDraft ? 'DRAFT' : 'PENDING',
        amount: totalAmount,
        currency: currency,
        subtotal: subtotal,
        taxAmount: taxAmount,
        description: description || 'Servicios profesionales SAP',
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días por defecto
        notes: notes,
        issuedById: userId,
        issuedToId: clientId,
        escrowTransactionId: escrowTransactionId || null,
        items: items.length > 0 ? JSON.stringify(items) : null
      }
    })

    // Si no es borrador, crear notificación para el cliente
    if (!isDraft && clientId) {
      await prisma.notification.create({
        data: {
          userId: clientId,
          type: 'INVOICE_RECEIVED',
          title: 'Nueva factura recibida',
          message: `Has recibido la factura ${invoiceNumber} por ${totalAmount} ${currency}`,
          isRead: false
        }
      })
    }

    // Log de la operación
    console.log(`Invoice created: ${invoiceNumber}, amount: ${totalAmount} ${currency}`)

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        amount: invoice.amount,
        currency: invoice.currency,
        dueDate: invoice.dueDate,
        createdAt: invoice.createdAt
      }
    })

  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
