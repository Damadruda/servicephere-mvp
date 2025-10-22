
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Función para conectar y verificar la conexión
export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Conectado a la base de datos exitosamente')
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error)
    throw error
  }
}

// Función para desconectar
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    console.log('✅ Desconectado de la base de datos')
  } catch (error) {
    console.error('❌ Error desconectando de la base de datos:', error)
  }
}

export default prisma
