
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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
        issuedBy: { 
          select: { name: true, email: true, userType: true } 
        },
        issuedTo: { 
          select: { name: true, email: true } 
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
    }

    // Verificar que el usuario tiene permisos para descargar esta factura
    if (invoice.issuedById !== session.user.id && 
        invoice.issuedToId !== session.user.id &&
        (session.user as any).userType !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Sin permisos para descargar esta factura' 
      }, { status: 403 })
    }

    // En producción, aquí generarías un PDF real
    const pdfData = await generateInvoicePDF(invoice)

    // Crear response con el PDF
    const response = new NextResponse(pdfData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="factura-${invoice.number}.pdf"`
      }
    })

    // Log de la operación
    console.log(`Invoice downloaded: ${invoice.number} by user ${session.user.id}`)

    return response

  } catch (error) {
    console.error('Error downloading invoice:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Función simulada para generar PDF de factura
async function generateInvoicePDF(invoice: any) {
  // En producción, usarías una librería como Puppeteer, jsPDF, etc.
  
  // Simular generación de PDF
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Crear un PDF mock (en realidad sería contenido binario real)
  const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 24 Tf
100 700 Td
(Factura ${invoice.number}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
398
%%EOF
`

  return Buffer.from(pdfContent)
}
