
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { 
      providerId, 
      quotationId, 
      verificationScores, 
      projectDetails 
    } = await request.json()

    // Simulate AI-powered risk analysis
    const riskAnalysis = await performRiskAnalysis(verificationScores, projectDetails)

    return NextResponse.json({
      success: true,
      riskFactors: riskAnalysis.riskFactors,
      overallRiskLevel: riskAnalysis.overallRiskLevel,
      recommendedMitigations: riskAnalysis.recommendedMitigations
    })
  } catch (error) {
    console.error('Error in risk analysis:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function performRiskAnalysis(verificationScores: any, projectDetails: any) {
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  const riskFactors = []
  
  // Financial risk based on provider performance and project size
  if (verificationScores.performance < 70 || projectDetails.totalCost > 250000) {
    riskFactors.push({
      id: 'financial_capacity',
      category: 'Financiero',
      title: 'Capacidad Financiera',
      description: 'Posible limitación en la capacidad financiera del proveedor',
      severity: verificationScores.performance < 50 ? 'high' : 'medium',
      probability: Math.max(20, 100 - verificationScores.performance),
      impact: projectDetails.totalCost > 500000 ? 85 : 65,
      mitigation: 'Establecer garantías bancarias y pagos escalonados por hitos'
    })
  }

  // Experience risk
  if (verificationScores.experience < 75) {
    riskFactors.push({
      id: 'technical_expertise',
      category: 'Técnico',
      title: 'Experiencia Técnica',
      description: 'Nivel de experiencia puede ser insuficiente para la complejidad del proyecto',
      severity: verificationScores.experience < 60 ? 'high' : 'medium',
      probability: 100 - verificationScores.experience,
      impact: 75,
      mitigation: 'Requerir supervisión técnica senior y plan de capacitación específico'
    })
  }

  // Timeline risk for complex projects
  const timelineMonths = parseInt(projectDetails.timeline?.match(/\d+/)?.[0] || '6')
  if (timelineMonths > 12 || projectDetails.complexity === 'high') {
    riskFactors.push({
      id: 'project_timeline',
      category: 'Temporal',
      title: 'Riesgo de Cronograma',
      description: 'Proyectos largos o complejos tienen mayor probabilidad de retrasos',
      severity: timelineMonths > 18 ? 'high' : 'medium',
      probability: Math.min(Math.max(15, timelineMonths * 4), 80),
      impact: 70,
      mitigation: 'Definir hitos frecuentes con penalizaciones por retrasos'
    })
  }

  // Market/Economic risk for large projects
  if (projectDetails.totalCost > 100000) {
    riskFactors.push({
      id: 'market_conditions',
      category: 'Económico',
      title: 'Condiciones de Mercado',
      description: 'Cambios en condiciones económicas pueden afectar el proyecto',
      severity: 'low',
      probability: 25,
      impact: 45,
      mitigation: 'Cláusulas de ajuste por inflación y fuerza mayor'
    })
  }

  // Determine overall risk level
  const highRisks = riskFactors.filter(r => r.severity === 'high').length
  const mediumRisks = riskFactors.filter(r => r.severity === 'medium').length
  
  let overallRiskLevel: 'low' | 'medium' | 'high' = 'low'
  
  if (highRisks > 1) {
    overallRiskLevel = 'high'
  } else if (highRisks === 1 || mediumRisks > 2) {
    overallRiskLevel = 'high'
  } else if (mediumRisks > 0) {
    overallRiskLevel = 'medium'
  }

  return {
    riskFactors,
    overallRiskLevel,
    recommendedMitigations: riskFactors.map(r => ({
      riskId: r.id,
      mitigation: r.mitigation
    }))
  }
}
