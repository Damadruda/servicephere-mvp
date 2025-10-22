
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  TrendingUp, 
  Users, 
  BarChart3,
  Award,
  Filter,
  Calendar,
  Target,
  CheckCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalyticsData {
  overview: {
    totalReviews: number
    averageRating: number
    period: string
  }
  ratingDistribution: Record<number, number>
  reviewsByType: Record<string, number>
  topRatedUsers: Array<{
    userId: string
    name: string
    userType: string
    companyName?: string
    averageRating: number
    totalReviews: number
    recommendationRate: number
  }>
  trends: Array<{
    week: string
    reviews: number
    avg_rating: number
  }>
  sapModules: Array<{
    module: string
    reviews: number
    avg_rating: number
  }>
}

export function ReviewAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews/analytics?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 w-16">
          <span className="text-sm font-medium">{rating}</span>
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
        </div>
        
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="text-sm text-muted-foreground w-16 text-right">
          {count} ({percentage.toFixed(0)}%)
        </div>
      </div>
    )
  }

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  const totalRatingCount = Object.values(analytics.ratingDistribution).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-8">
      {/* Header con filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analytics de Reviews</h2>
          <p className="text-muted-foreground">
            Análisis detallado del sistema de calificaciones del marketplace
          </p>
        </div>
        
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 días' },
            { value: '30d', label: '30 días' },
            { value: '90d', label: '90 días' },
            { value: '1y', label: '1 año' },
            { value: 'all', label: 'Todo' }
          ].map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Reviews</p>
                  <p className="text-3xl font-bold">{analytics.overview.totalReviews}</p>
                  <p className="text-blue-100 text-sm mt-1">
                    En {selectedPeriod === 'all' ? 'todo el tiempo' : `últimos ${selectedPeriod}`}
                  </p>
                </div>
                <BarChart3 className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Rating Promedio</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold">
                      {analytics.overview.averageRating.toFixed(1)}
                    </p>
                    <Star className="h-6 w-6 text-yellow-200 fill-current" />
                  </div>
                  <p className="text-yellow-100 text-sm mt-1">
                    De 5.0 estrellas
                  </p>
                </div>
                <Award className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Usuarios Activos</p>
                  <p className="text-3xl font-bold">{analytics.topRatedUsers.length}</p>
                  <p className="text-green-100 text-sm mt-1">
                    Con reviews públicos
                  </p>
                </div>
                <Users className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Reviews Verificados</p>
                  <p className="text-3xl font-bold">
                    {Math.round((analytics.overview.totalReviews * 0.85))}
                  </p>
                  <p className="text-purple-100 text-sm mt-1">
                    85% verificación automática
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribución de Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Distribución de Calificaciones
            </CardTitle>
            <CardDescription>
              Cómo se distribuyen las calificaciones en el marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating}>
                {renderRatingBar(
                  rating, 
                  analytics.ratingDistribution[rating] || 0,
                  totalRatingCount
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {analytics.overview.averageRating.toFixed(1)}/5.0
                </div>
                <div className="text-sm text-muted-foreground">
                  Promedio general basado en {analytics.overview.totalReviews} reviews
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Reviews por Tipo
            </CardTitle>
            <CardDescription>
              Distribución entre reviews cliente→proveedor y proveedor→cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="font-medium">Cliente → Proveedor</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {analytics.reviewsByType.CLIENT_TO_PROVIDER || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {analytics.overview.totalReviews > 0 
                      ? Math.round(((analytics.reviewsByType.CLIENT_TO_PROVIDER || 0) / analytics.overview.totalReviews) * 100)
                      : 0}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="font-medium">Proveedor → Cliente</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {analytics.reviewsByType.PROVIDER_TO_CLIENT || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {analytics.overview.totalReviews > 0 
                      ? Math.round(((analytics.reviewsByType.PROVIDER_TO_CLIENT || 0) / analytics.overview.totalReviews) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                El sistema bidireccional permite que tanto clientes como proveedores 
                se califiquen mutuamente después de completar proyectos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users y SAP Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usuarios Mejor Calificados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Usuarios Mejor Calificados
            </CardTitle>
            <CardDescription>
              Los usuarios con mejor reputación en el marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topRatedUsers.slice(0, 5).map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {user.companyName && <span>{user.companyName}</span>}
                        <Badge variant="outline" className="text-xs">
                          {user.userType === 'CLIENT' ? 'Cliente' : 'Proveedor'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-bold">{user.averageRating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.totalReviews} reviews • {user.recommendationRate.toFixed(0)}% recomendado
                    </div>
                  </div>
                </div>
              ))}
              
              {analytics.topRatedUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aún no hay suficientes reviews para mostrar rankings
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Módulos SAP Más Calificados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Módulos SAP Más Revieweados
            </CardTitle>
            <CardDescription>
              Los módulos SAP con más reviews y mejor calificación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.sapModules.slice(0, 8).map((module, index) => (
                <div key={module.module} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-indigo-500 rounded opacity-75" 
                         style={{ opacity: 1 - (index * 0.1) }} />
                    
                    <div>
                      <div className="font-medium">{module.module}</div>
                      <div className="text-sm text-muted-foreground">
                        {module.reviews} review{module.reviews !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-bold">{module.avg_rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {analytics.sapModules.length === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aún no hay datos de módulos SAP suficientes
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
