
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ProjectOpportunityCard } from './project-opportunity-card'
import { Search, Filter, SortAsc, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  description: string
  industry: string
  sapModules: string[]
  budget: string
  timeline: string
  location: {
    country: string
    city: string
    isRemote: boolean
  }
  client: {
    name: string
    companyName: string
  }
  publishedAt: string
  deadline?: string
  matchingScore?: number
}

export function ProjectOpportunities() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [sortBy, setSortBy] = useState('matchingScore')
  
  const router = useRouter()

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [projects, searchTerm, industryFilter, budgetFilter, sortBy])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects/opportunities')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      } else {
        throw new Error('Failed to load projects')
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Error al cargar oportunidades')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...projects]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.sapModules.some(module => 
          module.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(project => project.industry === industryFilter)
    }

    // Budget filter
    if (budgetFilter !== 'all') {
      filtered = filtered.filter(project => project.budget === budgetFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'matchingScore':
          return (b.matchingScore || 0) - (a.matchingScore || 0)
        case 'publishedAt':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case 'budget':
          // Simple budget sorting (could be improved)
          return b.budget.localeCompare(a.budget)
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }

  const handleCreateQuotation = (projectId: string) => {
    router.push(`/cotizaciones/crear/${projectId}`)
  }

  const industries = ['all', 'Manufactura', 'Retail', 'Servicios Financieros', 'Healthcare', 'Tecnología', 'Otro']
  const budgets = ['all', 'Menos de $50k', '$50k - $100k', '$100k - $250k', '$250k - $500k', 'Más de $500k']

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
          <CardDescription>
            Encuentra oportunidades que coincidan con tu experiencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Industry Filter */}
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Industria" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry === 'all' ? 'Todas las industrias' : industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Budget Filter */}
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Presupuesto" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((budget) => (
                  <SelectItem key={budget} value={budget}>
                    {budget === 'all' ? 'Todos los presupuestos' : budget}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchingScore">Mejor matching</SelectItem>
                <SelectItem value="publishedAt">Más recientes</SelectItem>
                <SelectItem value="budget">Presupuesto</SelectItem>
                <SelectItem value="deadline">Fecha límite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">
            {filteredProjects.length} oportunidad{filteredProjects.length !== 1 ? 'es' : ''} encontrada{filteredProjects.length !== 1 ? 's' : ''}
          </h2>
          {searchTerm && (
            <Badge variant="secondary">
              Búsqueda: "{searchTerm}"
            </Badge>
          )}
          {industryFilter !== 'all' && (
            <Badge variant="secondary">
              {industryFilter}
            </Badge>
          )}
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron oportunidades</h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar los filtros o revisa más tarde para nuevas oportunidades.
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setIndustryFilter('all')
              setBudgetFilter('all')
            }}>
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <ProjectOpportunityCard
              key={project.id}
              project={project}
              onCreateQuotation={handleCreateQuotation}
            />
          ))}
        </div>
      )}
    </div>
  )
}
