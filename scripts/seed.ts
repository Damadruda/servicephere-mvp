
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Datos de prueba realistas
const SAP_MODULES = ['FI', 'CO', 'MM', 'SD', 'PP', 'QM', 'PM', 'HR', 'WM', 'PS']
const INDUSTRIES = ['Manufacturing', 'Retail', 'Healthcare', 'Finance', 'Energy', 'Logistics', 'Automotive', 'Technology']
const COUNTRIES = ['España', 'México', 'Colombia', 'Argentina', 'Chile', 'Perú']
const IMPLEMENTATION_TYPES = ['new', 'upgrade', 'migration', 'optimization'] as const

async function main() {
  console.log('🌱 Iniciando seed completo de la base de datos...\n')

  // ==========================================
  // 1. CREAR USUARIOS ADMINISTRADOR Y DEMO
  // ==========================================
  console.log('📋 Paso 1: Creando usuarios admin y demo...')

  const adminPassword = bcrypt.hashSync('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sapmarketplace.com' },
    update: {},
    create: {
      email: 'admin@sapmarketplace.com',
      password: adminPassword,
      name: 'Admin Sistema',
      userType: 'ADMIN',
      isVerified: true
    }
  })
  console.log('✅ Admin creado:', adminUser.email)

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
  console.log('✅ Cliente demo creado:', demoClient.email)

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
          description: 'Consultor SAP certificado con más de 12 años de experiencia en implementaciones de S/4HANA, especializado en módulos FI, CO, MM y SD.',
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
          phoneNumber: '+52 55 1234 5678',
          linkedinProfile: 'https://linkedin.com/in/carlos-rodriguez-sap'
        }
      }
    },
    include: {
      providerProfile: true
    }
  })
  console.log('✅ Proveedor demo creado:', demoProvider.email)

  // ==========================================
  // 2. CREAR CLIENTES ADICIONALES
  // ==========================================
  console.log('\n📋 Paso 2: Creando clientes adicionales...')

  const clientsData = [
    {
      name: 'María López',
      email: 'maria.lopez@techcorp.com',
      company: 'TechCorp Industries',
      industry: 'Technology',
      country: 'Colombia',
      city: 'Bogotá',
      size: 'Medium',
      title: 'CTO'
    },
    {
      name: 'Juan Martínez',
      email: 'juan.martinez@retailplus.com',
      company: 'RetailPlus S.A.',
      industry: 'Retail',
      country: 'Chile',
      city: 'Santiago',
      size: 'Large',
      title: 'Director de Sistemas'
    },
    {
      name: 'Laura Fernández',
      email: 'laura.fernandez@healthcorp.com',
      company: 'HealthCorp Medical',
      industry: 'Healthcare',
      country: 'Argentina',
      city: 'Buenos Aires',
      size: 'Enterprise',
      title: 'Gerente de IT'
    },
    {
      name: 'Roberto Sánchez',
      email: 'roberto.sanchez@autoparts.com',
      company: 'AutoParts Global',
      industry: 'Automotive',
      country: 'México',
      city: 'Monterrey',
      size: 'Large',
      title: 'VP de Tecnología'
    },
    {
      name: 'Patricia Torres',
      email: 'patricia.torres@logistics.com',
      company: 'Logistics Express',
      industry: 'Logistics',
      country: 'Perú',
      city: 'Lima',
      size: 'Medium',
      title: 'Directora de Operaciones'
    }
  ]

  const clients = []
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
      include: {
        clientProfile: true
      }
    })
    clients.push(user)
    console.log(`✅ Cliente creado: ${user.email}`)
  }

  // ==========================================
  // 3. CREAR PROVEEDORES ADICIONALES
  // ==========================================
  console.log('\n📋 Paso 3: Creando proveedores adicionales...')

  const providersData = [
    {
      name: 'Diego Ramírez',
      email: 'diego@sapexperts.com',
      company: 'SAP Experts International',
      country: 'España',
      city: 'Barcelona',
      employees: '51-200',
      founded: 2008,
      partnerLevel: 'PLATINUM' as const,
      specializations: ['S/4HANA', 'SAP Analytics Cloud', 'SAP Ariba'],
      rating: 4.9,
      projects: 78,
      reviews: 56
    },
    {
      name: 'Carmen Ruiz',
      email: 'carmen@consultingsap.com',
      company: 'Consulting SAP Solutions',
      country: 'México',
      city: 'Guadalajara',
      employees: '11-50',
      founded: 2015,
      partnerLevel: 'GOLD' as const,
      specializations: ['SAP ECC', 'SAP BW', 'SAP SuccessFactors'],
      rating: 4.6,
      projects: 34,
      reviews: 28
    },
    {
      name: 'Andrés Morales',
      email: 'andres@sapconsultores.com',
      company: 'SAP Consultores Andinos',
      country: 'Colombia',
      city: 'Medellín',
      employees: '11-50',
      founded: 2013,
      partnerLevel: 'SILVER' as const,
      specializations: ['SAP MM', 'SAP SD', 'SAP PP'],
      rating: 4.4,
      projects: 28,
      reviews: 21
    },
    {
      name: 'Sofía Vargas',
      email: 'sofia@s4partners.com',
      company: 'S/4 Partners LATAM',
      country: 'Chile',
      city: 'Valparaíso',
      employees: '51-200',
      founded: 2010,
      partnerLevel: 'PLATINUM' as const,
      specializations: ['S/4HANA', 'SAP Fiori', 'SAP HANA'],
      rating: 4.8,
      projects: 92,
      reviews: 67
    }
  ]

  const providers = [demoProvider] // Include demo provider
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
            phoneNumber: `+${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 9000000) + 1000000}`,
            linkedinProfile: `https://linkedin.com/in/${provider.name.toLowerCase().replace(' ', '-')}`
          }
        }
      },
      include: {
        providerProfile: true
      }
    })
    providers.push(user)
    console.log(`✅ Proveedor creado: ${user.email}`)
  }

  // ==========================================
  // 4. CREAR PORTFOLIO ITEMS PARA PROVEEDORES
  // ==========================================
  console.log('\n📋 Paso 4: Creando portfolio items...')

  for (const provider of providers) {
    if (!provider.providerProfile) continue

    const numItems = Math.floor(Math.random() * 3) + 2 // 2-4 items por proveedor

    for (let i = 0; i < numItems; i++) {
      const industry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)]
      const modules = SAP_MODULES.slice(0, Math.floor(Math.random() * 3) + 2)

      await prisma.portfolioItem.create({
        data: {
          providerId: provider.providerProfile.id,
          title: `Implementación SAP ${modules.join('/')} - ${industry}`,
          description: `Proyecto exitoso de implementación de módulos SAP ${modules.join(', ')} para empresa del sector ${industry}. Incluye análisis de procesos, configuración, migración de datos y capacitación de usuarios.`,
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
    }
    console.log(`✅ Portfolio items creados para ${provider.providerProfile.companyName}`)
  }

  // ==========================================
  // 5. CREAR PROYECTOS
  // ==========================================
  console.log('\n📋 Paso 5: Creando proyectos...')

  const allClients = [demoClient, ...clients]
  const projects = []

  const projectsData = [
    {
      title: 'Implementación SAP S/4HANA Finance y Controlling',
      modules: ['FI', 'CO'],
      type: 'new' as const,
      budget: 350000,
      timeline: 8,
      status: 'PUBLISHED' as const
    },
    {
      title: 'Migración de SAP ECC a S/4HANA completo',
      modules: ['FI', 'CO', 'MM', 'SD'],
      type: 'migration' as const,
      budget: 750000,
      timeline: 12,
      status: 'PUBLISHED' as const
    },
    {
      title: 'Implementación SAP MM y SD para distribución',
      modules: ['MM', 'SD'],
      type: 'new' as const,
      budget: 280000,
      timeline: 6,
      status: 'PUBLISHED' as const
    },
    {
      title: 'Optimización de procesos SAP PP y QM',
      modules: ['PP', 'QM'],
      type: 'optimization' as const,
      budget: 150000,
      timeline: 4,
      status: 'IN_PROGRESS' as const
    },
    {
      title: 'Upgrade SAP ECC 6.0 a ECC 7.0',
      modules: ['FI', 'CO', 'MM'],
      type: 'upgrade' as const,
      budget: 420000,
      timeline: 10,
      status: 'PUBLISHED' as const
    },
    {
      title: 'Implementación SAP SuccessFactors HCM',
      modules: ['HR'],
      type: 'new' as const,
      budget: 200000,
      timeline: 5,
      status: 'COMPLETED' as const
    }
  ]

  for (let i = 0; i < projectsData.length; i++) {
    const client = allClients[i % allClients.length]
    const projectData = projectsData[i]

    const project = await prisma.project.create({
      data: {
        clientId: client.id,
        title: projectData.title,
        description: `Proyecto de ${projectData.type} para implementar/optimizar los módulos SAP ${projectData.modules.join(', ')}. Incluye análisis de procesos, configuración del sistema, migración de datos, capacitación de usuarios y soporte post go-live.`,
        requirements: `- Experiencia comprobada en módulos ${projectData.modules.join(', ')}\n- Certificaciones SAP vigentes\n- Equipo con al menos ${Math.floor(Math.random() * 5) + 3} consultores\n- Referencias verificables de proyectos similares\n- Metodología SAP Activate\n- Disponibilidad inmediata`,
        implementationType: projectData.type,
        sapModules: projectData.modules,
        budget: projectData.budget,
        budgetCurrency: 'USD',
        timeline: projectData.timeline,
        timelineUnit: 'months',
        preferredStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: client.clientProfile?.city || 'Remote',
        isRemote: Math.random() > 0.5,
        requiresCertification: true,
        minimumTeamSize: Math.floor(Math.random() * 3) + 2,
        expectedDeliverables: [
          'Documento de análisis de procesos',
          'Configuración del sistema',
          'Migración de datos',
          'Documentación técnica y funcional',
          'Capacitación de usuarios clave',
          'Soporte post go-live (3 meses)'
        ],
        status: projectData.status,
        publishedAt: projectData.status !== 'DRAFT' ? new Date() : null,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
      }
    })
    projects.push(project)
    console.log(`✅ Proyecto creado: ${project.title}`)
  }

  // ==========================================
  // 6. CREAR COTIZACIONES
  // ==========================================
  console.log('\n📋 Paso 6: Creando cotizaciones...')

  for (const project of projects) {
    if (project.status !== 'PUBLISHED' && project.status !== 'IN_PROGRESS') continue

    const numQuotations = Math.floor(Math.random() * 3) + 2 // 2-4 cotizaciones por proyecto

    for (let i = 0; i < numQuotations && i < providers.length; i++) {
      const provider = providers[i]
      const basePrice = project.budget * (0.8 + Math.random() * 0.4) // ±20% del presupuesto

      const quotation = await prisma.quotation.create({
        data: {
          projectId: project.id,
          providerId: provider.id,
          coverLetter: `Estimado cliente,\n\nNos complace presentar nuestra propuesta para ${project.title}. Contamos con amplia experiencia en implementaciones similares y un equipo altamente calificado.\n\nNuestra propuesta incluye un enfoque integral que garantiza el éxito del proyecto dentro de los plazos establecidos.\n\nQuedamos atentos a sus comentarios.\n\nSaludos cordiales,\n${provider.name}`,
          proposedTimeline: project.timeline + Math.floor(Math.random() * 2),
          proposedStartDate: new Date(Date.now() + (Math.random() * 45 + 15) * 24 * 60 * 60 * 1000),
          teamSize: project.minimumTeamSize + Math.floor(Math.random() * 3),
          methodology: 'SAP Activate',
          totalCost: basePrice,
          currency: 'USD',
          paymentTerms: '30% inicio, 40% durante implementación, 30% go-live',
          status: i === 0 && project.status === 'IN_PROGRESS' ? 'ACCEPTED' : 'PENDING',
          submittedAt: new Date(project.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      })
      console.log(`✅ Cotización creada para proyecto: ${project.title.substring(0, 40)}...`)
    }
  }

  // ==========================================
  // 7. CREAR REVIEWS
  // ==========================================
  console.log('\n📋 Paso 7: Creando reviews...')

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i]
    const numReviews = Math.floor(Math.random() * 4) + 2 // 2-5 reviews por proveedor

    for (let j = 0; j < numReviews && j < allClients.length; j++) {
      const client = allClients[j]
      const rating = Math.floor(Math.random() * 2) + 4 // 4-5 estrellas

      const comments = [
        'Excelente trabajo, muy profesionales y cumplieron con todos los plazos establecidos.',
        'Gran experiencia trabajando con este equipo. Altamente recomendados.',
        'Superaron nuestras expectativas. El proyecto fue un éxito total.',
        'Muy contentos con los resultados. Equipo altamente capacitado.',
        'Profesionales comprometidos con la calidad. Volveríamos a trabajar con ellos.'
      ]

      await prisma.review.create({
        data: {
          reviewerId: client.id,
          targetId: provider.id,
          rating,
          comment: comments[Math.floor(Math.random() * comments.length)],
          qualityRating: rating,
          timelinessRating: Math.min(5, rating + Math.floor(Math.random() * 2)),
          communicationRating: rating,
          professionalismRating: Math.min(5, rating + Math.floor(Math.random() * 2)),
          wouldRecommend: rating >= 4,
          isVerified: true,
          createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
        }
      })
    }
    console.log(`✅ Reviews creadas para ${provider.providerProfile?.companyName}`)
  }

  // ==========================================
  // RESUMEN FINAL
  // ==========================================
  console.log('\n' + '='.repeat(60))
  console.log('🎉 SEED COMPLETADO EXITOSAMENTE')
  console.log('='.repeat(60))
  console.log('\n📊 ESTADÍSTICAS:')
  console.log(`   👥 Usuarios totales: ${allClients.length + providers.length + 1}`)
  console.log(`   🏢 Clientes: ${allClients.length}`)
  console.log(`   🔧 Proveedores: ${providers.length}`)
  console.log(`   📁 Proyectos: ${projects.length}`)
  console.log(`   💰 Cotizaciones: ~${projects.filter(p => p.status === 'PUBLISHED').length * 3}`)
  console.log(`   📝 Portfolio Items: ~${providers.length * 3}`)
  console.log(`   ⭐ Reviews: ~${providers.length * 3}`)

  console.log('\n' + '='.repeat(60))
  console.log('🔑 CREDENCIALES DE ACCESO')
  console.log('='.repeat(60))
  console.log('\n⚙️  ADMINISTRADOR:')
  console.log('   Email: admin@sapmarketplace.com')
  console.log('   Password: admin123')

  console.log('\n👤 CLIENTE DEMO:')
  console.log('   Email: cliente@demo.com')
  console.log('   Password: cliente123')
  console.log('   Empresa: Tecnología Avanzada S.A.')

  console.log('\n🔧 PROVEEDOR DEMO:')
  console.log('   Email: proveedor@demo.com')
  console.log('   Password: proveedor123')
  console.log('   Empresa: SAP Consultores Expertos')

  console.log('\n📋 USUARIOS ADICIONALES:')
  console.log('   Todos los demás usuarios tienen password: password123')
  console.log('   Emails: maria.lopez@techcorp.com, juan.martinez@retailplus.com, etc.')

  console.log('\n' + '='.repeat(60))
  console.log('✅ Base de datos lista para QA y testing')
  console.log('='.repeat(60) + '\n')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
