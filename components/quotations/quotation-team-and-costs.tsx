
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuotationData } from './quotation-wizard'
import { Plus, Trash2, Calculator, Users, DollarSign } from 'lucide-react'

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

interface QuotationTeamAndCostsProps {
  data: QuotationData
  project: Project
  onUpdate: (updates: Partial<QuotationData>) => void
}

const teamRoles = [
  { role: 'Project Manager', avgRate: 150, description: 'Gestión del proyecto y coordinación' },
  { role: 'SAP Solution Architect', avgRate: 200, description: 'Diseño de la arquitectura SAP' },
  { role: 'SAP Functional Consultant - FI', avgRate: 120, description: 'Consultor funcional Finanzas' },
  { role: 'SAP Functional Consultant - SD', avgRate: 120, description: 'Consultor funcional Ventas' },
  { role: 'SAP Functional Consultant - MM', avgRate: 120, description: 'Consultor funcional Materiales' },
  { role: 'SAP Functional Consultant - PP', avgRate: 120, description: 'Consultor funcional Producción' },
  { role: 'SAP Technical Consultant', avgRate: 140, description: 'Desarrollador técnico ABAP' },
  { role: 'SAP Basis Administrator', avgRate: 130, description: 'Administración técnica SAP' },
  { role: 'Data Migration Specialist', avgRate: 135, description: 'Especialista en migración de datos' },
  { role: 'Change Management Specialist', avgRate: 110, description: 'Gestión del cambio organizacional' },
  { role: 'SAP Trainer', avgRate: 100, description: 'Capacitación de usuarios finales' },
  { role: 'Quality Assurance Analyst', avgRate: 90, description: 'Testing y aseguramiento de calidad' }
]

const costCategories = [
  { category: 'Licencias SAP', description: 'Costos de licenciamiento' },
  { category: 'Consultoría', description: 'Servicios de consultoría especializada' },
  { category: 'Desarrollo', description: 'Desarrollo personalizado y configuraciones' },
  { category: 'Testing', description: 'Pruebas y aseguramiento de calidad' },
  { category: 'Capacitación', description: 'Training de usuarios finales' },
  { category: 'Infraestructura', description: 'Costos de hardware y cloud' },
  { category: 'Migración de Datos', description: 'Extracción, transformación y carga' },
  { category: 'Go-Live Support', description: 'Soporte durante la puesta en marcha' },
  { category: 'Otros', description: 'Otros costos del proyecto' }
]

const experienceLevels = [
  'Junior (1-3 años)',
  'Semi-Senior (3-5 años)', 
  'Senior (5-8 años)',
  'Expert (8+ años)',
  'Principal (10+ años)'
]

const allocations = [
  '25% - Tiempo parcial mínimo',
  '50% - Medio tiempo',
  '75% - Tiempo parcial alto',
  '100% - Tiempo completo'
]

