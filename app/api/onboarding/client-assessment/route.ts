
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get client profile with assessment data
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!clientProfile || !clientProfile.description) {
      return NextResponse.json(
        { message: 'No assessment data found' },
        { status: 404 }
      )
    }

    // Parse assessment data from description field
    let assessmentData = null
    try {
      const parsedDescription = JSON.parse(clientProfile.description)
      assessmentData = parsedDescription.onboardingData
    } catch (error) {
      // If description is not JSON, return null
      console.log('Description is not JSON, no assessment data available')
    }

    if (!assessmentData) {
      return NextResponse.json(
        { message: 'No assessment data found' },
        { status: 404 }
      )
    }

    // Format assessment data for project creation
    const formattedData = {
      // Basic client info
      companyName: clientProfile.companyName,
      industry: clientProfile.industry,
      country: clientProfile.country,
      city: clientProfile.city,
      companySize: clientProfile.companySize,
      
      // Assessment data
      implementationType: assessmentData.implementationType,
      sapExperience: assessmentData.sapExperience,
      currentSapModules: assessmentData.currentSapModules || [],
      interestedModules: assessmentData.interestedModules || [],
      cloudPreference: assessmentData.cloudPreference,
      businessProcesses: assessmentData.businessProcesses || [],
      complianceRequirements: assessmentData.complianceRequirements || [],
      integrationNeeds: assessmentData.integrationNeeds || [],
      projectTimeline: assessmentData.projectTimeline,
      budgetRange: assessmentData.budgetRange,
      teamAvailability: assessmentData.teamAvailability,
      successCriteria: assessmentData.successCriteria || [],
      primaryGoals: assessmentData.primaryGoals || [],
      painPoints: assessmentData.painPoints || [],
      
      // AI recommendations if available
      aiRecommendations: assessmentData.aiRecommendations
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching client assessment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
