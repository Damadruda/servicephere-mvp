
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MapPin, Calendar, DollarSign, Clock, Building, Star, ChevronDown, ChevronUp, Users } from 'lucide-react'

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

interface ProjectOpportunityCardProps {
  project: Project
  onCreateQuotation: (projectId: string) => void
}

export function ProjectOpportunityCard({ project, onCreateQuotation }: ProjectOpportunityCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getMatchingColor = (score?: number) => {
    if (!score) return 'bg-gray-500'
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysAgo = (dateString: string) => {
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
    return days === 0 ? 'Hoy' : `Hace ${days} día${days !== 1 ? 's' : ''}`
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              {project.matchingScore && (
                <div className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded-full ${getMatchingColor(project.matchingScore)}`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {Math.round(project.matchingScore)}% match
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{project.client.companyName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{getDaysAgo(project.publishedAt)}</span>
              </div>
              {project.deadline && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Vence: {formatDate(project.deadline)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary">{project.industry}</Badge>
              <div className="flex items-center space-x-1 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{project.location.country}, {project.location.city}</span>
                {project.location.isRemote && (
                  <Badge variant="outline">Remoto OK</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1 text-lg font-semibold text-green-600">
              <DollarSign className="h-5 w-5" />
              <span>{project.budget}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {project.timeline}
            </div>
          </div>
        </div>

        <CardDescription className="text-sm">
          {expanded ? project.description : `${project.description.substring(0, 150)}...`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* SAP Modules */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Módulos SAP Requeridos</h4>
            <div className="flex flex-wrap gap-2">
              {project.sapModules.slice(0, expanded ? undefined : 4).map((module) => (
                <Badge key={module} variant="outline" className="text-xs">
                  {module}
                </Badge>
              ))}
              {!expanded && project.sapModules.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.sapModules.length - 4} más
                </Badge>
              )}
            </div>
          </div>

          {expanded && (
            <>
              <Separator />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Descripción completa:</strong></p>
                <p className="whitespace-pre-wrap">{project.description}</p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-1"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Ver menos</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Ver más detalles</span>
                </>
              )}
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/proyectos/${project.id}`, '_blank')}
              >
                Ver proyecto completo
              </Button>
              <Button
                size="sm"
                onClick={() => onCreateQuotation(project.id)}
                className="bg-primary hover:bg-primary/90"
              >
                <Users className="h-4 w-4 mr-2" />
                Crear Cotización
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
