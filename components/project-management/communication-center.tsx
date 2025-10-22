
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Users, 
  Bell,
  Phone,
  Video,
  Mail,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface CommunicationCenterProps {
  contractId: string
  conversations: any[]
  projectId: string
}

export function CommunicationCenter({ 
  contractId, 
  conversations, 
  projectId 
}: CommunicationCenterProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [newConversationDialog, setNewConversationDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [messages, setMessages] = useState<any[]>([])

  const selectedConv = conversations.find(conv => conv.id === selectedConversation)

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage
        })
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages(selectedConversation)
        toast.success('Mensaje enviado')
      } else {
        toast.error('Error al enviar mensaje')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  const filteredConversations = conversations.filter(conv =>
    searchTerm === '' || 
    conv.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages?.some((msg: any) => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Centro de Comunicación</h2>
          <p className="text-gray-600">
            Mantén comunicación fluida con todos los participantes del proyecto
          </p>
        </div>
        <Dialog open={newConversationDialog} onOpenChange={setNewConversationDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Conversación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Iniciar Nueva Conversación</DialogTitle>
              <DialogDescription>
                Selecciona el tema y participantes para la nueva conversación
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Asunto</Label>
                <Input placeholder="Ej: Revisión de hito 1..." />
              </div>
              <div>
                <Label>Mensaje inicial</Label>
                <Textarea placeholder="Escribe tu mensaje..." rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewConversationDialog(false)}>
                Cancelar
              </Button>
              <Button>Crear Conversación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Communication Tabs */}
      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="meetings">Reuniones</TabsTrigger>
          <TabsTrigger value="announcements">Anuncios</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Conversaciones
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar conversaciones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {filteredConversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`
                          p-4 border-b cursor-pointer transition-colors
                          ${selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                        `}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {conversation.subject || 'Conversación sin título'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {conversation.messages?.[0]?.content || 'No hay mensajes'}
                            </p>
                          </div>
                          {conversation.messages?.some((msg: any) => !msg.isRead) && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {conversation.messages?.length || 0} mensajes
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {conversation.messages?.[0] && format(
                              new Date(conversation.messages[0].createdAt), 
                              'MMM d', 
                              { locale: es }
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                {selectedConv ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedConv.subject || 'Conversación'}</CardTitle>
                          <CardDescription>
                            Participantes del proyecto
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Messages Area */}
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {messages.map(message => (
                          <div key={message.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.sender.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {message.sender.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(message.createdAt), 'PPp', { locale: es })}
                                </span>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-3">
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <div className="border-t pt-4">
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <Textarea
                              placeholder="Escribe tu mensaje..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault()
                                  sendMessage()
                                }
                              }}
                              rows={3}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Button onClick={sendMessage}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Selecciona una conversación para comenzar a chatear</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Notification items would be loaded from API */}
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Nuevo hito completado</p>
                    <p className="text-sm text-gray-600">
                      Se ha marcado como completado el hito "Configuración inicial"
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hace 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Nuevo mensaje</p>
                    <p className="text-sm text-gray-600">
                      Has recibido un nuevo mensaje del cliente
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Ayer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reuniones Programadas</CardTitle>
              <CardDescription>
                Programa y gestiona reuniones del proyecto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay reuniones programadas</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Programar Reunión
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anuncios del Proyecto</CardTitle>
              <CardDescription>
                Comunicados importantes y actualizaciones generales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay anuncios recientes</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Anuncio
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
