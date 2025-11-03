import { NextResponse } from 'next/server'

/**
 * Endpoint de diagnóstico para verificar configuración de NextAuth
 * 
 * Este endpoint es accesible públicamente y NO muestra valores sensibles.
 * Solo verifica si las variables de entorno están configuradas.
 * 
 * Accede a: https://www.servicephere.com/api/check-auth-config
 */
export async function GET() {
  try {
    // Verificar variables de entorno críticas
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      checks: {
        NEXTAUTH_SECRET: {
          configured: !!process.env.NEXTAUTH_SECRET,
          length: process.env.NEXTAUTH_SECRET?.length || 0,
          status: process.env.NEXTAUTH_SECRET 
            ? '✅ Configurado correctamente' 
            : '❌ NO CONFIGURADO - Necesitas agregarlo en Vercel'
        },
        NEXTAUTH_URL: {
          configured: !!process.env.NEXTAUTH_URL,
          value: process.env.NEXTAUTH_URL || 'NO CONFIGURADO',
          status: process.env.NEXTAUTH_URL 
            ? '✅ Configurado correctamente' 
            : '❌ NO CONFIGURADO - Debe ser: https://www.servicephere.com'
        },
        DATABASE_URL: {
          configured: !!process.env.DATABASE_URL,
          status: process.env.DATABASE_URL 
            ? '✅ Configurado correctamente' 
            : '❌ NO CONFIGURADO - Necesitas la URL de tu base de datos'
        }
      },
      summary: {
        allConfigured: !!(
          process.env.NEXTAUTH_SECRET && 
          process.env.NEXTAUTH_URL && 
          process.env.DATABASE_URL
        ),
        message: ''
      }
    }

    // Generar mensaje de resumen
    if (checks.summary.allConfigured) {
      checks.summary.message = '🎉 ¡Todo está configurado correctamente! NextAuth debería funcionar.'
    } else {
      const missing = []
      if (!process.env.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET')
      if (!process.env.NEXTAUTH_URL) missing.push('NEXTAUTH_URL')
      if (!process.env.DATABASE_URL) missing.push('DATABASE_URL')
      
      checks.summary.message = `⚠️ Faltan variables de entorno: ${missing.join(', ')}. Consulta la guía configurar_vercel_paso_a_paso.md`
    }

    return NextResponse.json(checks, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Error al verificar configuración',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
