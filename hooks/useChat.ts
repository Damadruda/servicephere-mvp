/**
 * useChat Hook
 * 
 * Custom hook for managing chat functionality in the application
 */

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface ChatMessage {
  id: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
  timestamp: Date
  sessionId?: string
  confidence?: number
}

export interface ChatSession {
  id: string
  title: string
  createdAt: Date
  messages: ChatMessage[]
}

export function useChat() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])

  // Initialize or create a new chat session
  const startSession = useCallback(async () => {
    if (!session?.user?.id) {
      console.log('[useChat] No user session - skipping chat session creation')
      return null
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to create chat session')
      }

      const data = await response.json()
      setCurrentSessionId(data.sessionId)
      return data.sessionId
    } catch (err) {
      console.error('[useChat] Error creating session:', err)
      setError(err instanceof Error ? err.message : 'Failed to create session')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [session])

  // Send a message in the chat
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return false

    // Get or create session ID
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = await startSession()
      if (!sessionId) {
        setError('Failed to initialize chat session')
        return false
      }
    }

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content,
      timestamp: new Date(),
      sessionId,
    }
    setMessages(prev => [...prev, userMessage])

    try {
      setIsSending(true)
      setError(null)

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, content }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: data.messageId || `${Date.now()}`,
        role: 'ASSISTANT',
        content: data.response,
        timestamp: new Date(),
        sessionId,
        confidence: data.confidence,
      }
      setMessages(prev => [...prev, assistantMessage])
      return true

    } catch (err) {
      console.error('[useChat] Error sending message:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message')
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'SYSTEM',
        content: 'Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
      return false
    } finally {
      setIsSending(false)
    }
  }, [currentSessionId, startSession])

  // Load chat history for a session
  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/chat/session/${sessionId}/messages`)

      if (!response.ok) {
        throw new Error('Failed to load session')
      }

      const data = await response.json()
      setMessages(data.messages || [])
      setCurrentSessionId(sessionId)
    } catch (err) {
      console.error('[useChat] Error loading session:', err)
      setError(err instanceof Error ? err.message : 'Failed to load session')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load all user sessions
  const loadSessions = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/chat/session')

      if (!response.ok) {
        throw new Error('Failed to load sessions')
      }

      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (err) {
      console.error('[useChat] Error loading sessions:', err)
    }
  }, [session])

  // Clear current chat
  const clearChat = useCallback(() => {
    setMessages([])
    setCurrentSessionId(null)
    setError(null)
  }, [])

  // Create a new chat session with a title
  const createNewSession = useCallback(async (title: string) => {
    if (!session?.user?.id) {
      console.log('[useChat] No user session - skipping chat session creation')
      return null
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error('Failed to create chat session')
      }

      const data = await response.json()
      setCurrentSessionId(data.sessionId)
      setMessages([])
      
      // Reload sessions list
      await loadSessions()
      
      return data.sessionId
    } catch (err) {
      console.error('[useChat] Error creating session:', err)
      setError(err instanceof Error ? err.message : 'Failed to create session')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [session, loadSessions])

  // Send feedback for a message
  const sendFeedback = useCallback(async (messageId: string, rating: string) => {
    try {
      const response = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, rating }),
      })

      if (!response.ok) {
        throw new Error('Failed to send feedback')
      }

      return true
    } catch (err) {
      console.error('[useChat] Error sending feedback:', err)
      return false
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    if (session?.user?.id) {
      loadSessions()
    }
  }, [session, loadSessions])

  return {
    messages,
    isLoading,
    isSending,
    error,
    currentSessionId,
    activeSession: currentSessionId,
    sessions,
    sendMessage,
    startSession,
    createNewSession,
    loadSession,
    loadSessions,
    clearChat,
    sendFeedback,
  }
}
