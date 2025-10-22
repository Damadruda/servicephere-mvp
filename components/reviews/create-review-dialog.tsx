
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Star, 
  Plus, 
  X, 
  Send, 
  AlertCircle,
  CheckCircle,
  Building2,
  User
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface EligibleReview {
  projectId: string
  projectTitle: string
  targetUserId: string
  targetName: string
  targetCompany?: string
  reviewType: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT'
  contractId?: string
  quotationId?: string
  sapModules: string[]
}

interface CreateReviewDialogProps {
  open: boolean
  onClose: () => void
  eligibleReview: EligibleReview
  onReviewCreated: () => void
}

export function CreateReviewDialog({ 
  open, 
  onClose, 
  eligibleReview, 
  onReviewCreated 
}: CreateReviewDialogProps) {
  const [formData, setFormData] = useState({
    overallRating: 5,
    communicationRating: 5,
    qualityRating: 5,
    timelinessRating: 5,
    professionalismRating: 5,
    valueRating: 5,
    technicalRating: 5,
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
    wouldRecommend: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const updateRating = (field: string, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }))
  }

  const addProCon = (type: 'pros' | 'cons') => {
    if (formData[type].length < 5) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], '']
      }))
    }
  }

  const updateProCon = (type: 'pros' | 'cons', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }))
  }

  const removeProCon = (type: 'pros' | 'cons', index: number) => {
    if (formData[type].length > 1) {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async () => {
    if (formData.comment.trim().length < 10) {
      toast.error('El comentario debe tener al menos 10 caracteres')
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        projectId: eligibleReview.projectId,
        targetUserId: eligibleReview.targetUserId,
        reviewType: eligibleReview.reviewType,
        overallRating: formData.overallRating,
        communicationRating: formData.communicationRating,
        qualityRating: formData.qualityRating,
        timelinessRating: formData.timelinessRating,
        professionalismRating: formData.professionalismRating,
        valueRating: formData.valueRating,
        technicalRating: formData.technicalRating,
        title: formData.title.trim() || undefined,
        comment: formData.comment.trim(),
        pros: formData.pros.filter(p => p.trim()),
        cons: formData.cons.filter(c => c.trim()),
        wouldRecommend: formData.wouldRecommend,
        quotationId: eligibleReview.quotationId,
        contractId: eligibleReview.contractId
      }

      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        toast.success('Review creado exitosamente!')
        onReviewCreated()
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

  const renderStarRating = (
    field: string,
    currentRating: number,
    label: string,
    description?: string
  ) => (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => updateRating(field, rating)}
            className="transition-colors hover:scale-110 transform"
          >
            <Star
              className={`h-6 w-6 ${
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Calificación General'
      case 2: return 'Calificaciones Detalladas'
      case 3: return 'Comentarios y Detalles'
      case 4: return 'Revisión Final'
      default: return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Crear Review - {eligibleReview.projectTitle}
          </DialogTitle>
          <DialogDescription>
            Comparte tu experiencia trabajando con {eligibleReview.targetName}
          </DialogDescription>
        </DialogHeader>

        {/* Progreso */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Información del objetivo del review */}
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg mb-6">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {eligibleReview.targetName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h4 className="font-medium flex items-center gap-2">
              {eligibleReview.targetName}
              {eligibleReview.reviewType === 'CLIENT_TO_PROVIDER' ? (
                <Building2 className="h-4 w-4 text-blue-600" />
              ) : (
                <User className="h-4 w-4 text-green-600" />
              )}
            </h4>
            {eligibleReview.targetCompany && (
              <p className="text-sm text-muted-foreground">
                {eligibleReview.targetCompany}
              </p>
            )}
            <Badge variant="outline" className="mt-1">
              {eligibleReview.reviewType === 'CLIENT_TO_PROVIDER' 
                ? 'Calificando al Proveedor' 
                : 'Calificando al Cliente'}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">{getStepTitle()}</h3>

          {/* Step 1: Calificación General */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {renderStarRating(
                'overallRating',
                formData.overallRating,
                'Calificación General',
                'Tu experiencia general trabajando con esta persona'
              )}

              <div className="space-y-2">
                <Label>Título del Review (Opcional)</Label>
                <Input
                  placeholder="Ej: Excelente trabajo en implementación S/4HANA"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/100 caracteres
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>¿Recomendarías trabajar con esta persona?</Label>
                  <p className="text-sm text-muted-foreground">
                    Esto ayuda a otros usuarios a tomar decisiones informadas
                  </p>
                </div>
                <Switch
                  checked={formData.wouldRecommend}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, wouldRecommend: checked }))}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Calificaciones Detalladas */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <p className="text-sm text-muted-foreground">
                Califica aspectos específicos de la colaboración:
              </p>

              <div className="grid gap-6">
                {renderStarRating(
                  'communicationRating',
                  formData.communicationRating,
                  'Comunicación',
                  'Claridad, frecuencia y efectividad de la comunicación'
                )}

                {renderStarRating(
                  'qualityRating',
                  formData.qualityRating,
                  'Calidad del Trabajo',
                  'Calidad técnica y atención al detalle'
                )}

                {renderStarRating(
                  'timelinessRating',
                  formData.timelinessRating,
                  'Cumplimiento de Tiempos',
                  'Puntualidad en entregas y cumplimiento de deadlines'
                )}

                {renderStarRating(
                  'professionalismRating',
                  formData.professionalismRating,
                  'Profesionalismo',
                  'Actitud, ética de trabajo y manejo de situaciones'
                )}

                {renderStarRating(
                  'valueRating',
                  formData.valueRating,
                  'Relación Calidad-Precio',
                  'Valor recibido en relación al costo'
                )}

                {renderStarRating(
                  'technicalRating',
                  formData.technicalRating,
                  'Competencia Técnica SAP',
                  'Conocimiento y habilidades técnicas en SAP'
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Comentarios */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label>Comentario Principal *</Label>
                <Textarea
                  placeholder="Describe tu experiencia trabajando con esta persona. Incluye detalles específicos sobre el proyecto, los resultados obtenidos y cualquier aspecto destacable..."
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={5}
                  maxLength={2000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mínimo 10 caracteres requeridos</span>
                  <span>{formData.comment.length}/2000 caracteres</span>
                </div>
              </div>

              {/* Pros */}
              <div className="space-y-3">
                <Label>Aspectos Positivos</Label>
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Ej: Excelente comunicación durante todo el proyecto"
                      value={pro}
                      onChange={(e) => updateProCon('pros', index, e.target.value)}
                      maxLength={200}
                    />
                    {formData.pros.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeProCon('pros', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.pros.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addProCon('pros')}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar aspecto positivo
                  </Button>
                )}
              </div>

              {/* Cons */}
              <div className="space-y-3">
                <Label>Áreas de Mejora (Opcional)</Label>
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Ej: Podría mejorar la documentación técnica"
                      value={con}
                      onChange={(e) => updateProCon('cons', index, e.target.value)}
                      maxLength={200}
                    />
                    {formData.cons.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeProCon('cons', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.cons.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addProCon('cons')}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar área de mejora
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Revisión Final */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Resumen del Review</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Calificación general:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{formData.overallRating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Recomendarías:</span>
                    <Badge variant={formData.wouldRecommend ? "default" : "secondary"}>
                      {formData.wouldRecommend ? "Sí" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Comentarios:</span>
                    <span>{formData.comment.length} caracteres</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Importante:</p>
                    <ul className="mt-1 text-amber-700 space-y-1">
                      <li>• Este review será público y verificado automáticamente</li>
                      <li>• No podrás editarlo después de enviarlo</li>
                      <li>• Mantén un tono profesional y constructivo</li>
                      <li>• Los reviews falsos o inapropiados serán moderados</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === 3 && formData.comment.trim().length < 10}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || formData.comment.trim().length < 10}
                className="flex items-center gap-2"
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
