
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Award,
  BarChart3,
  PenTool,
  Eye
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { ReviewsList } from './reviews-list'
import { CreateReviewForm } from './create-review-form'
import { MyReviewsList } from './my-reviews-list'
import { EligibleReviewsList } from './eligible-reviews-list'
import { ReviewAnalytics } from './review-analytics'
import { UserRatingCard } from './user-rating-card'

export function ReviewsHub() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [eligibleReviews, setEligibleReviews] = useState([])
  const [myStats, setMyStats] = useState({
    totalGiven: 0,
    totalReceived: 0,
    averageReceived: 0,
    pendingToWrite: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [eligibleRes, myReviewsRes] = await Promise.all([
        fetch('/api/reviews/eligible'),
        fetch('/api/reviews/my-reviews')
      ])

      if (eligibleRes.ok) {
        const eligibleData = await eligibleRes.json()
        setEligibleReviews(eligibleData.eligibleReviews)
        setMyStats(prev => ({
          ...prev,
          pendingToWrite: eligibleData.stats.totalEligible
        }))
      }

      if (myReviewsRes.ok) {
        const myReviewsData = await myReviewsRes.json()
        setMyStats(prev => ({
          ...prev,
          totalGiven: myReviewsData.reviews.filter((r: any) => r.isMyReview).length,
          totalReceived: myReviewsData.reviews.filter((r: any) => !r.isMyReview).length,
          averageReceived: myReviewsData.stats?.receivedDistribution 
            ? Object.entries(myReviewsData.stats.receivedDistribution)
                .reduce((acc: number, [rating, count]) => acc + (parseInt(rating) * (count as number)), 0) 
              / Object.values(myReviewsData.stats.receivedDistribution)
                .reduce((acc: number, count) => acc + (count as number), 0)
            : 0
        }))
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌟 Centro de Reviews y Calificaciones
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema bidireccional verificado donde clientes y proveedores se califican mutuamente 
              después de completar proyectos SAP exitosos
            </p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Reviews Escritos</p>
                    <p className="text-3xl font-bold">{myStats.totalGiven}</p>
                    <p className="text-blue-100 text-sm mt-1">
                      Calificaciones dadas
                    </p>
                  </div>
                  <PenTool className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Reviews Recibidos</p>
                    <p className="text-3xl font-bold">{myStats.totalReceived}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-300 mr-1" />
                      <span className="text-green-100 text-sm">
                        {myStats.averageReceived.toFixed(1)} promedio
                      </span>
                    </div>
                  </div>
                  <Award className="h-12 w-12 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Pendientes</p>
                    <p className="text-3xl font-bold">{myStats.pendingToWrite}</p>
                    <p className="text-orange-100 text-sm mt-1">
                      Por escribir
                    </p>
                  </div>
                  <AlertCircle className="h-12 w-12 text-orange-200" />
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
                    <p className="text-purple-100">Tasa Respuesta</p>
                    <p className="text-3xl font-bold">
                      {myStats.totalGiven + myStats.pendingToWrite > 0 
                        ? Math.round((myStats.totalGiven / (myStats.totalGiven + myStats.pendingToWrite)) * 100)
                        : 0}%
                    </p>
                    <p className="text-purple-100 text-sm mt-1">
                      Compromiso
                    </p>
                  </div>
                  <BarChart3 className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2" onClick={() => setActiveTab('overview')}>
              <Eye className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="write" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Escribir
              {myStats.pendingToWrite > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {myStats.pendingToWrite}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="my-reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Mis Reviews
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Explorar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Mi Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reviews Recientes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Reviews Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewsList 
                    userId={session?.user?.id} 
                    limit={5}
                    showPagination={false}
                  />
                </CardContent>
              </Card>

              {/* Acciones Rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myStats.pendingToWrite > 0 && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-orange-800">
                            Reviews Pendientes
                          </h4>
                          <p className="text-sm text-orange-600">
                            Tienes {myStats.pendingToWrite} proyectos completados esperando tu review
                          </p>
                        </div>
                        <Button 
                          onClick={() => setActiveTab('write')}
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Escribir Reviews
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('browse')}
                      className="h-20 flex-col"
                    >
                      <Search className="h-6 w-6 mb-2" />
                      Explorar Reviews
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('analytics')}
                      className="h-20 flex-col"
                    >
                      <BarChart3 className="h-6 w-6 mb-2" />
                      Ver Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="write">
            <EligibleReviewsList eligibleReviews={eligibleReviews} onReviewCreated={fetchDashboardData} />
          </TabsContent>

          <TabsContent value="my-reviews">
            <MyReviewsList />
          </TabsContent>

          <TabsContent value="browse">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Explorar Reviews de la Comunidad</h3>
                  <p className="text-muted-foreground">
                    Descubre las experiencias de otros usuarios en el marketplace
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Buscar por empresa o usuario..." 
                    className="w-64"
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Lista general de reviews públicos */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Función en Desarrollo</h4>
                    <p className="text-muted-foreground">
                      La exploración de reviews públicos estará disponible pronto
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <ReviewAnalytics />
          </TabsContent>

          <TabsContent value="profile">
            {session?.user?.id && <UserRatingCard userId={session.user.id} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
