
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

interface Message {
  id: string
  content: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  createdAt: string
  confidence?: number
  sapContext?: any
  feedback?: string
}

interface ChatSession {
  id: string
  sessionName: string
  language: string
  createdAt: string
  lastActivity: string
  _count: {
    messages: number
  }
  messages?: Message[]
}

export function useChat() {
  const { data: session } = useSession() || {}
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (session) {
      loadChatSessions()
    }
  }, [session])

  const loadChatSessions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat/session')
      const data = await response.json()
      
      if (data.success) {
        setSessions(data.sessions)
        if (data.sessions.length > 0 && !activeSession) {
          await switchToSession(data.sessions[0])
        }
      }
    } catch (error) {
      console.error('Error cargando sesiones:', error)
      toast.error('Error cargando las conversaciones')
    } finally {
      setIsLoading(false)
    }
  }

  const switchToSession = async (chatSession: ChatSession) => {
    setActiveSession(chatSession)
    await loadMessages(chatSession.id)
  }

  const loadMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/session/${sessionId}/messages`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error)
    }
  }

  const createNewSession = async (sessionName?: string) => {
    try {
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionName: sessionName || `Consulta SAP - ${new Date().toLocaleDateString()}`,
          language: 'es'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await loadChatSessions()
        setActiveSession(data.session)
        setMessages([])
        toast.success('Nueva conversación iniciada')
        return data.session
      }
    } catch (error) {
      console.error('Error creando sesión:', error)
      toast.error('Error creando nueva conversación')
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeSession || isSending) return false

    setIsSending(true)

    // Agregar mensaje del usuario inmediatamente
    const tempUserMessage: Message = {
      id: 'temp-user',
      content: content.trim(),
      role: 'USER',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSession.id,
          content: content.trim()
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Reemplazar mensaje temporal con los mensajes reales
        setMessages(prev => [
          ...prev.filter(m => m.id !== 'temp-user'),
          data.userMessage,
          data.assistantMessage
        ])
        return true
      } else {
        // Remover mensaje temporal si hay error
        setMessages(prev => prev.filter(m => m.id !== 'temp-user'))
        toast.error(data.error || 'Error enviando mensaje')
        return false
      }
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'temp-user'))
      console.error('Error enviando mensaje:', error)
      toast.error('Error de conexión')
      return false
    } finally {
      setIsSending(false)
    }
  }

  const sendFeedback = async (messageId: string, feedback: string) => {
    try {
      const response = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, feedback })
      })

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, feedback }
            : msg
        ))
        toast.success('Gracias por tu feedback')
      }
    } catch (error) {
      console.error('Error enviando feedback:', error)
    }
  }

  return {
    // Estados
    sessions,
    activeSession,
    messages,
    isLoading,
    isSending,
    
    // Acciones
    loadChatSessions,
    switchToSession,
    createNewSession,
    sendMessage,
    sendFeedback
  }
}
