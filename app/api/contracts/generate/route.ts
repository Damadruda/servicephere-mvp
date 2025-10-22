
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
      templateId, 
      quotationData, 
      verificationData, 
      projectDates 
    } = await request.json()

    // Generate intelligent contract based on template and data
    const contractGeneration = await generateIntelligentContract(
      templateId, 
      quotationData, 
      verificationData, 
      projectDates
    )

    return NextResponse.json({
      success: true,
      contractTerms: contractGeneration.contractTerms,
      paymentSchedule: contractGeneration.paymentSchedule,
      milestones: contractGeneration.milestones,
      paymentTerms: contractGeneration.paymentTerms
    })
  } catch (error) {
    console.error('Error generating contract:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateIntelligentContract(
  templateId: string, 
  quotationData: any, 
  verificationData: any, 
  projectDates: any
) {
  // Simulate contract generation delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  const timelineMonths = parseInt(quotationData.timeline.match(/\d+/)?.[0] || '6')
  const startDate = new Date(projectDates.startDate)
  const endDate = new Date(projectDates.endDate)

  // Generate payment schedule based on project size and risk
  const isHighValue = quotationData.totalCost > 200000
  const isHighRisk = verificationData.overallScore < 70

  let paymentSchedule = []
  
  if (isHighRisk) {
    // More conservative payment schedule for higher risk
    paymentSchedule = [
      {
        id: '1',
        name: 'Pago Inicial',
        description: 'Pago inicial reducido debido a evaluación de riesgo',
        percentage: 20,
        amount: quotationData.totalCost * 0.2,
        dueDate: projectDates.startDate,
        dependencies: []
      },
      {
        id: '2',
        name: 'Primer Hito',
        description: 'Pago al completar análisis y diseño',
        percentage: 25,
        amount: quotationData.totalCost * 0.25,
        dueDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.3)),
        dependencies: ['analysis_complete']
      },
      {
        id: '3',
        name: 'Segundo Hito',
        description: 'Pago al completar desarrollo',
        percentage: 30,
        amount: quotationData.totalCost * 0.3,
        dueDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.7)),
        dependencies: ['development_complete']
      },
      {
        id: '4',
        name: 'Pago Final',
        description: 'Pago final post go-live exitoso',
        percentage: 25,
        amount: quotationData.totalCost * 0.25,
        dueDate: addMonths(projectDates.endDate, 1), // 1 month after go-live
        dependencies: ['go-live', 'client-acceptance', '30-day-stability']
      }
    ]
  } else {
    // Standard payment schedule
    paymentSchedule = [
      {
        id: '1',
        name: 'Pago Inicial',
        description: 'Pago al inicio del proyecto',
        percentage: 30,
        amount: quotationData.totalCost * 0.3,
        dueDate: projectDates.startDate,
        dependencies: []
      },
      {
        id: '2',
        name: 'Pago Intermedio',
        description: 'Pago al completar desarrollo y testing',
        percentage: 40,
        amount: quotationData.totalCost * 0.4,
        dueDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.75)),
        dependencies: ['development_complete', 'testing_complete']
      },
      {
        id: '3',
        name: 'Pago Final',
        description: 'Pago al go-live exitoso',
        percentage: 30,
        amount: quotationData.totalCost * 0.3,
        dueDate: projectDates.endDate,
        dependencies: ['go-live', 'client-acceptance']
      }
    ]
  }

  // Generate project milestones
  const milestones = [
    {
      id: 'project_kickoff',
      name: 'Kick-off del Proyecto',
      description: 'Reunión inicial y setup del proyecto',
      deliverables: ['Plan de proyecto detallado', 'Equipo asignado', 'Ambiente de desarrollo'],
      startDate: projectDates.startDate,
      endDate: addDays(projectDates.startDate, 7),
      dependencies: []
    },
    {
      id: 'analysis_design',
      name: 'Análisis y Diseño',
      description: 'Análisis de requerimientos y diseño de la solución',
      deliverables: ['Documento de requerimientos', 'Diseño funcional', 'Diseño técnico'],
      startDate: addDays(projectDates.startDate, 7),
      endDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.25)),
      dependencies: ['project_kickoff']
    },
    {
      id: 'development',
      name: 'Desarrollo y Configuración',
      description: 'Configuración del sistema y desarrollos específicos',
      deliverables: ['Configuraciones SAP', 'Desarrollos ABAP', 'Interfaces desarrolladas'],
      startDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.25)),
      endDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.7)),
      dependencies: ['analysis_design']
    },
    {
      id: 'testing',
      name: 'Testing y UAT',
      description: 'Pruebas integrales y aceptación del usuario',
      deliverables: ['Plan de pruebas', 'Casos de test ejecutados', 'Aceptación del usuario'],
      startDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.7)),
      endDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.9)),
      dependencies: ['development']
    },
    {
      id: 'go_live',
      name: 'Go-Live y Soporte',
      description: 'Puesta en producción y soporte inicial',
      deliverables: ['Sistema en producción', 'Usuarios capacitados', 'Documentación final'],
      startDate: addMonths(projectDates.startDate, Math.floor(timelineMonths * 0.9)),
      endDate: projectDates.endDate,
      dependencies: ['testing']
    }
  ]

  // Generate contract terms based on template and risk assessment
  const contractTerms = {
    template: getTemplateName(templateId),
    scope: quotationData.title,
    totalValue: quotationData.totalCost,
    currency: quotationData.currency,
    duration: quotationData.timeline,
    startDate: projectDates.startDate,
    endDate: projectDates.endDate,
    paymentTerms: getPaymentTermsDescription(paymentSchedule),
    
    // Risk-based terms
    warranties: isHighRisk ? [
      'Garantía extendida de 120 días post go-live',
      'Garantía bancaria del 15% del valor del contrato',
      'Supervisión técnica obligatoria por consultor senior'
    ] : [
      'Garantía de 90 días post go-live',
      'Garantía de funcionalidad según especificaciones',
      'Soporte técnico incluido primer mes'
    ],
    
    slaTerms: {
      responseTime: isHighValue ? '12 horas para issues críticos' : '24 horas para issues críticos',
      resolutionTime: isHighValue ? '48 horas para issues críticos' : '72 horas para issues críticos',
      availability: '99% durante horario laboral',
      penaltyForSLA: isHighValue ? '0.5% del pago mensual por cada día de incumplimiento SLA' : 'Penalidad según gravedad'
    },
    
    penaltyClauses: [
      `Penalización del ${isHighRisk ? '2%' : '1%'} del valor total por cada semana de retraso`,
      'Derecho del cliente a terminar contrato por incumplimiento grave',
      isHighRisk ? 'Revisión obligatoria cada 30 días del progreso del proyecto' : 'Revisiones mensuales de progreso'
    ],
    
    additionalTerms: verificationData.riskAssessment ? 
      verificationData.riskAssessment.riskFactors.map((risk: any) => ({
        risk: risk.title,
        mitigation: risk.mitigation
      })) : []
  }

  return {
    contractTerms,
    paymentSchedule,
    milestones,
    paymentTerms: getPaymentTermsDescription(paymentSchedule)
  }
}

function getTemplateName(templateId: string): string {
  const templates: Record<string, string> = {
    'standard_implementation': 'Implementación SAP Estándar',
    'upgrade_migration': 'Upgrade y Migración SAP',
    'consulting_services': 'Servicios de Consultoría SAP',
    'support_maintenance': 'Soporte y Mantenimiento SAP'
  }
  return templates[templateId] || 'Template Personalizado'
}

function getPaymentTermsDescription(paymentSchedule: any[]): string {
  return paymentSchedule.map(payment => `${payment.percentage}% ${payment.name.toLowerCase()}`).join(', ')
}

function addMonths(dateString: string, months: number): string {
  const date = new Date(dateString)
  date.setMonth(date.getMonth() + months)
  return date.toISOString().split('T')[0]
}

function addDays(dateString: string, days: number): string {
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}
