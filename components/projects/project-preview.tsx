
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ProjectCreationData } from './project-creation-wizard'
import { Eye, Globe, Lock, Users, Edit2, CheckCircle } from 'lucide-react'

interface ProjectPreviewProps {
  data: ProjectCreationData
  onUpdate: (updates: Partial<ProjectCreationData>) => void
}

const visibilityOptions = [
  {
    value: 'public',
    label: 'Público',
    description: 'Visible para todos los consultores en la plataforma',
    icon: Globe,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    value: 'private',
    label: 'Privado',
    description: 'Solo tú puedes ver este proyecto',
    icon: Lock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  {
    value: 'inviteOnly',
    label: 'Solo por Invitación',
    description: 'Visible solo para consultores que invites',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
]

export function ProjectPreview({ data, onUpdate }: ProjectPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)

  const selectedVisibility = visibilityOptions.find(opt => opt.value === data.visibility) || visibilityOptions[0]
  const VisibilityIcon = selectedVisibility.icon

  const formatModules = (modules: string[]) => {
    if (modules.length <= 3) return modules.join(', ')
    return `${modules.slice(0, 3).join(', ')} y ${modules.length - 3} más`
  }

  const getImplementationTypeLabel = (type: string) => {
    const types = {
      'new': 'Nueva Implementación',
      'upgrade': 'Actualización/Upgrade',
      'migration': 'Migración',
      'optimization': 'Optimización'
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <div className="space-y-8">
      {/* Publication Settings */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Configuración de Publicación</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Define quién puede ver tu proyecto
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {visibilityOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  data.visibility === option.value ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onUpdate({ visibility: option.value as any })}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${option.bgColor}`}>
                      <Icon className={`h-4 w-4 ${option.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{option.label}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {data.visibility === 'inviteOnly' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-800">
                  Invitar Consultores Específicos (Opcional)
                </Label>
                <p className="text-xs text-blue-700">
                  Podrás invitar consultores específicos después de publicar el proyecto.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Project Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Vista Previa del Proyecto</Label>
          <div className={`flex items-center space-x-1 text-sm ${selectedVisibility.color}`}>
            <VisibilityIcon className="h-4 w-4" />
            <span>{selectedVisibility.label}</span>
          </div>
        </div>
        
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{data.title || 'Título del proyecto'}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>📍 {data.location.country || 'Ubicación'}, {data.location.city || 'Ciudad'}</span>
                  {data.location.isRemote && <Badge variant="outline">Remoto permitido</Badge>}
                  <span>⏱️ {data.timeline || 'Timeline'}</span>
                  <span>💰 {data.budget || 'Presupuesto'}</span>
                </div>
              </div>
              <Badge variant="secondary">{getImplementationTypeLabel(data.implementationType)}</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Descripción del Proyecto</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {data.description || 'Descripción del proyecto...'}
              </p>
            </div>

            <Separator />

            {/* Technical Details */}
            <div className="space-y-4">
              <h4 className="font-medium">Detalles Técnicos</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Módulos SAP Requeridos</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.sapModules.length > 0 ? (
                      data.sapModules.slice(0, 3).map((module) => (
                        <Badge key={module} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Módulos por definir</span>
                    )}
                    {data.sapModules.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{data.sapModules.length - 3} más
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Metodología</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {data.methodology || 'Por definir'}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Preferencia de Despliegue</Label>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {data.cloudPreference.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Tamaño del Equipo</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {data.teamSize || 'Por definir'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Context */}
            <div className="space-y-4">
              <h4 className="font-medium">Contexto de Negocio</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Industria</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {data.industry || 'Por definir'}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Procesos Prioritarios</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.businessProcesses.length > 0 ? (
                      data.businessProcesses.slice(0, 2).map((process) => (
                        <Badge key={process} variant="secondary" className="text-xs">
                          {process}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Procesos por definir</span>
                    )}
                    {data.businessProcesses.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{data.businessProcesses.length - 2} más
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {data.requirements && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Requerimientos Específicos</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {data.requirements}
                  </p>
                </div>
              </>
            )}

            {/* Compliance & Integrations */}
            {(data.complianceRequirements.length > 0 || data.integrationNeeds.length > 0) && (
              <>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  {data.complianceRequirements.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Compliance</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {data.complianceRequirements.slice(0, 2).map((req) => (
                          <Badge key={req} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {data.complianceRequirements.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{data.complianceRequirements.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {data.integrationNeeds.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Integraciones</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {data.integrationNeeds.slice(0, 2).map((integration) => (
                          <Badge key={integration} variant="outline" className="text-xs">
                            {integration}
                          </Badge>
                        ))}
                        {data.integrationNeeds.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{data.integrationNeeds.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Final Checklist */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            ¿Todo listo para publicar?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.title ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.title ? 'text-green-700' : 'text-gray-600'}>
                  Título descriptivo
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.description ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.description ? 'text-green-700' : 'text-gray-600'}>
                  Descripción completa
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.sapModules.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.sapModules.length > 0 ? 'text-green-700' : 'text-gray-600'}>
                  Módulos SAP definidos
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.budget ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.budget ? 'text-green-700' : 'text-gray-600'}>
                  Presupuesto estimado
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.timeline ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.timeline ? 'text-green-700' : 'text-gray-600'}>
                  Timeline definido
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${data.location.country ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={data.location.country ? 'text-green-700' : 'text-gray-600'}>
                  Ubicación especificada
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h4 className="font-medium text-blue-800">
              🚀 ¡Excelente! Tu proyecto está listo para conectar con consultores SAP
            </h4>
            <p className="text-sm text-blue-700">
              Una vez publicado, recibirás notificaciones cuando consultores especializados se interesen en tu proyecto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
