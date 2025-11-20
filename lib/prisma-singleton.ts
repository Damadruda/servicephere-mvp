// lib/prisma-singleton.ts
// SOLUCIÓN: Singleton pattern para Prisma que funciona en Vercel

import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  // PERFORMANCE FIX: Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [PRISMA] Inicializando cliente de base de datos...')
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  // Verificar conexión
  client.$connect()
    .then(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [PRISMA] Conexión a base de datos establecida')
      }
    })
    .catch((error) => {
      console.error('❌ [PRISMA] Error conectando a la base de datos:', error)
      throw error
    })

  return client
}

// Usar singleton en todos los entornos
const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Exportar instancia única
export { prisma }

// Función helper para verificar conexión
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Database connection check failed:', error)
    }
    return false
  }
}
