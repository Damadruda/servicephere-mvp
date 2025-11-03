import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// ============================================
// CONFIGURACIÓN DE NEXTAUTH
// ============================================
// Sistema de autenticación completo con NextAuth.js
// Usa JWT para sesiones y bcrypt para contraseñas

export const authOptions: NextAuthOptions = {
  // Configuración de debugging (solo en desarrollo)
  debug: process.env.NODE_ENV === 'development',
  
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 [AUTH] Iniciando proceso de autorización...')
        
        // Validar que existen las credenciales
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ [AUTH] Credenciales faltantes')
          throw new Error('Email y contraseña son requeridos')
        }

        try {
          // Buscar usuario en la base de datos
          console.log('🔍 [AUTH] Buscando usuario:', credentials.email)
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              clientProfile: true,
              providerProfile: true
            }
          })

          if (!user) {
            console.error('❌ [AUTH] Usuario no encontrado')
            throw new Error('Credenciales inválidas')
          }

          console.log('✅ [AUTH] Usuario encontrado:', user.email)

          // Verificar contraseña
          console.log('🔑 [AUTH] Verificando contraseña...')
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.error('❌ [AUTH] Contraseña inválida')
            throw new Error('Credenciales inválidas')
          }

          console.log('✅ [AUTH] Contraseña válida')
          console.log('✅ [AUTH] Autorización exitosa para:', user.email)

          // Retornar datos del usuario para la sesión
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType,
            isVerified: user.isVerified
          } as any
        } catch (error) {
          console.error('❌ [AUTH] Error en autorización:', error)
          // Re-lanzar el error para que NextAuth lo maneje
          if (error instanceof Error) {
            throw error
          }
          throw new Error('Error en el proceso de autenticación')
        }
      }
    })
  ],
  
  // Configuración de sesión
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  // Configuración de JWT
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  // Callbacks para manejar JWT y sesión
  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log('🎫 [JWT] Callback ejecutado, trigger:', trigger)
      
      // En el primer login, agregar datos del usuario al token
      if (user) {
        console.log('📝 [JWT] Agregando datos de usuario al token')
        token.id = user.id
        token.userType = user.userType
        token.isVerified = user.isVerified
      }
      
      return token
    },
    
    async session({ session, token }) {
      console.log('👤 [SESSION] Callback ejecutado')
      
      // Agregar datos del token a la sesión
      if (session.user && token) {
        session.user.id = token.id as string || token.sub!
        session.user.userType = token.userType as any
        session.user.isVerified = token.isVerified as boolean
        
        console.log('✅ [SESSION] Sesión creada para:', session.user.email)
      }
      
      return session
    },
    
    async redirect({ url, baseUrl }) {
      console.log('🔀 [REDIRECT] url:', url, 'baseUrl:', baseUrl)
      
      // Permitir redirecciones a rutas relativas
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Permitir redirecciones al mismo dominio
      else if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    }
  },
  
  // Páginas personalizadas
  pages: {
    signIn: '/login',
    error: '/login', // En caso de error, redirigir al login
  },
  
  // Secret (CRÍTICO para producción)
  secret: process.env.NEXTAUTH_SECRET,
  
  // Configuración de cookies
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  
  // Eventos para logging
  events: {
    async signIn({ user }) {
      console.log('✅ [EVENT] Usuario inició sesión:', user.email)
    },
    async signOut({ token }) {
      console.log('👋 [EVENT] Usuario cerró sesión:', token?.email)
    },
    async session({ session }) {
      console.log('🔄 [EVENT] Sesión verificada:', session.user?.email)
    }
  }
}
