
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Calculator,
  DollarSign,
  Info,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react'

export function FeeCalculator() {
  const [amount, setAmount] = useState<number>(10000)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [userType, setUserType] = useState('standard')

  // Fee structure
  const feeStructure = {
    platform: {
      standard: 0.05, // 5%
      premium: 0.035, // 3.5%
      enterprise: 0.025 // 2.5%
    },
    processing: {
      credit_card: 0.029, // 2.9%
      bank_transfer: 0.008, // 0.8%
      digital_wallet: 0.025 // 2.5%
    }
  }

  const platformFeeRate = feeStructure.platform[userType as keyof typeof feeStructure.platform]
  const processingFeeRate = feeStructure.processing[paymentMethod as keyof typeof feeStructure.processing]

  const platformFee = amount * platformFeeRate
  const processingFee = amount * processingFeeRate
  const totalFees = platformFee + processingFee
  const netAmount = amount - totalFees

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(2) + '%'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculadora de Fees
        </CardTitle>
        <CardDescription>
          Calcula los fees transparentes para tus transacciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Amount */}
        <div>
          <Label htmlFor="amount">Monto de la Transacción</Label>
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="pl-10"
              placeholder="10,000"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <Label>Método de Pago</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit_card">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Tarjeta de Crédito (2.9%)
                </div>
              </SelectItem>
              <SelectItem value="bank_transfer">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Transferencia Bancaria (0.8%)
                </div>
              </SelectItem>
              <SelectItem value="digital_wallet">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Wallet Digital (2.5%)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User Type */}
        <div>
          <Label>Tipo de Usuario</Label>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (5%)</SelectItem>
              <SelectItem value="premium">Premium (3.5%)</SelectItem>
              <SelectItem value="enterprise">Enterprise (2.5%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Fee Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Info className="h-4 w-4" />
            Desglose de Fees
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monto base:</span>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">
                Fee de plataforma ({formatPercentage(platformFeeRate)}):
              </span>
              <span className="text-red-600">-{formatCurrency(platformFee)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">
                Fee de procesamiento ({formatPercentage(processingFeeRate)}):
              </span>
              <span className="text-red-600">-{formatCurrency(processingFee)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-semibold">
              <span>Total fees:</span>
              <span className="text-red-600">-{formatCurrency(totalFees)}</span>
            </div>
            
            <div className="flex justify-between font-bold text-green-600">
              <span>Monto neto:</span>
              <span>{formatCurrency(netAmount)}</span>
            </div>
          </div>
        </div>

        {/* Fee Information */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Fees Transparentes</p>
              <p>
                Los fees incluyen protección de escrow, procesamiento de pagos y 
                soporte 24/7. No hay fees ocultos ni sorpresas.
              </p>
            </div>
          </div>
        </div>

        {/* Savings Tip */}
        {paymentMethod === 'credit_card' && (
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Banknote className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-xs text-green-700">
                <p className="font-medium mb-1">💡 Consejo de Ahorro</p>
                <p>
                  Usando transferencia bancaria ahorrarías{' '}
                  <strong>
                    {formatCurrency(
                      (feeStructure.processing.credit_card - feeStructure.processing.bank_transfer) * amount
                    )}
                  </strong>
                  {' '}en fees de procesamiento.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
