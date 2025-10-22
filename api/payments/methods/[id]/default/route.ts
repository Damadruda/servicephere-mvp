
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params

    // En producción, aquí actualizarías el método por defecto
    const result = await setDefaultPaymentMethod(id, session.user.id)

    if (!result.success) {
      return NextResponse.json({ 
        error: 'Error al actualizar método por defecto' 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Método por defecto actualizado'
    })

  } catch (error) {
    console.error('Error setting default payment method:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

// Función simulada para establecer método por defecto
async function setDefaultPaymentMethod(methodId: string, userId: string) {
  // En producción, actualizarías en la base de datos
  await new Promise(resolve => setTimeout(resolve, 500))

  console.log(`Set default payment method ${methodId} for user ${userId}`)

  return {
    success: true
  }
}
