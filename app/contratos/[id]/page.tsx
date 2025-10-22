
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContractDetails } from '@/components/contracts/contract-details'
import { Loader2, ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ContractPageProps {
  params: {
    id: string
  }
}

interface ContractDetail {
  id: string
  contractNumber: string
  title: string
  description: string
  totalValue: number
  currency: string
  status: string
  startDate: string
  endDate: string
  clientSigned: boolean
  providerSigned: boolean
  client: {
    name: string
    companyName: string
  }
  provider: {
    name: string
    companyName: string
  }
  project: {
    title: string
  }
  milestones: any[]
  payments: any[]
  contractTerms: any
  createdAt: string
}

export default function ContractPage({ params }: ContractPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [contract, setContract] = useState<ContractDetail | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    loadContract()
  }, [session, status, params.id])

  const loadContract = async () => {
    try {
      const response = await fetch(`/api/contracts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setContract(data.contract)
      } else if (response.status === 404) {
        toast.error('Contrato no encontrado')
        router.push('/contratos')
      } else {
        throw new Error('Error loading contract')
      }
    } catch (error) {
      console.error('Error loading contract:', error)
      toast.error('Error al cargar el contrato')
      router.push('/contratos')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contrato no encontrado</h1>
          <p className="text-gray-600 mb-4">El contrato que buscas no existe o no tienes acceso a él.</p>
          <Button onClick={() => router.push('/contratos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Contratos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="outline"
              onClick={() => router.push('/contratos')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Contratos
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
                <p className="text-muted-foreground">Contrato #{contract.contractNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Details Component */}
        <ContractDetails 
          contract={contract}
          userType={session?.user?.userType || 'CLIENT'}
          onUpdate={loadContract}
        />
      </main>
      
      <Footer />
    </div>
  )
}
