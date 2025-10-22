
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Flag, 
  ChevronDown,
  ChevronUp,
  Verified,
  Calendar
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Review {
  id: string
  overallRating: number
  communicationRating?: number
  qualityRating?: number
  timelinessRating?: number
  professionalismRating?: number
  title?: string
  comment: string
  pros: string[]
  cons: string[]
  wouldRecommend: boolean
  isVerified: boolean
  reviewType: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT'
  response?: string
  respondedAt?: string
  helpfulVotes: number
  unhelpfulVotes: number
  createdAt: string
  reviewer: {
    name: string
    userType: string
  }
  project: {
    title: string
    sapModules: string[]
  }
  reviewerCompany?: string
}

interface ReviewsListProps {
  userId?: string
  limit?: number
  showPagination?: boolean
  filters?: any
}

export function ReviewsList({ 
  userId, 
  limit = 10, 
  showPagination = true, 
  filters = {} 
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())
  const [votingReviews, setVotingReviews] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (userId) {
      fetchUserReviews()
    } else {
      fetchPublicReviews()
    }
  }, [userId, filters])

  const fetchUserReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...filters
      })
      
      const response = await fetch(`/api/reviews/user/${userId}?${params}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPublicReviews = async () => {
    try {
      setLoading(true)
      // Implementar cuando tengamos endpoint para reviews públicos
      setReviews([])
    } catch (error) {
      console.error('Error fetching public reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (reviewId: string, isHelpful: boolean) => {
    try {
      setVotingReviews(prev => new Set([...prev, reviewId]))
      
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHelpful })
      })

      if (response.ok) {
        const data = await response.json()
        
        setReviews(prev => prev.map(review => 
          review.id === reviewId
            ? {
                ...review,
                helpfulVotes: data.helpfulVotes,
                unhelpfulVotes: data.unhelpfulVotes
              }
            : review
        ))
      }
    } catch (error) {
      console.error('Error voting on review:', error)
    } finally {
      setVotingReviews(prev => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    }
  }

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const renderStarRating = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}</span>
      </div>
    )
  }

  const getReviewTypeLabel = (type: string) => {
    return type === 'CLIENT_TO_PROVIDER' 
      ? 'Cliente → Proveedor' 
      : 'Proveedor → Cliente'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h4 className="text-lg font-medium mb-2">No hay reviews disponibles</h4>
        <p className="text-muted-foreground">
          {userId ? 'Este usuario aún no ha recibido reviews' : 'No hay reviews públicos para mostrar'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {review.reviewer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{review.reviewer.name}</h4>
                      {review.reviewerCompany && (
                        <span className="text-sm text-muted-foreground">
                          @ {review.reviewerCompany}
                        </span>
                      )}
                      {review.isVerified && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Verified className="h-3 w-3" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline">
                        {getReviewTypeLabel(review.reviewType)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(review.createdAt), 'dd MMM yyyy', { locale: es })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {renderStarRating(review.overallRating, 'md')}
                  {review.project && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {review.project.title}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Título del review */}
              {review.title && (
                <h5 className="font-medium text-lg">{review.title}</h5>
              )}

              {/* Calificaciones detalladas */}
              {expandedReviews.has(review.id) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  {review.communicationRating && (
                    <div>
                      <p className="text-sm font-medium mb-1">Comunicación</p>
                      {renderStarRating(review.communicationRating)}
                    </div>
                  )}
                  {review.qualityRating && (
                    <div>
                      <p className="text-sm font-medium mb-1">Calidad</p>
                      {renderStarRating(review.qualityRating)}
                    </div>
                  )}
                  {review.timelinessRating && (
                    <div>
                      <p className="text-sm font-medium mb-1">Puntualidad</p>
                      {renderStarRating(review.timelinessRating)}
                    </div>
                  )}
                  {review.professionalismRating && (
                    <div>
                      <p className="text-sm font-medium mb-1">Profesionalismo</p>
                      {renderStarRating(review.professionalismRating)}
                    </div>
                  )}
                </div>
              )}

              {/* Comentario principal */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700">{review.comment}</p>
              </div>

              {/* Pros y Cons */}
              {(review.pros.length > 0 || review.cons.length > 0) && expandedReviews.has(review.id) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {review.pros.length > 0 && (
                    <div>
                      <h6 className="font-medium text-green-700 mb-2">✅ Aspectos Positivos</h6>
                      <ul className="space-y-1">
                        {review.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-green-600">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {review.cons.length > 0 && (
                    <div>
                      <h6 className="font-medium text-orange-700 mb-2">⚠️ Áreas de Mejora</h6>
                      <ul className="space-y-1">
                        {review.cons.map((con, i) => (
                          <li key={i} className="text-sm text-orange-600">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Recomendación */}
              <div className="flex items-center gap-2">
                <Badge variant={review.wouldRecommend ? "default" : "secondary"}>
                  {review.wouldRecommend ? "✅ Recomendado" : "❌ No Recomendado"}
                </Badge>
                
                {review.project?.sapModules && review.project.sapModules.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {review.project.sapModules.slice(0, 3).map((module) => (
                      <Badge key={module} variant="outline" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                    {review.project.sapModules.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{review.project.sapModules.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Respuesta del reviewer */}
              {review.response && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-700">Respuesta del usuario</span>
                    <span className="text-xs text-blue-500">
                      {format(new Date(review.respondedAt!), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                  <p className="text-blue-700 text-sm">{review.response}</p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(review.id, true)}
                    disabled={votingReviews.has(review.id)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpfulVotes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(review.id, false)}
                    disabled={votingReviews.has(review.id)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{review.unhelpfulVotes}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-red-600"
                  >
                    <Flag className="h-4 w-4" />
                    Reportar
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(review.id)}
                  className="flex items-center gap-1"
                >
                  {expandedReviews.has(review.id) ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Contraer
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Ver más
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
