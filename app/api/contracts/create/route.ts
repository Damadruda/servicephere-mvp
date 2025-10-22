
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const { quotationId, dueDiligenceData } = await request.json()

    // Get quotation details
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        project: {
          include: {
            client: true
          }
        },
        provider: true
      }
    })

    if (!quotation || quotation.project.clientId !== session.user.id) {
      return NextResponse.json(
        { error: 'Quotation not found or unauthorized' },
        { status: 404 }
      )
    }

    // Create due diligence record
    const dueDiligence = await prisma.dueDiligence.create({
      data: {
        quotationId: quotation.id,
        providerId: quotation.providerId,
        credentialsVerified: dueDiligenceData.credentialsVerified,
        certificationsValid: dueDiligenceData.certificationsValid,
        referencesChecked: dueDiligenceData.referencesChecked,
        financialStatusOk: dueDiligenceData.financialStatusOk,
        legalComplianceOk: dueDiligenceData.legalComplianceOk,
        reliabilityScore: dueDiligenceData.reliabilityScore,
        experienceScore: dueDiligenceData.experienceScore,
        performanceScore: dueDiligenceData.performanceScore,
        overallScore: dueDiligenceData.overallScore,
        verificationDetails: dueDiligenceData.verificationDetails,
        referenceContacts: dueDiligenceData.referenceContacts,
        certificationDetails: dueDiligenceData.certificationDetails,
        riskAssessment: dueDiligenceData.riskAssessment,
        status: dueDiligenceData.overallScore >= 70 ? 'APPROVED' : 'REJECTED',
        completedAt: new Date()
      }
    })

    // Generate contract number
    const contractNumber = `SAP-${Date.now()}-${quotation.project.id.substring(0, 8).toUpperCase()}`

    // Create contract
    const contract = await prisma.contract.create({
      data: {
        quotationId: quotation.id,
        clientId: session.user.id,
        providerId: quotation.providerId,
        contractNumber,
        title: quotation.title,
        description: quotation.description,
        totalValue: quotation.totalCost,
        currency: quotation.currency,
        startDate: new Date(dueDiligenceData.startDate),
        endDate: new Date(dueDiligenceData.endDate),
        milestones: dueDiligenceData.milestones,
        deliverables: quotation.deliverables,
        contractTerms: dueDiligenceData.contractTerms,
        paymentTerms: quotation.paymentTerms,
        paymentSchedule: dueDiligenceData.paymentSchedule,
        status: 'DRAFT'
      }
    })

    // Create payment records
    if (dueDiligenceData.paymentSchedule && Array.isArray(dueDiligenceData.paymentSchedule)) {
      await Promise.all(
        dueDiligenceData.paymentSchedule.map((payment: any) =>
          prisma.payment.create({
            data: {
              contractId: contract.id,
              amount: payment.amount,
              currency: quotation.currency,
              description: payment.description,
              dueDate: new Date(payment.dueDate),
              status: 'PENDING'
            }
          })
        )
      )
    }

    // Update quotation status
    await prisma.quotation.update({
      where: { id: quotation.id },
      data: { 
        status: 'ACCEPTED',
        respondedAt: new Date()
      }
    })

    return NextResponse.json(
      { 
        success: true,
        contractId: contract.id,
        dueDiligenceId: dueDiligence.id,
        message: 'Contrato creado exitosamente'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
