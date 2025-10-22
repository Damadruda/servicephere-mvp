
'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Smile,
  Search, 
  Filter,
  MoreVertical,
  Pin,
  Star,
  Archive,
  Trash2,
  Edit,
  Reply,
  Forward,
  Image,
  File,
  Mic,
  Phone,
  Video,
  UserPlus
} from 'lucide-react'
import { PresenceIndicator } from './presence-indicator'
import { TypingIndicator } from './typing-indicator'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface AdvancedChatProps {
  userId: string
  conversations: any[]
}

export function AdvancedChat({ userId, conversations }: AdvancedChatProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [attachmentDialog, setAttachmentDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedConv = conversations.find(conv => conv.id === selectedConversation)

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
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

  const handleTyping = () => {
    setIsTyping(true)
    // Simulate typing indicator
    setTimeout(() => setIsTyping(false), 3000)
  }

  const filteredConversations = conversations.filter(conv =>
    searchQuery === '' || 
    conv.project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMessageTime = (date: string) => {
    const messageDate = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'HH:mm')
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer'
    } else {
      return format(messageDate, 'dd/MM/yyyy')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat Avanzado
            </CardTitle>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Filter className="h-4 w-4 mr-1" />
                  Filtros
                </Button>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Nuevo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`
                    p-4 border-b cursor-pointer transition-colors
                    ${selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                  `}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">
                          {conversation.project?.title || 'Conversación sin título'}
                        </p>
                        <div className="flex items-center gap-1">
                          {conversation.pinned && <Pin className="h-3 w-3 text-blue-500" />}
                          {conversation.starred && <Star className="h-3 w-3 text-yellow-500" />}
                          <span className="text-xs text-gray-500">
                            {conversation.messages[0] && getMessageTime(conversation.messages[0].createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-2">
                        {conversation.messages[0]?.content || 'No hay mensajes'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {conversation.project && (
                            <Badge variant="outline" className="text-xs">
                              Proyecto
                            </Badge>
                          )}
                          {conversation.hasFiles && (
                            <File className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {selectedConv.project?.title?.charAt(0).toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {selectedConv.project?.title || 'Conversación'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <PresenceIndicator status="online" size="small" showText />
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Última conexión hace 5 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => {
                    const isOwnMessage = message.senderId === userId
                    const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId

                    return (
                      <div key={message.id} className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                        {showAvatar && !isOwnMessage && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {message.sender.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                          {showAvatar && (
                            <p className={`text-xs text-gray-500 mb-1 ${isOwnMessage ? 'text-right' : ''}`}>
                              {isOwnMessage ? 'Tú' : message.sender.name}
                            </p>
                          )}
                          <div className={`group relative`}>
                            <div className={`
                              p-3 rounded-2xl max-w-full break-words
                              ${isOwnMessage 
                                ? 'bg-blue-500 text-white rounded-br-md' 
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'}
                            `}>
                              <p className="text-sm">{message.content}</p>
                              {message.attachmentUrl && (
                                <div className="mt-2 p-2 bg-white/20 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <File className="h-4 w-4" />
                                    <span className="text-xs">Archivo adjunto</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className={`
                              absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity
                              ${isOwnMessage ? '-left-12' : '-right-12'}
                            `}>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Reply className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Forward className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Star className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : ''}`}>
                            {getMessageTime(message.createdAt)}
                            {isOwnMessage && (
                              <span className="ml-1">
                                {message.isRead ? '✓✓' : '✓'}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  {typingUsers.length > 0 && (
                    <TypingIndicator users={typingUsers} />
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end gap-3">
                    <div className="flex items-center gap-2">
                      <Dialog open={attachmentDialog} onOpenChange={setAttachmentDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adjuntar archivo</DialogTitle>
                            <DialogDescription>
                              Selecciona el tipo de archivo que deseas compartir
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-20 flex-col gap-2">
                              <Image className="h-6 w-6" />
                              Imagen
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2">
                              <File className="h-6 w-6" />
                              Documento
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Escribe tu mensaje..."
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value)
                          handleTyping()
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        className="min-h-[44px] max-h-32 resize-none"
                        rows={1}
                      />
                    </div>
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Selecciona una conversación</p>
                <p className="text-sm">Elige un chat para comenzar a conversar</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
