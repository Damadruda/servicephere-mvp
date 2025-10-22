
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { sessionId, content } = await request.json()

    // Verificar que la sesión pertenece al usuario
    const chatSession = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id
      }
    })

    if (!chatSession) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    // Obtener información del usuario para contexto
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        clientProfile: true,
        providerProfile: {
          include: {
            certifications: true,
            competencies: true
          }
        }
      }
    })

    // Obtener mensajes anteriores para contexto
    const previousMessages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 10 // Últimos 10 mensajes para contexto
    })

    // Construir contexto del usuario
    const userContext = buildUserContext(user)

    // Crear mensaje del usuario
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        content: content.trim(),
        role: 'USER'
      }
    })

    // Generar respuesta con LLM
    const assistantResponse = await generateSAPAssistantResponse(
      content,
      userContext,
      previousMessages,
      user?.userType || 'CLIENT'
    )

    // Crear mensaje del asistente
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        content: assistantResponse.content,
        role: 'ASSISTANT',
        confidence: assistantResponse.confidence,
        sapContext: assistantResponse.sapContext || {}
      }
    })

    // Actualizar actividad de la sesión
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { lastActivity: new Date() }
    })

    // Registrar analytics
    await prisma.chatAnalytics.create({
      data: {
        userId: session.user.id,
        sessionId,
        queryType: classifyQueryType(content),
        queryCategory: classifyQueryCategory(content),
        resolution: assistantResponse.confidence > 0.7 ? 'RESOLVED' : 'PARTIAL',
        responseTime: assistantResponse.responseTime
      }
    }).catch(err => console.error('Error saving analytics:', err))

    return NextResponse.json({
      success: true,
      userMessage,
      assistantMessage
    })

  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error procesando mensaje' 
    }, { status: 500 })
  }
}

function buildUserContext(user: any) {
  const context: any = {
    userType: user?.userType || 'CLIENT',
    isVerified: user?.isVerified || false
  }

  if (user?.clientProfile) {
    context.industry = user.clientProfile.industry
    context.companySize = user.clientProfile.companySize
    context.country = user.clientProfile.country
  }

  if (user?.providerProfile) {
    context.specializations = user.providerProfile.sapSpecializations || []
    context.certifications = user.providerProfile.certifications?.map((c: any) => c.module) || []
    context.averageRating = user.providerProfile.averageRating
    context.verified = user.providerProfile.verified
  }

  return context
}

async function generateSAPAssistantResponse(query: string, userContext: any, previousMessages: any[], userType: string) {
  const startTime = Date.now()
  
  try {
    // Buscar conocimiento relevante en la base de datos
    const relevantKnowledge = await findRelevantKnowledge(query, userType)

    // Construir prompt contextual
    const systemPrompt = buildSystemPrompt(userContext, relevantKnowledge, userType)
    
    // Construir historial de conversación
    const conversationHistory = previousMessages.map(msg => ({
      role: msg.role === 'USER' ? 'user' : 'assistant',
      content: msg.content
    }))

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8), // Últimos 8 mensajes
      { role: 'user', content: query }
    ]

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`)
    }

    const data = await response.json()
    const responseContent = data.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.'
    
    const responseTime = (Date.now() - startTime) / 1000

    return {
      content: responseContent,
      confidence: calculateConfidence(query, responseContent, relevantKnowledge),
      sapContext: {
        relevantKnowledge: relevantKnowledge.map(k => k.id),
        queryType: classifyQueryType(query),
        userType: userType
      },
      responseTime
    }

  } catch (error) {
    console.error('Error generating LLM response:', error)
    return {
      content: 'Lo siento, ha ocurrido un error procesando tu consulta. Por favor intenta de nuevo.',
      confidence: 0.0,
      sapContext: null,
      responseTime: (Date.now() - startTime) / 1000
    }
  }
}

async function findRelevantKnowledge(query: string, userType: string) {
  // Búsqueda básica por palabras clave
  const searchTerms = extractKeywords(query)
  
  const knowledge = await prisma.sAPKnowledge.findMany({
    where: {
      AND: [
        { isActive: true },
        { userType: userType as any },
        {
          OR: [
            { title: { contains: searchTerms[0], mode: 'insensitive' } },
            { content: { contains: searchTerms[0], mode: 'insensitive' } },
            { tags: { hasSome: searchTerms } }
          ]
        }
      ]
    },
    take: 3,
    orderBy: [
      { helpfulVotes: 'desc' },
      { viewCount: 'desc' }
    ]
  })

  return knowledge
}

function buildSystemPrompt(userContext: any, knowledge: any[], userType: string) {
  let prompt = `Eres un asistente especializado en SAP para el marketplace B2B SAP. Tu misión es ayudar a ${userType === 'CLIENT' ? 'clientes' : 'proveedores'} con consultas relacionadas con SAP.

