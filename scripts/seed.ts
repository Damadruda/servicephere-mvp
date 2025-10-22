
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de usuarios de demo...')

  // Create test CLIENT user
  const clientPassword = bcrypt.hashSync('cliente123', 12)
  
  try {
    const testClient = await prisma.user.upsert({
      where: { email: 'cliente@demo.com' },
      update: {},
      create: {
        email: 'cliente@demo.com',
        password: clientPassword,
        name: 'Ana García',
        userType: 'CLIENT',
        clientProfile: {
          create: {
            companyName: 'Tecnología Avanzada S.A.',
            industry: 'Manufacturing',
            country: 'España',
            city: 'Madrid',
            description: 'Empresa manufacturera que necesita implementar SAP para optimizar sus procesos de producción y logística.',
            companySize: 'Large',
            contactName: 'Ana García',
            contactTitle: 'Directora de Tecnología'
          }
        }
      }
    })

    console.log('✅ Cliente de demo creado:', { email: testClient.email, name: testClient.name })

    // Create test PROVIDER user
    const providerPassword = bcrypt.hashSync('proveedor123', 12)
    
    const testProvider = await prisma.user.upsert({
      where: { email: 'proveedor@demo.com' },
      update: {},
      create: {
        email: 'proveedor@demo.com',
        password: providerPassword,
        name: 'Carlos Rodríguez',
        userType: 'PROVIDER',
        providerProfile: {
          create: {
            companyName: 'SAP Consultores Expertos',
            description: 'Consultor SAP certificado con más de 12 años de experiencia en implementaciones de S/4HANA, especializado en módulos FI, CO, MM y SD.',
            country: 'México',
            city: 'Ciudad de México',
            employeeCount: '11-50',
            foundedYear: 2012
          }
        }
      }
    })

    console.log('✅ Proveedor de demo creado:', { email: testProvider.email, name: testProvider.name })

    // Create admin user
    const adminPassword = bcrypt.hashSync('admin123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@sapmarketplace.com' },
      update: {},
      create: {
        email: 'admin@sapmarketplace.com',
        password: adminPassword,
        name: 'Admin Sistema',
        userType: 'ADMIN'
      }
    })

    console.log('✅ Usuario administrador creado:', { email: adminUser.email, name: adminUser.name })

    console.log('\n📋 CREDENCIALES DE DEMO:')
    console.log('==========================================')
    console.log('👤 CLIENTE:')
    console.log('   Email: cliente@demo.com')
    console.log('   Password: cliente123')
    console.log('   Empresa: Tecnología Avanzada S.A.')
    console.log('')
    console.log('🔧 PROVEEDOR:')
    console.log('   Email: proveedor@demo.com')
    console.log('   Password: proveedor123')
    console.log('   Empresa: SAP Consultores Expertos')
    console.log('')
    console.log('⚙️  ADMIN:')
    console.log('   Email: admin@sapmarketplace.com')
    console.log('   Password: admin123')
    console.log('==========================================')

  } catch (error) {
    console.error('❌ Error creando usuarios de demo:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
