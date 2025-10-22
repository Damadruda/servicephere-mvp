
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  userType: z.enum(['CLIENT', 'PROVIDER']),
  profileData: z.object({
    companyName: z.string().min(2),
    industry: z.string().min(2),
    country: z.string().min(2),
    city: z.string().min(2),
    description: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    contactName: z.string().optional(),
    contactTitle: z.string().optional(),
    phoneNumber: z.string().optional(),
    companySize: z.string().optional(),
    employeeCount: z.string().optional(),
    foundedYear: z.number().optional()
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(validatedData.password, 12)

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        userType: validatedData.userType,
        ...(validatedData.userType === 'CLIENT' ? {
          clientProfile: {
            create: {
              companyName: validatedData.profileData.companyName,
              industry: validatedData.profileData.industry,
              country: validatedData.profileData.country,
              city: validatedData.profileData.city,
              description: validatedData.profileData.description || '',
              website: validatedData.profileData.website || null,
              contactName: validatedData.profileData.contactName || validatedData.name,
              contactTitle: validatedData.profileData.contactTitle || '',
              phoneNumber: validatedData.profileData.phoneNumber || null,
              companySize: validatedData.profileData.companySize || 'Medium'
            }
          }
        } : {
          providerProfile: {
            create: {
              companyName: validatedData.profileData.companyName,
              description: validatedData.profileData.description || '',
              country: validatedData.profileData.country,
              city: validatedData.profileData.city,
              website: validatedData.profileData.website || null,
              employeeCount: validatedData.profileData.employeeCount || '11-50',
              foundedYear: validatedData.profileData.foundedYear || new Date().getFullYear()
            }
          }
        })
      }
    })

    return NextResponse.json(
      { message: 'Usuario creado exitosamente', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
