
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma-singleton'
import { z } from 'zod'


// Configuración para evitar generación estática durante el build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

