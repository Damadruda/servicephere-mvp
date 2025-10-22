
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PaymentsHub } from '@/components/payments/payments-hub'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Pagos y Facturación - SAP Marketplace',
  description: 'Sistema completo de pagos con escrow seguro, fees transparentes y facturación automática'
}

async function getUserFinancialData(userId: string) {
  // Obtener transacciones del usuario
  const transactions = await prisma.escrowTransaction.findMany({
    where: {
      OR: [
        { payerId: userId },
        { payeeId: userId }
      ]
    },
    include: {
      contract: {
        include: {
          quotation: {
            include: {
              project: {
                select: { title: true }
              },
              provider: {
                select: { name: true }
              }
            }
          },
          client: {
            select: { name: true }
          }
        }
      },
      payer: {
        select: { name: true, email: true }
      },
      payee: {
        select: { name: true, email: true }
      },
      disputes: {
        where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  // Obtener facturas
  const invoices = await prisma.invoice.findMany({
    where: {
      OR: [
        { issuedToId: userId },
        { issuedById: userId }
      ]
    },
    include: {
      issuedBy: {
        select: { name: true }
      },
      issuedTo: {
        select: { name: true }
      },
      escrowTransaction: {
        select: { contractId: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  // Obtener balance del wallet
  const walletBalance = await prisma.wallet.findUnique({
    where: { userId },
    select: {
      balance: true,
      currency: true,
      frozenAmount: true
    }
  })

  // Calcular estadísticas financieras
  const totalReceived = transactions
    .filter(t => t.payeeId === userId && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPaid = transactions
    .filter(t => t.payerId === userId && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingEscrow = transactions
    .filter(t => t.status === 'ESCROWED')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalFees = transactions
    .filter(t => t.payerId === userId)
    .reduce((sum, t) => sum + (t.platformFee + t.paymentProcessingFee), 0)

  return {
    transactions,
    invoices,
    walletBalance: walletBalance || { balance: 0, currency: 'USD', frozenAmount: 0 },
    stats: {
      totalReceived,
      totalPaid,
      pendingEscrow,
      totalFees
    }
  }
}

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const financialData = await getUserFinancialData(session.user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <PaymentsHub 
        userId={session.user.id}
        userType={session.user.userType}
        financialData={financialData}
      />
    </div>
  )
}
