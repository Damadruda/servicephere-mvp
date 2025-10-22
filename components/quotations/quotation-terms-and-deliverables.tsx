
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { QuotationData } from './quotation-wizard'
import { Plus, Trash2, FileText, AlertTriangle, Calendar } from 'lucide-react'

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

interface QuotationTermsAndDeliverablesProps {
  data: QuotationData
  project: Project
  onUpdate: (updates: Partial<QuotationData>) => void
}

const standardDeliverables = [
  'Documento de Análisis de Requerimientos',
  'Diseño Funcional Detallado',
  'Documento de Arquitectura Técnica',
  'Plan de Pruebas y Casos de Test',
  'Manual de Usuario Final',
  'Documentación de Configuración SAP',
  'Plan de Cutover y Go-Live',
  'Documentación de Interfaces',
  'Plan de Capacitación',
  'Documentación de Soporte Post Go-Live',
  'Reporte de Migración de Datos',
  'Certificado de Pruebas UAT'
]

const standardServices = [
  'Análisis de procesos As-Is y To-Be',
  'Configuración de módulos SAP',
  'Desarrollo de interfaces específicas',
  'Migración y validación de datos maestros',
  'Capacitación de usuarios clave',
  'Capacitación de usuarios finales',
  'Soporte durante Go-Live (40 horas)',
  'Documentación funcional y técnica',
  'Pruebas integrales del sistema',
  'Configuración de reportes estándar',
  'Setup de autorizaciones y roles'
]

const commonExclusions = [
  'Licencias SAP (adquiridas por separado)',
  'Hardware e infraestructura',
  'Desarrollos fuera del alcance inicial',
  'Capacitación adicional post Go-Live',
  'Soporte extendido (más de 1 mes)',
  'Modificaciones a requerimientos aprobados',
  'Integración con sistemas no especificados',
  'Migración de datos históricos (más de 2 años)',
  'Personalalizaciones de pantallas SAP Fiori',
  'Consultoría en procesos de negocio'
]

const commonRisks = [
  'Cambios en requerimientos durante la implementación',
  'Disponibilidad limitada de usuarios clave del cliente',
  'Calidad de datos maestros en el sistema origen',
  'Retrasos en la provisión de infraestructura',
  'Complejidad de integraciones no identificadas',
  'Resistencia al cambio organizacional',
  'Dependencias externas no controlables'
]

const paymentTermsOptions = [
  '30% inicio, 40% entregables intermedios, 30% go-live',
  '25% firma contrato, 50% UAT aprobado, 25% go-live exitoso',
  '20% inicio, 30% diseño aprobado, 30% desarrollo completo, 20% go-live',
  'Pagos mensuales en base a horas trabajadas',
  '50% inicio del proyecto, 50% go-live exitoso'
]

