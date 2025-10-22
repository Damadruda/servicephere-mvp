
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  PieChart,
  FileText,
  Filter,
  RefreshCw,
  Target,
  Percent,
  Calculator,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface FinancialReportsProps {
  userId: string
  stats: any
  transactions: any[]
}

export function FinancialReports({ userId, stats, transactions }: FinancialReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [reportType, setReportType] = useState('overview')

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Calculate monthly data (mock data for demo)
  const monthlyData = [
    { month: 'Ene', income: 15000, expenses: 8000, profit: 7000 },
    { month: 'Feb', income: 18000, expenses: 9500, profit: 8500 },
    { month: 'Mar', income: 22000, expenses: 11000, profit: 11000 },
    { month: 'Abr', income: 25000, expenses: 12500, profit: 12500 },
    { month: 'May', income: 28000, expenses: 13000, profit: 15000 },
    { month: 'Jun', income: 32000, expenses: 15000, profit: 17000 }
  ]

  // Payment method breakdown
  const paymentMethodStats = [
    { method: 'Tarjetas de Crédito', amount: 45000, percentage: 45, count: 120 },
    { method: 'Transferencias Bancarias', amount: 35000, percentage: 35, count: 85 },
    { method: 'Wallets Digitales', amount: 20000, percentage: 20, count: 95 }
  ]

  // Project categories performance
  const categoryStats = [
    { category: 'SAP S/4HANA Implementation', revenue: 85000, projects: 8, avgValue: 10625 },
    { category: 'SAP Analytics Cloud', revenue: 45000, projects: 12, avgValue: 3750 },
    { category: 'SAP Integration', revenue: 32000, projects: 15, avgValue: 2133 },
    { category: 'SAP Training', revenue: 18000, projects: 25, avgValue: 720 }
  ]

  // Tax and compliance data
  const taxData = {
    currentQuarter: {
      grossIncome: 180000,
      deductibleExpenses: 35000,
      taxableIncome: 145000,
      estimatedTax: 36250,
      paidTax: 32000,
      pendingTax: 4250
    },
    yearToDate: {
      grossIncome: 520000,
      deductibleExpenses: 95000,
      taxableIncome: 425000,
      estimatedTax: 106250,
      paidTax: 95000,
      pendingTax: 11250
    }
  }

  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]
  const monthlyGrowth = previousMonth ? 
    ((currentMonth.profit - previousMonth.profit) / previousMonth.profit) * 100 : 0

  const generateReport = async (type: string, format: string) => {
    // In production, this would generate and download actual reports
    console.log(`Generating ${type} report in ${format} format`)
    
    // Simulate report generation
    const reportData = {
      type,
      format,
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      data: {
        totalIncome: stats.totalReceived,
        totalExpenses: stats.totalPaid,
        netProfit: stats.totalReceived - stats.totalPaid,
        transactions: transactions.length,
        fees: stats.totalFees
      }
    }

    // Create and download file (mock)
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-report-${type}-${selectedPeriod}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Reportes Financieros
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 días</SelectItem>
                  <SelectItem value="30d">30 días</SelectItem>
                  <SelectItem value="90d">90 días</SelectItem>
                  <SelectItem value="1y">1 año</SelectItem>
                  <SelectItem value="ytd">Este año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm" onClick={() => generateReport('comprehensive', 'pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Ingresos Totales</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalReceived)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs text-green-100">+12.5% vs mes anterior</span>
                </div>
              </div>
              <ArrowDownRight className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Gastos Totales</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalPaid)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs text-red-100">-8.3% vs mes anterior</span>
                </div>
              </div>
              <ArrowUpRight className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Ganancia Neta</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalReceived - stats.totalPaid)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs text-blue-100">
                    +{monthlyGrowth.toFixed(1)}% crecimiento
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Fees Pagados</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalFees)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Percent className="h-3 w-3" />
                  <span className="text-xs text-purple-100">
                    {((stats.totalFees / stats.totalPaid) * 100).toFixed(1)}% de gastos
                  </span>
                </div>
              </div>
              <Calculator className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="income">Ingresos</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="tax">Fiscal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendencia Mensual
              </CardTitle>
              <CardDescription>
                Evolución de ingresos, gastos y ganancias por mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((month, index) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{month.month}</div>
                    <div className="flex-1">
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Ingresos</div>
                          <div className="font-medium text-green-600">
                            {formatCurrency(month.income)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Gastos</div>
                          <div className="font-medium text-red-600">
                            {formatCurrency(month.expenses)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Ganancia</div>
                          <div className="font-medium text-blue-600">
                            {formatCurrency(month.profit)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 h-2">
                        <div 
                          className="bg-green-200 rounded-sm"
                          style={{ width: `${(month.income / 35000) * 100}%` }}
                        />
                        <div 
                          className="bg-red-200 rounded-sm"
                          style={{ width: `${(month.expenses / 35000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Métodos de Pago
              </CardTitle>
              <CardDescription>
                Distribución de transacciones por método de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodStats.map(method => (
                  <div key={method.method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {method.method === 'Tarjetas de Crédito' ? (
                            <CreditCard className="h-4 w-4" />
                          ) : method.method === 'Transferencias Bancarias' ? (
                            <Banknote className="h-4 w-4" />
                          ) : (
                            <DollarSign className="h-4 w-4" />
                          )}
                          <span className="font-medium">{method.method}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(method.amount)}</div>
                        <div className="text-sm text-gray-600">
                          {method.count} transacciones
                        </div>
                      </div>
                    </div>
                    <Progress value={method.percentage} className="h-2" />
                    <div className="text-xs text-gray-500 text-right">
                      {method.percentage}% del total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          {/* Income by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Categoría de Proyecto</CardTitle>
              <CardDescription>
                Análisis de ingresos por tipo de servicio SAP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map(category => (
                  <div key={category.category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{category.category}</h4>
                      <Badge variant="outline">
                        {category.projects} proyectos
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Ingresos Totales</p>
                        <p className="font-bold text-lg text-green-600">
                          {formatCurrency(category.revenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Valor Promedio</p>
                        <p className="font-medium">
                          {formatCurrency(category.avgValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Contribución</p>
                        <p className="font-medium">
                          {((category.revenue / categoryStats.reduce((sum, c) => sum + c.revenue, 0)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(category.revenue / Math.max(...categoryStats.map(c => c.revenue))) * 100} 
                      className="h-2 mt-3" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          {/* Expense Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Gastos</CardTitle>
              <CardDescription>
                Desglose detallado de gastos operativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Gastos por Categoría</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fees de Plataforma</span>
                      <span className="font-medium">{formatCurrency(stats.totalFees * 0.6)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Procesamiento de Pagos</span>
                      <span className="font-medium">{formatCurrency(stats.totalFees * 0.4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Costos Operativos</span>
                      <span className="font-medium">{formatCurrency(2500)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Marketing</span>
                      <span className="font-medium">{formatCurrency(1800)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Tendencia de Gastos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Este mes</span>
                      <span className="font-medium">{formatCurrency(stats.totalFees + 4300)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mes anterior</span>
                      <span className="font-medium">{formatCurrency((stats.totalFees + 4300) * 0.92)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Variación</span>
                      <span className="font-medium text-red-600">+8.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">ROI Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+247%</div>
                <p className="text-sm text-gray-600">Retorno sobre inversión</p>
                <Progress value={75} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Margen de Ganancia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">68.5%</div>
                <p className="text-sm text-gray-600">Margen neto promedio</p>
                <Progress value={68.5} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tiempo Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">12 días</div>
                <p className="text-sm text-gray-600">De contrato a pago</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">-3 días vs anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Eficiencia de Cobros</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tasa de cobro exitoso</span>
                      <Badge className="bg-green-100 text-green-800">98.5%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tiempo promedio de cobro</span>
                      <Badge variant="outline">5.2 días</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Disputas resueltas</span>
                      <Badge className="bg-blue-100 text-blue-800">95.8%</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Proyección Anual</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ingresos proyectados</span>
                      <span className="font-medium">{formatCurrency(650000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ganancia proyectada</span>
                      <span className="font-medium text-green-600">{formatCurrency(445000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Crecimiento esperado</span>
                      <Badge className="bg-green-100 text-green-800">+35%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          {/* Tax Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trimestre Actual</CardTitle>
                <CardDescription>Resumen fiscal Q1 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos brutos:</span>
                  <span className="font-medium">{formatCurrency(taxData.currentQuarter.grossIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gastos deducibles:</span>
                  <span className="font-medium text-green-600">-{formatCurrency(taxData.currentQuarter.deductibleExpenses)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Ingreso gravable:</span>
                  <span className="font-bold">{formatCurrency(taxData.currentQuarter.taxableIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuesto estimado:</span>
                  <span className="font-medium">{formatCurrency(taxData.currentQuarter.estimatedTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuesto pagado:</span>
                  <span className="font-medium text-green-600">{formatCurrency(taxData.currentQuarter.paidTax)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Pendiente de pago:</span>
                  <span className="font-bold text-red-600">{formatCurrency(taxData.currentQuarter.pendingTax)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Año Hasta la Fecha</CardTitle>
                <CardDescription>Resumen fiscal 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos brutos:</span>
                  <span className="font-medium">{formatCurrency(taxData.yearToDate.grossIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gastos deducibles:</span>
                  <span className="font-medium text-green-600">-{formatCurrency(taxData.yearToDate.deductibleExpenses)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Ingreso gravable:</span>
                  <span className="font-bold">{formatCurrency(taxData.yearToDate.taxableIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuesto estimado:</span>
                  <span className="font-medium">{formatCurrency(taxData.yearToDate.estimatedTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuesto pagado:</span>
                  <span className="font-medium text-green-600">{formatCurrency(taxData.yearToDate.paidTax)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Pendiente de pago:</span>
                  <span className="font-bold text-red-600">{formatCurrency(taxData.yearToDate.pendingTax)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tax Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos Fiscales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Declaración Q1 2024</p>
                      <p className="text-sm text-gray-600">Generada el 31 de marzo, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => generateReport('tax-q1', 'pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Resumen Anual 2023</p>
                      <p className="text-sm text-gray-600">Generada el 31 de diciembre, 2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => generateReport('tax-annual', 'pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Comprobantes de Gastos</p>
                      <p className="text-sm text-gray-600">Consolidado mensual</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => generateReport('expenses', 'csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
