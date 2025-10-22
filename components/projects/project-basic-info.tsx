
'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectCreationData } from './project-creation-wizard'
import { Lightbulb, FileText, Target } from 'lucide-react'

interface ProjectBasicInfoProps {
  data: ProjectCreationData
  onUpdate: (updates: Partial<ProjectCreationData>) => void
  initialData?: any
}

const projectTitleSuggestions = [
  'Implementación SAP S/4HANA Cloud',
  'Migración de SAP ECC a S/4HANA',
  'Optimización de módulos SAP FI/CO',
  'Rollout global SAP S/4HANA',
  'Implementación SAP SuccessFactors',
  'Integración SAP con sistemas legacy',
  'Upgrade SAP a última versión',
  'Implementación SAP Ariba Procurement'
]

const descriptionTemplates = {
  new: `Nuestra empresa busca implementar SAP S/4HANA para modernizar nuestros procesos de negocio. 

Objetivos principales:
• Centralizar la gestión de información empresarial
• Mejorar la eficiencia operacional
• Obtener visibilidad en tiempo real de KPIs
• Prepararse para el crecimiento futuro

Alcance del proyecto:
• Análisis de procesos actuales (As-Is)
• Diseño de procesos futuros (To-Be) 
• Configuración e implementación
• Migración de datos
• Capacitación de usuarios
• Go-live y soporte post-implementación`,

  upgrade: `Necesitamos actualizar nuestro sistema SAP actual a la versión más reciente para aprovechar las nuevas funcionalidades y mantener el soporte.

Situación actual:
• Sistema SAP ECC 6.0 implementado hace [X] años
• [X] usuarios activos
• Módulos implementados: [especificar]

Objetivos de la migración:
• Acceso a nuevas funcionalidades
• Mejorar performance del sistema
• Mantener soporte técnico continuo
• Reducir costos de mantenimiento`,

  migration: `Buscamos migrar desde nuestro sistema ERP actual hacia SAP S/4HANA para estandarizar procesos y aprovechar las capacidades de análisis en tiempo real.

Sistema actual: [especificar ERP actual]
• [X] usuarios
• Módulos/funcionalidades principales
• Principales limitaciones identificadas

Expectativas del nuevo sistema:
• Mejor integración entre módulos
• Reportes en tiempo real
• Interfaz más moderna e intuitiva
• Escalabilidad para crecimiento futuro`,

  optimization: `Tenemos SAP implementado pero necesitamos optimizar configuraciones, mejorar procesos y aprovechar mejor las funcionalidades disponibles.

Situación actual:
• SAP [versión] implementado
• Módulos activos: [especificar]
• Áreas de mejora identificadas

Objetivos de optimización:
• Mejorar eficiencia de procesos existentes
• Implementar mejores prácticas
• Capacitación avanzada de usuarios
• Optimización de performance`
}

export function ProjectBasicInfo({ data, onUpdate, initialData }: ProjectBasicInfoProps) {
  const handleTitleSuggestion = (suggestion: string) => {
    onUpdate({ title: suggestion })
  }

  const handleDescriptionTemplate = (type: keyof typeof descriptionTemplates) => {
    onUpdate({ description: descriptionTemplates[type] })
  }

  const generateRequirements = () => {
    const requirements = []
    
    if (initialData?.painPoints) {
      requirements.push(`Desafíos a resolver:\n• ${initialData.painPoints.join('\n• ')}`)
    }
    
    if (initialData?.successCriteria) {
      requirements.push(`Criterios de éxito:\n• ${initialData.successCriteria.join('\n• ')}`)
    }
    
    if (initialData?.complianceRequirements) {
      requirements.push(`Requerimientos de compliance:\n• ${initialData.complianceRequirements.join('\n• ')}`)
    }
    
    onUpdate({ requirements: requirements.join('\n\n') })
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Título del Proyecto</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Un título claro y específico ayudará a los consultores a entender rápidamente tu proyecto
          </p>
        </div>
        
        <Input
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="ej. Implementación SAP S/4HANA para empresa manufacturera"
          className="text-lg"
        />

        {/* Title suggestions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Sugerencias de títulos:</p>
          <div className="flex flex-wrap gap-2">
            {projectTitleSuggestions.slice(0, 4).map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleTitleSuggestion(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Descripción del Proyecto</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Describe el contexto, objetivos y alcance de tu proyecto. Sé específico para atraer a los consultores más adecuados.
          </p>
        </div>
        
        <Textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe tu proyecto..."
          rows={8}
          className="resize-none"
        />

        {/* Description templates */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Plantillas de descripción por tipo de proyecto:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground justify-center py-2"
              onClick={() => handleDescriptionTemplate('new')}
            >
              Nueva Implementación
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground justify-center py-2"
              onClick={() => handleDescriptionTemplate('upgrade')}
            >
              Actualización
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground justify-center py-2"
              onClick={() => handleDescriptionTemplate('migration')}
            >
              Migración
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground justify-center py-2"
              onClick={() => handleDescriptionTemplate('optimization')}
            >
              Optimización
            </Badge>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Requerimientos Específicos</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Detalla requerimientos técnicos, funcionales, de compliance o cualquier restricción importante
          </p>
        </div>
        
        <Textarea
          value={data.requirements}
          onChange={(e) => onUpdate({ requirements: e.target.value })}
          placeholder="ej. Cumplimiento SOX, integración con sistema de nómina existente, soporte multiidioma..."
          rows={6}
          className="resize-none"
        />

        {/* Generate requirements from assessment */}
        {initialData && (
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={generateRequirements}
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              Auto-generar desde tu assessment
            </Badge>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-blue-800">
              <FileText className="w-4 h-4 mr-2" />
              Título Efectivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-700">
              Incluye el tipo de proyecto, tecnología SAP y tu industria para máxima claridad
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-green-800">
              <Target className="w-4 h-4 mr-2" />
              Descripción Clara
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-700">
              Menciona objetivos específicos, situación actual y resultados esperados
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-purple-800">
              <Lightbulb className="w-4 h-4 mr-2" />
              Requerimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-purple-700">
              Sé específico sobre limitaciones, integraciones necesarias y estándares a cumplir
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
