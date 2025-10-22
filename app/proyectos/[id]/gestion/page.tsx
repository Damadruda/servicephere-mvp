
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectManagementDashboard } from '@/components/project-management/project-management-dashboard'
import { prisma } from '@/lib/prisma'

interface Props {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Gestión de Proyecto - SAP Marketplace',
  description: 'Gestión completa del proyecto con tracking de milestones, comunicación y reportes'
}

async function getProjectData(contractId: string) {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      quotation: {
        include: {
          project: {
            include: {
              client: {
                include: {
                  clientProfile: true
                }
              }
            }
          },
          provider: {
            include: {
              providerProfile: true
            }
          }
        }
      },
      payments: {
        orderBy: {
          dueDate: 'asc'
        }
      },
      milestoneUpdates: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!contract) {
    return null
  }

  // Get communication data
  const conversations = await prisma.conversation.findMany({
    where: {
      projectId: contract.quotation.project.id
    },
    include: {
      messages: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          sender: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  return {
    contract,
    conversations
  }
}

export default async function ProjectManagementPage({ params }: Props) {
  const data = await getProjectData(params.id)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ProjectManagementDashboard 
        contract={data.contract}
        conversations={data.conversations}
      />
    </div>
  )
}
