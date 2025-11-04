
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Lazy initialization de PrismaClient para evitar ejecución en build time
let prisma: PrismaClient | null = null

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const userType = searchParams.get('userType')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      isActive: true
    }

    if (category && category !== 'ALL') {
      where.category = category
    }

    if (userType && userType !== 'ALL') {
      where.userType = userType
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: search.toLowerCase().split(/\s+/) } }
      ]
    }

    const knowledge = await getPrismaClient().sAPKnowledge.findMany({
      where,
      take: limit,
      orderBy: [
        { helpfulVotes: 'desc' },
        { viewCount: 'desc' },
        { lastUpdated: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      knowledge,
      count: knowledge.length
    })

  } catch (error) {
    console.error('Error fetching knowledge:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error obteniendo conocimientos' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo administradores pueden crear conocimiento
    const user = await getPrismaClient().user.findUnique({
      where: { id: session.user.id }
    })

    if (user?.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const { 
      title, 
      content, 
      category, 
      tags, 
      sapModules, 
      difficulty, 
      userType 
    } = await request.json()

    const knowledge = await getPrismaClient().sAPKnowledge.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        sapModules: sapModules || [],
        difficulty: difficulty || 'BEGINNER',
        userType: userType || 'CLIENT'
      }
    })

    return NextResponse.json({
      success: true,
      knowledge
    })

  } catch (error) {
    console.error('Error creating knowledge:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error creando conocimiento' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { knowledgeId, vote } = await request.json()

    if (vote === 'helpful') {
      await getPrismaClient().sAPKnowledge.update({
        where: { id: knowledgeId },
        data: { 
          helpfulVotes: { increment: 1 },
          viewCount: { increment: 1 }
        }
      })
    } else if (vote === 'unhelpful') {
      await getPrismaClient().sAPKnowledge.update({
        where: { id: knowledgeId },
        data: { 
          unhelpfulVotes: { increment: 1 },
          viewCount: { increment: 1 }
        }
      })
    } else {
      // Solo incrementar view count
      await getPrismaClient().sAPKnowledge.update({
        where: { id: knowledgeId },
        data: { viewCount: { increment: 1 } }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Voto registrado'
    })

  } catch (error) {
    console.error('Error updating knowledge vote:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error registrando voto' 
    }, { status: 500 })
  }
}
