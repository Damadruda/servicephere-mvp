
'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QuotationData } from './quotation-wizard'
import { Lightbulb, FileText, Target } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  requirements: string
  industry: string
  sapModules: string[]
  budget: string
  timeline: string
  implementationType: string
  cloudPreference: string
  businessProcesses: string[]
  complianceRequirements: string[]
  integrationNeeds: string[]
  client: {
    name: string
    companyName: string
  }
}

interface QuotationBasicInfoProps {
  data: QuotationData
  project: Project
  onUpdate: (updates: Partial<QuotationData>) => void
}

const approachTemplates = {
  new: `Nuestro enfoque para la implementación nueva de SAP S/4HANA incluye:

• **Fase de Preparación y Planificación**: Análisis detallado de procesos actuales y definición de objetivos específicos
• **Diseño de la Solución**: Configuración de módulos SAP adaptada a los requerimientos de ${'{company}'}
• **Desarrollo y Testing**: Configuraciones personalizadas, desarrollo de interfaces y pruebas exhaustivas
• **Capacitación y Go-Live**: Preparación del equipo y transición controlada al nuevo sistema
• **Soporte Post-Implementación**: Acompañamiento y optimización continua

Utilizaremos la metodología SAP Activate para garantizar una implementación ágil y eficiente, con entregables claros en cada fase.`,

  upgrade: `Nuestra propuesta para la actualización a SAP S/4HANA considera:

• **Evaluación del Sistema Actual**: Análisis completo de la implementación existente y identificación de gaps
• **Estrategia de Migración**: Plan detallado para la transición minimizando interrupciones operativas
• **Conversión y Limpieza de Datos**: Migración segura y optimización de la base de datos
• **Pruebas de Funcionalidad**: Validación exhaustiva de todos los procesos críticos
• **Training del Usuario**: Capacitación enfocada en nuevas funcionalidades

Aprovecharemos al máximo la inversión existente mientras incorporamos las innovaciones de S/4HANA.`,

  migration: `Para la migración desde el sistema actual a SAP S/4HANA, proponemos:

• **Análisis del Sistema Legacy**: Mapeo completo de procesos y datos actuales
• **Diseño de la Nueva Arquitectura**: Estructura optimizada para SAP con mejores prácticas
• **Estrategia de Migración de Datos**: Extracción, transformación y carga segura de información crítica
• **Implementación Paralela**: Desarrollo y testing sin afectar operaciones actuales
• **Cutover Planificado**: Transición controlada con plan de rollback si es necesario

Garantizamos continuidad del negocio durante todo el proceso de migración.`,

  optimization: `Nuestro enfoque de optimización de SAP se centra en:

• **Diagnóstico Integral**: Evaluación de performance, procesos y configuraciones actuales
• **Identificación de Oportunidades**: Análisis de gaps y áreas de mejora específicas
• **Implementación de Mejores Prácticas**: Ajustes y optimizaciones basadas en experiencia
• **Automatización de Procesos**: Reducción de tareas manuales mediante configuraciones avanzadas
• **Capacitación Especializada**: Training enfocado en optimizar el uso del sistema

Maximizaremos el ROI de la implementación actual con mejoras incrementales y medibles.`
}

const titleSuggestions = [
  'Propuesta de Implementación SAP S/4HANA',
  'Consultoría Especializada en Migración SAP',
  'Servicios de Optimización y Upgrade SAP',
  'Implementación SAP con Metodología Activate',
  'Solución SAP Integral para {industry}',
  'Propuesta de Modernización SAP S/4HANA Cloud'
]

