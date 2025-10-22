
// Chat suggestions component - temporarily disabled
interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
  userType?: 'CLIENT' | 'PROVIDER' | 'ADMIN'
}

export default function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Sugerencias de chat en desarrollo</p>
    </div>
  )
}
