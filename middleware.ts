/**
 * Middleware for ServiceSphere
 * 
 * This middleware handles:
 * 1. Authentication verification for protected routes
 * 2. Route protection based on user type
 * 3. Request logging in development
 * 
 * Note: NextAuth handles its own routes automatically at /api/auth/*
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/proyectos/nuevo',
  '/perfil',
  '/notificaciones',
  '/mensajes',
  '/contratos',
  '/pagos',
  '/cotizaciones',
  '/portfolio',
  '/configuracion',
]

// Routes only for clients
const CLIENT_ONLY_ROUTES = [
  '/proyectos/nuevo',
  '/seleccion',
]

// Routes only for providers
const PROVIDER_ONLY_ROUTES = [
  '/portfolio/nuevo',
]

// Public routes that authenticated users shouldn't access
const AUTH_ROUTES = [
  '/login',
  '/registro',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔀 [MIDDLEWARE] Request:', {
      method: request.method,
      pathname,
      url: request.url,
    })
  }
  
  // Skip middleware for:
  // - API routes (handled by their own authentication)
  // - Static files
  // - Image optimization
  // - Public assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/i)
  ) {
    return NextResponse.next()
  }
  
  // Get the token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🎫 [MIDDLEWARE] Token:', {
      hasToken: !!token,
      email: token?.email,
      userType: token?.userType,
    })
  }
  
  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )
  
  const isAuthRoute = AUTH_ROUTES.some(route => 
    pathname.startsWith(route)
  )
  
  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 [MIDDLEWARE] Redirecting to login - no auth')
    }
    
    return NextResponse.redirect(loginUrl)
  }
  
  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && token) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔓 [MIDDLEWARE] Redirecting to dashboard - already auth')
    }
    
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Check user type restrictions
  if (token) {
    const isClientOnlyRoute = CLIENT_ONLY_ROUTES.some(route => 
      pathname.startsWith(route)
    )
    const isProviderOnlyRoute = PROVIDER_ONLY_ROUTES.some(route => 
      pathname.startsWith(route)
    )
    
    if (isClientOnlyRoute && token.userType !== 'CLIENT') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚫 [MIDDLEWARE] Access denied - client only route')
      }
      
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    if (isProviderOnlyRoute && token.userType !== 'PROVIDER') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚫 [MIDDLEWARE] Access denied - provider only route')
      }
      
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Continue with the request
  return NextResponse.next()
}

// Configure middleware matcher
// This determines which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