export function QuotationTeamAndCosts({ data, project, onUpdate }: QuotationTeamAndCostsProps) {
  const [newTeamMember, setNewTeamMember] = useState({
    role: '',
    experience: '',
    certifications: [] as string[],
    allocation: '',
    cost: 0
  })

  const [newCostItem, setNewCostItem] = useState({
    category: '',
    description: '',
    cost: 0,
    currency: 'USD'
  })

  const [certificationInput, setCertificationInput] = useState('')

  const addTeamMember = () => {
    if (newTeamMember.role && newTeamMember.experience && newTeamMember.allocation && newTeamMember.cost > 0) {
      onUpdate({
        teamComposition: [...data.teamComposition, { ...newTeamMember }]
      })
      calculateTotalCost([...data.teamComposition, newTeamMember], data.costBreakdown)
      setNewTeamMember({ role: '', experience: '', certifications: [], allocation: '', cost: 0 })
      setCertificationInput('')
    }
  }

  const removeTeamMember = (index: number) => {
    const updated = data.teamComposition.filter((_, i) => i !== index)
    onUpdate({ teamComposition: updated })
    calculateTotalCost(updated, data.costBreakdown)
  }

  const addCostItem = () => {
    if (newCostItem.category && newCostItem.description && newCostItem.cost > 0) {
      onUpdate({
        costBreakdown: [...data.costBreakdown, { ...newCostItem }]
      })
      calculateTotalCost(data.teamComposition, [...data.costBreakdown, newCostItem])
      setNewCostItem({ category: '', description: '', cost: 0, currency: 'USD' })
    }
  }

  const removeCostItem = (index: number) => {
    const updated = data.costBreakdown.filter((_, i) => i !== index)
    onUpdate({ costBreakdown: updated })
    calculateTotalCost(data.teamComposition, updated)
  }

  const calculateTotalCost = (team: typeof data.teamComposition, costs: typeof data.costBreakdown) => {
    const teamCost = team.reduce((sum, member) => sum + member.cost, 0)
    const additionalCosts = costs.reduce((sum, item) => sum + item.cost, 0)
    const total = teamCost + additionalCosts
    
    onUpdate({ totalCost: total })
  }

  const addCertification = () => {
    if (certificationInput.trim()) {
      setNewTeamMember(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }))
      setCertificationInput('')
    }
  }

  const removeCertification = (index: number) => {
    setNewTeamMember(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const loadTeamTemplate = () => {
    const moduleCount = project.sapModules.length
    const isComplex = moduleCount > 4 || project.implementationType === 'migration'
    
    let template = [
      { role: 'Project Manager', experience: 'Senior (5-8 años)', certifications: ['PMP', 'SAP Activate'], allocation: '50% - Medio tiempo', cost: 15000 },
      { role: 'SAP Solution Architect', experience: 'Expert (8+ años)', certifications: ['SAP Certified Solution Architect'], allocation: '75% - Tiempo parcial alto', cost: 30000 }
    ]

    // Add functional consultants based on modules
    if (project.sapModules.some(m => m.includes('FI'))) {
      template.push({ role: 'SAP Functional Consultant - FI', experience: 'Senior (5-8 años)', certifications: ['SAP Certified Application Associate - Financial Accounting'], allocation: '100% - Tiempo completo', cost: 24000 })
    }
    
    if (project.sapModules.some(m => m.includes('SD'))) {
      template.push({ role: 'SAP Functional Consultant - SD', experience: 'Senior (5-8 años)', certifications: ['SAP Certified Application Associate - Sales and Distribution'], allocation: '100% - Tiempo completo', cost: 24000 })
    }

    if (project.sapModules.some(m => m.includes('MM'))) {
      template.push({ role: 'SAP Functional Consultant - MM', experience: 'Senior (5-8 años)', certifications: ['SAP Certified Application Associate - Materials Management'], allocation: '100% - Tiempo completo', cost: 24000 })
    }

    // Add technical roles if complex
    if (isComplex) {
      template.push(
        { role: 'SAP Technical Consultant', experience: 'Senior (5-8 años)', certifications: ['SAP Certified Development Associate - ABAP'], allocation: '75% - Tiempo parcial alto', cost: 21000 },
        { role: 'Data Migration Specialist', experience: 'Senior (5-8 años)', certifications: ['SAP Data Services', 'SAP LTMC'], allocation: '50% - Medio tiempo', cost: 13500 }
      )
    }

    // Always add training and QA
    template.push(
      { role: 'SAP Trainer', experience: 'Semi-Senior (3-5 años)', certifications: ['SAP Enable Now', 'Adult Learning Principles'], allocation: '25% - Tiempo parcial mínimo', cost: 5000 },
      { role: 'Quality Assurance Analyst', experience: 'Semi-Senior (3-5 años)', certifications: ['ISTQB', 'SAP Testing'], allocation: '50% - Medio tiempo', cost: 9000 }
    )

    onUpdate({ teamComposition: template })
    calculateTotalCost(template, data.costBreakdown)
  }

  const loadCostTemplate = () => {
    const moduleCount = project.sapModules.length
    const isComplex = moduleCount > 4
    
    let template = [
      { category: 'Consultoría', description: 'Servicios de consultoría especializada SAP', cost: data.teamComposition.reduce((sum, member) => sum + member.cost, 0) || 50000, currency: 'USD' },
      { category: 'Licencias SAP', description: 'Licenciamiento S/4HANA y módulos requeridos', cost: isComplex ? 80000 : 50000, currency: 'USD' }
    ]

    if (project.implementationType === 'migration') {
      template.push({ category: 'Migración de Datos', description: 'ETL y migración desde sistema legacy', cost: 15000, currency: 'USD' })
    }

    if (project.cloudPreference === 'cloud') {
      template.push({ category: 'Infraestructura', description: 'Costos de infraestructura cloud', cost: 10000, currency: 'USD' })
    }

    template.push(
      { category: 'Capacitación', description: 'Training de usuarios finales', cost: 8000, currency: 'USD' },
      { category: 'Go-Live Support', description: 'Soporte intensivo durante go-live', cost: 12000, currency: 'USD' }
    )

    onUpdate({ costBreakdown: template })
    calculateTotalCost(data.teamComposition, template)
  }

  return (
    <div className="space-y-8">
      {/* Team Composition */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Composición del Equipo</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Define los roles, experiencia y certificaciones de tu equipo
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={loadTeamTemplate}
          >
            <Users className="h-4 w-4 mr-2" />
            Cargar template
          </Button>
        </div>

        {/* Existing Team Members */}
        {data.teamComposition.length > 0 && (
          <div className="space-y-3">
            {data.teamComposition.map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{member.role}</h4>
                        <Badge variant="secondary">{member.experience}</Badge>
                        <Badge variant="outline">{member.allocation}</Badge>
                      </div>
                      
                      {member.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.certifications.map((cert, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-green-600">${member.cost.toLocaleString()}</span> para el proyecto
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Team Member */}
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Rol</Label>
                  <Select
                    value={newTeamMember.role}
                    onValueChange={(value) => {
                      const roleData = teamRoles.find(r => r.role === value)
                      setNewTeamMember(prev => ({
                        ...prev,
                        role: value,
                        cost: roleData?.avgRate ? roleData.avgRate * 100 : prev.cost
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamRoles.map((role) => (
                        <SelectItem key={role.role} value={role.role}>
                          <div>
                            <div className="font-medium">{role.role}</div>
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Experiencia</Label>
                  <Select
                    value={newTeamMember.experience}
                    onValueChange={(value) => setNewTeamMember(prev => ({ ...prev, experience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nivel de experiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Asignación al Proyecto</Label>
                  <Select
                    value={newTeamMember.allocation}
                    onValueChange={(value) => setNewTeamMember(prev => ({ ...prev, allocation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Dedicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {allocations.map((allocation) => (
                        <SelectItem key={allocation} value={allocation}>
                          {allocation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Costo Total (USD)</Label>
                  <Input
                    type="number"
                    value={newTeamMember.cost}
                    onChange={(e) => setNewTeamMember(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Certificaciones</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    placeholder="Agregar certificación"
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCertification}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newTeamMember.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newTeamMember.certifications.map((cert, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {cert}
                        <button
                          onClick={() => removeCertification(i)}
                          className="ml-1 hover:bg-red-600 rounded-full"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={addTeamMember}
                disabled={!newTeamMember.role || !newTeamMember.experience || !newTeamMember.allocation || newTeamMember.cost <= 0}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Miembro del Equipo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Desglose de Costos</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Detalla todos los componentes de costo del proyecto
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={loadCostTemplate}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Cargar template
          </Button>
        </div>

        {/* Existing Cost Items */}
        {data.costBreakdown.length > 0 && (
          <div className="space-y-3">
            {data.costBreakdown.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.category}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        ${item.cost.toLocaleString()} {item.currency}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCostItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Cost Item */}
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Categoría</Label>
                  <Select
                    value={newCostItem.category}
                    onValueChange={(value) => setNewCostItem(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {costCategories.map((category) => (
                        <SelectItem key={category.category} value={category.category}>
                          <div>
                            <div className="font-medium">{category.category}</div>
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Costo (USD)</Label>
                  <Input
                    type="number"
                    value={newCostItem.cost}
                    onChange={(e) => setNewCostItem(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Descripción</Label>
                <Input
                  value={newCostItem.description}
                  onChange={(e) => setNewCostItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe este componente de costo..."
                />
              </div>

              <Button
                type="button"
                onClick={addCostItem}
                disabled={!newCostItem.category || !newCostItem.description || newCostItem.cost <= 0}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Componente de Costo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Cost Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Costo Total del Proyecto</h3>
              <p className="text-sm text-green-700">
                Equipo: ${data.teamComposition.reduce((sum, member) => sum + member.cost, 0).toLocaleString()} + 
                Otros costos: ${data.costBreakdown.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                <DollarSign className="inline h-8 w-8" />
                {data.totalCost.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">{data.currency}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
