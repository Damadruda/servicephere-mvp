
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  Eye, 
  ThumbsUp, 
  Flag,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface MyReview {
  id: string
  overallRating: number
  title?: string
  comment: string
  isVerified: boolean
  status: string
  reviewType: string
  response?: string
  respondedAt?: string
  helpfulVotes: number
  unhelpfulVotes: number
  createdAt: string
  isMyReview: boolean
  reviewer: {
    name: string
    userType: string
  }
  target: {
    name: string
    userType: string
  }
  project: {
    title: string
  }
  reviewerCompany?: string
  targetCompany?: string
}

export function MyReviewsList() {
  const [reviews, setReviews] = useState<MyReview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [stats, setStats] = useState({
    given: {} as Record<string, number>,
    receivedDistribution: {} as Record<number, number>
  })

  useEffect(() => {
    fetchMyReviews()
  }, [activeTab])

  const fetchMyReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: activeTab,
        sortBy: 'newest'
      })
      
      const response = await fetch(`/api/reviews/my-reviews?${params}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching my reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FLAGGED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="h-3 w-3" />
      case 'APPROVED': return <CheckCircle className="h-3 w-3" />
      case 'PENDING': return <Clock className="h-3 w-3" />
      case 'FLAGGED': return <AlertCircle className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  const renderStarRating = (rating: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Mis Reviews</h2>
        <p className="text-muted-foreground">
          Gestiona todos los reviews que has escrito y recibido
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Todos ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="given" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Escritos ({reviews.filter(r => r.isMyReview).length})
          </TabsTrigger>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Recibidos ({reviews.filter(r => !r.isMyReview).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hay reviews</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'given' 
                      ? 'Aún no has escrito ningún review'
                      : activeTab === 'received'
                      ? 'Aún no has recibido reviews'
                      : 'No tienes reviews para mostrar'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {review.isMyReview 
                                  ? review.target.name.charAt(0).toUpperCase()
                                  : review.reviewer.name.charAt(0).toUpperCase()
                                }
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <h4 className="font-medium">
                                {review.isMyReview 
                                  ? `Review para ${review.target.name}`
                                  : `Review de ${review.reviewer.name}`
                                }
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{review.project.title}</span>
                                <span>•</span>
                                <span>
                                  {format(new Date(review.createdAt), 'dd MMM yyyy', { locale: es })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(review.status)}>
                              {getStatusIcon(review.status)}
                              <span className="ml-1">
                                {review.status === 'VERIFIED' ? 'Verificado' :
                                 review.status === 'APPROVED' ? 'Aprobado' :
                                 review.status === 'PENDING' ? 'Pendiente' :
                                 review.status === 'FLAGGED' ? 'Reportado' : review.status}
                              </span>
                            </Badge>
                            
                            <Badge variant="outline">
                              {review.reviewType === 'CLIENT_TO_PROVIDER' 
                                ? 'Cliente → Proveedor' 
                                : 'Proveedor → Cliente'}
                            </Badge>

                            {review.isVerified && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verificado
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          {renderStarRating(review.overallRating)}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Título del review */}
                      {review.title && (
                        <h5 className="font-medium">{review.title}</h5>
                      )}

                      {/* Comentario */}
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 line-clamp-3">
                          {review.comment}
                        </p>
                      </div>

                      {/* Respuesta si existe */}
                      {review.response && (
                        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-700 text-sm">
                              Respuesta del usuario
                            </span>
                            <span className="text-xs text-blue-500">
                              {format(new Date(review.respondedAt!), 'dd MMM yyyy', { locale: es })}
                            </span>
                          </div>
                          <p className="text-blue-700 text-sm">{review.response}</p>
                        </div>
                      )}

                      {/* Métricas de interacción */}
                      <div className="flex items-center justify-between pt-3 border-t text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.helpfulVotes} útiles</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>Público</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {review.isMyReview && !review.response && (
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          )}
                          
                          {!review.isMyReview && !review.response && (
                            <Button variant="outline" size="sm">
                              Responder
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
