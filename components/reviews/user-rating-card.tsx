
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Star, 
  TrendingUp, 
  Award, 
  MessageSquare, 
  CheckCircle,
  Target,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface UserRatingData {
  id: string
  averageRating: number
  totalReviewsReceived: number
  avgCommunication: number
  avgQuality: number
  avgTimeliness: number
  avgProfessionalism: number
  avgValue: number
  avgTechnical: number
  clientReviews: number
  providerReviews: number
  recommendationRate: number
  fiveStarCount: number
  fourStarCount: number
  threeStarCount: number
  twoStarCount: number
  oneStarCount: number
  verifiedReviewsCount: number
  responseRate: number
  lastReviewAt?: string
}

interface UserRatingCardProps {
  userId: string
}

export function UserRatingCard({ userId }: UserRatingCardProps) {
  const [rating, setRating] = useState<UserRatingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserRating()
  }, [userId])

  const fetchUserRating = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews/user/${userId}?limit=1`)
      if (response.ok) {
        const data = await response.json()
        setRating(data.userRating)
      }
    } catch (error) {
      console.error('Error fetching user rating:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStarRating = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4', 
      lg: 'h-6 w-6'
    }[size]
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600'
    if (score >= 4.0) return 'text-blue-600'
    if (score >= 3.5) return 'text-yellow-600'
    if (score >= 3.0) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 4.5) return 'bg-green-50 border-green-200'
    if (score >= 4.0) return 'bg-blue-50 border-blue-200'
    if (score >= 3.5) return 'bg-yellow-50 border-yellow-200'
    if (score >= 3.0) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  if (!rating || rating.totalReviewsReceived === 0) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aún sin reviews</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Tu perfil de calificaciones aparecerá aquí una vez que recibas tus primeros reviews 
              después de completar proyectos.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalStars = rating.fiveStarCount + rating.fourStarCount + rating.threeStarCount + 
                    rating.twoStarCount + rating.oneStarCount

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Mi Perfil de Calificaciones</h2>
        <p className="text-muted-foreground">
          Tu reputación en el marketplace basada en reviews verificados
        </p>
      </div>

      {/* Rating Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`${getScoreBg(rating.averageRating)} border-2`}>
          <CardHeader className="text-center pb-2">
            <CardTitle className="flex items-center justify-center gap-2">
              <Award className={`h-8 w-8 ${getScoreColor(rating.averageRating)}`} />
              Tu Calificación General
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <div className={`text-6xl font-bold ${getScoreColor(rating.averageRating)}`}>
                {rating.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center">
                {renderStarRating(rating.averageRating, 'lg')}
              </div>
              <p className="text-lg text-muted-foreground">
                Basado en {rating.totalReviewsReceived} review{rating.totalReviewsReceived !== 1 ? 's' : ''} verificado{rating.totalReviewsReceived !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {rating.recommendationRate.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Te recomiendan</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {rating.verifiedReviewsCount}
                </div>
                <div className="text-sm text-muted-foreground">Reviews verificados</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {rating.responseRate.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Tasa respuesta</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Calificaciones por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Comunicación', value: rating.avgCommunication },
              { label: 'Calidad', value: rating.avgQuality },
              { label: 'Puntualidad', value: rating.avgTimeliness },
              { label: 'Profesionalismo', value: rating.avgProfessionalism },
              { label: 'Relación Calidad-Precio', value: rating.avgValue },
              { label: 'Competencia Técnica', value: rating.avgTechnical }
            ].map((category, index) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{category.label}</span>
                  <span className={`text-sm font-bold ${getScoreColor(category.value)}`}>
                    {category.value.toFixed(1)}
                  </span>
                </div>
                <Progress 
                  value={(category.value / 5) * 100} 
                  className="h-2"
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Distribución de Calificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { stars: 5, count: rating.fiveStarCount, color: 'bg-green-500' },
              { stars: 4, count: rating.fourStarCount, color: 'bg-blue-500' },
              { stars: 3, count: rating.threeStarCount, color: 'bg-yellow-500' },
              { stars: 2, count: rating.twoStarCount, color: 'bg-orange-500' },
              { stars: 1, count: rating.oneStarCount, color: 'bg-red-500' }
            ].map((item) => {
              const percentage = totalStars > 0 ? (item.count / totalStars) * 100 : 0
              
              return (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{item.stars}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                  
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground w-16 text-right">
                    {item.count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{rating.clientReviews}</div>
                <div className="text-sm text-muted-foreground">Reviews de Clientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{rating.providerReviews}</div>
                <div className="text-sm text-muted-foreground">Reviews de Proveedores</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Último Review</div>
                <div className="text-sm text-muted-foreground">
                  {rating.lastReviewAt 
                    ? format(new Date(rating.lastReviewAt), 'dd MMM yyyy', { locale: es })
                    : 'N/A'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges and Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Logros y Reconocimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {rating.averageRating >= 4.5 && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                ⭐ Top Rated
              </Badge>
            )}
            
            {rating.verifiedReviewsCount >= 10 && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                🎯 Altamente Revieweado
              </Badge>
            )}
            
            {rating.recommendationRate >= 90 && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                👍 Altamente Recomendado
              </Badge>
            )}
            
            {rating.responseRate >= 80 && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                💬 Excelente Comunicador
              </Badge>
            )}
            
            {rating.totalReviewsReceived >= 50 && (
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">
                🏆 Veterano del Marketplace
              </Badge>
            )}
          </div>
          
          {rating.averageRating < 4.0 && rating.totalReviewsReceived >= 5 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Consejo:</strong> Considera mejorar la comunicación con tus clientes y 
                la calidad de las entregas para obtener mejores calificaciones.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