export function QuotationBasicInfo({ data, project, onUpdate }: QuotationBasicInfoProps) {
  const handleTitleSuggestion = (suggestion: string) => {
    const customizedTitle = suggestion
      .replace('{company}', project.client.companyName)
      .replace('{industry}', project.industry)
    onUpdate({ title: customizedTitle })
  }

  const handleApproachTemplate = (type: keyof typeof approachTemplates) => {
    const template = approachTemplates[type]
      .replace('{company}', project.client.companyName)
      .replace('{industry}', project.industry)
    onUpdate({ approach: template })
  }

  const generateDescription = () => {
    const description = `Estimado equipo de ${project.client.companyName},

Nos complace presentar nuestra propuesta para el proyecto "${project.title}".

Con más de [X años] de experiencia en implementaciones SAP para la industria ${project.industry}, entendemos los desafíos específicos que enfrentan las empresas como la suya.

**Nuestra propuesta incluye:**
• Implementación de los módulos: ${project.sapModules.slice(0, 3).join(', ')}${project.sapModules.length > 3 ? ' y otros' : ''}
• Enfoque ${project.implementationType === 'new' ? 'de implementación nueva' : 'de ' + project.implementationType}
• Despliegue ${project.cloudPreference === 'cloud' ? 'en la nube' : project.cloudPreference === 'onPremise' ? 'on-premise' : 'híbrido'}
• Timeline estimado: ${project.timeline}

Nuestro equipo certificado en SAP garantiza una implementación exitosa que cumpla con todos sus requerimientos técnicos y de negocio.

Quedamos a su disposición para aclarar cualquier duda sobre esta propuesta.

Saludos cordiales,
[Nombre del consultor]
[Empresa consultora]`

    onUpdate({ description })
  }

  return (
    <div className="space-y-8">
      {/* Project Context */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-lg">
            📋 Contexto del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p><strong>Cliente:</strong> {project.client.companyName}</p>
              <p><strong>Industria:</strong> {project.industry}</p>
              <p><strong>Tipo:</strong> {project.implementationType}</p>
            </div>
            <div>
              <p><strong>Presupuesto:</strong> {project.budget}</p>
              <p><strong>Timeline:</strong> {project.timeline}</p>
              <p><strong>Módulos:</strong> {project.sapModules.length} módulos requeridos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Title */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Título de la Propuesta</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Un título profesional que refleje el alcance de tu propuesta
          </p>
        </div>
        
        <Input
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="ej. Propuesta de Implementación SAP S/4HANA"
          className="text-lg"
        />

        {/* Title suggestions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Sugerencias de títulos:</p>
          <div className="flex flex-wrap gap-2">
            {titleSuggestions.slice(0, 4).map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleTitleSuggestion(suggestion)}
              >
                {suggestion.replace('{industry}', project.industry)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Descripción de la Propuesta</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Carta de presentación que acompañará tu cotización. Sé profesional y específico.
          </p>
        </div>
        
        <Textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Descripción profesional de tu propuesta..."
          rows={8}
          className="resize-none"
        />

        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
            onClick={generateDescription}
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            Auto-generar descripción
          </Badge>
        </div>
      </div>

      {/* Approach */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Enfoque y Metodología</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Describe tu enfoque técnico y metodología para abordar este proyecto específico
          </p>
        </div>
        
        <Textarea
          value={data.approach}
          onChange={(e) => onUpdate({ approach: e.target.value })}
          placeholder="Describe tu enfoque específico para este proyecto..."
          rows={10}
          className="resize-none"
        />

        {/* Approach templates */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Templates por tipo de proyecto:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground justify-center py-2"
              onClick={() => handleApproachTemplate('new')}
            >
              Nueva Implementación
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground justify-center py-2"
              onClick={() => handleApproachTemplate('upgrade')}
            >
              Actualización
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground justify-center py-2"
              onClick={() => handleApproachTemplate('migration')}
            >
              Migración
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground justify-center py-2"
              onClick={() => handleApproachTemplate('optimization')}
            >
              Optimización
            </Badge>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-blue-800">
              <FileText className="w-4 h-4 mr-2" />
              Título Profesional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-700">
              Menciona SAP, el tipo de proyecto y la industria del cliente
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-green-800">
              <Target className="w-4 h-4 mr-2" />
              Descripción Específica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-700">
              Personaliza el mensaje para el cliente específico y su industria
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-purple-800">
              <Lightbulb className="w-4 h-4 mr-2" />
              Enfoque Técnico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-purple-700">
              Demuestra experiencia específica en el tipo de proyecto solicitado
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
