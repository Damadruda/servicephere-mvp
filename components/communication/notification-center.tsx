
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bell, 
  BellOff,
  Mail,
  MessageSquare,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Settings,
  Trash2,
  CheckCircle2,
  Volume2,
  Smartphone,
  Monitor
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface NotificationCenterProps {
  userId: string
  notifications: any[]
}

export function NotificationCenter({ userId, notifications }: NotificationCenterProps) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    desktop: true,
    sound: true,
    vibration: true
  })

  // Mock additional notifications for demo
  const allNotifications = [
    ...notifications,
    {
      id: 'demo1',
      type: 'MESSAGE_RECEIVED',
      title: 'Nuevo mensaje',
      message: 'Juan Pérez te ha enviado un mensaje sobre el proyecto SAP S/4HANA',
      createdAt: new Date(),
      isRead: false,
      priority: 'normal',
      channel: 'chat',
      actionUrl: '/comunicacion'
    },
    {
      id: 'demo2',
      type: 'PROJECT_UPDATE',
      title: 'Actualización de proyecto',
      message: 'Se ha completado el hito "Configuración inicial" del proyecto',
      createdAt: new Date(Date.now() - 3600000),
      isRead: false,
      priority: 'high',
      channel: 'system',
      actionUrl: '/proyectos/123'
    },
    {
      id: 'demo3',
      type: 'PAYMENT_UPDATE',
      title: 'Pago recibido',
      message: 'Se ha recibido el pago de $15,000 USD para el contrato #CNT-2024-001',
      createdAt: new Date(Date.now() - 7200000),
      isRead: true,
      priority: 'normal',
      channel: 'financial',
      actionUrl: '/contratos/123'
    },
    {
      id: 'demo4',
      type: 'NEW_QUOTATION',
      title: 'Nueva cotización',
      message: 'Has recibido una nueva cotización para el proyecto "Migración SAP ECC"',
      createdAt: new Date(Date.now() - 10800000),
      isRead: false,
      priority: 'high',
      channel: 'business',
      actionUrl: '/cotizaciones/recibidas'
    },
    {
      id: 'demo5',
      type: 'SYSTEM',
      title: 'Actualización del sistema',
      message: 'El sistema se actualizará el próximo domingo de 2:00 AM a 4:00 AM',
      createdAt: new Date(Date.now() - 86400000),
      isRead: true,
      priority: 'low',
      channel: 'system',
      actionUrl: null
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE_RECEIVED': return <MessageSquare className="h-4 w-4" />
      case 'PROJECT_UPDATE': return <CheckCircle className="h-4 w-4" />
      case 'PAYMENT_UPDATE': return <AlertTriangle className="h-4 w-4" />
      case 'NEW_QUOTATION': return <Mail className="h-4 w-4" />
      case 'SYSTEM': return <Settings className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'chat': return <MessageSquare className="h-3 w-3" />
      case 'email': return <Mail className="h-3 w-3" />
      case 'sms': return <Phone className="h-3 w-3" />
      case 'system': return <Settings className="h-3 w-3" />
      case 'business': return <CheckCircle className="h-3 w-3" />
      case 'financial': return <AlertTriangle className="h-3 w-3" />
      default: return <Bell className="h-3 w-3" />
    }
  }

  const filteredNotifications = allNotifications.filter(notif => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notif.isRead) ||
                         (selectedFilter === 'read' && notif.isRead) ||
                         notif.type.toLowerCase().includes(selectedFilter.toLowerCase())
    
    const matchesSearch = searchQuery === '' || 
                         notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        toast.success('Notificación marcada como leída')
        // Update local state here
      }
    } catch (error) {
      toast.error('Error al marcar como leída')
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      if (response.ok) {
        toast.success('Todas las notificaciones marcadas como leídas')
      }
    } catch (error) {
      toast.error('Error al marcar todas como leídas')
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Notificación eliminada')
      }
    } catch (error) {
      toast.error('Error al eliminar notificación')
    }
  }

  const updateSettings = async (newSettings: any) => {
    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, settings: newSettings })
      })
      
      if (response.ok) {
        setNotificationSettings(newSettings)
        toast.success('Configuración actualizada')
      }
    } catch (error) {
      toast.error('Error al actualizar configuración')
    }
  }

  const unreadCount = allNotifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* Notification Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Centro de Notificaciones</h2>
          <p className="text-gray-600">
            {unreadCount} notificaciones sin leer de {allNotifications.length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar todas como leídas
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuración de Notificaciones</DialogTitle>
                <DialogDescription>
                  Personaliza cómo y cuándo recibir notificaciones
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Canales de Notificación</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">Notificaciones por email</span>
                      </div>
                      <Switch
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) => updateSettings({...notificationSettings, email: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="text-sm">Notificaciones push</span>
                      </div>
                      <Switch
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) => updateSettings({...notificationSettings, push: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">Mensajes SMS</span>
                      </div>
                      <Switch
                        checked={notificationSettings.sms}
                        onCheckedChange={(checked) => updateSettings({...notificationSettings, sms: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span className="text-sm">Notificaciones de escritorio</span>
                      </div>
                      <Switch
                        checked={notificationSettings.desktop}
                        onCheckedChange={(checked) => updateSettings({...notificationSettings, desktop: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Preferencias de Sonido</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        <span className="text-sm">Sonido de notificación</span>
                      </div>
                      <Switch
                        checked={notificationSettings.sound}
                        onCheckedChange={(checked) => updateSettings({...notificationSettings, sound: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="text-sm">Vibración</span>
                      </div>
                      <Switch
                        checked={notificationSettings.vibration}
                        onCheckedChange={(checked) => updateSettings({...notificationSettings, vibration: checked})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                Todas ({allNotifications.length})
              </Button>
              <Button
                variant={selectedFilter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('unread')}
              >
                Sin leer ({unreadCount})
              </Button>
              <Button
                variant={selectedFilter === 'read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('read')}
              >
                Leídas ({allNotifications.length - unreadCount})
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notifications List */}
      <Tabs value="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="grouped">Agrupadas</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <Card key={notification.id} className={`
                transition-all hover:shadow-md
                ${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''}
              `}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`
                      p-2 rounded-full
                      ${notification.priority === 'high' ? 'bg-red-100' : 
                        notification.priority === 'normal' ? 'bg-blue-100' : 'bg-gray-100'}
                    `}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getChannelIcon(notification.channel)}
                              <span className="text-xs text-gray-500">{notification.channel}</span>
                            </div>
                          </div>
                          <p className={`text-sm ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(notification.createdAt, 'PPP HH:mm', { locale: es })}
                            </span>
                            {notification.actionUrl && (
                              <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                                Ver detalles
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BellOff className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay notificaciones
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery || selectedFilter !== 'all' 
                      ? 'No se encontraron notificaciones con los filtros aplicados'
                      : 'No tienes notificaciones en este momento'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="grouped" className="space-y-4">
          <div className="text-center text-gray-500 py-8">
            <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Vista agrupada en desarrollo</p>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="text-center text-gray-500 py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Vista timeline en desarrollo</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
