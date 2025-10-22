
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  MessageCircle, 
  Video, 
  Bell, 
  Users, 
  Search,
  Settings,
  Phone,
  Calendar,
  FileText,
  Zap,
  Activity,
  Globe,
  Headphones,
  Monitor,
  Smartphone
} from 'lucide-react'
import { AdvancedChat } from './advanced-chat'
import { VideoCallCenter } from './video-call-center'
import { NotificationCenter } from './notification-center'
import { CollaborationSpace } from './collaboration-space'
import { AutomationSettings } from './automation-settings'
import { PresenceIndicator } from './presence-indicator'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface CommunicationHubProps {
  userId: string
  userType: string
  communicationData: any
}

export function CommunicationHub({ 
  userId, 
  userType, 
  communicationData 
}: CommunicationHubProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [onlineUsers, setOnlineUsers] = useState(12) // Mock data
  const [activeChats, setActiveChats] = useState(3)
  const [pendingCalls, setPendingCalls] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const { conversations, unreadNotifications, activeContracts } = communicationData

  // Calculate communication metrics
  const totalUnread = conversations.reduce((acc: number, conv: any) => {
    return acc + conv.messages.filter((msg: any) => !msg.isRead && msg.receiverId === userId).length
  }, 0)

  const urgentNotifications = unreadNotifications.filter(
    (notif: any) => notif.type === 'URGENT' || notif.type === 'PROJECT_DEADLINE'
  ).length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Centro de Comunicación
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema unificado de comunicación multi-canal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PresenceIndicator status="online" />
          <span className="text-sm text-gray-600">En línea</span>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('automation')}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chats Activos</p>
                <p className="text-xl font-bold">{activeChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">No Leídos</p>
                <p className="text-xl font-bold">{totalUnread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Llamadas</p>
                <p className="text-xl font-bold">{pendingCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En Línea</p>
                <p className="text-xl font-bold">{onlineUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Urgentes</p>
                <p className="text-xl font-bold">{urgentNotifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Communication Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2" onClick={() => setActiveTab('dashboard')}>
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat Avanzado
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Llamadas
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Colaboración
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automatización
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Conversations */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Conversaciones Recientes
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar conversaciones..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversations.slice(0, 5).map((conversation: any) => (
                      <div key={conversation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {conversation.project?.title?.charAt(0).toUpperCase() || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <PresenceIndicator 
                              status="online" 
                              size="small" 
                              className="absolute -bottom-1 -right-1"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {conversation.project?.title || 'Conversación sin título'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {conversation.messages[0]?.content.substring(0, 50) || 'No hay mensajes'}...
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {conversation.messages[0] && format(
                                  new Date(conversation.messages[0].createdAt),
                                  'HH:mm',
                                  { locale: es }
                                )}
                              </span>
                              {conversation.project && (
                                <Badge variant="outline" className="text-xs">
                                  Proyecto
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {conversation.messages.filter((msg: any) => !msg.isRead && msg.receiverId === userId).length > 0 && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Phone className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Llamada completada</p>
                      <p className="text-xs text-gray-600">Con Juan Pérez - 15 min</p>
                      <p className="text-xs text-gray-500">Hace 30 min</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MessageCircle className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nuevo mensaje</p>
                      <p className="text-xs text-gray-600">Proyecto SAP S/4HANA</p>
                      <p className="text-xs text-gray-500">Hace 1 hora</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Calendar className="h-3 w-3 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reunión programada</p>
                      <p className="text-xs text-gray-600">Revisión de avances</p>
                      <p className="text-xs text-gray-500">Mañana 10:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <FileText className="h-3 w-3 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Documento compartido</p>
                      <p className="text-xs text-gray-600">especificaciones.pdf</p>
                      <p className="text-xs text-gray-500">Hace 2 horas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Communication Channels Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Canales Web
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chat en vivo</span>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Video llamadas</span>
                    <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notificaciones push</span>
                    <Badge className="bg-green-100 text-green-800">Activadas</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  Canales Móviles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Configurar</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WhatsApp</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Próximamente</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">App móvil</span>
                    <Badge className="bg-gray-100 text-gray-800">Planeado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-green-600" />
                  Soporte Avanzado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bot inteligente</span>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Escalación automática</span>
                    <Badge className="bg-green-100 text-green-800">Configurado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Horario 24/7</span>
                    <Badge className="bg-blue-100 text-blue-800">Premium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <AdvancedChat 
            userId={userId}
            conversations={conversations}
          />
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <VideoCallCenter userId={userId} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationCenter 
            userId={userId}
            notifications={unreadNotifications}
          />
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <CollaborationSpace 
            userId={userId}
            activeContracts={activeContracts}
          />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <AutomationSettings userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
