
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Star, 
  Calendar, 
  DollarSign, 
  Clock, 
  Building2, 
  User,
  PenTool,
  CheckCircle
} from 'lucide-react'
import { CreateReviewDialog } from './create-review-dialog'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'

interface EligibleReview {
  projectId: string
  projectTitle: string
  projectCompletedAt: string
  targetUserId: string
  targetName: string
  targetCompany?: string
  reviewType: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT'
  contractId?: string
  quotationId?: string
  projectValue?: number
  sapModules: string[]
  industry: string
}

interface EligibleReviewsListProps {
  eligibleReviews: EligibleReview[]
  onReviewCreated: () => void
}

export function EligibleReviewsList({ eligibleReviews, onReviewCreated }: EligibleReviewsListProps) {
  const [selectedReview, setSelectedReview] = useState<EligibleReview | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleWriteReview = (review: EligibleReview) => {
    setSelectedReview(review)
    setShowCreateDialog(true)
  }

  const handleReviewCreated = () => {
    setShowCreateDialog(false)
    setSelectedReview(null)
    onReviewCreated()
  }

  const getReviewTypeLabel = (type: string) => {
    return type === 'CLIENT_TO_PROVIDER' 
      ? 'Calificar al Proveedor' 
      : 'Calificar al Cliente'
  }

  const getReviewTypeDescription = (type: string) => {
    return type === 'CLIENT_TO_PROVIDER' 
      ? 'Comparte tu experiencia trabajando con este proveedor SAP'
      : 'Comparte tu experiencia trabajando con este cliente'
  }

  if (eligibleReviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">¡Todo al día! 🎉</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No tienes reviews pendientes. Todos tus proyectos completados ya han sido calificados.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Reviews Pendientes por Escribir</h2>
        <p className="text-muted-foreground">
          Ayuda a la comunidad SAP compartiendo tu experiencia en estos proyectos completados
        </p>
      </div>

      <div className="grid gap-6">
        {eligibleReviews.map((review, index) => (
          <motion.div
            key={`${review.projectId}-${review.targetUserId}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {review.projectTitle}
                        <Badge variant="secondary" className="font-normal">
                          {review.industry}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getReviewTypeDescription(review.reviewType)}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Completado {formatDistanceToNow(new Date(review.projectCompletedAt), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </div>
                      
                      {review.projectValue && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${review.projectValue.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                    <Clock className="h-3 w-3 mr-1" />
                    Pendiente
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Información del usuario a calificar */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {review.targetName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {review.targetName}
                        {review.reviewType === 'CLIENT_TO_PROVIDER' ? (
                          <Building2 className="h-4 w-4 text-blue-600" />
                        ) : (
                          <User className="h-4 w-4 text-green-600" />
                        )}
                      </h4>
                      {review.targetCompany && (
                        <p className="text-sm text-muted-foreground">
                          {review.targetCompany}
                        </p>
                      )}
                      <Badge variant="outline" className="mt-1">
                        {getReviewTypeLabel(review.reviewType)}
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleWriteReview(review)}
                    className="flex items-center gap-2"
                  >
                    <PenTool className="h-4 w-4" />
                    Escribir Review
                  </Button>
                </div>

                {/* Módulos SAP involucrados */}
                {review.sapModules && review.sapModules.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Módulos SAP trabajados:</p>
                    <div className="flex flex-wrap gap-2">
                      {review.sapModules.map((module) => (
                        <Badge key={module} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Información adicional */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{index + 1}</div>
                    <div className="text-xs text-muted-foreground">Prioridad</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.ceil((Date.now() - new Date(review.projectCompletedAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-muted-foreground">Días completado</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {review.sapModules.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Módulos SAP</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-purple-600">⭐</div>
                    <div className="text-xs text-muted-foreground">Review esperado</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dialog para crear review */}
      {selectedReview && (
        <CreateReviewDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          eligibleReview={selectedReview}
          onReviewCreated={handleReviewCreated}
        />
      )}
    </div>
  )
}
