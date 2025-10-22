
'use client'

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectCreationData } from './project-creation-wizard'
import { Database, Cloud, Cog, Workflow } from 'lucide-react'

interface ProjectTechnicalDetailsProps {
  data: ProjectCreationData
  onUpdate: (updates: Partial<ProjectCreationData>) => void
  initialData?: any
}

const sapModules = {
  financial: [
    'FI - Financial Accounting',
    'CO - Controlling',
    'TR - Treasury',
    'FM - Funds Management',
    'IM - Investment Management'
  ],
  logistics: [
    'SD - Sales & Distribution',
    'MM - Materials Management',
    'PP - Production Planning',
    'QM - Quality Management',
    'PM - Plant Maintenance',
    'WM - Warehouse Management',
    'LE - Logistics Execution'
  ],
  hr: [
    'HR - Human Resources',
    'PY - Payroll',
    'TM - Time Management',
    'PA - Personnel Administration',
    'OM - Organizational Management'
  ],
  analytics: [
    'BW - Business Warehouse',
    'BO - BusinessObjects',
    'Analytics Cloud',
    'BPC - Business Planning'
  ],
  industry: [
    'IS-Retail',
    'IS-Oil & Gas',
    'IS-Utilities',
    'IS-Banking',
    'IS-Insurance',
    'IS-Automotive',
    'IS-Healthcare'
  ]
}

const allModules = Object.values(sapModules).flat()

const implementationTypes = [
  {
    id: 'new',
    title: 'Nueva Implementación',
    description: 'Implementar SAP desde cero',
    icon: Database,
    details: 'Para empresas que no tienen SAP o sistemas ERP robustos'
  },
  {
    id: 'upgrade',
    title: 'Actualización/Upgrade',
    description: 'Actualizar versión existente de SAP',
    icon: Workflow,
    details: 'Migrar a S/4HANA o versiones más recientes'
  },
  {
    id: 'migration',
    title: 'Migración',
    description: 'Migrar desde otro sistema ERP',
    icon: Database,
    details: 'Reemplazar Oracle, JDE, Microsoft u otros sistemas'
  },
  {
    id: 'optimization',
    title: 'Optimización',
    description: 'Mejorar implementación actual',
    icon: Cog,
    details: 'Optimizar procesos y funcionalidades existentes'
  }
]

const methodologies = [
  { value: 'SAP Activate', label: 'SAP Activate', description: 'Metodología moderna y ágil de SAP' },
  { value: 'ASAP', label: 'ASAP (AcceleratedSAP)', description: 'Metodología tradicional de SAP' },
  { value: 'Agile', label: 'Metodología Ágil', description: 'Enfoque iterativo y flexible' },
  { value: 'Waterfall', label: 'Cascada (Waterfall)', description: 'Enfoque secuencial tradicional' },
  { value: 'Hybrid', label: 'Híbrido', description: 'Combinación de metodologías' }
]

const cloudPreferences = [
  { value: 'cloud', label: 'Cloud (SaaS)', icon: Cloud, description: 'Implementación completamente en la nube' },
  { value: 'onPremise', label: 'On-Premise', icon: Database, description: 'Instalación en servidores propios' },
  { value: 'hybrid', label: 'Híbrido', icon: Workflow, description: 'Combinación de cloud y on-premise' },
  { value: 'noPreference', label: 'Sin preferencia', icon: Cog, description: 'Abierto a recomendaciones' }
]

export function ProjectTechnicalDetails({ data, onUpdate, initialData }: ProjectTechnicalDetailsProps) {
  const handleModuleToggle = (module: string, checked: boolean) => {
    const updated = checked
      ? [...data.sapModules, module]
      : data.sapModules.filter(m => m !== module)
    onUpdate({ sapModules: updated })
  }

  const handleSelectAllModules = (category: string) => {
    const categoryModules = sapModules[category as keyof typeof sapModules]
    if (!categoryModules) return
    
    const allSelected = categoryModules.every(module => data.sapModules.includes(module))
    
    if (allSelected) {
      // Deselect all from this category
      const updated = data.sapModules.filter(m => !categoryModules.includes(m))
      onUpdate({ sapModules: updated })
    } else {
      // Select all from this category
      const updated = [...new Set([...data.sapModules, ...categoryModules])]
      onUpdate({ sapModules: updated })
    }
  }

  return (
    <div className="space-y-8">
      {/* Implementation Type */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Tipo de Implementación</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Define el alcance y naturaleza de tu proyecto SAP
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {implementationTypes.map((type) => {
            const Icon = type.icon
            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  data.implementationType === type.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onUpdate({ implementationType: type.id as any })}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{type.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {type.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{type.details}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* SAP Modules */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Módulos SAP Requeridos</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona todos los módulos que necesitas implementar o optimizar
          </p>
        </div>
        
        {Object.entries(sapModules).map(([category, modules]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-primary capitalize">
                {category === 'financial' && '💰 Módulos Financieros'}
                {category === 'logistics' && '📦 Módulos Logísticos'}
                {category === 'hr' && '👥 Recursos Humanos'}
                {category === 'analytics' && '📊 Analytics y Reporting'}
                {category === 'industry' && '🏭 Soluciones Específicas por Industria'}
              </h4>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleSelectAllModules(category)}
              >
                {modules.every(module => data.sapModules.includes(module)) 
                  ? 'Deseleccionar todos' 
                  : 'Seleccionar todos'
                }
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
              {modules.map((module) => (
                <div key={module} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    id={`module-${module}`}
                    checked={data.sapModules.includes(module)}
                    onCheckedChange={(checked) => handleModuleToggle(module, checked as boolean)}
                  />
                  <Label htmlFor={`module-${module}`} className="text-sm cursor-pointer">
                    {module}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {data.sapModules.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Módulos seleccionados ({data.sapModules.length}):</p>
            <div className="flex flex-wrap gap-2">
              {data.sapModules.map((module) => (
                <Badge key={module} variant="default">
                  {module}
                  <button
                    onClick={() => handleModuleToggle(module, false)}
                    className="ml-2 hover:bg-red-600 rounded-full"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Methodology */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Metodología Preferida</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona la metodología de implementación que prefieres
          </p>
        </div>
        
        <Select value={data.methodology} onValueChange={(value) => onUpdate({ methodology: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona metodología" />
          </SelectTrigger>
          <SelectContent>
            {methodologies.map((methodology) => (
              <SelectItem key={methodology.value} value={methodology.value}>
                <div>
                  <div className="font-medium">{methodology.label}</div>
                  <div className="text-xs text-muted-foreground">{methodology.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cloud Preference */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Preferencia de Despliegue</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Elige el modelo de implementación que mejor se adapte a tu organización
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cloudPreferences.map((preference) => {
            const Icon = preference.icon
            return (
              <Card
                key={preference.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  data.cloudPreference === preference.value ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onUpdate({ cloudPreference: preference.value as any })}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{preference.label}</CardTitle>
                      <CardDescription className="text-sm">
                        {preference.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Assessment Data Notice */}
      {initialData && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 text-sm">
              ✅ Datos Pre-cargados desde tu Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-green-700">
              {initialData.interestedModules?.length > 0 && (
                <p>• {initialData.interestedModules.length} módulos sugeridos desde tu assessment</p>
              )}
              {initialData.implementationType && (
                <p>• Tipo de implementación: {initialData.implementationType}</p>
              )}
              {initialData.cloudPreference && (
                <p>• Preferencia de despliegue: {initialData.cloudPreference}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
