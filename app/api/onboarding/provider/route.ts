
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Crear o actualizar el perfil del proveedor
    const provider = await prisma.providerProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName: data.companyName,
        description: data.description,
        country: data.country,
        city: data.city,
        website: data.website || null,
        employeeCount: data.employeeCount || '11-50',
        foundedYear: data.foundedYear || new Date().getFullYear(),
        contactName: data.contactName,
        contactTitle: data.contactTitle || '',
        phoneNumber: data.phoneNumber || null,
        linkedinProfile: data.linkedinProfile || null,
        partnerLevel: data.sapPartnerLevel || null,
        sapSpecializations: data.specializations,
        targetIndustries: data.industries,
        verified: false,
        approvalStatus: 'PENDING'
      },
      update: {
        companyName: data.companyName,
        description: data.description,
        country: data.country,
        city: data.city,
        website: data.website || null,
        employeeCount: data.employeeCount || '11-50',
        foundedYear: data.foundedYear || new Date().getFullYear(),
        contactName: data.contactName,
        contactTitle: data.contactTitle || '',
        phoneNumber: data.phoneNumber || null,
        linkedinProfile: data.linkedinProfile || null,
        partnerLevel: data.sapPartnerLevel || null,
        sapSpecializations: data.specializations,
        targetIndustries: data.industries,
        approvalStatus: 'PENDING'
      }
    })

    // Crear/actualizar certificaciones
    if (data.certifications && data.certifications.length > 0) {
      // Eliminar certificaciones existentes
      await prisma.certification.deleteMany({
        where: { providerId: provider.id }
      })
      
      // Crear nuevas certificaciones
      await prisma.certification.createMany({
        data: data.certifications.map((cert: any) => ({
          providerId: provider.id,
          module: cert.module,
          level: cert.level,
          consultant: cert.consultant,
          certificationNumber: cert.certificationNumber || null,
          verified: false // Se verificará posteriormente
        }))
      })
    }

    // Crear/actualizar portfolio
    if (data.portfolioProjects && data.portfolioProjects.length > 0) {
      // Eliminar proyectos existentes
      await prisma.portfolioItem.deleteMany({
        where: { providerId: provider.id }
      })
      
      // Crear nuevos proyectos
      await prisma.portfolioItem.createMany({
        data: data.portfolioProjects.map((project: any) => ({
          providerId: provider.id,
          title: project.title,
          description: project.description,
          clientName: project.client || null,
          modules: project.modules || [],
          duration: project.duration || null,
          teamSize: project.teamSize || null,
          budget: project.budget || null,
          results: project.results || null,
          completedYear: project.completedYear || new Date().getFullYear(),
          verified: false
        }))
      })
    }

    // Actualizar el tipo de usuario si es necesario
    await prisma.user.update({
      where: { id: session.user.id },
      data: { userType: 'PROVIDER' }
    })

    // TODO: Enviar email de confirmación
    // TODO: Iniciar proceso de verificación automática

    return NextResponse.json({
      message: 'Onboarding completado exitosamente',
      providerId: provider.id,
      approvalStatus: 'PENDING'
    }, { status: 201 })

  } catch (error) {
    console.error('Error en onboarding:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const provider = await prisma.providerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        certifications: true,
        portfolioItems: true
      }
    })

    return NextResponse.json({
      provider,
      onboardingCompleted: !!provider,
      approvalStatus: provider?.approvalStatus || 'NOT_STARTED'
    })

  } catch (error) {
    console.error('Error obteniendo estado de onboarding:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
