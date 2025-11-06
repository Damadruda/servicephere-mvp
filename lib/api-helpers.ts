/**
 * API Helper Functions
 * 
 * Utility functions for consistent API responses and error handling
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

/**
 * Standard API error response
 */
export function errorResponse(message: string, status: number = 500, details?: any) {
  console.error(`❌ [API ERROR] ${status}:`, message, details || '')
  
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
    },
    { status }
  )
}

/**
 * Standard API success response
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  )
}

/**
 * Verify authentication and return session
 * 
 * Usage:
 * ```ts
 * const session = await requireAuth()
 * if (!session) {
 *   return errorResponse('Unauthorized', 401)
 * }
 * ```
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }
  
  return session
}

/**
 * Verify user type matches required type
 */
export function requireUserType(session: any, requiredType: 'CLIENT' | 'PROVIDER' | 'ADMIN') {
  if (!session?.user?.userType) {
    return false
  }
  
  return session.user.userType === requiredType
}

/**
 * Handle Prisma errors with meaningful messages
 */
export function handlePrismaError(error: any) {
  // Prisma error codes
  const prismaErrors: Record<string, string> = {
    P2002: 'Ya existe un registro con estos datos',
    P2003: 'Referencia inválida a otro registro',
    P2014: 'La relación requerida no existe',
    P2015: 'No se pudo encontrar el registro relacionado',
    P2016: 'Error de interpretación de la consulta',
    P2017: 'Las relaciones no están conectadas',
    P2018: 'No se encontraron los registros requeridos conectados',
    P2019: 'Error de entrada',
    P2020: 'El valor está fuera de rango para el tipo',
    P2021: 'La tabla no existe en la base de datos',
    P2022: 'La columna no existe en la base de datos',
    P2023: 'Datos inconsistentes en la columna',
    P2024: 'Tiempo de espera agotado obteniendo una conexión del pool',
    P2025: 'Registro no encontrado o una operación falló porque depende de registros requeridos',
  }
  
  // Check if it's a Prisma error
  if (error.code && error.code.startsWith('P')) {
    return prismaErrors[error.code] || 'Error de base de datos'
  }
  
  return 'Error interno del servidor'
}

/**
 * Validate required fields
 */
export function validateRequired(data: any, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!data[field]) {
      return `El campo ${field} es requerido`
    }
  }
  return null
}

/**
 * Sanitize output by removing sensitive fields
 */
export function sanitizeUser(user: any) {
  const { password, ...sanitized } = user
  return sanitized
}

/**
 * Parse pagination parameters
 */
export function parsePagination(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit
  
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)), // Max 100 items per page
    skip: Math.max(0, skip),
  }
}

/**
 * Build pagination response
 */
export function paginationResponse(data: any[], total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}
