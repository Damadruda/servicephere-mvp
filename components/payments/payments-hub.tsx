
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Wallet, 
  Receipt, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  Settings,
  Download,
  Plus,
  DollarSign,
  Banknote,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'
import { EscrowDashboard } from './escrow-dashboard'
import { PaymentMethods } from './payment-methods'
import { InvoiceManagement } from './invoice-management'
import { FinancialReports } from './financial-reports'
import { DisputeCenter } from './dispute-center'
import { WalletManagement } from './wallet-management'
import { FeeCalculator } from './fee-calculator'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface PaymentsHubProps {
  userId: string
  userType: string
  financialData: any
}

export function PaymentsHub({ 
  userId, 
  userType, 
  financialData 
}: PaymentsHubProps) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const { transactions, invoices, walletBalance, stats } = financialData

  // Calculate additional metrics
  const activeEscrows = transactions.filter((t: any) => t.status === 'ESCROWED').length
  const pendingDisputes = transactions.filter((t: any) => t.disputes?.length > 0).length
  const thisMonthRevenue = transactions
    .filter((t: any) => {
      const transactionDate = new Date(t.createdAt)
      const now = new Date()
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear() &&
             t.payeeId === userId &&
             t.status === 'COMPLETED'
    })
    .reduce((sum: number, t: any) => sum + t.amount, 0)

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Pagos y Facturación
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema completo de pagos con escrow seguro y fees transparentes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" />
            Escrow Activo
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Balance Disponible</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(walletBalance.balance, walletBalance.currency)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ingresos Este Mes</p>
                <p className="text-xl font-bold">{formatCurrency(thisMonthRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En Escrow</p>
                <p className="text-xl font-bold">{formatCurrency(stats.pendingEscrow)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Receipt className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Facturas Mes</p>
                <p className="text-xl font-bold">
                  {invoices.filter((inv: any) => {
                    const invDate = new Date(inv.createdAt)
                    const now = new Date()
                    return invDate.getMonth() === now.getMonth() && 
                           invDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Disputas Activas</p>
                <p className="text-xl font-bold">{pendingDisputes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="escrow" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Escrow
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Facturas
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="disputes" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Disputas
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      Transacciones Recientes
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Todas
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 8).map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.payerId === userId ? 'bg-red-100' : 'bg-green-100'
                          }`}>
                            {transaction.payerId === userId ? (
                              <ArrowUpIcon className="h-4 w-4 text-red-600" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {transaction.contract?.quotation?.project?.title || 'Transacción'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span>
                                {transaction.payerId === userId 
                                  ? `Pagado a ${transaction.payee.name}`
                                  : `Recibido de ${transaction.payer.name}`
                                }
                              </span>
                              <span>•</span>
                              <span>{format(new Date(transaction.createdAt), 'PPP', { locale: es })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.payerId === userId ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.payerId === userId ? '-' : '+'}
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusBadgeClass(transaction.status)}>
                              {getStatusText(transaction.status)}
                            </Badge>
                            {transaction.disputes.length > 0 && (
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Fee Calculator */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Nuevo Pago
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Receipt className="h-4 w-4 mr-2" />
                    Crear Factura
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="h-4 w-4 mr-2" />
                    Recargar Wallet
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Datos
                  </Button>
                </CardContent>
              </Card>

              <FeeCalculator />
            </div>
          </div>

          {/* Payment Methods Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pago Configurados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Tarjetas de Crédito</p>
                      <p className="text-xs text-gray-600">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Banknote className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Transferencias</p>
                      <p className="text-xs text-gray-600">Wire, ACH, SEPA</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Wallet className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Wallets Digitales</p>
                      <p className="text-xs text-gray-600">PayPal, Apple Pay</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Configurar</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escrow" className="space-y-6">
          <EscrowDashboard 
            userId={userId}
            transactions={transactions}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentMethods userId={userId} />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceManagement 
            userId={userId}
            invoices={invoices}
          />
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <WalletManagement 
            userId={userId}
            balance={walletBalance}
          />
        </TabsContent>

        <TabsContent value="disputes" className="space-y-6">
          <DisputeCenter userId={userId} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <FinancialReports 
            userId={userId}
            stats={stats}
            transactions={transactions}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions
function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'ESCROWED': return 'bg-yellow-100 text-yellow-800'
    case 'PENDING': return 'bg-blue-100 text-blue-800'
    case 'FAILED': return 'bg-red-100 text-red-800'
    case 'REFUNDED': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'COMPLETED': return 'Completado'
    case 'ESCROWED': return 'En Escrow'
    case 'PENDING': return 'Pendiente'
    case 'FAILED': return 'Fallido'
    case 'REFUNDED': return 'Reembolsado'
    default: return status
  }
}

// Arrow Icons (you might want to use from lucide-react)
function ArrowUpIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  )
}

function ArrowDownIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  )
}
