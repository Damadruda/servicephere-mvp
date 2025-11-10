
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Minimize2, Maximize2, Send, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { useChat } from '@/hooks/useChat'

interface ChatBotProps {
  className?: string
}

export default function ChatBot({ className = '' }: ChatBotProps) {
  const { data: session } = useSession() || {}
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputMessage, setInputMessage] = useState('')

  const {
    sessions,
    messages,
    isLoading,
    currentSessionId,
    sendMessage,
    startSession,
  } = useChat()

  // Derivar activeSession de sessions y currentSessionId
  const activeSession = sessions.find(s => s.id === currentSessionId)

  const handleToggleChat = async () => {
    setIsOpen(!isOpen)
    
    if (!isOpen && !activeSession && sessions.length === 0) {
      // Crear sesión automáticamente al abrir el chat
      await startSession()
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading || !currentSessionId) return

    await sendMessage(inputMessage)
    setInputMessage('')
  }

  if (!session) {
    return null // No mostrar chat si no está autenticado
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <Button
              onClick={handleToggleChat}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
            
            {/* Notification badge if there are unread messages */}
            {sessions.length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  {sessions.length}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 ${
              isMinimized ? 'w-80 h-12' : 'w-96 h-[600px]'
            } transition-all duration-300`}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Asistente SAP</h3>
                  <p className="text-xs text-blue-100">
                    {isLoading ? 'Cargando...' : 'En línea'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 flex flex-col h-[480px]">
                  <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h4 className="font-medium mb-2">¡Hola! Soy tu asistente SAP</h4>
                        <p className="text-sm">
                          Puedo ayudarte con consultas sobre módulos SAP, implementaciones, precios y más.
                        </p>
                        <div className="mt-4 space-y-2">
                          <Badge variant="outline" className="text-xs">
                            Project Scoping
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Technical Consultation
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Platform Help
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              <div className="flex items-start space-x-2">
                                {message.role === 'assistant' && (
                                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                )}
                                {message.role === 'user' && (
                                  <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm whitespace-pre-wrap">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                              <div className="flex items-center space-x-2">
                                <Bot className="h-4 w-4 animate-pulse" />
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  <Separator />

                  {/* Input Area */}
                  <div className="p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Escribe tu consulta sobre SAP..."
                        className="flex-1 min-h-[40px] max-h-[100px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage(e)
                          }
                        }}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim() || !currentSessionId}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Presiona Enter para enviar, Shift+Enter para nueva línea
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
