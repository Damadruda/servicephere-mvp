
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QuotationData } from './quotation-wizard'
import { Plus, Trash2, Calendar, Users, Settings } from 'lucide-react'

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

interface QuotationTechnicalProposalProps {
  data: QuotationData
  project: Project
  onUpdate: (updates: Partial<QuotationData>) => void
}

const methodologies = [
  { value: 'SAP Activate', label: 'SAP Activate', description: 'Metodología ágil recomendada por SAP' },
  { value: 'ASAP', label: 'ASAP (AcceleratedSAP)', description: 'Metodología tradicional estructurada' },
  { value: 'Agile', label: 'Metodología Ágil', description: 'Enfoque iterativo con sprints' },
  { value: 'Waterfall', label: 'Cascada (Waterfall)', description: 'Enfoque secuencial tradicional' },
  { value: 'Hybrid', label: 'Híbrido', description: 'Combinación de metodologías' }
]

const defaultMilestones = {
  new: [
    { name: 'Fase 1: Preparación', description: 'Análisis de requerimientos y configuración del entorno', duration: '4-6 semanas', dependencies: [] },
    { name: 'Fase 2: Diseño', description: 'Diseño funcional y técnico de la solución', duration: '6-8 semanas', dependencies: ['Fase 1'] },
    { name: 'Fase 3: Desarrollo', description: 'Configuración, desarrollo y pruebas unitarias', duration: '8-12 semanas', dependencies: ['Fase 2'] },
    { name: 'Fase 4: Testing', description: 'Pruebas integrales y aceptación del usuario', duration: '4-6 semanas', dependencies: ['Fase 3'] },
    { name: 'Fase 5: Go-Live', description: 'Implementación y soporte inicial', duration: '2-4 semanas', dependencies: ['Fase 4'] }
  ],
  upgrade: [
    { name: 'Evaluación', description: 'Análisis del sistema actual y planning del upgrade', duration: '2-3 semanas', dependencies: [] },
    { name: 'Preparación', description: 'Backup, preparación del entorno y plan de rollback', duration: '1-2 semanas', dependencies: ['Evaluación'] },
    { name: 'Migración', description: 'Proceso de upgrade y conversión de datos', duration: '2-3 semanas', dependencies: ['Preparación'] },
    { name: 'Validación', description: 'Pruebas exhaustivas y validación funcional', duration: '2-4 semanas', dependencies: ['Migración'] },
    { name: 'Estabilización', description: 'Optimización y soporte post-upgrade', duration: '2-3 semanas', dependencies: ['Validación'] }
  ]
}

const technicalProposalTemplates = {
  implementationApproach: {
    new: `**Enfoque de Implementación Nueva:**

1. **Análisis y Diseño:** Comenzaremos con un análisis detallado de los procesos actuales de ${'{company}'} para diseñar una solución SAP S/4HANA que se alinee con sus objetivos de negocio.

2. **Configuración Estándar:** Utilizaremos las mejores prácticas de SAP y configuraciones estándar para maximizar el ROI y minimizar la complejidad.

3. **Desarrollo Personalizado:** Solo donde sea estrictamente necesario, desarrollaremos funcionalidades específicas manteniendo la actualizabilidad del sistema.

4. **Integración:** Implementaremos interfaces robustas con los sistemas existentes garantizando la continuidad operativa.`,

    upgrade: `**Estrategia de Actualización a S/4HANA:**

1. **Sistema de Conversión:** Utilizaremos las herramientas SAP DMO (Database Migration Option) para una conversión técnica eficiente.

2. **Simplificación de Datos:** Aprovecharemos la oportunidad para limpiar y optimizar la base de datos existente.

3. **Nuevas Funcionalidades:** Identificaremos e implementaremos las nuevas capacidades de S/4HANA que agregan valor inmediato.

4. **Migración Gradual:** Planificaremos una transición por fases para minimizar el impacto en las operaciones.`
  }
}

