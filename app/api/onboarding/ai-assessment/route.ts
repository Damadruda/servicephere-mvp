
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Call the AI agent for recommendations
    const aiResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/chat-sap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: generateAssessmentPrompt(body)
      })
    })

    const aiResult = await aiResponse.json()
    
    // Parse AI response to extract structured recommendations
    const recommendations = parseAiRecommendations(aiResult.response, body)

    return NextResponse.json(
      { recommendations },
      { status: 200 }
    )
  } catch (error) {
    console.error('AI assessment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateAssessmentPrompt(data: any): string {
  return `
Actúa como un experto consultor SAP senior. Analiza la siguiente información de assessment de un cliente y proporciona recomendaciones específicas.

INFORMACIÓN DEL CLIENTE:
- Sistemas actuales: ${data.currentSystemsUsed?.join(', ') || 'No especificado'}
- Principales desafíos: ${data.painPoints?.join(', ') || 'No especificado'}
- Objetivos de negocio: ${data.primaryGoals?.join(', ') || 'No especificado'}
- Urgencia del proyecto: ${data.urgencyLevel || 'No especificado'}
- Experiencia SAP: ${data.sapExperience || 'No especificado'}
- Tipo de implementación: ${data.implementationType || 'No especificado'}
- Módulos de interés: ${data.interestedModules?.join(', ') || 'No especificado'}
- Procesos prioritarios: ${data.businessProcesses?.join(', ') || 'No especificado'}
- Preferencia de despliegue: ${data.cloudPreference || 'No especificado'}
- Timeline: ${data.projectTimeline || 'No especificado'}
- Presupuesto: ${data.budgetRange || 'No especificado'}
- Disponibilidad del equipo: ${data.teamAvailability || 'No especificado'}
- Requerimientos de compliance: ${data.complianceRequirements?.join(', ') || 'No especificado'}
- Necesidades de integración: ${data.integrationNeeds?.join(', ') || 'No especificado'}
- Criterios de éxito: ${data.successCriteria?.join(', ') || 'No especificado'}

PROPORCIONA RECOMENDACIONES EN EL SIGUIENTE FORMATO JSON:
{
  "recommendedModules": ["lista de módulos SAP recomendados"],
  "implementationApproach": "descripción detallada del enfoque de implementación recomendado",
  "estimatedTimeline": "timeline realista basado en el alcance y complejidad",
  "keyConsiderations": ["lista de consideraciones importantes para el proyecto"],
  "suggestedPartners": ["tipos de partners o consultores recomendados"]
}

Base tus recomendaciones en:
1. Mejores prácticas de SAP
2. Experiencia y madurez del cliente
3. Complejidad del negocio
4. Restricciones de timeline y presupuesto
5. Requerimientos específicos de la industria

Sé específico y práctico en tus recomendaciones.
`;
}

function parseAiRecommendations(aiResponse: string, originalData: any) {
  try {
    // Try to parse JSON response from AI
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  // Fallback: generate basic recommendations based on the data
  return generateFallbackRecommendations(originalData);
}

function generateFallbackRecommendations(data: any) {
  const recommendations = {
    recommendedModules: [] as string[],
    implementationApproach: '',
    estimatedTimeline: '',
    keyConsiderations: [] as string[],
    suggestedPartners: [] as string[]
  };

  // Basic module recommendations based on interested modules
  if (data.interestedModules?.length > 0) {
    recommendations.recommendedModules = data.interestedModules.slice(0, 5);
  }

  // Basic implementation approach
  if (data.implementationType === 'new') {
    recommendations.implementationApproach = 'Implementación SAP S/4HANA desde cero con metodología SAP Activate';
  } else if (data.implementationType === 'upgrade') {
    recommendations.implementationApproach = 'Migración a SAP S/4HANA con enfoque en modernización de procesos';
  } else {
    recommendations.implementationApproach = 'Enfoque personalizado basado en requirements específicos';
  }

  // Timeline estimation
  const moduleCount = data.interestedModules?.length || 3;
  if (moduleCount <= 3) {
    recommendations.estimatedTimeline = '6-12 meses';
  } else if (moduleCount <= 6) {
    recommendations.estimatedTimeline = '12-18 meses';
  } else {
    recommendations.estimatedTimeline = '18-24 meses';
  }

  // Key considerations
  recommendations.keyConsiderations = [
    'Definición clara de requirements de negocio',
    'Plan de gestión de cambio organizacional',
    'Estrategia de migración de datos',
    'Plan de capacitación de usuarios finales'
  ];

  // Partner suggestions
  if (data.budgetRange?.includes('100k')) {
    recommendations.suggestedPartners = ['Consultores especializados', 'Partners SAP Silver'];
  } else {
    recommendations.suggestedPartners = ['Partners SAP Gold/Platinum', 'Integradores de sistemas', 'Consultores senior'];
  }

  return recommendations;
}
