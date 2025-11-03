

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// ============================================
// VALIDACIÓN DE VARIABLES DE ENTORNO CRÍTICAS
// ============================================
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET
const NEXTAUTH_URL = process.env.NEXTAUTH_URL

// Validar que NEXTAUTH_SECRET esté configurado
if (!NEXTAUTH_SECRET) {
  console.error('❌ ERROR CRÍTICO: NEXTAUTH_SECRET no está configurado')
  console.error('📝 Solución:')
  console.error('   1. En desarrollo: Crea un archivo .env en la raíz del proyecto')
  console.error('   2. En producción: Configura la variable en Vercel')
  console.error('   3. Genera un secret con: openssl rand -base64 32')
  console.error('   4. Consulta: configurar_vercel_paso_a_paso.md para instrucciones detalladas')
  
  // En desarrollo, usar un valor temporal (NUNCA en producción)
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Usando NEXTAUTH_SECRET temporal para desarrollo')
    console.warn('⚠️ NO USES ESTO EN PRODUCCIÓN')
  }
}

if (!NEXTAUTH_URL) {
  console.error('❌ ERROR: NEXTAUTH_URL no está configurado')
  console.error('📝 Debe ser: https://www.servicephere.com (en producción)')
  console.error('📝 O: http://localhost:3000 (en desarrollo)')
}

// ============================================
// CONFIGURACIÓN DE NEXTAUTH
// ============================================
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              clientProfile: true,
              providerProfile: true
            }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType,
            isVerified: user.isVerified
          } as any
        } catch (error) {
          console.error('Error en autorización:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.userType = token.userType as any
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  // Usar el NEXTAUTH_SECRET validado
  // En desarrollo, si no existe, NextAuth generará uno temporal con una advertencia
  secret: NEXTAUTH_SECRET || (process.env.NODE_ENV === 'development' ? 'development-secret-please-change-in-production' : undefined),
}
