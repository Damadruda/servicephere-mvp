
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Banknote,
  Smartphone,
  Plus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'

interface PaymentMethodsProps {
  userId: string
}

export function PaymentMethods({ userId }: PaymentMethodsProps) {
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [addMethodDialog, setAddMethodDialog] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>('credit_card')

  // Mock payment methods - in production, these would come from your payment processor
  const paymentMethods = [
    {
      id: '1',
      type: 'credit_card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      isVerified: true,
      nickname: 'Tarjeta Principal'
    },
    {
      id: '2',
      type: 'credit_card',
      brand: 'mastercard',
      last4: '5555',
      expiryMonth: 8,
      expiryYear: 2024,
      isDefault: false,
      isVerified: true,
      nickname: 'Tarjeta Corporativa'
    },
    {
      id: '3',
      type: 'bank_account',
      accountType: 'checking',
      last4: '6789',
      bankName: 'Bank of America',
      isDefault: false,
      isVerified: false,
      nickname: 'Cuenta Principal'
    }
  ]

  const supportedMethods = [
    {
      type: 'credit_card',
      name: 'Tarjetas de Crédito',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      fee: '2.9%',
      processingTime: 'Instantáneo',
      security: 'Alta'
    },
    {
      type: 'bank_transfer',
      name: 'Transferencia Bancaria',
      description: 'ACH, Wire Transfer, SEPA',
      icon: Banknote,
      fee: '0.8%',
      processingTime: '1-3 días hábiles',
      security: 'Máxima'
    },
    {
      type: 'digital_wallet',
      name: 'Wallets Digitales',
      description: 'PayPal, Apple Pay, Google Pay',
      icon: Smartphone,
      fee: '2.5%',
      processingTime: 'Instantáneo',
      security: 'Alta'
    }
  ]

  const getCardIcon = (brand: string) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳'
    }
    return icons[brand as keyof typeof icons] || '💳'
  }

  const addPaymentMethod = async (methodData: any) => {
    try {
      const response = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...methodData })
      })

      if (response.ok) {
        toast.success('Método de pago agregado exitosamente')
        setAddMethodDialog(false)
      } else {
        toast.error('Error al agregar método de pago')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const removePaymentMethod = async (methodId: string) => {
    try {
      const response = await fetch(`/api/payments/methods/${methodId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Método de pago eliminado')
      } else {
        toast.error('Error al eliminar método de pago')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const setDefaultMethod = async (methodId: string) => {
    try {
      const response = await fetch(`/api/payments/methods/${methodId}/default`, {
        method: 'PATCH'
      })

      if (response.ok) {
        toast.success('Método por defecto actualizado')
      } else {
        toast.error('Error al actualizar método por defecto')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Métodos de Pago
            </CardTitle>
            <Dialog open={addMethodDialog} onOpenChange={setAddMethodDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Método
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Método de Pago</DialogTitle>
                  <DialogDescription>
                    Selecciona y configura un nuevo método de pago
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Method Type Selection */}
                  <div className="grid grid-cols-1 gap-3">
                    {supportedMethods.map(method => (
                      <div
                        key={method.type}
                        className={`
                          p-4 border rounded-lg cursor-pointer transition-colors
                          ${selectedMethod === method.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                        `}
                        onClick={() => setSelectedMethod(method.type)}
                      >
                        <div className="flex items-center gap-3">
                          <method.icon className="h-6 w-6" />
                          <div className="flex-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium">{method.fee}</p>
                            <p className="text-gray-600">{method.processingTime}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form based on selected method */}
                  {selectedMethod === 'credit_card' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiry">MM/YY</Label>
                          <Input
                            id="expiry"
                            placeholder="12/25"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="nickname">Nombre (Opcional)</Label>
                        <Input
                          id="nickname"
                          placeholder="Ej: Tarjeta Corporativa"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'bank_transfer' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="accountNumber">Número de Cuenta</Label>
                        <Input
                          id="accountNumber"
                          placeholder="123456789"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="routingNumber">Código de Enrutamiento</Label>
                        <Input
                          id="routingNumber"
                          placeholder="021000021"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountType">Tipo de Cuenta</Label>
                        <select className="w-full p-2 border rounded-md mt-1">
                          <option value="checking">Cuenta Corriente</option>
                          <option value="savings">Cuenta de Ahorros</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Toda la información de pago se encripta y almacena de forma segura. 
                      Nunca almacenamos números de tarjeta completos.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    className="w-full"
                    onClick={() => addPaymentMethod({ type: selectedMethod })}
                  >
                    Agregar Método de Pago
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Gestiona tus métodos de pago para recibir y enviar pagos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes métodos de pago
              </h3>
              <p className="text-gray-600 mb-4">
                Agrega un método de pago para comenzar a realizar transacciones
              </p>
              <Button onClick={() => setAddMethodDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Método
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {method.type === 'credit_card' ? (
                        <CreditCard className="h-6 w-6" />
                      ) : method.type === 'bank_account' ? (
                        <Banknote className="h-6 w-6" />
                      ) : (
                        <Smartphone className="h-6 w-6" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {method.type === 'credit_card' 
                            ? `${getCardIcon(method.brand || 'visa')} •••• •••• •••• ${method.last4}`
                            : method.type === 'bank_account'
                            ? `${method.bankName} ••••${method.last4}`
                            : method.nickname || 'Método de pago'
                          }
                        </p>
                        {method.isDefault && (
                          <Badge className="bg-blue-100 text-blue-800">Por Defecto</Badge>
                        )}
                        {method.isVerified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {method.nickname && <span>{method.nickname} • </span>}
                        {method.type === 'credit_card' && (
                          <span>Expira {method.expiryMonth}/{method.expiryYear}</span>
                        )}
                        {method.type === 'bank_account' && (
                          <span>Cuenta {method.accountType}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultMethod(method.id)}
                      >
                        Hacer Por Defecto
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* Edit method */}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configuración de Seguridad
          </CardTitle>
          <CardDescription>
            Configura las medidas de seguridad para tus pagos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Verificación 2FA para pagos</p>
              <p className="text-sm text-gray-600">
                Requiere autenticación adicional para pagos superiores a $1,000
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificaciones de transacciones</p>
              <p className="text-sm text-gray-600">
                Recibe notificaciones inmediatas por email y SMS
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Límite diario de pagos</p>
              <p className="text-sm text-gray-600">
                Máximo $50,000 USD en pagos por día
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configurar
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lista blanca de beneficiarios</p>
              <p className="text-sm text-gray-600">
                Solo permite pagos a beneficiarios pre-aprobados
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Supported Payment Networks */}
      <Card>
        <CardHeader>
          <CardTitle>Redes de Pago Soportadas</CardTitle>
          <CardDescription>
            Todos los métodos están respaldados por procesadores certificados PCI DSS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">💳</div>
              <p className="font-medium text-sm">Visa</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">💳</div>
              <p className="font-medium text-sm">Mastercard</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">💳</div>
              <p className="font-medium text-sm">American Express</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl mb-2">🏦</div>
              <p className="font-medium text-sm">ACH/Wire</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
