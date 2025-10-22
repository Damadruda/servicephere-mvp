
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { MessageSquare, Clock, ThumbsUp, AlertCircle, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ChatAnalyticsProps {
  isAdmin?: boolean
}

export default function ChatAnalytics({ isAdmin = false }: ChatAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const [type, setType] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [period, type])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ period })
      if (isAdmin) {
        params.append('type', type)
      }
      
      const response = await fetch(`/api/chat/analytics?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
      } else {
        toast.error('Error cargando analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No se pudieron cargar los analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Chat Analytics</h2>
          <p className="text-gray-600">
            {isAdmin ? 'Vista completa del sistema' : 'Tus estadísticas personales'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
            </SelectContent>
          </Select>
          
          {isAdmin && (
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">General</SelectItem>
                <SelectItem value="queries">Consultas</SelectItem>
                <SelectItem value="satisfaction">Satisfacción</SelectItem>
                <SelectItem value="resolution">Resolución</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* User Analytics (Non-admin) */}
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Consultas</p>
                  <p className="text-2xl font-bold">{analytics.totalQueries}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesiones</p>
                  <p className="text-2xl font-bold">{analytics.sessionsCount}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfacción</p>
                  <p className="text-2xl font-bold">
                    {analytics.avgSatisfaction ? `${analytics.avgSatisfaction.toFixed(1)}/5` : 'N/A'}
                  </p>
                </div>
                <ThumbsUp className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolución</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(analytics.resolutionStats).map(([key, value]: [string, any]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Analytics */}
      {isAdmin && type === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Consultas</p>
                  <p className="text-2xl font-bold">{analytics.totalQueries}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesiones</p>
                  <p className="text-2xl font-bold">{analytics.totalSessions}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Únicos</p>
                  <p className="text-2xl font-bold">{analytics.uniqueUsers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                  <p className="text-2xl font-bold">
                    {analytics.avgResponseTime ? `${analytics.avgResponseTime.toFixed(1)}s` : 'N/A'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consultas/Sesión</p>
                  <p className="text-2xl font-bold">{analytics.queriesPerSession}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isAdmin && type === 'queries' && analytics.queryTypes && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Consulta</CardTitle>
              <CardDescription>Distribución por tipo de consulta</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.queryTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorías de Consulta</CardTitle>
              <CardDescription>Consultas por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.queryCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, count }) => `${category}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.queryCategories.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${index * 45}, 70%, 60%)`} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {isAdmin && type === 'satisfaction' && analytics.distribution && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Satisfacción General</CardTitle>
              <CardDescription>Promedio: {analytics.avgSatisfaction?.toFixed(1)}/5</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {analytics.avgSatisfaction?.toFixed(1) || 'N/A'}
                </div>
                <p className="text-gray-600">de 5 estrellas</p>
                <p className="text-sm text-gray-500 mt-2">
                  Basado en {analytics.totalRatings} calificaciones
                </p>
              </div>
              
              <Progress 
                value={(analytics.avgSatisfaction / 5) * 100} 
                className="h-3" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Ratings</CardTitle>
              <CardDescription>Cantidad por rating</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {isAdmin && type === 'resolution' && analytics.resolutionStats && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Resolución</CardTitle>
            <CardDescription>Tiempo de respuesta por tipo de resolución</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {analytics.resolutionStats.map((stat: any) => (
                <div key={stat.resolution} className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold">{stat.resolution}</h3>
                  <p className="text-2xl font-bold text-blue-600">{stat.count}</p>
                  <p className="text-sm text-gray-600">
                    Promedio: {stat.avgResponseTime.toFixed(1)}s
                  </p>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.resolutionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="resolution" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
