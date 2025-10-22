
'use client'

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientOnboardingData } from './client-onboarding-wizard'
import { Database, Package, Cloud, RefreshCw } from 'lucide-react'

interface SapAssessmentProps {
  data: ClientOnboardingData
  onUpdate: (updates: Partial<ClientOnboardingData>) => void
}

const sapModules = {
  financial: [
    'FI - Financial Accounting',
    'CO - Controlling',
    'TR - Treasury',
    'FM - Funds Management'
  ],
  logistics: [
    'SD - Sales & Distribution',
    'MM - Materials Management',
    'PP - Production Planning',
    'QM - Quality Management',
    'PM - Plant Maintenance',
    'WM - Warehouse Management'
  ],
  hr: [
    'HR - Human Resources',
    'PY - Payroll',
    'TM - Time Management'
  ],
  analytics: [
    'BW - Business Warehouse',
    'BO - BusinessObjects',
    'Analytics Cloud'
  ]
}

const allModules = Object.values(sapModules).flat()

const implementationTypes = [
  {
    id: 'new',
    title: 'Nueva Implementación',
    description: 'Implementar SAP desde cero',
    icon: Package,
    details: 'Para empresas que no tienen SAP o sistemas ERP'
  },
  {
    id: 'upgrade',
    title: 'Actualización',
    description: 'Actualizar versión existente de SAP',
    icon: RefreshCw,
    details: 'Migrar a S/4HANA o versiones más recientes'
  },
  {
    id: 'migration',
    title: 'Migración',
    description: 'Migrar desde otro sistema ERP',
    icon: Database,
    details: 'Reemplazar Oracle, JDE u otros sistemas'
  },
  {
    id: 'optimization',
    title: 'Optimización',
    description: 'Mejorar implementación actual',
    icon: Cloud,
    details: 'Optimizar procesos y funcionalidades existentes'
  }
]

const experienceLevels = [
  { value: 'none', label: 'Sin experiencia con SAP' },
  { value: 'basic', label: 'Conocimientos básicos (usuario final)' },
  { value: 'intermediate', label: 'Experiencia intermedia (administrador)' },
  { value: 'advanced', label: 'Experiencia avanzada (consultor/implementador)' }
]

export function SapAssessment({ data, onUpdate }: SapAssessmentProps) {
  const handleCurrentModuleToggle = (module: string, checked: boolean) => {
    const updated = checked
      ? [...data.currentSapModules, module]
      : data.currentSapModules.filter(m => m !== module)
    onUpdate({ currentSapModules: updated })
  }

  const handleInterestedModuleToggle = (module: string, checked: boolean) => {
    const updated = checked
      ? [...data.interestedModules, module]
      : data.interestedModules.filter(m => m !== module)
    onUpdate({ interestedModules: updated })
  }

  return (
    <div className="space-y-8">
      {/* SAP Experience Level */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Cuál es tu nivel de experiencia con SAP?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Esto nos ayuda a adaptar nuestras recomendaciones a tu contexto
          </p>
        </div>
        
        <Select value={data.sapExperience} onValueChange={(value) => onUpdate({ sapExperience: value as any })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona tu nivel de experiencia" />
          </SelectTrigger>
          <SelectContent>
            {experienceLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Current SAP Modules (if has experience) */}
      {data.sapExperience !== 'none' && (
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">¿Qué módulos SAP utilizas actualmente?</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Selecciona los módulos SAP que tu empresa tiene implementados
            </p>
          </div>
          
          {Object.entries(sapModules).map(([category, modules]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-sm text-primary capitalize">
                {category === 'financial' && 'Módulos Financieros'}
                {category === 'logistics' && 'Módulos Logísticos'}
                {category === 'hr' && 'Recursos Humanos'}
                {category === 'analytics' && 'Analytics y Reporting'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                {modules.map((module) => (
                  <div key={module} className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${module}`}
                      checked={data.currentSapModules.includes(module)}
                      onCheckedChange={(checked) => handleCurrentModuleToggle(module, checked as boolean)}
                    />
                    <Label htmlFor={`current-${module}`} className="text-sm cursor-pointer">
                      {module}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {data.currentSapModules.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Módulos actuales:</p>
              <div className="flex flex-wrap gap-2">
                {data.currentSapModules.map((module) => (
                  <Badge key={module} variant="secondary">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interested Modules */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">
            {data.sapExperience === 'none' 
              ? '¿Qué áreas de negocio quieres gestionar con SAP?'
              : '¿Qué nuevos módulos te interesan?'
            }
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Identifica las funcionalidades que necesitas para tu proyecto
          </p>
        </div>
        
        {Object.entries(sapModules).map(([category, modules]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm text-primary capitalize">
              {category === 'financial' && 'Módulos Financieros'}
              {category === 'logistics' && 'Módulos Logísticos'}
              {category === 'hr' && 'Recursos Humanos'}
              {category === 'analytics' && 'Analytics y Reporting'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
              {modules.map((module) => (
                <div key={module} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interested-${module}`}
                    checked={data.interestedModules.includes(module)}
                    onCheckedChange={(checked) => handleInterestedModuleToggle(module, checked as boolean)}
                  />
                  <Label htmlFor={`interested-${module}`} className="text-sm cursor-pointer">
                    {module}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {data.interestedModules.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Módulos de interés:</p>
            <div className="flex flex-wrap gap-2">
              {data.interestedModules.map((module) => (
                <Badge key={module} variant="default">
                  {module}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Implementation Type */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Qué tipo de proyecto necesitas?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Define el alcance y tipo de implementación que requieres
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
    </div>
  )
}
