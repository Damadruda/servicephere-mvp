
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, DollarSign, FileText, Settings, Plus, Trash2, Clock } from 'lucide-react'
import { DueDiligenceData } from './due-diligence-wizard'
import { toast } from 'sonner'

interface Quotation {
  id: string
  title: string
  description: string
  totalCost: number
  currency: string
  timeline: string
  project: {
    id: string
    title: string
    companyName: string
  }
  provider: {
    id: string
    name: string
    companyName: string
    email: string
  }
}

interface ContractGenerationProps {
  data: DueDiligenceData
  quotation: Quotation
  onUpdate: (updates: Partial<DueDiligenceData>) => void
}

interface PaymentMilestone {
  id: string
  name: string
  description: string
  percentage: number
  amount: number
  dueDate: string
  dependencies: string[]
}

interface ContractMilestone {
  id: string
  name: string
  description: string
  deliverables: string[]
  startDate: string
  endDate: string
  dependencies: string[]
}

const contractTemplates = [
  {
    id: 'standard_implementation',
    name: 'Implementación SAP Estándar',
    description: 'Template para implementaciones nuevas de S/4HANA',
    applicableFor: ['new', 'implementation']
  },
  {
    id: 'upgrade_migration',
    name: 'Upgrade y Migración',
    description: 'Template para actualizaciones y migraciones',
    applicableFor: ['upgrade', 'migration']
  },
  {
    id: 'consulting_services',
    name: 'Servicios de Consultoría',
    description: 'Template para servicios de consultoría y optimización',
    applicableFor: ['consulting', 'optimization']
  },
  {
    id: 'support_maintenance',
    name: 'Soporte y Mantenimiento',
    description: 'Template para contratos de soporte post go-live',
    applicableFor: ['support', 'maintenance']
  }
]

const paymentTermsOptions = [
  '30% inicio, 40% UAT, 30% go-live',
  '25% inicio, 50% desarrollo completo, 25% go-live',
  '20% inicio, 30% diseño, 30% desarrollo, 20% go-live',
  'Pagos mensuales por horas trabajadas',
  'Pago único al completar el proyecto'
]

