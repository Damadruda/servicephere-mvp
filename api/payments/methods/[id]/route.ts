
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params

    // En producción, aquí eliminarías el método de pago del procesador
    const result = await removePaymentMethod(id)

    if (!result.success) {
      return NextResponse.json({ 
        error: 'Error al eliminar método de pago' 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Método de pago eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error removing payment method:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Función simulada para eliminar métodos de pago
async function removePaymentMethod(methodId: string) {
  // En producción, aquí integrarías con tu procesador de pagos
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    success: true
  }
}
