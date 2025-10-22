
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CommunicationHub } from '@/components/communication/communication-hub'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Centro de Comunicación - SAP Marketplace',
  description: 'Sistema unificado de comunicación multi-canal con chat, video llamadas y colaboración en tiempo real'
}

async function getUserCommunicationData(userId: string) {
  // Obtener conversaciones activas
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { clientId: userId },
        { providerId: userId }
      ],
      isActive: true
    },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: { name: true, email: true }
          }
        }
      },
      project: {
        select: { 
          title: true,
          client: { select: { name: true } },
          quotations: {
            select: { provider: { select: { name: true } } }
          }
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  // Obtener notificaciones no leídas
  const unreadNotifications = await prisma.notification.findMany({
    where: {
      userId,
      isRead: false
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  // Obtener contratos activos para contexto
  const activeContracts = await prisma.contract.findMany({
    where: {
      OR: [
        { clientId: userId },
        { providerId: userId }
      ],
      status: 'ACTIVE'
    },
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
  })

  return {
    conversations,
    unreadNotifications,
    activeContracts
  }
}

export default async function CommunicationPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const communicationData = await getUserCommunicationData(session.user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <CommunicationHub 
        userId={session.user.id}
        userType={session.user.userType}
        communicationData={communicationData}
      />
    </div>
  )
}
