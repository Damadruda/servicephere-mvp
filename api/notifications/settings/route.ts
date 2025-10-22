
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, settings } = body

    // Verificar que el userId coincida con la sesión
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })
    }

    // For now, we'll store notification settings in a JSON field on the user
    // In production, you might want a separate NotificationSettings model
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        // You'll need to add a notificationSettings JSON field to the User model
        // notificationSettings: settings
      }
    })

    return NextResponse.json({ 
      success: true, 
      settings 
    })

  } catch (error) {
    console.error('Error updating notification settings:', error)
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
    const userId = searchParams.get('userId')

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })
    }

    // Default settings
    const defaultSettings = {
      email: true,
      push: true,
      sms: false,
      desktop: true,
      sound: true,
      vibration: true
    }

    return NextResponse.json({ settings: defaultSettings })

  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}