export function QuotationTermsAndDeliverables({ data, project, onUpdate }: QuotationTermsAndDeliverablesProps) {
  const [newDeliverable, setNewDeliverable] = useState('')
  const [newIncludedService, setNewIncludedService] = useState('')
  const [newExcludedService, setNewExcludedService] = useState('')
  const [newRisk, setNewRisk] = useState('')

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      onUpdate({
        deliverables: [...data.deliverables, newDeliverable.trim()]
      })
      setNewDeliverable('')
    }
  }

  const removeDeliverable = (index: number) => {
    const updated = data.deliverables.filter((_, i) => i !== index)
    onUpdate({ deliverables: updated })
  }

  const addIncludedService = () => {
    if (newIncludedService.trim()) {
      onUpdate({
        includedServices: [...data.includedServices, newIncludedService.trim()]
      })
      setNewIncludedService('')
    }
  }

  const removeIncludedService = (index: number) => {
    const updated = data.includedServices.filter((_, i) => i !== index)
    onUpdate({ includedServices: updated })
  }

  const addExcludedService = () => {
    if (newExcludedService.trim()) {
      onUpdate({
        excludedServices: [...data.excludedServices, newExcludedService.trim()]
      })
      setNewExcludedService('')
    }
  }

  const removeExcludedService = (index: number) => {
    const updated = data.excludedServices.filter((_, i) => i !== index)
    onUpdate({ excludedServices: updated })
  }

  const addRisk = () => {
    if (newRisk.trim()) {
      onUpdate({
        risks: [...data.risks, newRisk.trim()]
      })
      setNewRisk('')
    }
  }

  const removeRisk = (index: number) => {
    const updated = data.risks.filter((_, i) => i !== index)
    onUpdate({ risks: updated })
  }

  const loadStandardDeliverables = () => {
    const filtered = standardDeliverables.filter(deliverable => 
      !data.deliverables.includes(deliverable)
    )
    onUpdate({ deliverables: [...data.deliverables, ...filtered.slice(0, 6)] })
  }

  const loadStandardServices = () => {
    const filtered = standardServices.filter(service => 
      !data.includedServices.includes(service)
    )
    onUpdate({ includedServices: [...data.includedServices, ...filtered.slice(0, 5)] })
  }

  const loadCommonExclusions = () => {
    const filtered = commonExclusions.filter(exclusion => 
      !data.excludedServices.includes(exclusion)
    )
    onUpdate({ excludedServices: [...data.excludedServices, ...filtered.slice(0, 4)] })
  }

  const loadCommonRisks = () => {
    const filtered = commonRisks.filter(risk => 
      !data.risks.includes(risk)
    )
    onUpdate({ risks: [...data.risks, ...filtered.slice(0, 3)] })
  }

  const generateAssumptions = () => {
    const assumptions = `Las siguientes asunciones son base para esta cotización:

• **Disponibilidad del Cliente**: El equipo clave de ${project.client.companyName} estará disponible según el cronograma del proyecto
• **Calidad de Datos**: Los datos maestros y transaccionales están en condiciones adecuadas para la migración
• **Infraestructura**: El ambiente SAP estará disponible y configurado según especificaciones técnicas
• **Requerimientos**: Los requerimientos funcionales están completamente definidos y no cambiarán durante la implementación
• **Accesos**: Se proporcionarán todos los accesos necesarios a sistemas y personal clave
• **Aprobaciones**: Las aprobaciones de diseño y testing se darán en los tiempos establecidos
• **Integración**: Las interfaces con sistemas externos están claramente definidas y documentadas
• **Capacitación**: Los usuarios finales participarán activamente en las sesiones de capacitación programadas

**Importante**: Cualquier cambio a estas asunciones puede impactar el cronograma y costos del proyecto.`

    onUpdate({ assumptions })
  }

  return (
    <div className="space-y-8">
      {/* Deliverables */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Entregables del Proyecto</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Define todos los documentos y entregables que proporcionarás
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={loadStandardDeliverables}
          >
            <FileText className="h-4 w-4 mr-2" />
            Cargar estándar
          </Button>
        </div>

        {/* Existing Deliverables */}
        {data.deliverables.length > 0 && (
          <div className="space-y-2">
            {data.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm">{deliverable}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDeliverable(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Deliverable */}
        <div className="flex space-x-2">
          <Input
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            placeholder="Nuevo entregable..."
            onKeyPress={(e) => e.key === 'Enter' && addDeliverable()}
          />
          <Button type="button" onClick={addDeliverable}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Included Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Servicios Incluidos</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Lista detallada de todos los servicios que incluye tu propuesta
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={loadStandardServices}
          >
            <Plus className="h-4 w-4 mr-2" />
            Cargar estándar
          </Button>
        </div>

        {/* Existing Included Services */}
        {data.includedServices.length > 0 && (
          <div className="grid gap-2">
            {data.includedServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-800">{service}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIncludedService(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Included Service */}
        <div className="flex space-x-2">
          <Input
            value={newIncludedService}
            onChange={(e) => setNewIncludedService(e.target.value)}
            placeholder="Nuevo servicio incluido..."
            onKeyPress={(e) => e.key === 'Enter' && addIncludedService()}
          />
          <Button type="button" onClick={addIncludedService}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Excluded Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Servicios NO Incluidos</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Especifica claramente qué no está incluido en esta cotización
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={loadCommonExclusions}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Exclusiones comunes
          </Button>
        </div>

        {/* Existing Excluded Services */}
        {data.excludedServices.length > 0 && (
          <div className="grid gap-2">
            {data.excludedServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-red-800">{service}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExcludedService(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Excluded Service */}
        <div className="flex space-x-2">
          <Input
            value={newExcludedService}
            onChange={(e) => setNewExcludedService(e.target.value)}
            placeholder="Servicio NO incluido..."
            onKeyPress={(e) => e.key === 'Enter' && addExcludedService()}
          />
          <Button type="button" onClick={addExcludedService}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Términos de Pago</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Define la estructura de pagos para este proyecto
          </p>
        </div>

        {/* Payment Terms Options */}
        <div className="space-y-2">
          {paymentTermsOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`payment-${index}`}
                checked={data.paymentTerms === option}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onUpdate({ paymentTerms: option })
                  }
                }}
              />
              <Label htmlFor={`payment-${index}`} className="text-sm cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </div>

        <div>
          <Label className="text-sm">Términos personalizados</Label>
          <Textarea
            value={data.paymentTerms}
            onChange={(e) => onUpdate({ paymentTerms: e.target.value })}
            placeholder="Describe los términos de pago específicos..."
            rows={2}
          />
        </div>
      </div>

      {/* Project Timeline */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">Timeline del Proyecto</Label>
        <Input
          value={data.timeline}
          onChange={(e) => onUpdate({ timeline: e.target.value })}
          placeholder={`ej. ${project.timeline}`}
        />
      </div>

      {/* Validity Period */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">Validez de la Cotización</Label>
        <Input
          type="date"
          value={data.validUntil.toISOString().split('T')[0]}
          onChange={(e) => onUpdate({ validUntil: new Date(e.target.value) })}
        />
        <p className="text-xs text-muted-foreground">
          Esta cotización es válida hasta la fecha especificada
        </p>
      </div>

      {/* Assumptions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Asunciones del Proyecto</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Condiciones que asumes como base para esta cotización
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={generateAssumptions}
          >
            Auto-generar
          </Button>
        </div>
        
        <Textarea
          value={data.assumptions}
          onChange={(e) => onUpdate({ assumptions: e.target.value })}
          placeholder="Lista las asunciones clave para este proyecto..."
          rows={8}
        />
      </div>

      {/* Risks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Riesgos Identificados</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Riesgos potenciales y cómo planeas mitigarlos
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={loadCommonRisks}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Riesgos comunes
          </Button>
        </div>

        {/* Existing Risks */}
        {data.risks.length > 0 && (
          <div className="space-y-2">
            {data.risks.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">{risk}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRisk(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Risk */}
        <div className="flex space-x-2">
          <Input
            value={newRisk}
            onChange={(e) => setNewRisk(e.target.value)}
            placeholder="Nuevo riesgo identificado..."
            onKeyPress={(e) => e.key === 'Enter' && addRisk()}
          />
          <Button type="button" onClick={addRisk}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
