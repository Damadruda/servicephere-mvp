import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// ============================================
// NEXTAUTH API ROUTE HANDLER
// ============================================
// Este archivo maneja todas las rutas de NextAuth:
// - GET /api/auth/* (sesión, csrf, providers, etc.)
// - POST /api/auth/* (signin, signout, callback)

const handler = NextAuth(authOptions)

// Exportar el handler para ambos métodos HTTP
export { handler as GET, handler as POST }

// Configuración de runtime para Vercel
export const runtime = 'nodejs'
