
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientOnboardingData } from './client-onboarding-wizard'
import { Building, Shield, Workflow, Globe } from 'lucide-react'

interface BusinessObjectivesProps {
  data: ClientOnboardingData
  onUpdate: (updates: Partial<ClientOnboardingData>) => void
}

const businessProcesses = [
  'Finanzas y Contabilidad',
  'Ventas y Distribución',
  'Compras y Procurement',
  'Gestión de Inventarios',
  'Producción y Manufacturing',
  'Gestión de Calidad',
  'Recursos Humanos',
  'Mantenimiento de Activos',
  'Logística y Supply Chain',
  'Customer Service',
  'Planning y Forecasting',
  'Business Intelligence'
]

const complianceRequirements = [
  'SOX (Sarbanes-Oxley)',
  'IFRS / US GAAP',
  'ISO 9001 (Calidad)',
  'ISO 14001 (Ambiental)',
  'GxP (Good Manufacturing Practices)',
  'FDA Regulations',
  'OSHA (Seguridad Laboral)',
  'Local Tax Compliance',
  'Import/Export Regulations',
  'Industry-specific Regulations'
]

const integrationNeeds = [
  'E-commerce Platforms',
  'CRM Systems',
  'Business Intelligence Tools',
  'Legacy Systems',
  'Third-party APIs',
  'EDI Systems',
  'Banking/Payment Systems',
  'Warehouse Management Systems',
  'Manufacturing Equipment',
  'Cloud Applications (Office 365, etc.)'
]

const successCriteria = [
  'Reducción de tiempo en procesos clave',
  'Mejora en precisión de datos',
  'Reducción de costos operativos',
  'Mejora en tiempos de respuesta al cliente',
  'Automatización de procesos manuales',
  'Mejora en compliance y auditoría',
  'Escalabilidad para crecimiento futuro',
  'Integración completa de sistemas',
  'Mejora en reporting y analytics',
  'ROI positivo en timeline definido'
]

const cloudPreferences = [
  { value: 'cloud', label: 'Cloud (SaaS)', icon: Globe, description: 'Implementación completamente en la nube' },
  { value: 'onPremise', label: 'On-Premise', icon: Building, description: 'Instalación en servidores propios' },
  { value: 'hybrid', label: 'Híbrido', icon: Workflow, description: 'Combinación de cloud y on-premise' },
  { value: 'noPreference', label: 'Sin preferencia', icon: Shield, description: 'Abierto a recomendaciones' }
]

const timelineOptions = [
  '3-6 meses',
  '6-12 meses',
  '12-18 meses',
  '18-24 meses',
  'Más de 24 meses'
]

const budgetRanges = [
  'Menos de $100k',
  '$100k - $500k',
  '$500k - $1M',
  '$1M - $5M',
  'Más de $5M',
  'Por definir'
]

const teamAvailabilityOptions = [
  'Tiempo completo dedicado',
  'Tiempo parcial (50%)',
  'Mínima disponibilidad',
  'Necesitamos apoyo externo',
  'Por definir'
]

