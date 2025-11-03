import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// ============================================
// NEXTAUTH API ROUTE HANDLER (PAGES ROUTER)
// ============================================
// Este archivo maneja todas las rutas de NextAuth:
// - GET /api/auth/* (session, csrf, providers, signin, signout, etc.)
// - POST /api/auth/* (signin, signout, callback)
//
// IMPORTANTE: NextAuth v4 fue diseñado para el Pages Router.
// Este archivo usa la sintaxis del Pages Router (pages/api/*)
// mientras que el resto de la app usa App Router (app/*)
//
// Esta es una configuración híbrida recomendada por el equipo de Next.js

console.log('🔥 [NEXTAUTH PAGES] Route handler loaded at /api/auth/[...nextauth]')

// Para Pages Router, simplemente exportamos el handler por defecto
export default NextAuth(authOptions)
