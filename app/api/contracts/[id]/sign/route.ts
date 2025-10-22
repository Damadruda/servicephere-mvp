
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const contract = await prisma.contract.findUnique({
      where: { id: params.id }
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      )
    }

    // Check permissions and signature status
    if (contract.status !== 'PENDING_SIGNATURES') {
      return NextResponse.json(
        { error: 'Contract is not in pending signatures status' },
        { status: 400 }
      )
    }

    let updateData: any = {}
    
    if (session.user.id === contract.clientId && !contract.clientSigned) {
      updateData = {
        clientSigned: true,
        clientSignedAt: new Date(),
        clientSignature: `digital-signature-${Date.now()}-client`
      }
    } else if (session.user.id === contract.providerId && !contract.providerSigned) {
      updateData = {
        providerSigned: true,
        providerSignedAt: new Date(),
        providerSignature: `digital-signature-${Date.now()}-provider`
      }
    } else {
      return NextResponse.json(
        { error: 'You have already signed this contract or are not authorized to sign' },
        { status: 400 }
      )
    }

    // Check if both parties will have signed after this update
    const bothWillBeSigned = (
      (contract.clientSigned || updateData.clientSigned) && 
      (contract.providerSigned || updateData.providerSigned)
    )

    if (bothWillBeSigned) {
      updateData.status = 'ACTIVE'
    }

    const updatedContract = await prisma.contract.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Contract signed successfully',
      contractStatus: updatedContract.status
    })
  } catch (error) {
    console.error('Error signing contract:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
