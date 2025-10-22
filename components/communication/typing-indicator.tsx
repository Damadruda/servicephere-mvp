
'use client'

interface TypingIndicatorProps {
  users: string[]
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0]} está escribiendo...`
    } else if (users.length === 2) {
      return `${users[0]} y ${users[1]} están escribiendo...`
    } else {
      return `${users.length} personas están escribiendo...`
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-sm text-gray-500 italic">
          {getTypingText()}
        </span>
      </div>
    </div>
  )
}
