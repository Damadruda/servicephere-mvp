
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contractId')

    // In production, you would fetch boards from the database
    const mockBoards = [
      {
        id: '1',
        title: 'Arquitectura SAP S/4HANA',
        contractId: contractId || 'contract1',
        type: 'whiteboard',
        lastModified: new Date(),
        collaborators: ['Juan Pérez', 'María González'],
        content: {
          elements: [],
          comments: []
        }
      }
    ]

    return NextResponse.json({ boards: mockBoards })

  } catch (error) {
    console.error('Error fetching collaboration boards:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, type, contractId } = body

    // In production, you would create the board in the database
    const newBoard = {
      id: `board_${Date.now()}`,
      title,
      type,
      contractId,
      createdBy: session.user.id,
      createdAt: new Date(),
      lastModified: new Date(),
      collaborators: [session.user.name],
      content: {
        elements: [],
        comments: []
      }
    }

    return NextResponse.json({ 
      success: true, 
      board: newBoard 
    })

  } catch (error) {
    console.error('Error creating collaboration board:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
