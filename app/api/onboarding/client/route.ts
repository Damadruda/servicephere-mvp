
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Update client profile with onboarding data
    await prisma.clientProfile.update({
      where: { userId: session.user.id },
      data: {
        // Store onboarding data as JSON in description field or create new fields
        description: JSON.stringify({
          assessmentComplete: true,
          onboardingData: body,
          completedAt: new Date().toISOString()
        })
      }
    })

    // Mark user as verified after completing onboarding
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isVerified: true }
    })

    return NextResponse.json(
      { message: 'Onboarding completed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Client onboarding error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
