
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  Calendar, 
  MessageCircle, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  DollarSign,
  TrendingUp,
  Target,
  Archive
} from 'lucide-react'
import { ProjectTimeline } from './project-timeline'
import { MilestoneTracker } from './milestone-tracker'
import { CommunicationCenter } from './communication-center'
import { DocumentManager } from './document-manager'
import { ProgressReporting } from './progress-reporting'
import { RiskManagement } from './risk-management'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ProjectManagementDashboardProps {
  contract: any
  conversations: any[]
}

export function ProjectManagementDashboard({ 
  contract, 
  conversations 
}: ProjectManagementDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Calculate project metrics
  const totalMilestones = contract.milestones?.milestones?.length || 0
  const completedMilestones = contract.milestoneUpdates?.filter((m: any) => 
    m.status === 'COMPLETED'
  ).length || 0
  const overallProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  const totalPayments = contract.payments?.length || 0
  const paidPayments = contract.payments?.filter((p: any) => p.status === 'PAID').length || 0
  const paymentProgress = totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0

  const daysUntilDeadline = Math.ceil(
    (new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING_SIGNATURES': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {contract.title}
          </h1>
          <p className="text-gray-600 mt-1">
            Cliente: {contract.quotation.project.client.name} | 
            Proveedor: {contract.quotation.provider.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(contract.status)}>
            {contract.status}
          </Badge>
          <span className="text-sm text-gray-600">
            Contrato #{contract.contractNumber}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedMilestones} de {totalMilestones} hitos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Financiero</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(contract.totalValue)}
            </div>
            <Progress value={paymentProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {paidPayments} de {totalPayments} pagos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Restante</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysUntilDeadline > 0 ? `${daysUntilDeadline}d` : 'Vencido'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Hasta: {format(new Date(contract.endDate), 'PPP', { locale: es })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comunicación</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.reduce((acc, conv) => acc + conv.messages.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {conversations.length} conversaciones activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Hitos
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Comunicación
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Hitos Recientes
                </CardTitle>
                <CardDescription>
                  Últimas actualizaciones de hitos del proyecto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contract.milestoneUpdates?.slice(0, 3).map((milestone: any) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{milestone.milestoneName}</p>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={milestone.progressPercent} className="w-20 h-2" />
                          <span className="text-xs text-gray-500">
                            {milestone.progressPercent}%
                          </span>
                        </div>
                      </div>
                      <Badge className={
                        milestone.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        milestone.status === 'DELAYED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {milestone.status}
                      </Badge>
                    </div>
                  ))}
                  {(!contract.milestoneUpdates || contract.milestoneUpdates.length === 0) && (
                    <p className="text-gray-500 text-center py-4">
                      No hay actualizaciones de hitos disponibles
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Estado de Pagos
                </CardTitle>
                <CardDescription>
                  Cronograma de pagos del proyecto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contract.payments?.slice(0, 3).map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-gray-600">
                          Vence: {format(new Date(payment.dueDate), 'PPP', { locale: es })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(payment.amount)}</p>
                        <Badge className={
                          payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          payment.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {(!contract.payments || contract.payments.length === 0) && (
                    <p className="text-gray-500 text-center py-4">
                      No hay pagos programados
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <ProjectTimeline contract={contract} />
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <MilestoneTracker contract={contract} />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationCenter 
            contractId={contract.id}
            conversations={conversations}
            projectId={contract.quotation.project.id}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentManager contractId={contract.id} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ProgressReporting contract={contract} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
