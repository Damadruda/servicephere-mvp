import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Datos de prueba realistas
const SAP_MODULES = ['FI', 'CO', 'MM', 'SD', 'PP', 'QM', 'PM', 'HR', 'WM', 'PS']
const INDUSTRIES = ['Manufacturing', 'Retail', 'Healthcare', 'Finance', 'Energy', 'Logistics', 'Automotive', 'Technology']

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación de admin
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado. Debe iniciar sesión.' },
        { status: 401 }
      )
    }

    // Verificar que el usuario es admin
    const userType = session.user.userType as string
    if (userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado. Solo administradores pueden ejecutar el seed.' },
        { status: 403 }
      )
    }

    const results = {
      users: 0,
      clients: 0,
      providers: 0,
      portfolioItems: 0,
      projects: 0,
      quotations: 0,
      reviews: 0
    }

    // 1. CREAR USUARIOS ADMINISTRADOR Y DEMO
    const adminPassword = bcrypt.hashSync('admin123', 12)
    await prisma.user.upsert({
      where: { email: 'admin@servicephere.com' },
      update: {},
      create: {
        email: 'admin@servicephere.com',
        password: adminPassword,
        name: 'Admin Sistema',
        userType: 'ADMIN',
        isVerified: true
      }
    })
    results.users++

    // Cliente demo básico
    const clientPassword = bcrypt.hashSync('cliente123', 12)
    const demoClient = await prisma.user.upsert({
      where: { email: 'cliente@demo.com' },
      update: {},
      create: {
        email: 'cliente@demo.com',
        password: clientPassword,
        name: 'Ana García',
        userType: 'CLIENT',
        isVerified: true,
        clientProfile: {
          create: {
            companyName: 'Tecnología Avanzada S.A.',
            industry: 'Manufacturing',
            country: 'España',
            city: 'Madrid',
            description: 'Empresa manufacturera que necesita implementar SAP para optimizar sus procesos de producción y logística.',
            companySize: 'Large',
            contactName: 'Ana García',
            contactTitle: 'Directora de Tecnología',
            phoneNumber: '+34 91 123 4567'
          }
        }
      }
    })
    results.users++
    results.clients++

    // Proveedor demo básico
    const providerPassword = bcrypt.hashSync('proveedor123', 12)
    const demoProvider = await prisma.user.upsert({
      where: { email: 'proveedor@demo.com' },
      update: {},
      create: {
        email: 'proveedor@demo.com',
        password: providerPassword,
        name: 'Carlos Rodríguez',
        userType: 'PROVIDER',
        isVerified: true,
        providerProfile: {
          create: {
            companyName: 'SAP Consultores Expertos',
            description: 'Consultor SAP certificado con más de 12 años de experiencia en implementaciones de S/4HANA.',
            country: 'México',
            city: 'Ciudad de México',
            employeeCount: '11-50',
            foundedYear: 2012,
            isPartner: true,
            partnerLevel: 'GOLD',
            verified: true,
            approvalStatus: 'APPROVED',
            sapSpecializations: ['S/4HANA', 'SAP ECC', 'SAP BW'],
            targetIndustries: ['Manufacturing', 'Retail', 'Logistics'],
            averageRating: 4.7,
            totalProjects: 45,
            totalReviews: 32,
            contactName: 'Carlos Rodríguez',
            contactTitle: 'Director de Consultoría',
            phoneNumber: '+52 55 1234 5678'
          }
        }
      },
      include: { providerProfile: true }
    })
    results.users++
    results.providers++

    // 2. CREAR CLIENTES ADICIONALES
    const clientsData = [
      { name: 'María López', email: 'maria.lopez@techcorp.com', company: 'TechCorp Industries', industry: 'Technology', country: 'Colombia', city: 'Bogotá', size: 'Medium', title: 'CTO' },
      { name: 'Juan Martínez', email: 'juan.martinez@retailplus.com', company: 'RetailPlus S.A.', industry: 'Retail', country: 'Chile', city: 'Santiago', size: 'Large', title: 'Director de Sistemas' },
      { name: 'Laura Fernández', email: 'laura.fernandez@healthcorp.com', company: 'HealthCorp Medical', industry: 'Healthcare', country: 'Argentina', city: 'Buenos Aires', size: 'Enterprise', title: 'Gerente de IT' }
    ]

    const clients = [demoClient]
    for (const client of clientsData) {
      const password = bcrypt.hashSync('password123', 12)
      const user = await prisma.user.upsert({
        where: { email: client.email },
        update: {},
        create: {
          email: client.email,
          password,
          name: client.name,
          userType: 'CLIENT',
          isVerified: true,
          clientProfile: {
            create: {
              companyName: client.company,
              industry: client.industry,
              country: client.country,
              city: client.city,
              companySize: client.size,
              contactName: client.name,
              contactTitle: client.title,
              description: `Empresa líder en el sector ${client.industry} buscando optimizar procesos con SAP.`,
              phoneNumber: `+${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 9000000) + 1000000}`
            }
          }
        },
        include: { clientProfile: true }
      })
      clients.push(user)
      results.users++
      results.clients++
    }

    // 3. CREAR PROVEEDORES ADICIONALES
    const providersData = [
      { name: 'Diego Ramírez', email: 'diego@sapexperts.com', company: 'SAP Experts International', country: 'España', city: 'Barcelona', employees: '51-200', founded: 2008, partnerLevel: 'PLATINUM' as const, specializations: ['S/4HANA', 'SAP Analytics Cloud'], rating: 4.9, projects: 78, reviews: 56 },
      { name: 'Carmen Ruiz', email: 'carmen@consultingsap.com', company: 'Consulting SAP Solutions', country: 'México', city: 'Guadalajara', employees: '11-50', founded: 2015, partnerLevel: 'GOLD' as const, specializations: ['SAP ECC', 'SAP BW'], rating: 4.6, projects: 34, reviews: 28 }
    ]

    const providers = [demoProvider]
    for (const provider of providersData) {
      const password = bcrypt.hashSync('password123', 12)
      const user = await prisma.user.upsert({
        where: { email: provider.email },
        update: {},
        create: {
          email: provider.email,
          password,
          name: provider.name,
          userType: 'PROVIDER',
          isVerified: true,
          providerProfile: {
            create: {
              companyName: provider.company,
              description: `Consultoría SAP especializada con amplia experiencia en ${provider.specializations.join(', ')}.`,
              country: provider.country,
              city: provider.city,
              employeeCount: provider.employees,
              foundedYear: provider.founded,
              isPartner: true,
              partnerLevel: provider.partnerLevel,
              verified: true,
              approvalStatus: 'APPROVED',
              sapSpecializations: provider.specializations,
              targetIndustries: INDUSTRIES.slice(0, 3),
              averageRating: provider.rating,
              totalProjects: provider.projects,
              totalReviews: provider.reviews,
              contactName: provider.name,
              contactTitle: 'Director General',
              phoneNumber: `+${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 9000000) + 1000000}`
            }
          }
        },
        include: { providerProfile: true }
      })
      providers.push(user)
      results.users++
      results.providers++
    }

    // 4. CREAR PORTFOLIO ITEMS
    for (const provider of providers) {
      if (!provider.providerProfile) continue

      const numItems = 2
      for (let i = 0; i < numItems; i++) {
        const industry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)]
        const modules = SAP_MODULES.slice(0, Math.floor(Math.random() * 3) + 2)

        await prisma.portfolioItem.create({
          data: {
            providerId: provider.providerProfile.id,
            title: `Implementación SAP ${modules.join('/')} - ${industry}`,
            description: `Proyecto exitoso de implementación de módulos SAP ${modules.join(', ')} para empresa del sector ${industry}.`,
            industry,
            sapModules: modules,
            projectValue: Math.floor(Math.random() * 400000) + 100000,
            duration: `${Math.floor(Math.random() * 10) + 3} meses`,
            methodology: 'SAP Activate',
            teamSize: `${Math.floor(Math.random() * 8) + 3} personas`,
            clientTestimonial: 'Excelente trabajo, superó nuestras expectativas en tiempo y calidad.',
            startDate: new Date(2022, Math.floor(Math.random() * 12), 1),
            endDate: new Date(2023, Math.floor(Math.random() * 12), 1),
            isPublic: true
          }
        })
        results.portfolioItems++
      }
    }

    // 5. CREAR PROYECTOS
    const projectsData = [
      { title: 'Implementación SAP S/4HANA Finance', modules: ['FI', 'CO'], type: 'new' as const, budget: 350000, timeline: 8, status: 'PUBLISHED' as const },
      { title: 'Migración SAP ECC a S/4HANA', modules: ['FI', 'CO', 'MM', 'SD'], type: 'migration' as const, budget: 750000, timeline: 12, status: 'PUBLISHED' as const },
      { title: 'Implementación SAP MM y SD', modules: ['MM', 'SD'], type: 'new' as const, budget: 280000, timeline: 6, status: 'PUBLISHED' as const }
    ]

    const projects = []
    for (let i = 0; i < projectsData.length; i++) {
      const client = clients[i % clients.length]
      const projectData = projectsData[i]

      const project = await prisma.project.create({
        data: {
          clientId: client.id,
          title: projectData.title,
          description: `Proyecto de ${projectData.type} para implementar los módulos SAP ${projectData.modules.join(', ')}.`,
          requirements: `- Experiencia en módulos ${projectData.modules.join(', ')}\n- Certificaciones SAP vigentes\n- Metodología SAP Activate`,
          implementationType: projectData.type,
          sapModules: projectData.modules,
          budget: projectData.budget,
          budgetCurrency: 'USD',
          timeline: projectData.timeline,
          timelineUnit: 'months',
          preferredStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          location: client.clientProfile?.city || 'Remote',
          isRemote: true,
          requiresCertification: true,
          minimumTeamSize: 3,
          expectedDeliverables: ['Análisis de procesos', 'Configuración', 'Migración de datos', 'Capacitación'],
          status: projectData.status,
          publishedAt: new Date(),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      })
      projects.push(project)
      results.projects++
    }

    // 6. CREAR COTIZACIONES
    for (const project of projects) {
      for (let i = 0; i < Math.min(2, providers.length); i++) {
        const provider = providers[i]
        const basePrice = project.budget * (0.9 + Math.random() * 0.2)

        await prisma.quotation.create({
          data: {
            projectId: project.id,
            providerId: provider.id,
            coverLetter: `Estimado cliente, nos complace presentar nuestra propuesta para ${project.title}.`,
            proposedTimeline: project.timeline,
            proposedStartDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            teamSize: project.minimumTeamSize + 1,
            methodology: 'SAP Activate',
            totalCost: basePrice,
            currency: 'USD',
            paymentTerms: '30% inicio, 40% implementación, 30% go-live',
            status: 'PENDING',
            submittedAt: new Date()
          }
        })
        results.quotations++
      }
    }

    // 7. CREAR REVIEWS
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i]
      for (let j = 0; j < 2 && j < clients.length; j++) {
        const client = clients[j]
        const rating = Math.floor(Math.random() * 2) + 4

        await prisma.review.create({
          data: {
            reviewerId: client.id,
            targetId: provider.id,
            rating,
            comment: 'Excelente trabajo, muy profesionales y cumplieron con todos los plazos.',
            qualityRating: rating,
            timelinessRating: rating,
            communicationRating: rating,
            professionalismRating: rating,
            wouldRecommend: true,
            isVerified: true,
            createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
          }
        })
        results.reviews++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Base de datos poblada exitosamente',
      results,
      credentials: {
        admin: { email: 'admin@servicephere.com', password: 'admin123' },
        client: { email: 'cliente@demo.com', password: 'cliente123' },
        provider: { email: 'proveedor@demo.com', password: 'proveedor123' },
        others: 'password123'
      }
    })

  } catch (error) {
    console.error('Error en seed:', error)
    return NextResponse.json(
      { error: 'Error al poblar la base de datos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
