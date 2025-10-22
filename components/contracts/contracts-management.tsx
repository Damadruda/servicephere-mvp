
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ContractCard } from './contract-card'
import { Search, Filter, Calendar, Loader2, AlertCircle, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Contract {
  id: string
  contractNumber: string
  title: string
  description: string
  totalValue: number
  currency: string
  status: 'DRAFT' | 'PENDING_SIGNATURES' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
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
  createdAt: string
}

export function ContractsManagement() {
  const { data: session } = useSession()
  const router = useRouter()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  useEffect(() => {
    loadContracts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [contracts, searchTerm, statusFilter, sortBy])

  const loadContracts = async () => {
    try {
      const response = await fetch('/api/contracts/my-contracts')
      if (response.ok) {
        const data = await response.json()
        setContracts(data.contracts || [])
      } else {
        throw new Error('Failed to load contracts')
      }
    } catch (error) {
      console.error('Error loading contracts:', error)
      toast.error('Error al cargar contratos')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...contracts]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.provider.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'startDate':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case 'totalValue':
          return b.totalValue - a.totalValue
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    setFilteredContracts(filtered)
  }

  const handleContractAction = async (contractId: string, action: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/${action}`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success(`Acción ${action} ejecutada exitosamente`)
        loadContracts()
      } else {
        throw new Error(`Failed to ${action} contract`)
      }
    } catch (error) {
      console.error(`Error ${action} contract:`, error)
      toast.error(`Error al ejecutar ${action}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'PENDING_SIGNATURES': return 'bg-yellow-100 text-yellow-800'
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Borrador'
      case 'PENDING_SIGNATURES': return 'Pendiente Firmas'
      case 'ACTIVE': return 'Activo'
      case 'COMPLETED': return 'Completado'
      case 'CANCELLED': return 'Cancelado'
      case 'EXPIRED': return 'Expirado'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Mis Contratos</CardTitle>
              <CardDescription>
                {filteredContracts.length} contrato{filteredContracts.length !== 1 ? 's' : ''} encontrado{filteredContracts.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="PENDING_SIGNATURES">Pendiente Firmas</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Más recientes</SelectItem>
                <SelectItem value="startDate">Fecha inicio</SelectItem>
                <SelectItem value="totalValue">Valor</SelectItem>
                <SelectItem value="status">Estado</SelectItem>
              </SelectContent>
            </Select>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/cotizaciones/recibidas')}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Cotizaciones
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{contracts.filter(c => c.status === 'PENDING_SIGNATURES').length}</p>
                <p className="text-sm text-muted-foreground">Pendiente Firmas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{contracts.filter(c => c.status === 'ACTIVE').length}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{contracts.filter(c => c.status === 'COMPLETED').length}</p>
                <p className="text-sm text-muted-foreground">Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{contracts.filter(c => c.status === 'DRAFT').length}</p>
                <p className="text-sm text-muted-foreground">Borradores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  ${contracts.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay contratos</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron contratos con los filtros aplicados.'
                : session?.user?.userType === 'CLIENT' 
                  ? 'Aún no tienes contratos. Acepta una cotización para crear tu primer contrato.'
                  : 'Aún no tienes contratos como proveedor.'}
            </p>
            <div className="space-x-2">
              <Button onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}>
                Limpiar filtros
              </Button>
              {session?.user?.userType === 'CLIENT' && (
                <Button variant="outline" onClick={() => router.push('/cotizaciones/recibidas')}>
                  Ver Cotizaciones
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              userType={session?.user?.userType || 'CLIENT'}
              onAction={handleContractAction}
            />
          ))}
        </div>
      )}
    </div>
  )
}
