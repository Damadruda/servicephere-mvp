
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientOnboardingData } from './client-onboarding-wizard'
import { AlertTriangle, Clock, Zap } from 'lucide-react'

interface ClientBasicInfoProps {
  data: ClientOnboardingData
  onUpdate: (updates: Partial<ClientOnboardingData>) => void
}

const currentSystems = [
  'Excel/Hojas de cálculo',
  'ERP Legacy (Oracle, JD Edwards, etc.)',
  'QuickBooks / Contabilidad básica',
  'CRM (Salesforce, HubSpot, etc.)',
  'WMS (Warehouse Management)',
  'MES (Manufacturing Execution)',
  'Sistemas customizados',
  'SAP (versión antigua)',
  'Ninguno / Procesos manuales'
]

const commonPainPoints = [
  'Procesos manuales lentos',
  'Falta de integración entre sistemas',
  'Reportes y análisis limitados',
  'Control de inventario deficiente',
  'Problemas de compliance',
  'Escalabilidad limitada',
  'Costos operativos altos',
  'Falta de visibilidad en tiempo real',
  'Problemas de calidad de datos',
  'Procesos de aprobación lentos'
]

const businessGoals = [
  'Automatizar procesos manuales',
  'Mejorar eficiencia operacional',
  'Centralizar información',
  'Mejorar reporting y analytics',
  'Reducir costos operativos',
  'Acelerar crecimiento',
  'Mejorar compliance y auditoría',
  'Facilitar expansión internacional',
  'Mejorar experiencia del cliente',
  'Modernizar tecnología'
]

export function ClientBasicInfo({ data, onUpdate }: ClientBasicInfoProps) {
  const handleSystemToggle = (system: string, checked: boolean) => {
    const updated = checked
      ? [...data.currentSystemsUsed, system]
      : data.currentSystemsUsed.filter(s => s !== system)
    onUpdate({ currentSystemsUsed: updated })
  }

  const handlePainPointToggle = (painPoint: string, checked: boolean) => {
    const updated = checked
      ? [...data.painPoints, painPoint]
      : data.painPoints.filter(p => p !== painPoint)
    onUpdate({ painPoints: updated })
  }

  const handleGoalToggle = (goal: string, checked: boolean) => {
    const updated = checked
      ? [...data.primaryGoals, goal]
      : data.primaryGoals.filter(g => g !== goal)
    onUpdate({ primaryGoals: updated })
  }

  const urgencyOptions = [
    { value: 'low', label: 'Baja - Planificación a largo plazo', icon: Clock, color: 'bg-blue-500' },
    { value: 'medium', label: 'Media - Implementación en 6-12 meses', icon: AlertTriangle, color: 'bg-yellow-500' },
    { value: 'high', label: 'Alta - Necesidad urgente (menos de 6 meses)', icon: Zap, color: 'bg-red-500' }
  ]

  return (
    <div className="space-y-8">
      {/* Current Systems */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Qué sistemas utilizas actualmente?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona todos los sistemas que tu empresa utiliza para gestionar sus procesos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentSystems.map((system) => (
            <div key={system} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <Checkbox
                id={system}
                checked={data.currentSystemsUsed.includes(system)}
                onCheckedChange={(checked) => handleSystemToggle(system, checked as boolean)}
              />
              <Label
                htmlFor={system}
                className="text-sm cursor-pointer"
              >
                {system}
              </Label>
            </div>
          ))}
        </div>

        {data.currentSystemsUsed.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Sistemas seleccionados:</p>
            <div className="flex flex-wrap gap-2">
              {data.currentSystemsUsed.map((system) => (
                <Badge key={system} variant="secondary">
                  {system}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pain Points */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Cuáles son tus principales desafíos?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Identifica los problemas más importantes que tu empresa enfrenta actualmente
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonPainPoints.map((painPoint) => (
            <div key={painPoint} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <Checkbox
                id={painPoint}
                checked={data.painPoints.includes(painPoint)}
                onCheckedChange={(checked) => handlePainPointToggle(painPoint, checked as boolean)}
              />
              <Label
                htmlFor={painPoint}
                className="text-sm cursor-pointer"
              >
                {painPoint}
              </Label>
            </div>
          ))}
        </div>

        {data.painPoints.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Desafíos identificados:</p>
            <div className="flex flex-wrap gap-2">
              {data.painPoints.map((painPoint) => (
                <Badge key={painPoint} variant="destructive">
                  {painPoint}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary Goals */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Cuáles son tus objetivos principales?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Selecciona las metas más importantes que quieres lograr con SAP
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businessGoals.map((goal) => (
            <div key={goal} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <Checkbox
                id={goal}
                checked={data.primaryGoals.includes(goal)}
                onCheckedChange={(checked) => handleGoalToggle(goal, checked as boolean)}
              />
              <Label
                htmlFor={goal}
                className="text-sm cursor-pointer"
              >
                {goal}
              </Label>
            </div>
          ))}
        </div>

        {data.primaryGoals.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Objetivos seleccionados:</p>
            <div className="flex flex-wrap gap-2">
              {data.primaryGoals.map((goal) => (
                <Badge key={goal} variant="default">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Urgency Level */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">¿Cuál es la urgencia de tu proyecto?</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Esto nos ayudará a priorizar y recomendar el enfoque adecuado
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {urgencyOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  data.urgencyLevel === option.value ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onUpdate({ urgencyLevel: option.value as any })}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-sm">{option.label}</CardTitle>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
