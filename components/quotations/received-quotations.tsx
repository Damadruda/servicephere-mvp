
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuotationCard } from './quotation-card'
import { QuotationComparison } from './quotation-comparison'
import { Search, Filter, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Quotation {
  id: string
  title: string
  description: string
  totalCost: number
  currency: string
  timeline: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  submittedAt: string
  validUntil: string
  project: {
    id: string
    title: string
  }
  provider: {
    id: string
    name: string
    companyName: string
    industry: string
    website?: string
  }
}

export function ReceivedQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('submittedAt')
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    loadQuotations()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [quotations, searchTerm, statusFilter, sortBy])

  const loadQuotations = async () => {
    try {
      const response = await fetch('/api/quotations/received')
      if (response.ok) {
        const data = await response.json()
        setQuotations(data.quotations || [])
      } else {
        throw new Error('Failed to load quotations')
      }
    } catch (error) {
      console.error('Error loading quotations:', error)
      toast.error('Error al cargar cotizaciones')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...quotations]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quotation =>
        quotation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.provider.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.project.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quotation => quotation.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'submittedAt':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        case 'totalCost':
          return a.totalCost - b.totalCost
        case 'validUntil':
          return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
        case 'provider':
          return a.provider.companyName.localeCompare(b.provider.companyName)
        default:
          return 0
      }
    })

    setFilteredQuotations(filtered)
  }

  const handleQuotationAction = async (quotationId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/quotations/${quotationId}/${action}`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success(
          action === 'accept' 
            ? 'Cotización aceptada exitosamente' 
            : 'Cotización rechazada'
        )
        loadQuotations()
      } else {
        throw new Error(`Failed to ${action} quotation`)
      }
    } catch (error) {
      console.error(`Error ${action}ing quotation:`, error)
      toast.error(`Error al ${action === 'accept' ? 'aceptar' : 'rechazar'} la cotización`)
    }
  }

  const handleSelectQuotation = (quotationId: string) => {
    setSelectedQuotations(prev => {
      if (prev.includes(quotationId)) {
        return prev.filter(id => id !== quotationId)
      } else if (prev.length < 3) {
        return [...prev, quotationId]
      } else {
        toast.warning('Máximo 3 cotizaciones para comparar')
        return prev
      }
    })
  }

  const getSelectedQuotationsData = () => {
    return quotations.filter(q => selectedQuotations.includes(q.id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente'
      case 'ACCEPTED': return 'Aceptada'
      case 'REJECTED': return 'Rechazada'
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

  if (showComparison) {
    return (
      <QuotationComparison
        quotations={getSelectedQuotationsData()}
        onBack={() => setShowComparison(false)}
        onAction={handleQuotationAction}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Mis Cotizaciones</CardTitle>
              <CardDescription>
                {filteredQuotations.length} cotización{filteredQuotations.length !== 1 ? 'es' : ''} encontrada{filteredQuotations.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            {selectedQuotations.length > 1 && (
              <Button onClick={() => setShowComparison(true)}>
                Comparar ({selectedQuotations.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cotizaciones..."
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
                <SelectItem value="PENDING">Pendientes</SelectItem>
                <SelectItem value="ACCEPTED">Aceptadas</SelectItem>
                <SelectItem value="REJECTED">Rechazadas</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submittedAt">Más recientes</SelectItem>
                <SelectItem value="totalCost">Menor costo</SelectItem>
                <SelectItem value="validUntil">Por vencer</SelectItem>
                <SelectItem value="provider">Proveedor</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Selection */}
            {selectedQuotations.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedQuotations([])}
              >
                Limpiar selección
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{quotations.filter(q => q.status === 'PENDING').length}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{quotations.filter(q => q.status === 'ACCEPTED').length}</p>
                <p className="text-sm text-muted-foreground">Aceptadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <div>
                <p className="text-2xl font-bold">{quotations.filter(q => q.status === 'REJECTED').length}</p>
                <p className="text-sm text-muted-foreground">Rechazadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{quotations.filter(q => 
                  new Date(q.validUntil) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
                  q.status === 'PENDING'
                ).length}</p>
                <p className="text-sm text-muted-foreground">Por vencer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotations List */}
      {filteredQuotations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay cotizaciones</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron cotizaciones con los filtros aplicados.'
                : 'Aún no has recibido cotizaciones para tus proyectos.'}
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
            }}>
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuotations.map((quotation) => (
            <QuotationCard
              key={quotation.id}
              quotation={quotation}
              isSelected={selectedQuotations.includes(quotation.id)}
              onSelect={() => handleSelectQuotation(quotation.id)}
              onAction={handleQuotationAction}
            />
          ))}
        </div>
      )}
    </div>
  )
}
