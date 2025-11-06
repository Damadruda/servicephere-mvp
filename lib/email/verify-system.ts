// scripts/verify-system.ts
// Script para verificar el estado del sistema y diagnosticar problemas

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function verifySystem() {
  console.log('🔍 VERIFICACIÓN DEL SISTEMA SERVICEPHERE\n')
  console.log('='.'='.repeat(40))
  
  // 1. Verificar variables de entorno
  console.log('\n📋 VARIABLES DE ENTORNO:')
  console.log('------------------------')
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ NO configurada'}`)
  console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? '✅ Configurada' : '❌ NO configurada'}`)
  console.log(`NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Configurada' : '❌ NO configurada'}`)
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'No definido'}`)
  
  // 2. Verificar conexión a base de datos
  console.log('\n🗄️ CONEXIÓN A BASE DE DATOS:')
  console.log('----------------------------')
  try {
    await prisma.$connect()
    console.log('✅ Conexión exitosa')
    
    // Verificar tablas
    const userCount = await prisma.user.count()
    const clientCount = await prisma.clientProfile.count()
    const providerCount = await prisma.providerProfile.count()
    
    console.log(`\n📊 ESTADÍSTICAS:`)
    console.log(`  Usuarios totales: ${userCount}`)
    console.log(`  Perfiles de cliente: ${clientCount}`)
    console.log(`  Perfiles de proveedor: ${providerCount}`)
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error)
    console.log('\n🔧 SOLUCIÓN SUGERIDA:')
    console.log('1. Verifica que DATABASE_URL esté configurada correctamente')
    console.log('2. Ejecuta: npx prisma migrate deploy')
    console.log('3. Si es desarrollo local, ejecuta: npx prisma migrate dev')
    process.exit(1)
  }
  
  // 3. Crear usuario de prueba
  console.log('\n🧪 CREANDO USUARIO DE PRUEBA:')
  console.log('------------------------------')
  
  const testEmail = `test-${Date.now()}@servicephere.com`
  const testPassword = 'Test123456!'
  
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 12)
    
    // Crear usuario
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Usuario de Prueba',
        userType: 'CLIENT',
        isVerified: true
      }
    })
    
    console.log('✅ Usuario creado:', testUser.email)
    
    // Crear perfil de cliente
    const clientProfile = await prisma.clientProfile.create({
      data: {
        userId: testUser.id,
        companyName: 'Empresa de Prueba',
        industry: 'technology',
        country: 'México',
        city: 'Ciudad de México',
        companySize: 'Medium',
        contactName: 'Usuario de Prueba',
        contactTitle: 'CTO'
      }
    })
    
    console.log('✅ Perfil de cliente creado')
    
    // Verificar que se puede recuperar
    const foundUser = await prisma.user.findUnique({
      where: { email: testEmail },
      include: { clientProfile: true }
    })
    
    if (foundUser && foundUser.clientProfile) {
      console.log('✅ Usuario y perfil verificados correctamente')
      console.log('\n📝 CREDENCIALES DE PRUEBA:')
      console.log(`  Email: ${testEmail}`)
      console.log(`  Password: ${testPassword}`)
    } else {
      console.error('❌ Error: No se pudo recuperar el usuario creado')
    }
    
    // Limpiar usuario de prueba
    await prisma.clientProfile.delete({ where: { userId: testUser.id } })
    await prisma.user.delete({ where: { id: testUser.id } })
    console.log('✅ Usuario de prueba eliminado')
    
  } catch (error: any) {
    console.error('❌ Error creando usuario de prueba:', error.message)
    
    if (error.code === 'P2003') {
      console.log('\n🔧 PROBLEMA: Error de foreign key')
      console.log('SOLUCIÓN: Las tablas no están correctamente relacionadas')
      console.log('Ejecuta: npx prisma migrate reset --force')
    } else if (error.code === 'P2002') {
      console.log('\n🔧 PROBLEMA: Usuario duplicado')
    } else {
      console.log('\n🔧 PROBLEMA DESCONOCIDO')
      console.log('Revisa los logs de Prisma arriba')
    }
  }
  
  // 4. Verificar bcrypt
  console.log('\n🔐 VERIFICANDO BCRYPT:')
  console.log('---------------------')
  try {
    const testHash = await bcrypt.hash('test', 10)
    const isValid = await bcrypt.compare('test', testHash)
    if (isValid) {
      console.log('✅ Bcrypt funciona correctamente')
    } else {
      console.log('❌ Bcrypt no funciona correctamente')
    }
  } catch (error) {
    console.error('❌ Error con bcrypt:', error)
  }
  
  // Resumen final
  console.log('\n' + '='.repeat(50))
  console.log('📋 RESUMEN DE VERIFICACIÓN COMPLETADO')
  console.log('='.repeat(50))
  
  await prisma.$disconnect()
}

// Ejecutar verificación
verifySystem().catch((error) => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
