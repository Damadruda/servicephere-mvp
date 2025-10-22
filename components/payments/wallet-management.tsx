
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Wallet, 
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Shield,
  TrendingUp,
  Clock,
  DollarSign,
  RefreshCw,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface WalletManagementProps {
  userId: string
  balance: any
}

export function WalletManagement({ userId, balance }: WalletManagementProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [topUpDialog, setTopUpDialog] = useState(false)
  const [withdrawDialog, setWithdrawDialog] = useState(false)
  const [transferDialog, setTransferDialog] = useState(false)

  // Mock wallet transactions
  const walletTransactions = [
    {
      id: '1',
      type: 'DEPOSIT',
      amount: 5000,
      currency: 'USD',
      description: 'Recarga desde tarjeta terminada en 4242',
      status: 'COMPLETED',
      createdAt: new Date(),
      fee: 50
    },
    {
      id: '2',
      type: 'WITHDRAWAL',
      amount: 2500,
      currency: 'USD',
      description: 'Retiro a cuenta bancaria terminada en 6789',
      status: 'PROCESSING',
      createdAt: new Date(Date.now() - 86400000),
      fee: 25
    },
    {
      id: '3',
      type: 'PAYMENT',
      amount: 1200,
      currency: 'USD',
      description: 'Pago de factura #INV-2024-001',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 172800000),
      fee: 0
    },
    {
      id: '4',
      type: 'RECEIVED',
      amount: 3500,
      currency: 'USD',
      description: 'Pago recibido por proyecto SAP S/4HANA',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 259200000),
      fee: 0
    },
    {
      id: '5',
      type: 'TRANSFER',
      amount: 800,
      currency: 'USD',
      description: 'Transferencia a proveedor@example.com',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 345600000),
      fee: 8
    }
  ]

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case 'WITHDRAWAL': return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'PAYMENT': return <ArrowUpRight className="h-4 w-4 text-blue-500" />
      case 'RECEIVED': return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case 'TRANSFER': return <ArrowUpRight className="h-4 w-4 text-purple-500" />
      default: return <DollarSign className="h-4 w-4 text-gray-500" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'RECEIVED': 
        return 'text-green-600'
      case 'WITHDRAWAL':
      case 'PAYMENT':
      case 'TRANSFER':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'PENDING': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const topUpWallet = async (amount: number, paymentMethodId: string) => {
    try {
      const response = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, paymentMethodId })
      })

      if (response.ok) {
        toast.success('Recarga procesada exitosamente')
        setTopUpDialog(false)
      } else {
        toast.error('Error al procesar recarga')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const withdrawFromWallet = async (amount: number, accountId: string) => {
    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, accountId })
      })

      if (response.ok) {
        toast.success('Retiro procesado exitosamente')
        setWithdrawDialog(false)
      } else {
        toast.error('Error al procesar retiro')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const transferFunds = async (amount: number, recipientEmail: string) => {
    try {
      const response = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, recipientEmail })
      })

      if (response.ok) {
        toast.success('Transferencia procesada exitosamente')
        setTransferDialog(false)
      } else {
        toast.error('Error al procesar transferencia')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  // Calculate wallet metrics
  const totalIn = walletTransactions
    .filter(t => ['DEPOSIT', 'RECEIVED'].includes(t.type) && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOut = walletTransactions
    .filter(t => ['WITHDRAWAL', 'PAYMENT', 'TRANSFER'].includes(t.type) && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalFees = walletTransactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.fee, 0)

  const availablePercentage = balance.frozenAmount > 0 
    ? ((balance.balance - balance.frozenAmount) / balance.balance) * 100 
    : 100

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Balance Card */}
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-6 w-6" />
                <span className="text-green-100">Wallet Principal</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white hover:bg-white/20"
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-green-100 text-sm mb-1">Balance Disponible</p>
              <p className="text-3xl font-bold">
                {showBalance 
                  ? formatCurrency(balance.balance - balance.frozenAmount, balance.currency)
                  : '••••••'
                }
              </p>
            </div>

            {balance.frozenAmount > 0 && (
              <div className="mb-4">
                <p className="text-green-100 text-sm mb-1">Fondos Congelados</p>
                <p className="text-lg font-semibold">
                  {showBalance 
                    ? formatCurrency(balance.frozenAmount, balance.currency)
                    : '••••••'
                  }
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Dialog open={topUpDialog} onOpenChange={setTopUpDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-green-600 border-white bg-white hover:bg-green-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Recargar
                  </Button>
                </DialogTrigger>
              </Dialog>

              <Dialog open={withdrawDialog} onOpenChange={setWithdrawDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-white border-white hover:bg-white/20">
                    <Minus className="h-4 w-4 mr-2" />
                    Retirar
                  </Button>
                </DialogTrigger>
              </Dialog>

              <Dialog open={transferDialog} onOpenChange={setTransferDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-white border-white hover:bg-white/20">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Transferir
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowDownRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Recibido</p>
                  <p className="text-lg font-bold">{formatCurrency(totalIn)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Enviado</p>
                  <p className="text-lg font-bold">{formatCurrency(totalOut)}</p>
                </div>
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
                  <p className="text-sm text-gray-600">Ganancia Neta</p>
                  <p className={`text-lg font-bold ${totalIn - totalOut >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalIn - totalOut)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fees Pagados</p>
                  <p className="text-lg font-bold">{formatCurrency(totalFees)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Balance Distribution */}
      {balance.frozenAmount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Distribución del Balance
            </CardTitle>
            <CardDescription>
              Muestra cómo están distribuidos tus fondos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Balance Disponible</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(availablePercentage)}%
                  </span>
                </div>
                <Progress value={availablePercentage} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(balance.balance - balance.frozenAmount)} disponibles de{' '}
                  {formatCurrency(balance.balance)} total
                </p>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  {formatCurrency(balance.frozenAmount)} están congelados en transacciones de escrow activas.
                  Estos fondos se liberarán automáticamente al completar los proyectos.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Historial de Transacciones
            </CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
          <CardDescription>
            Últimas transacciones de tu wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {walletTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{format(new Date(transaction.createdAt), 'PPP HH:mm', { locale: es })}</span>
                      {transaction.fee > 0 && (
                        <>
                          <span>•</span>
                          <span>Fee: {formatCurrency(transaction.fee)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                    {['DEPOSIT', 'RECEIVED'].includes(transaction.type) ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <Badge className={getStatusBadgeClass(transaction.status)}>
                    {transaction.status === 'COMPLETED' ? 'Completado' :
                     transaction.status === 'PROCESSING' ? 'Procesando' :
                     transaction.status === 'PENDING' ? 'Pendiente' :
                     transaction.status === 'FAILED' ? 'Fallido' : transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Up Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recargar Wallet</DialogTitle>
          <DialogDescription>
            Agrega fondos a tu wallet usando tu método de pago preferido
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="topupAmount">Monto a Recargar</Label>
            <Input
              id="topupAmount"
              type="number"
              placeholder="0.00"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Método de Pago</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-sm">Visa •••• 4242</p>
                    <p className="text-xs text-gray-600">Tarjeta principal</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Recomendada</Badge>
              </div>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Fee de procesamiento: 1% del monto. Los fondos estarán disponibles inmediatamente.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={() => topUpWallet(1000, 'card_1')}
            className="w-full"
          >
            Confirmar Recarga
          </Button>
        </div>
      </DialogContent>

      {/* Withdraw Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retirar Fondos</DialogTitle>
          <DialogDescription>
            Retira fondos de tu wallet a tu cuenta bancaria
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="withdrawAmount">Monto a Retirar</Label>
            <Input
              id="withdrawAmount"
              type="number"
              placeholder="0.00"
              max={balance.balance - balance.frozenAmount}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Disponible: {formatCurrency(balance.balance - balance.frozenAmount)}
            </p>
          </div>

          <div>
            <Label>Cuenta Destino</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-sm">Bank of America ••••6789</p>
                    <p className="text-xs text-gray-600">Cuenta corriente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Fee: $5 USD. Tiempo de procesamiento: 1-3 días hábiles.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={() => withdrawFromWallet(1000, 'bank_1')}
            className="w-full"
          >
            Confirmar Retiro
          </Button>
        </div>
      </DialogContent>

      {/* Transfer Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Fondos</DialogTitle>
          <DialogDescription>
            Envía fondos a otro usuario del marketplace
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipientEmail">Email del Destinatario</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="destinatario@example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="transferAmount">Monto a Transferir</Label>
            <Input
              id="transferAmount"
              type="number"
              placeholder="0.00"
              max={balance.balance - balance.frozenAmount}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="transferNote">Nota (Opcional)</Label>
            <Input
              id="transferNote"
              placeholder="Concepto de la transferencia"
              className="mt-1"
            />
          </div>

          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              Fee: 1% del monto (mínimo $1). La transferencia es instantánea.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={() => transferFunds(1000, 'recipient@example.com')}
            className="w-full"
          >
            Confirmar Transferencia
          </Button>
        </div>
      </DialogContent>
    </div>
  )
}
