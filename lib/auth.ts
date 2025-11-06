import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

/**
 * ============================================
 * CONFIGURACIÓN DE NEXTAUTH
 * ============================================
 * 
 * COMPREHENSIVE FIX - November 2024
 * 
 * Sistema de autenticación completo con NextAuth.js
 * - Usa JWT para sesiones (sin base de datos de sesiones)
 * - Usa bcrypt para hash de contraseñas
 * - Soporta dominios personalizados y despliegues de Vercel
 * - Configuración segura para producción
 * 
 * VARIABLES DE ENTORNO REQUERIDAS:
 * - NEXTAUTH_SECRET: Clave secreta para firmar tokens (mínimo 32 caracteres)
 * - NEXTAUTH_URL: URL base de la aplicación (opcional en Vercel)
 * - DATABASE_URL: Conexión a PostgreSQL
 * 
 * FIXES APLICADOS:
 * - Configuración segura de secret con fallback
 * - Callbacks mejorados con mejor manejo de errores
 * - Logger mejorado para debugging en producción
 * - Configuración de cookies optimizada
 */

/**
 * Configurar NEXTAUTH_SECRET
 * 
 * En desarrollo: usa un secret por defecto si no está configurado
 * En producción: REQUIERE que esté configurado (falla si no existe)
 * 
 * IMPORTANTE: El secret debe tener al menos 32 caracteres para seguridad
 */
function getNextAuthSecret(): string {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET
  }
  
  // En desarrollo, usar secret por defecto
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ [AUTH CONFIG] Using default NEXTAUTH_SECRET in development')
    return 'development-secret-please-change-in-production-min-32-chars-required-for-security'
  }
  
  // En producción, REQUERIR que esté configurado
  console.error('❌ [AUTH CONFIG] CRITICAL: NEXTAUTH_SECRET is required in production!')
  console.error('❌ [AUTH CONFIG] Generate one with: openssl rand -base64 32')
  throw new Error('NEXTAUTH_SECRET must be set in production environment')
}

const NEXTAUTH_SECRET = getNextAuthSecret()

/**
 * Log de configuración (solo en desarrollo y en server-side)
 */
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  console.log('🔧 [AUTH CONFIG] NextAuth configuration:')
  console.log('   - Has custom secret:', !!process.env.NEXTAUTH_SECRET)
  console.log('   - Node env:', process.env.NODE_ENV)
  console.log('   - NextAuth URL:', process.env.NEXTAUTH_URL || 'auto-detect')
}

export const authOptions: NextAuthOptions = {
  // Configuración de debugging (solo en desarrollo)
  debug: process.env.NODE_ENV === 'development',
  
  // CRITICAL: Logger for production debugging
  logger: {
    error: (code, metadata) => {
      console.error('[NEXTAUTH ERROR]', code, metadata)
    },
    warn: (code) => {
      console.warn('[NEXTAUTH WARNING]', code)
    },
    debug: (code, metadata) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[NEXTAUTH DEBUG]', code, metadata)
      }
    },
  },
  
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 [AUTH] Iniciando proceso de autorización...')
          
          // Validar que existen las credenciales
          if (!credentials?.email || !credentials?.password) {
            console.error('❌ [AUTH] Credenciales faltantes')
            throw new Error('Email y contraseña son requeridos')
          }

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
  
  /**
   * Callbacks para manejar JWT y sesión
   * 
   * Los callbacks permiten personalizar el comportamiento de NextAuth:
   * - jwt: Se ejecuta cada vez que se crea o actualiza un token
   * - session: Se ejecuta cada vez que se verifica una sesión
   * - redirect: Se ejecuta después de login/logout para determinar redirección
   * 
   * FIXES APLICADOS:
   * - Mejor manejo de errores
   * - Logging condicional (solo en desarrollo)
   * - Type safety mejorada
   * - Validación de datos antes de asignar
   */
  callbacks: {
    /**
     * JWT Callback
     * 
     * Se ejecuta cada vez que se crea o actualiza un JWT token.
     * El token se almacena en una cookie HTTP-only.
     * 
     * @param token - El token JWT actual
     * @param user - El usuario (solo disponible en el primer login)
     * @param trigger - El evento que disparó el callback ('signIn', 'signUp', 'update')
     */
    async jwt({ token, user, trigger }) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🎫 [JWT] Callback triggered:', trigger)
        }
        
        // En el primer login, agregar datos del usuario al token
        if (user) {
          if (process.env.NODE_ENV === 'development') {
            console.log('📝 [JWT] Adding user data to token for:', user.email)
          }
          
          token.id = user.id
          token.userType = user.userType
          token.isVerified = user.isVerified
        }
        
        return token
      } catch (error) {
        console.error('❌ [JWT] Error in callback:', error)
        // Return token as-is if there's an error
        return token
      }
    },
    
    /**
     * Session Callback
     * 
     * Se ejecuta cada vez que se verifica una sesión (ej: getSession, useSession).
     * Aquí agregamos datos del token a la sesión que será enviada al cliente.
     * 
     * @param session - El objeto de sesión
     * @param token - El token JWT decodificado
     */
    async session({ session, token }) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('👤 [SESSION] Callback executed')
        }
        
        // Agregar datos del token a la sesión
        if (session.user && token) {
          // Use token.sub as fallback for user ID
          session.user.id = (token.id as string) || token.sub || ''
          session.user.userType = token.userType as any
          session.user.isVerified = (token.isVerified as boolean) || false
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ [SESSION] Session created for:', session.user.email)
          }
        }
        
        return session
      } catch (error) {
        console.error('❌ [SESSION] Error in callback:', error)
        // Return session as-is if there's an error
        return session
      }
    },
    
    /**
     * Redirect Callback
     * 
     * Se ejecuta después de login/logout para determinar a dónde redirigir.
     * 
     * @param url - La URL a la que NextAuth quiere redirigir
     * @param baseUrl - La URL base de la aplicación
     */
    async redirect({ url, baseUrl }) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔀 [REDIRECT] Requested:', url, '| Base:', baseUrl)
        }
        
        // Permitir redirecciones a rutas relativas
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`
        }
        
        // Permitir redirecciones al mismo dominio
        try {
          const urlObj = new URL(url)
          const baseUrlObj = new URL(baseUrl)
          
          if (urlObj.origin === baseUrlObj.origin) {
            return url
          }
        } catch {
          // If URL parsing fails, return baseUrl
        }
        
        // Por defecto, redirigir al baseUrl
        return baseUrl
      } catch (error) {
        console.error('❌ [REDIRECT] Error in callback:', error)
        return baseUrl
      }
    }
  },
  
  // Páginas personalizadas
  pages: {
    signIn: '/login',
    error: '/login', // En caso de error, redirigir al login
  },
  
  // Secret (CRÍTICO para producción)
  secret: NEXTAUTH_SECRET,
  

  // Configuración de URLs (importante para Vercel)
  useSecureCookies: process.env.NODE_ENV === 'production',
  
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