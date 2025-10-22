
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'

interface ProjectTimelineProps {
  contract: any
}

export function ProjectTimeline({ contract }: ProjectTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const milestones = contract.milestones?.milestones || []
  const milestoneUpdates = contract.milestoneUpdates || []

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getMilestoneForDate = (date: Date) => {
    return milestones.find((milestone: any) => {
      const milestoneDate = new Date(milestone.dueDate)
      return isSameDay(date, milestoneDate)
    })
  }

  const getMilestoneStatus = (milestoneId: string) => {
    const update = milestoneUpdates.find((u: any) => u.milestoneId === milestoneId)
    return update?.status || 'NOT_STARTED'
  }

  const getMilestoneProgress = (milestoneId: string) => {
    const update = milestoneUpdates.find((u: any) => u.milestoneId === milestoneId)
    return update?.progressPercent || 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DELAYED': return 'bg-red-100 text-red-800 border-red-200'
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4" />
      case 'DELAYED': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Timeline del Proyecto
              </CardTitle>
              <CardDescription>
                Vista cronológica de hitos y actividades
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium text-lg px-4">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendario de Hitos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map(day => {
                  const milestone = getMilestoneForDate(day)
                  const isToday = isSameDay(day, new Date())
                  const isCurrentMonth = isSameMonth(day, currentDate)

                  return (
                    <div
                      key={day.toString()}
                      className={`
                        relative p-2 min-h-[60px] border rounded-lg transition-colors
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                        ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                        ${milestone ? 'border-l-4 border-l-blue-500' : ''}
                      `}
                    >
                      <div className="text-sm font-medium">
                        {format(day, 'd')}
                      </div>
                      {milestone && (
                        <div className="mt-1">
                          <div className={`
                            text-xs px-2 py-1 rounded-full text-center
                            ${getStatusColor(getMilestoneStatus(milestone.id))}
                          `}>
                            {milestone.name.substring(0, 10)}...
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestone List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hitos del Mes</CardTitle>
              <CardDescription>
                Hitos programados para {format(currentDate, 'MMMM yyyy', { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones
                  .filter((milestone: any) => {
                    const milestoneDate = new Date(milestone.dueDate)
                    return isSameMonth(milestoneDate, currentDate)
                  })
                  .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((milestone: any) => {
                    const status = getMilestoneStatus(milestone.id)
                    const progress = getMilestoneProgress(milestone.id)

                    return (
                      <div key={milestone.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{milestone.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {milestone.description}
                            </p>
                          </div>
                          <Badge className={getStatusColor(status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(status)}
                              {status}
                            </div>
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            Fecha: {format(new Date(milestone.dueDate), 'PPP', { locale: es })}
                          </span>
                          <span className="text-gray-500">
                            Progreso: {progress}%
                          </span>
                        </div>

                        <Progress value={progress} className="h-2" />

                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Entregables:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {milestone.deliverables.map((deliverable: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}
                {milestones.filter((milestone: any) => 
                  isSameMonth(new Date(milestone.dueDate), currentDate)
                ).length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No hay hitos programados para este mes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {format(new Date(contract.startDate), 'PPP', { locale: es })}
              </div>
              <p className="text-sm text-gray-600">Fecha de Inicio</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((milestoneUpdates.filter((m: any) => m.status === 'COMPLETED').length / milestones.length) * 100) || 0}%
              </div>
              <p className="text-sm text-gray-600">Progreso Total</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {format(new Date(contract.endDate), 'PPP', { locale: es })}
              </div>
              <p className="text-sm text-gray-600">Fecha de Finalización</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