export function ContractGeneration({ data, quotation, onUpdate }: ContractGenerationProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [contractTerms, setContractTerms] = useState<any>({})
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentMilestone[]>([])
  const [milestones, setMilestones] = useState<ContractMilestone[]>([])
  const [customTerms, setCustomTerms] = useState('')

  useEffect(() => {
    // Auto-select template based on project type
    const defaultTemplate = contractTemplates.find(t => 
      t.applicableFor.includes('implementation')
    ) || contractTemplates[0]
    
    setSelectedTemplate(defaultTemplate.id)
    
    // Set default dates
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() + 14) // Start in 2 weeks
    
    const timelineMonths = parseInt(quotation.timeline.match(/\d+/)?.[0] || '6')
    const end = new Date(start)
    end.setMonth(start.getMonth() + timelineMonths)
    
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
    
    if (Object.keys(data.contractTerms).length === 0) {
      generateContract(defaultTemplate.id)
    }
  }, [])

  const generateContract = async (templateId: string) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          quotationData: quotation,
          verificationData: data,
          projectDates: {
            startDate,
            endDate
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        setContractTerms(result.contractTerms)
        setPaymentSchedule(result.paymentSchedule)
        setMilestones(result.milestones)
        setPaymentTerms(result.paymentTerms)
        
        updateContractData(result)
      } else {
        // Fallback to manual generation
        generateManualContract(templateId)
      }
      
    } catch (error) {
      console.error('Error generating contract:', error)
      generateManualContract(templateId)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateManualContract = (templateId: string) => {
    // Generate contract based on template and quotation data
    const template = contractTemplates.find(t => t.id === templateId)
    
    // Generate payment schedule
    const paymentMilestones: PaymentMilestone[] = [
      {
        id: '1',
        name: 'Pago Inicial',
        description: 'Pago al inicio del proyecto y firma del contrato',
        percentage: 30,
        amount: quotation.totalCost * 0.3,
        dueDate: startDate,
        dependencies: []
      },
      {
        id: '2',
        name: 'Pago Intermedio',
        description: 'Pago al completar el desarrollo y testing',
        percentage: 40,
        amount: quotation.totalCost * 0.4,
        dueDate: calculateMidDate(startDate, endDate),
        dependencies: ['development']
      },
      {
        id: '3',
        name: 'Pago Final',
        description: 'Pago al go-live exitoso y aceptación del cliente',
        percentage: 30,
        amount: quotation.totalCost * 0.3,
        dueDate: endDate,
        dependencies: ['go-live', 'client-acceptance']
      }
    ]

    // Generate project milestones
    const projectMilestones: ContractMilestone[] = [
      {
        id: 'analysis',
        name: 'Fase de Análisis',
        description: 'Análisis de requerimientos y diseño de la solución',
        deliverables: ['Documento de requerimientos', 'Diseño funcional', 'Plan de proyecto'],
        startDate: startDate,
        endDate: addMonths(startDate, 1),
        dependencies: []
      },
      {
        id: 'development',
        name: 'Fase de Desarrollo',
        description: 'Configuración, desarrollo y pruebas unitarias',
        deliverables: ['Configuraciones SAP', 'Desarrollos ABAP', 'Pruebas unitarias'],
        startDate: addMonths(startDate, 1),
        endDate: addMonths(startDate, Math.floor(parseInt(quotation.timeline.match(/\d+/)?.[0] || '6') * 0.7)),
        dependencies: ['analysis']
      },
      {
        id: 'testing',
        name: 'Fase de Testing',
        description: 'Pruebas integrales y aceptación del usuario',
        deliverables: ['Plan de pruebas', 'Casos de test ejecutados', 'Reporte de UAT'],
        startDate: addMonths(startDate, Math.floor(parseInt(quotation.timeline.match(/\d+/)?.[0] || '6') * 0.7)),
        endDate: addMonths(startDate, Math.floor(parseInt(quotation.timeline.match(/\d+/)?.[0] || '6') * 0.9)),
        dependencies: ['development']
      },
      {
        id: 'go-live',
        name: 'Go-Live',
        description: 'Puesta en marcha y soporte inicial',
        deliverables: ['Sistema productivo', 'Usuarios capacitados', 'Soporte go-live'],
        startDate: addMonths(startDate, Math.floor(parseInt(quotation.timeline.match(/\d+/)?.[0] || '6') * 0.9)),
        endDate: endDate,
        dependencies: ['testing']
      }
    ]

    // Generate contract terms
    const terms = {
      template: template?.name,
      scope: quotation.title,
      totalValue: quotation.totalCost,
      currency: quotation.currency,
      duration: quotation.timeline,
      startDate,
      endDate,
      paymentTerms: '30% inicio, 40% desarrollo completo, 30% go-live exitoso',
      warranties: [
        'Garantía de 90 días post go-live para corrección de errores',
        'Garantía de funcionalidad según especificaciones acordadas',
        'Soporte técnico incluido durante el primer mes post go-live'
      ],
      slaTerms: {
        responseTime: '24 horas para issues críticos',
        resolutionTime: '72 horas para issues críticos',
        availability: '99% durante horario laboral'
      },
      penaltyClauses: [
        'Penalización del 1% del valor total por cada semana de retraso',
        'Derecho del cliente a terminar el contrato por incumplimiento grave'
      ]
    }

    setContractTerms(terms)
    setPaymentSchedule(paymentMilestones)
    setMilestones(projectMilestones)
    setPaymentTerms('30% inicio, 40% desarrollo completo, 30% go-live exitoso')

    updateContractData({
      contractTerms: terms,
      paymentSchedule: paymentMilestones,
      milestones: projectMilestones,
      paymentTerms: '30% inicio, 40% desarrollo completo, 30% go-live exitoso'
    })
  }

  const updateContractData = (contractData: any) => {
    onUpdate({
      contractTerms: contractData.contractTerms,
      paymentSchedule: contractData.paymentSchedule,
      milestones: contractData.milestones,
      startDate,
      endDate
    })
  }

  const addPaymentMilestone = () => {
    const newMilestone: PaymentMilestone = {
      id: Date.now().toString(),
      name: 'Nuevo Pago',
      description: '',
      percentage: 0,
      amount: 0,
      dueDate: '',
      dependencies: []
    }
    
    setPaymentSchedule([...paymentSchedule, newMilestone])
  }

  const updatePaymentMilestone = (id: string, updates: Partial<PaymentMilestone>) => {
    setPaymentSchedule(prev => 
      prev.map(m => m.id === id ? { ...m, ...updates } : m)
    )
  }

  const removePaymentMilestone = (id: string) => {
    setPaymentSchedule(prev => prev.filter(m => m.id !== id))
  }

  const calculateMidDate = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const midTime = startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2
    return new Date(midTime).toISOString().split('T')[0]
  }

  const addMonths = (dateString: string, months: number) => {
    const date = new Date(dateString)
    date.setMonth(date.getMonth() + months)
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Selección de Template de Contrato
          </CardTitle>
          <CardDescription>
            Selecciona el template más adecuado para este tipo de proyecto SAP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {contractTemplates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-colors ${
                  selectedTemplate === template.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                      selectedTemplate === template.id 
                        ? 'bg-primary border-primary' 
                        : 'border-gray-300'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => generateContract(selectedTemplate)}
              disabled={!selectedTemplate || isGenerating}
              className="flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Generando Contrato...</span>
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4" />
                  <span>Generar Contrato Inteligente</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contract Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Fechas del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Fecha de Inicio</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Fecha de Finalización</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Cronograma de Pagos
              </CardTitle>
              <CardDescription>
                Estructura de pagos basada en hitos del proyecto
              </CardDescription>
            </div>
            <Button size="sm" onClick={addPaymentMilestone}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Pago
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentSchedule.map((payment, index) => (
              <Card key={payment.id} className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Pago {index + 1}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removePaymentMilestone(payment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">Nombre</Label>
                      <Input
                        value={payment.name}
                        onChange={(e) => updatePaymentMilestone(payment.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Porcentaje (%)</Label>
                      <Input
                        type="number"
                        value={payment.percentage}
                        onChange={(e) => {
                          const percentage = parseInt(e.target.value) || 0
                          updatePaymentMilestone(payment.id, { 
                            percentage,
                            amount: quotation.totalCost * (percentage / 100)
                          })
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Fecha de Vencimiento</Label>
                      <Input
                        type="date"
                        value={payment.dueDate}
                        onChange={(e) => updatePaymentMilestone(payment.id, { dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Label className="text-sm">Descripción</Label>
                    <Textarea
                      value={payment.description}
                      onChange={(e) => updatePaymentMilestone(payment.id, { description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  
                  <div className="mt-2 text-right">
                    <span className="text-lg font-semibold text-green-600">
                      ${payment.amount.toLocaleString()} {quotation.currency}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {paymentSchedule.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Total del Contrato</span>
                  <span className="text-xl font-bold text-green-600">
                    ${paymentSchedule.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} {quotation.currency}
                  </span>
                </div>
                <div className="text-sm text-green-700 mt-1">
                  {paymentSchedule.reduce((sum, p) => sum + p.percentage, 0)}% del valor total
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contract Terms Summary */}
      {Object.keys(contractTerms).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa del Contrato</CardTitle>
            <CardDescription>
              Términos principales generados automáticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Información General</h4>
                  <p><strong>Template:</strong> {contractTerms.template}</p>
                  <p><strong>Alcance:</strong> {contractTerms.scope}</p>
                  <p><strong>Duración:</strong> {contractTerms.duration}</p>
                  <p><strong>Valor Total:</strong> ${contractTerms.totalValue?.toLocaleString()} {contractTerms.currency}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Fechas Clave</h4>
                  <p><strong>Inicio:</strong> {new Date(contractTerms.startDate).toLocaleDateString('es-ES')}</p>
                  <p><strong>Finalización:</strong> {new Date(contractTerms.endDate).toLocaleDateString('es-ES')}</p>
                  <p><strong>Términos de Pago:</strong> {contractTerms.paymentTerms}</p>
                </div>
              </div>
              
              {contractTerms.warranties && (
                <div>
                  <h4 className="font-medium">Garantías Incluidas</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {contractTerms.warranties.map((warranty: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{warranty}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Términos Personalizados</CardTitle>
          <CardDescription>
            Agrega cláusulas específicas o modificaciones a los términos estándar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={customTerms}
            onChange={(e) => setCustomTerms(e.target.value)}
            placeholder="Ejemplo: Debido al análisis de riesgo, se requiere una garantía bancaria adicional del 10% del valor del contrato..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  )
}
