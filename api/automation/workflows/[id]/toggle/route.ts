
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
    const body = await request.json()
    const { isActive } = body

    // In production, you would:
    // 1. Verify the user owns this workflow
    // 2. Update the workflow in the database
    // 3. Enable/disable the actual automation logic

    // For now, we'll just simulate the response
    console.log(`Workflow ${id} ${isActive ? 'activated' : 'deactivated'} by user ${session.user.id}`)

    return NextResponse.json({ 
      success: true, 
      workflowId: id,
      isActive 
    })

  } catch (error) {
    console.error('Error toggling workflow:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
