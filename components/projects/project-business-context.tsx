
'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectCreationData } from './project-creation-wizard'
import { Building, DollarSign, Clock, MapPin } from 'lucide-react'

interface ProjectBusinessContextProps {
  data: ProjectCreationData
  onUpdate: (updates: Partial<ProjectCreationData>) => void
  initialData?: any
}

const industries = [
  'Manufactura',
  'Retail y Distribución',
  'Servicios Financieros',
  'Healthcare y Farmacéutico',
  'Petróleo y Gas',
  'Utilities y Energía',
  'Telecomunicaciones',
  'Tecnología',
  'Consultoría',
  'Gobierno',
  'Educación',
  'Automotriz',
  'Alimentos y Bebidas',
  'Química',
  'Construcción',
  'Otro'
]

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
  'Business Intelligence',
  'Gestión de Proyectos',
  'Compliance y Auditoría'
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
  'Industry-specific Regulations',
  'GDPR / Data Privacy',
  'Anti-Money Laundering (AML)'
]

const integrationNeeds = [
  'E-commerce Platforms (Shopify, WooCommerce)',
  'CRM Systems (Salesforce, HubSpot)',
  'Business Intelligence Tools (Tableau, PowerBI)',
  'Legacy ERP Systems',
  'Third-party APIs',
  'EDI Systems',
  'Banking/Payment Systems',
  'Warehouse Management Systems',
  'Manufacturing Equipment (MES/IoT)',
  'Cloud Applications (Office 365, Google Workspace)',
  'HR Systems (Workday, BambooHR)',
  'Tax Software'
]

const budgetRanges = [
  'Menos de $50k',
  '$50k - $100k',
  '$100k - $250k',
  '$250k - $500k',
  '$500k - $1M',
  '$1M - $2M',
  'Más de $2M',
  'Por definir'
]

const timelineOptions = [
  '1-3 meses',
  '3-6 meses',
  '6-12 meses',
  '12-18 meses',
  '18-24 meses',
  'Más de 24 meses'
]

const teamSizes = [
  '1-2 consultores',
  '3-5 consultores',
  '6-10 consultores',
  '11-20 consultores',
  'Más de 20 consultores',
  'Equipo completo (incluye PM, arquitectos, desarrolladores)'
]

export function ProjectBusinessContext({ data, onUpdate, initialData }: ProjectBusinessContextProps) {
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

  return (
    <div className="space-y-8">
      {/* Industry and Business Processes */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">Industria</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Selecciona tu industria principal
            </p>
          </div>
          
          <Select value={data.industry} onValueChange={(value) => onUpdate({ industry: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona industria" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold">Procesos de Negocio Prioritarios</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Áreas que requieren mayor atención
            </p>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
            {businessProcesses.map((process) => (
              <div key={process} className="flex items-center space-x-2">
                <Checkbox
                  id={`process-${process}`}
                  checked={data.businessProcesses.includes(process)}
                  onCheckedChange={(checked) => handleProcessToggle(process, checked as boolean)}
                />
                <Label htmlFor={`process-${process}`} className="text-sm cursor-pointer">
                  {process}
                </Label>
              </div>
            ))}
          </div>

          {data.businessProcesses.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Procesos seleccionados:</p>
              <div className="flex flex-wrap gap-1">
                {data.businessProcesses.slice(0, 3).map((process) => (
                  <Badge key={process} variant="secondary" className="text-xs">
                    {process}
                  </Badge>
                ))}
                {data.businessProcesses.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.businessProcesses.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Parameters */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-blue-800">
              <DollarSign className="w-4 h-4 mr-2" />
              Presupuesto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={data.budget} onValueChange={(value) => onUpdate({ budget: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona rango" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((budget) => (
                  <SelectItem key={budget} value={budget}>
                    {budget}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-green-800">
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={data.timeline} onValueChange={(value) => onUpdate({ timeline: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona duración" />
              </SelectTrigger>
              <SelectContent>
                {timelineOptions.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center text-purple-800">
              <Building className="w-4 h-4 mr-2" />
              Tamaño del Equipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={data.teamSize} onValueChange={(value) => onUpdate({ teamSize: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tamaño" />
              </SelectTrigger>
              <SelectContent>
                {teamSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Ubicación del Proyecto</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Define donde se realizará principalmente el trabajo
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>País</Label>
            <Input
              value={data.location.country}
              onChange={(e) => onUpdate({ 
                location: { ...data.location, country: e.target.value }
              })}
              placeholder="ej. México"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Ciudad</Label>
            <Input
              value={data.location.city}
              onChange={(e) => onUpdate({ 
                location: { ...data.location, city: e.target.value }
              })}
              placeholder="ej. Ciudad de México"
            />
          </div>
          
          <div className="space-y-2 flex items-end">
            <div className="flex items-center space-x-2 h-10">
              <Checkbox
                id="remote"
                checked={data.location.isRemote}
                onCheckedChange={(checked) => onUpdate({ 
                  location: { ...data.location, isRemote: checked as boolean }
                })}
              />
              <Label htmlFor="remote" className="text-sm">
                Trabajo remoto permitido
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Requirements */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Requerimientos de Compliance (Opcional)</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Regulaciones o estándares que debe cumplir la implementación
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {complianceRequirements.map((requirement) => (
            <div key={requirement} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
              <Checkbox
                id={`compliance-${requirement}`}
                checked={data.complianceRequirements.includes(requirement)}
                onCheckedChange={(checked) => handleComplianceToggle(requirement, checked as boolean)}
              />
              <Label htmlFor={`compliance-${requirement}`} className="text-sm cursor-pointer">
                {requirement}
              </Label>
            </div>
          ))}
        </div>

        {data.complianceRequirements.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.complianceRequirements.map((requirement) => (
              <Badge key={requirement} variant="outline">
                {requirement}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Integration Needs */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Integraciones Necesarias (Opcional)</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Sistemas existentes que deben conectarse con SAP
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {integrationNeeds.map((integration) => (
            <div key={integration} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
              <Checkbox
                id={`integration-${integration}`}
                checked={data.integrationNeeds.includes(integration)}
                onCheckedChange={(checked) => handleIntegrationToggle(integration, checked as boolean)}
              />
              <Label htmlFor={`integration-${integration}`} className="text-sm cursor-pointer">
                {integration}
              </Label>
            </div>
          ))}
        </div>

        {data.integrationNeeds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.integrationNeeds.map((integration) => (
              <Badge key={integration} variant="secondary">
                {integration}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Data Summary */}
      {initialData && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 text-sm">
              📊 Información Pre-cargada desde tu Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                {initialData.industry && (
                  <p>• Industria: {initialData.industry}</p>
                )}
                {initialData.budgetRange && (
                  <p>• Presupuesto sugerido: {initialData.budgetRange}</p>
                )}
                {initialData.projectTimeline && (
                  <p>• Timeline estimado: {initialData.projectTimeline}</p>
                )}
              </div>
              <div>
                {initialData.businessProcesses?.length > 0 && (
                  <p>• {initialData.businessProcesses.length} procesos identificados</p>
                )}
                {initialData.complianceRequirements?.length > 0 && (
                  <p>• {initialData.complianceRequirements.length} requerimientos de compliance</p>
                )}
                {initialData.integrationNeeds?.length > 0 && (
                  <p>• {initialData.integrationNeeds.length} integraciones identificadas</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
