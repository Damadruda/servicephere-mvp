
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Star, Award, Users, Filter, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ProviderProfile } from '@/lib/types'
import { motion } from 'framer-motion'

export function ServicesExplorer() {
  const [providers, setProviders] = useState<ProviderProfile[]>([])
  const [filteredProviders, setFilteredProviders] = useState<ProviderProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    industry: '',
    partnerLevel: '',
    country: '',
    minRating: '',
    sapModule: ''
  })

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    filterProviders()
  }, [providers, searchTerm, filters])

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/providers/search')
      if (response.ok) {
        const data = await response.json()
        setProviders(data)
        setFilteredProviders(data)
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProviders = () => {
    let filtered = [...providers]

    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.partnerLevel) {
      filtered = filtered.filter(provider => provider.partnerLevel === filters.partnerLevel)
    }

    if (filters.country) {
      filtered = filtered.filter(provider => 
        provider.country.toLowerCase().includes(filters.country.toLowerCase())
      )
    }

    if (filters.minRating) {
      const minRating = parseFloat(filters.minRating)
      filtered = filtered.filter(provider => provider.averageRating >= minRating)
    }

    setFilteredProviders(filtered)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      industry: '',
      partnerLevel: '',
      country: '',
      minRating: '',
      sapModule: ''
    })
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-muted animate-pulse rounded-lg" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
            Buscar y Filtrar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar consultores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.partnerLevel} onValueChange={(value) => handleFilterChange('partnerLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel de Partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="PLATINUM">Platinum</SelectItem>
                <SelectItem value="GOLD">Gold</SelectItem>
                <SelectItem value="SILVER">Silver</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="País"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            />

            <Select value={filters.minRating} onValueChange={(value) => handleFilterChange('minRating', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Calificación mínima" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier calificación</SelectItem>
                <SelectItem value="4">4+ estrellas</SelectItem>
                <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                <SelectItem value="4.8">4.8+ estrellas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredProviders.length} consultores encontrados
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      {filteredProviders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron consultores</h3>
            <p className="text-muted-foreground text-center">
              Intenta ajustar tus filtros de búsqueda para encontrar más resultados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={provider.logo || "https://i.pinimg.com/originals/58/cc/3f/58cc3f8f27ab1ba62291eba894fa11f0.jpg"}
                        alt={`${provider.companyName} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {provider.companyName}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {provider.city}, {provider.country}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {provider.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {provider.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({provider.totalReviews})
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{provider.totalProjects} proyectos</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {provider.isPartner && provider.partnerLevel && (
                      <Badge variant="outline" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Partner {provider.partnerLevel}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {provider.employeeCount}
                    </Badge>
                  </div>

                  {provider.certifications && provider.certifications.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Certificaciones:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.certifications.slice(0, 3).map((cert) => (
                          <Badge key={cert.id} variant="outline" className="text-xs">
                            {cert.sapModule}
                          </Badge>
                        ))}
                        {provider.certifications.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.certifications.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/proveedores/${provider.id}`}>
                        Ver Perfil
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="flex-1">
                      <Link href={`/proveedores/${provider.id}/contactar`}>
                        Contactar
                      </Link>
                    </Button>
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