export function QuotationTechnicalProposal({ data, project, onUpdate }: QuotationTechnicalProposalProps) {
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    duration: '',
    dependencies: [] as string[]
  })

  const handleTechnicalProposalChange = (field: keyof QuotationData['technicalProposal'], value: string) => {
    onUpdate({
      technicalProposal: {
        ...data.technicalProposal,
        [field]: value
      }
    })
  }

  const addMilestone = () => {
    if (newMilestone.name && newMilestone.description && newMilestone.duration) {
      onUpdate({
        milestones: [...data.milestones, { ...newMilestone }]
      })
      setNewMilestone({ name: '', description: '', duration: '', dependencies: [] })
    }
  }

  const removeMilestone = (index: number) => {
    const updated = data.milestones.filter((_, i) => i !== index)
    onUpdate({ milestones: updated })
  }

  const loadDefaultMilestones = () => {
    const projectType = project.implementationType as keyof typeof defaultMilestones
    const milestones = defaultMilestones[projectType] || defaultMilestones.new
    onUpdate({ milestones })
  }

  const generateTechnicalProposal = (field: keyof typeof technicalProposalTemplates) => {
    const projectType = project.implementationType as keyof typeof technicalProposalTemplates.implementationApproach
    const template = technicalProposalTemplates[field][projectType] || technicalProposalTemplates[field].new
    const content = template.replace('{company}', project.client.companyName)
    handleTechnicalProposalChange(field, content)
  }

  return (
    <div className="space-y-8">
      {/* Methodology */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Metodología de Implementación</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona la metodología que utilizarás para este proyecto
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

      {/* Technical Proposal Sections */}
      <div className="space-y-6">
        <div>
          <Label className="text-lg font-semibold">Propuesta Técnica Detallada</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Detalla los aspectos técnicos clave de tu propuesta
          </p>
        </div>

        {/* Implementation Approach */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Enfoque de Implementación</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => generateTechnicalProposal('implementationApproach')}
            >
              Auto-generar
            </Button>
          </div>
          <Textarea
            value={data.technicalProposal.implementationApproach}
            onChange={(e) => handleTechnicalProposalChange('implementationApproach', e.target.value)}
            placeholder="Describe tu enfoque técnico para la implementación..."
            rows={6}
          />
        </div>

        {/* Architecture Overview */}
        <div className="space-y-3">
          <Label className="font-medium">Resumen de Arquitectura</Label>
          <Textarea
            value={data.technicalProposal.architectureOverview}
            onChange={(e) => handleTechnicalProposalChange('architectureOverview', e.target.value)}
            placeholder="Describe la arquitectura técnica propuesta..."
            rows={4}
          />
        </div>

        {/* Risk Mitigation */}
        <div className="space-y-3">
          <Label className="font-medium">Mitigación de Riesgos</Label>
          <Textarea
            value={data.technicalProposal.riskMitigation}
            onChange={(e) => handleTechnicalProposalChange('riskMitigation', e.target.value)}
            placeholder="Describe cómo manejarás los riesgos potenciales..."
            rows={4}
          />
        </div>

        {/* Quality Assurance */}
        <div className="space-y-3">
          <Label className="font-medium">Aseguramiento de Calidad</Label>
          <Textarea
            value={data.technicalProposal.qualityAssurance}
            onChange={(e) => handleTechnicalProposalChange('qualityAssurance', e.target.value)}
            placeholder="Describe tu proceso de QA y testing..."
            rows={4}
          />
        </div>

        {/* Data Strategy */}
        <div className="space-y-3">
          <Label className="font-medium">Estrategia de Datos</Label>
          <Textarea
            value={data.technicalProposal.dataStrategy}
            onChange={(e) => handleTechnicalProposalChange('dataStrategy', e.target.value)}
            placeholder="Describe tu enfoque para migración y gestión de datos..."
            rows={4}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Hitos del Proyecto</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Define los principales hitos y entregables del proyecto
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={loadDefaultMilestones}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Cargar template
          </Button>
        </div>

        {/* Existing Milestones */}
        {data.milestones.length > 0 && (
          <div className="space-y-3">
            {data.milestones.map((milestone, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{milestone.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>⏱️ {milestone.duration}</span>
                        {milestone.dependencies.length > 0 && (
                          <span>🔗 Depende de: {milestone.dependencies.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Milestone */}
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Nombre del Hito</Label>
                  <input
                    type="text"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ej. Fase 1: Análisis"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Duración</Label>
                  <input
                    type="text"
                    value={newMilestone.duration}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="ej. 4-6 semanas"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Descripción</Label>
                <Textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe los entregables y objetivos de este hito..."
                  rows={2}
                  className="mt-1"
                />
              </div>
              <Button
                type="button"
                onClick={addMilestone}
                disabled={!newMilestone.name || !newMilestone.description || !newMilestone.duration}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Hito
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Context Reference */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 text-sm">
            💡 Información del Proyecto para Referencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-green-700">
            <div>
              <p><strong>Módulos SAP:</strong></p>
              <ul className="text-xs mt-1 space-y-1">
                {project.sapModules.slice(0, 4).map(module => (
                  <li key={module}>• {module}</li>
                ))}
                {project.sapModules.length > 4 && <li>• +{project.sapModules.length - 4} más</li>}
              </ul>
            </div>
            <div>
              <p><strong>Procesos de Negocio:</strong></p>
              <ul className="text-xs mt-1 space-y-1">
                {project.businessProcesses.slice(0, 3).map(process => (
                  <li key={process}>• {process}</li>
                ))}
                {project.businessProcesses.length > 3 && <li>• +{project.businessProcesses.length - 3} más</li>}
              </ul>
            </div>
            <div>
              <p><strong>Compliance:</strong></p>
              <ul className="text-xs mt-1 space-y-1">
                {project.complianceRequirements.slice(0, 3).map(req => (
                  <li key={req}>• {req}</li>
                ))}
                {project.complianceRequirements.length > 3 && <li>• +{project.complianceRequirements.length - 3} más</li>}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
