
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Star, Send, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface CreateReviewFormProps {
  projectId: string
  targetUserId: string
  targetName: string
  reviewType: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT'
  onReviewCreated?: () => void
}

export function CreateReviewForm({
  projectId,
  targetUserId,
  targetName,
  reviewType,
  onReviewCreated
}: CreateReviewFormProps) {
  const [formData, setFormData] = useState({
    overallRating: 5,
    communicationRating: 5,
    qualityRating: 5,
    timelinessRating: 5,
    professionalismRating: 5,
    valueRating: 5,
    title: '',
    comment: '',
    wouldRecommend: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateRating = (field: string, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.comment.trim().length < 10) {
      toast.error('El comentario debe tener al menos 10 caracteres')
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        projectId,
        targetUserId,
        reviewType,
        ...formData,
        comment: formData.comment.trim(),
        title: formData.title.trim() || undefined
      }

      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        toast.success('Review creado exitosamente!')
        // Reset form
        setFormData({
          overallRating: 5,
          communicationRating: 5,
          qualityRating: 5,
          timelinessRating: 5,
          professionalismRating: 5,
          valueRating: 5,
          title: '',
          comment: '',
          wouldRecommend: true
        })
        onReviewCreated?.()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al crear el review')
      }
    } catch (error) {
      console.error('Error creating review:', error)
      toast.error('Error al crear el review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = (field: string, currentRating: number, label: string) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => updateRating(field, rating)}
            className="transition-colors hover:scale-110 transform"
          >
            <Star
              className={`h-5 w-5 ${
                rating <= currentRating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium">{currentRating}</span>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Crear Review para {targetName}
        </CardTitle>
        <CardDescription>
          Comparte tu experiencia trabajando con esta {reviewType === 'CLIENT_TO_PROVIDER' ? 'persona' : 'empresa'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Calificación General */}
          {renderStarRating('overallRating', formData.overallRating, 'Calificación General')}

          {/* Calificaciones Detalladas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderStarRating('communicationRating', formData.communicationRating, 'Comunicación')}
            {renderStarRating('qualityRating', formData.qualityRating, 'Calidad')}
            {renderStarRating('timelinessRating', formData.timelinessRating, 'Puntualidad')}
            {renderStarRating('professionalismRating', formData.professionalismRating, 'Profesionalismo')}
            {renderStarRating('valueRating', formData.valueRating, 'Relación Calidad-Precio')}
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label>Título del Review (Opcional)</Label>
            <Input
              placeholder="Ej: Excelente trabajo en implementación SAP"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              maxLength={100}
            />
          </div>

          {/* Comentario */}
          <div className="space-y-2">
            <Label>Comentario *</Label>
            <Textarea
              placeholder="Describe tu experiencia trabajando con esta persona..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mínimo 10 caracteres requeridos</span>
              <span>{formData.comment.length}/1000</span>
            </div>
          </div>

          {/* Recomendación */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>¿Recomendarías trabajar con esta persona?</Label>
              <p className="text-sm text-muted-foreground">
                Esto ayuda a otros usuarios a tomar decisiones
              </p>
            </div>
            <Switch
              checked={formData.wouldRecommend}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, wouldRecommend: checked }))
              }
            />
          </div>

          {/* Aviso */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Importante:</p>
                <p className="mt-1">
                  Este review será público y verificado automáticamente. 
                  Mantén un tono profesional y constructivo.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            disabled={isSubmitting || formData.comment.trim().length < 10}
            className="w-full flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Publicar Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
