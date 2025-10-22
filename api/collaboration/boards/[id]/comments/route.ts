
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

    // In production, fetch comments from database
    const mockComments = [
      {
        id: '1',
        boardId: id,
        userId: session.user.id,
        userName: session.user.name,
        content: '¿Podríamos revisar esta parte del diagrama?',
        position: { x: 200, y: 150 },
        createdAt: new Date(),
        isResolved: false,
        replies: []
      }
    ]

    return NextResponse.json({ comments: mockComments })

  } catch (error) {
    console.error('Error fetching board comments:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { content, position } = body

    // In production, save comment to database
    const newComment = {
      id: `comment_${Date.now()}`,
      boardId: id,
      userId: session.user.id,
      userName: session.user.name,
      content,
      position,
      createdAt: new Date(),
      isResolved: false,
      replies: []
    }

    return NextResponse.json({ 
      success: true, 
      comment: newComment 
    })

  } catch (error) {
    console.error('Error creating board comment:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
