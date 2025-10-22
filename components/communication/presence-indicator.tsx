
'use client'

import { cn } from '@/lib/utils'

interface PresenceIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'away'
  size?: 'small' | 'medium' | 'large'
  className?: string
  showText?: boolean
}

export function PresenceIndicator({ 
  status, 
  size = 'medium', 
  className,
  showText = false 
}: PresenceIndicatorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En línea'
      case 'busy': return 'Ocupado'
      case 'away': return 'Ausente'
      case 'offline': return 'Desconectado'
      default: return 'Desconocido'
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small': return 'w-2 h-2'
      case 'medium': return 'w-3 h-3'
      case 'large': return 'w-4 h-4'
      default: return 'w-3 h-3'
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-full border-2 border-white",
        getStatusColor(status),
        getSizeClasses(size)
      )}>
        {status === 'busy' && (
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
          </div>
        )}
      </div>
      {showText && (
        <span className="text-xs text-gray-600">
          {getStatusText(status)}
        </span>
      )}
    </div>
  )
}