export function BusinessObjectives({ data, onUpdate }: BusinessObjectivesProps) {
  const handleProcessToggle = (process: string, checked: boolean) => {
    const updated = checked
      ? [...data.businessProcesses, process]
      : data.businessProcesses.filter(p => p !== process)
    onUpdate({ businessProcesses: updated })
  }

  const handleComplianceToggle = (requirement: string, checked: boolean) => {
    const updated = checked
      ? [...data.complianceRequirements, requirement]
      : data.complianceRequirements.filter(r => r !== requirement)
    onUpdate({ complianceRequirements: updated })
  }

  const handleIntegrationToggle = (integration: string, checked: boolean) => {
    const updated = checked
      ? [...data.integrationNeeds, integration]
      : data.integrationNeeds.filter(i => i !== integration)
    onUpdate({ integrationNeeds: updated })
  }

  const handleSuccessCriteriaToggle = (criteria: string, checked: boolean) => {
    const updated = checked
      ? [...data.successCriteria, criteria]
      : data.successCriteria.filter(c => c !== criteria)
    onUpdate({ successCriteria: updated })
  }

  return (
    <div className="space-y-8">
      {/* Business Processes */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Qué procesos de negocio son prioritarios?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona las áreas que necesitan mayor atención en tu implementación SAP
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {businessProcesses.map((process) => (
            <div key={process} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <Checkbox
                id={process}
                checked={data.businessProcesses.includes(process)}
                onCheckedChange={(checked) => handleProcessToggle(process, checked as boolean)}
              />
              <Label htmlFor={process} className="text-sm cursor-pointer">
                {process}
              </Label>
            </div>
          ))}
        </div>

        {data.businessProcesses.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Procesos prioritarios:</p>
            <div className="flex flex-wrap gap-2">
              {data.businessProcesses.map((process) => (
                <Badge key={process} variant="default">
                  {process}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cloud Preference */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Tienes preferencia de despliegue?</Label>
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

      {/* Project Timeline */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Cuál es tu timeline objetivo?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Tiempo estimado para completar la implementación
          </p>
        </div>
        
        <Select value={data.projectTimeline} onValueChange={(value) => onUpdate({ projectTimeline: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona el timeline del proyecto" />
          </SelectTrigger>
          <SelectContent>
            {timelineOptions.map((timeline) => (
              <SelectItem key={timeline} value={timeline}>
                {timeline}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Range */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Cuál es tu rango de presupuesto?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Rango estimado para la implementación (incluyendo licencias, consultoría y hardware)
          </p>
        </div>
        
        <Select value={data.budgetRange} onValueChange={(value) => onUpdate({ budgetRange: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona el rango de presupuesto" />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map((budget) => (
              <SelectItem key={budget} value={budget}>
                {budget}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Availability */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Cuál es la disponibilidad de tu equipo?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Tiempo que tu equipo puede dedicar al proyecto SAP
          </p>
        </div>
        
        <Select value={data.teamAvailability} onValueChange={(value) => onUpdate({ teamAvailability: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona la disponibilidad del equipo" />
          </SelectTrigger>
          <SelectContent>
            {teamAvailabilityOptions.map((availability) => (
              <SelectItem key={availability} value={availability}>
                {availability}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Compliance Requirements */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Tienes requerimientos de compliance específicos?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Regulaciones o estándares que debe cumplir tu implementación SAP
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {complianceRequirements.map((requirement) => (
            <div key={requirement} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <Checkbox
                id={requirement}
                checked={data.complianceRequirements.includes(requirement)}
                onCheckedChange={(checked) => handleComplianceToggle(requirement, checked as boolean)}
              />
              <Label htmlFor={requirement} className="text-sm cursor-pointer">
                {requirement}
              </Label>
            </div>
          ))}
        </div>

        {data.complianceRequirements.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Requerimientos de compliance:</p>
            <div className="flex flex-wrap gap-2">
              {data.complianceRequirements.map((requirement) => (
                <Badge key={requirement} variant="outline">
                  {requirement}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Integration Needs */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Qué sistemas necesitas integrar con SAP?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Sistemas existentes que deben conectarse con SAP
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrationNeeds.map((integration) => (
            <div key={integration} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <Checkbox
                id={integration}
                checked={data.integrationNeeds.includes(integration)}
                onCheckedChange={(checked) => handleIntegrationToggle(integration, checked as boolean)}
              />
              <Label htmlFor={integration} className="text-sm cursor-pointer">
                {integration}
              </Label>
            </div>
          ))}
        </div>

        {data.integrationNeeds.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Integraciones necesarias:</p>
            <div className="flex flex-wrap gap-2">
              {data.integrationNeeds.map((integration) => (
                <Badge key={integration} variant="secondary">
                  {integration}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Criteria */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Cómo definirías el éxito del proyecto?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Criterios clave que determinarán si el proyecto fue exitoso
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {successCriteria.map((criteria) => (
            <div key={criteria} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <Checkbox
                id={criteria}
                checked={data.successCriteria.includes(criteria)}
                onCheckedChange={(checked) => handleSuccessCriteriaToggle(criteria, checked as boolean)}
              />
              <Label htmlFor={criteria} className="text-sm cursor-pointer">
                {criteria}
              </Label>
            </div>
          ))}
        </div>

        {data.successCriteria.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Criterios de éxito:</p>
            <div className="flex flex-wrap gap-2">
              {data.successCriteria.map((criteria) => (
                <Badge key={criteria} variant="default">
                  {criteria}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
