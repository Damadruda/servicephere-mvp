import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// ============================================
// NEXTAUTH API ROUTE HANDLER
// ============================================
// Este archivo maneja todas las rutas de NextAuth:
// - GET /api/auth/* (sesión, csrf, providers, etc.)
// - POST /api/auth/* (signin, signout, callback)

// Log para verificar que el route handler se está cargando
console.log('🔥 [NEXTAUTH ROUTE] Route handler loaded at /api/auth/[...nextauth]')

// Crear el handler de NextAuth
const handler = NextAuth(authOptions)

// Wrapper para logging (ayuda a debuggear si las rutas se están llamando)
const wrappedGET = async (req: Request, context: any) => {
  console.log('🔵 [NEXTAUTH GET] Request received:', req.url)
  return handler(req, context)
}

const wrappedPOST = async (req: Request, context: any) => {
  console.log('🟢 [NEXTAUTH POST] Request received:', req.url)
  return handler(req, context)
}

// Exportar explícitamente los métodos HTTP
// Next.js App Router requiere esta sintaxis específica para NextAuth v4
// Usar "export { handler as GET, handler as POST }" es CRÍTICO para que funcione
export { wrappedGET as GET, wrappedPOST as POST }

// Configuración de runtime para Vercel
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
