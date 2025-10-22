
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Receipt, 
  Plus,
  Download,
  Send,
  Eye,
  Edit,
  Copy,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface InvoiceManagementProps {
  userId: string
  invoices: any[]
}

export function InvoiceManagement({ userId, invoices }: InvoiceManagementProps) {
  const [createInvoiceDialog, setCreateInvoiceDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [invoiceFilter, setInvoiceFilter] = useState('all')

  // Mock invoice data for demo
  const allInvoices = [
    ...invoices,
    {
      id: 'INV-2024-001',
      number: 'INV-2024-001',
      status: 'PAID',
      amount: 15000,
      currency: 'USD',
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      paidDate: new Date('2024-02-10'),
      issuedBy: { name: 'SAP Solutions Inc' },
      issuedTo: { name: 'Tech Corp' },
      description: 'Implementación SAP S/4HANA - Fase 1',
      items: [
        { description: 'Consultoría SAP', quantity: 80, rate: 150, amount: 12000 },
        { description: 'Licencias SAP', quantity: 1, rate: 3000, amount: 3000 }
      ],
      taxAmount: 1500,
      notes: 'Gracias por su confianza en nuestros servicios'
    },
    {
      id: 'INV-2024-002',
      number: 'INV-2024-002',
      status: 'PENDING',
      amount: 8500,
      currency: 'USD',
      issueDate: new Date('2024-01-20'),
      dueDate: new Date('2024-02-20'),
      paidDate: null,
      issuedBy: { name: 'Data Analytics Pro' },
      issuedTo: { name: 'Manufacturing LLC' },
      description: 'Desarrollo de dashboards SAP Analytics Cloud',
      items: [
        { description: 'Desarrollo de dashboards', quantity: 40, rate: 200, amount: 8000 },
        { description: 'Training y documentación', quantity: 1, rate: 500, amount: 500 }
      ],
      taxAmount: 850,
      notes: null
    },
    {
      id: 'INV-2024-003',
      number: 'INV-2024-003',
      status: 'OVERDUE',
      amount: 12000,
      currency: 'USD',
      issueDate: new Date('2023-12-15'),
      dueDate: new Date('2024-01-15'),
      paidDate: null,
      issuedBy: { name: 'Integration Experts' },
      issuedTo: { name: 'Retail Chain' },
      description: 'Integración SAP ECC a S/4HANA',
      items: [
        { description: 'Migración de datos', quantity: 60, rate: 180, amount: 10800 },
        { description: 'Testing y validación', quantity: 1, rate: 1200, amount: 1200 }
      ],
      taxAmount: 1200,
      notes: 'Requiere atención urgente para el pago'
    }
  ]

  const filteredInvoices = allInvoices.filter(invoice => {
    if (invoiceFilter === 'all') return true
    if (invoiceFilter === 'paid') return invoice.status === 'PAID'
    if (invoiceFilter === 'pending') return invoice.status === 'PENDING'
    if (invoiceFilter === 'overdue') return invoice.status === 'OVERDUE'
    return true
  })

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'OVERDUE': return 'bg-red-100 text-red-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="h-4 w-4" />
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'OVERDUE': return <AlertTriangle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const createInvoice = async (invoiceData: any) => {
    try {
      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...invoiceData })
      })

      if (response.ok) {
        toast.success('Factura creada exitosamente')
        setCreateInvoiceDialog(false)
      } else {
        toast.error('Error al crear factura')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const sendInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Factura enviada exitosamente')
      } else {
        toast.error('Error al enviar factura')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`)
      if (response.ok) {
        // Handle file download
        toast.success('Factura descargada')
      } else {
        toast.error('Error al descargar factura')
      }
    } catch (error) {
      toast.error('Error al descargar factura')
    }
  }

  // Calculate totals
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = filteredInvoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = filteredInvoices
    .filter(inv => ['PENDING', 'OVERDUE'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      {/* Invoice Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Facturas</p>
                <p className="text-xl font-bold">{filteredInvoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pagadas</p>
                <p className="text-xl font-bold">{formatCurrency(paidAmount)}</p>
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
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-xl font-bold">{formatCurrency(pendingAmount)}</p>
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
                <p className="text-sm text-gray-600">Vencidas</p>
                <p className="text-xl font-bold">
                  {filteredInvoices.filter(inv => inv.status === 'OVERDUE').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Gestión de Facturas
            </CardTitle>
            <div className="flex items-center gap-3">
              <Dialog open={createInvoiceDialog} onOpenChange={setCreateInvoiceDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Factura
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Factura</DialogTitle>
                    <DialogDescription>
                      Completa los datos para generar una factura profesional
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client">Cliente</Label>
                        <Input id="client" placeholder="Nombre del cliente" />
                      </div>
                      <div>
                        <Label htmlFor="amount">Monto</Label>
                        <Input id="amount" type="number" placeholder="0.00" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Descripción de los servicios..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="issueDate">Fecha de Emisión</Label>
                        <Input id="issueDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                        <Input id="dueDate" type="date" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notas (Opcional)</Label>
                      <Textarea 
                        id="notes" 
                        placeholder="Notas adicionales..."
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => createInvoice({})}
                        className="flex-1"
                      >
                        Crear Factura
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => createInvoice({ draft: true })}
                        className="flex-1"
                      >
                        Guardar Borrador
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filter Tabs */}
          <Tabs value={invoiceFilter} onValueChange={setInvoiceFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todas ({allInvoices.length})</TabsTrigger>
              <TabsTrigger value="paid">
                Pagadas ({allInvoices.filter(inv => inv.status === 'PAID').length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes ({allInvoices.filter(inv => inv.status === 'PENDING').length})
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Vencidas ({allInvoices.filter(inv => inv.status === 'OVERDUE').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Invoices List */}
          <div className="space-y-4">
            {filteredInvoices.map(invoice => (
              <div key={invoice.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">#{invoice.number}</h3>
                      <Badge className={getStatusBadgeClass(invoice.status)}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1">
                          {invoice.status === 'PAID' ? 'Pagada' :
                           invoice.status === 'PENDING' ? 'Pendiente' :
                           invoice.status === 'OVERDUE' ? 'Vencida' : invoice.status}
                        </span>
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3">{invoice.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          Emitida: {format(new Date(invoice.issueDate), 'PPP', { locale: es })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className={
                          invoice.status === 'OVERDUE' ? 'text-red-600 font-medium' : ''
                        }>
                          Vence: {format(new Date(invoice.dueDate), 'PPP', { locale: es })}
                        </span>
                      </div>
                      
                      {invoice.paidDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">
                            Pagada: {format(new Date(invoice.paidDate), 'PPP', { locale: es })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span>De: {invoice.issuedBy.name}</span>
                      <span>•</span>
                      <span>Para: {invoice.issuedTo.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Factura #{invoice.number}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Invoice Header */}
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <h4 className="font-semibold mb-2">De:</h4>
                              <p className="text-sm">{invoice.issuedBy.name}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Para:</h4>
                              <p className="text-sm">{invoice.issuedTo.name}</p>
                            </div>
                          </div>

                          {/* Invoice Details */}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Fecha de Emisión</p>
                              <p className="font-medium">
                                {format(new Date(invoice.issueDate), 'PPP', { locale: es })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Fecha de Vencimiento</p>
                              <p className="font-medium">
                                {format(new Date(invoice.dueDate), 'PPP', { locale: es })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Estado</p>
                              <Badge className={getStatusBadgeClass(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Invoice Items */}
                          {invoice.items && (
                            <div>
                              <h4 className="font-semibold mb-3">Elementos de la Factura</h4>
                              <div className="border rounded-lg">
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="text-left p-3">Descripción</th>
                                      <th className="text-right p-3">Cantidad</th>
                                      <th className="text-right p-3">Precio</th>
                                      <th className="text-right p-3">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {invoice.items.map((item: any, index: number) => (
                                      <tr key={index} className="border-t">
                                        <td className="p-3">{item.description}</td>
                                        <td className="text-right p-3">{item.quantity}</td>
                                        <td className="text-right p-3">
                                          {formatCurrency(item.rate)}
                                        </td>
                                        <td className="text-right p-3">
                                          {formatCurrency(item.amount)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-gray-50">
                                    <tr>
                                      <td colSpan={3} className="text-right p-3 font-medium">
                                        Subtotal:
                                      </td>
                                      <td className="text-right p-3">
                                        {formatCurrency(
                                          invoice.items.reduce((sum: number, item: any) => sum + item.amount, 0)
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={3} className="text-right p-3 font-medium">
                                        Impuestos:
                                      </td>
                                      <td className="text-right p-3">
                                        {formatCurrency(invoice.taxAmount)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={3} className="text-right p-3 font-bold text-lg">
                                        Total:
                                      </td>
                                      <td className="text-right p-3 font-bold text-lg">
                                        {formatCurrency(invoice.amount)}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {invoice.notes && (
                            <div>
                              <h4 className="font-semibold mb-2">Notas</h4>
                              <p className="text-sm text-gray-600">{invoice.notes}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => downloadInvoice(invoice.id)}
                              className="flex-1"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Descargar PDF
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => sendInvoice(invoice.id)}
                              className="flex-1"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Enviar por Email
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadInvoice(invoice.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    {invoice.status === 'PENDING' && (
                      <Button 
                        size="sm"
                        onClick={() => sendInvoice(invoice.id)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay facturas {invoiceFilter !== 'all' ? invoiceFilter : ''}
                </h3>
                <p className="text-gray-600 mb-4">
                  {invoiceFilter === 'all' 
                    ? 'Crea tu primera factura para comenzar a facturar servicios'
                    : 'No se encontraron facturas con este filtro'
                  }
                </p>
                {invoiceFilter === 'all' && (
                  <Button onClick={() => setCreateInvoiceDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Factura
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
