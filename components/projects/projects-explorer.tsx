
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, DollarSign, Clock, Building, Users, Filter } from 'lucide-react'
import Link from 'next/link'
import { Project } from '@/lib/types'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

export function ProjectsExplorer() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    industry: '',
    budget: '',
    timeline: '',
    country: '',
    sapModule: '',
    isRemote: ''
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, filters])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/public')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
        setFilteredProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProjects = () => {
    let filtered = [...projects]

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.industry) {
      filtered = filtered.filter(project => project.industry === filters.industry)
    }

    if (filters.budget) {
      filtered = filtered.filter(project => project.budget === filters.budget)
    }

    if (filters.timeline) {
      filtered = filtered.filter(project => project.timeline === filters.timeline)
    }

    if (filters.country) {
      filtered = filtered.filter(project => 
        project.country.toLowerCase().includes(filters.country.toLowerCase())
      )
    }

    if (filters.sapModule) {
      filtered = filtered.filter(project => 
        project.sapModules.includes(filters.sapModule)
      )
    }

    if (filters.isRemote === 'true') {
      filtered = filtered.filter(project => project.isRemote)
    } else if (filters.isRemote === 'false') {
      filtered = filtered.filter(project => !project.isRemote)
    }

    setFilteredProjects(filtered)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      industry: '',
      budget: '',
      timeline: '',
      country: '',
      sapModule: '',
      isRemote: ''
    })
    setSearchTerm('')
  }

  const getStatusColor = (project: Project) => {
    const publishedDate = project.publishedAt ? new Date(project.publishedAt) : new Date()
    const daysOld = Math.floor((new Date().getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysOld <= 3) return 'bg-green-500'
    if (daysOld <= 7) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-muted animate-pulse rounded-lg" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Buscar y Filtrar Proyectos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Industria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las industrias</SelectItem>
                <SelectItem value="manufacturing">Manufactura</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="finance">Financiero</SelectItem>
                <SelectItem value="healthcare">Salud</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="automotive">Automotriz</SelectItem>
                <SelectItem value="technology">Tecnología</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.budget} onValueChange={(value) => handleFilterChange('budget', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Presupuesto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier presupuesto</SelectItem>
                <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="1m+">$1M+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sapModule} onValueChange={(value) => handleFilterChange('sapModule', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Módulo SAP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los módulos</SelectItem>
                <SelectItem value="FI">Finance (FI)</SelectItem>
                <SelectItem value="SD">Sales & Distribution (SD)</SelectItem>
                <SelectItem value="MM">Materials Management (MM)</SelectItem>
                <SelectItem value="PP">Production Planning (PP)</SelectItem>
                <SelectItem value="CO">Controlling (CO)</SelectItem>
                <SelectItem value="PM">Plant Maintenance (PM)</SelectItem>
                <SelectItem value="HR">Human Resources (HR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select value={filters.timeline} onValueChange={(value) => handleFilterChange('timeline', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier timeline</SelectItem>
                <SelectItem value="1-3m">1-3 meses</SelectItem>
                <SelectItem value="3-6m">3-6 meses</SelectItem>
                <SelectItem value="6-12m">6-12 meses</SelectItem>
                <SelectItem value="12m+">12+ meses</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="País"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            />

            <Select value={filters.isRemote} onValueChange={(value) => handleFilterChange('isRemote', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier modalidad</SelectItem>
                <SelectItem value="true">Remoto</SelectItem>
                <SelectItem value="false">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredProjects.length} proyectos encontrados
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron proyectos</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar tus filtros de búsqueda para encontrar más resultados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {project.client.clientProfile?.companyName || project.client.name}
                        <span className="mx-2">•</span>
                        <MapPin className="h-3 w-3 mr-1" />
                        {project.country}
                        {project.isRemote && <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 rounded">Remoto</span>}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(project)} text-white`}>
                      {project.status === 'PUBLISHED' ? 'Nuevo' : 'Activo'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {project.industry}
                    </Badge>
                    {project.sapModules.map((module) => (
                      <Badge key={module} variant="secondary" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      <span className="font-medium">{project.budget}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                      <span>{project.timeline}</span>
                    </div>
                  </div>

                  {project.teamSize && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Equipo: {project.teamSize}</span>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/proyectos/${project.id}`}>
                        Ver Detalles
                      </Link>
                    </Button>
                    {session?.user?.userType === 'PROVIDER' && (
                      <Button size="sm" asChild className="flex-1">
                        <Link href={`/proyectos/${project.id}/cotizar`}>
                          Enviar Cotización
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