CONTEXTO DEL USUARIO:
- Tipo: ${userType === 'CLIENT' ? 'Cliente (necesita servicios SAP)' : 'Proveedor (consultor SAP)'}
- Verificado: ${userContext.isVerified ? 'Sí' : 'No'}
`

  if (userContext.industry) {
    prompt += `- Industria: ${userContext.industry}\n`
  }
  if (userContext.companySize) {
    prompt += `- Tamaño empresa: ${userContext.companySize}\n`
  }
  if (userContext.specializations?.length) {
    prompt += `- Especializaciones: ${userContext.specializations.join(', ')}\n`
  }
  if (userContext.certifications?.length) {
    prompt += `- Certificaciones: ${userContext.certifications.join(', ')}\n`
  }

  if (knowledge.length > 0) {
    prompt += `\nCONOCIMIENTO RELEVANTE:\n`
    knowledge.forEach((k, index) => {
      prompt += `${index + 1}. ${k.title}\n${k.content.substring(0, 200)}...\n\n`
    })
  }

  prompt += `
INSTRUCCIONES:
1. Responde en español de manera profesional y útil
2. Si es un cliente: enfócate en project scoping, estimaciones, mejores prácticas
3. Si es un proveedor: enfócate en consultoría técnica, metodologías, certificaciones
4. Usa la información del contexto del usuario para personalizar tu respuesta
5. Si no tienes información específica, sé honesto pero ofrece ayuda general
6. Sugiere escalación a soporte humano si es necesario (confianza <70%)
7. Mantén las respuestas concisas pero informativas (máximo 400 palabras)

Casos de uso principales:
- Para clientes: "¿Qué módulos SAP necesito?", "¿Cuánto cuesta implementación?", "¿Cuánto tiempo toma?"
- Para proveedores: "¿SAP Activate o ASAP?", "¿On-premise o cloud?", "¿Qué certificaciones necesito?"
- Para ambos: Navegación plataforma, mejores prácticas, troubleshooting
`

  return prompt
}

function extractKeywords(query: string): string[] {
  const sapTerms = ['s4hana', 'successfactors', 'ariba', 'concur', 'fiori', 'hana', 'fi', 'co', 'sd', 'mm', 'pp', 'hcm']
  const words = query.toLowerCase().split(/\s+/)
  return words.filter(word => word.length > 3 || sapTerms.includes(word))
}

function classifyQueryType(query: string): string {
  const lower = query.toLowerCase()
  if (lower.includes('costo') || lower.includes('precio') || lower.includes('presupuesto')) {
    return 'PROJECT_SCOPING'
  }
  if (lower.includes('módulo') || lower.includes('implementa') || lower.includes('migra')) {
    return 'TECHNICAL_CONSULTATION'
  }
  return 'GENERAL_SUPPORT'
}

function classifyQueryCategory(query: string): string {
  const lower = query.toLowerCase()
  if (lower.includes('costo') || lower.includes('precio')) return 'Budget'
  if (lower.includes('tiempo') || lower.includes('duración')) return 'Timeline'
  if (lower.includes('módulo')) return 'Modules'
  if (lower.includes('certificación')) return 'Certification'
  return 'General'
}

function calculateConfidence(query: string, response: string, knowledge: any[]): number {
  let confidence = 0.5 // Base confidence
  
  // Increase confidence if we found relevant knowledge
  if (knowledge.length > 0) confidence += 0.2
  
  // Increase confidence if response is substantial
  if (response.length > 100) confidence += 0.1
  
  // Increase confidence if query contains SAP terms
  const sapTerms = ['sap', 's4hana', 'fiori', 'hana', 'módulo']
  if (sapTerms.some(term => query.toLowerCase().includes(term))) {
    confidence += 0.2
  }
  
  return Math.min(confidence, 1.0)
}
