import NextAuth from 'next-auth'
import type { NextRequest } from 'next/server'
import { authOptions } from '@/lib/auth'

// ============================================
// NEXTAUTH API ROUTE HANDLER
// ============================================
// Este archivo maneja todas las rutas de NextAuth:
// - GET /api/auth/* (sesión, csrf, providers, etc.)
// - POST /api/auth/* (signin, signout, callback)

// Crear el handler de NextAuth
const handler = NextAuth(authOptions)

// Exportar explícitamente los métodos HTTP
// Next.js App Router requiere exportaciones nombradas para GET y POST
export const GET = handler
export const POST = handler

// Configuración de runtime para Vercel
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
