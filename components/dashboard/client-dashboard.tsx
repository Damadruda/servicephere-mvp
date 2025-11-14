
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Briefcase, MessageSquare, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { SAPChatBot } from '@/components/sap-chatbot'
import { Project, Quotation } from '@/lib/types'
import { motion } from 'framer-motion'

export function ClientDashboard() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingQuotations: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, quotationsRes, statsRes] = await Promise.all([
        fetch('/api/projects/my-projects'),
        fetch('/api/quotations/received'),
        fetch('/api/dashboard/client-stats')
      ])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData)
      }

      if (quotationsRes.ok) {
        const quotationsData = await quotationsRes.json()
        setQuotations(quotationsData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-blue-500'
      case 'IN_PROGRESS': return 'bg-yellow-500'
      case 'COMPLETED': return 'bg-green-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getQuotationStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-500'
      case 'ACCEPTED': return 'bg-green-500'
      case 'REJECTED': return 'bg-red-500'
      case 'WITHDRAWN': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido de vuelta, {session?.user?.name}
            </p>
          </div>
          <Button asChild>
            <Link href="/proyectos/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proyectos Totales</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  Proyectos creados
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  En progreso
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cotizaciones Pendientes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingQuotations}</div>
                <p className="text-xs text-muted-foreground">
                  Por revisar
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  En proyectos SAP
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Mis Proyectos</TabsTrigger>
            <TabsTrigger value="quotations">
              Cotizaciones Recibidas
              {stats.pendingQuotations > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {stats.pendingQuotations}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            {projects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay proyectos</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Comienza publicando tu primer proyecto SAP y conecta con expertos.
                  </p>
                  <Button asChild>
                    <Link href="/proyectos/nuevo">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Proyecto
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="card-hover">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <CardDescription>{project.industry} • {project.sapModules.join(', ')}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(project.status)} text-white`}>
                              {project.status === 'PUBLISHED' ? 'Publicado' :
                               project.status === 'IN_PROGRESS' ? 'En Progreso' :
                               project.status === 'COMPLETED' ? 'Completado' :
                               project.status === 'CANCELLED' ? 'Cancelado' : 'Borrador'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {project._count?.quotations || 0} cotizaciones
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Presupuesto: {project.budget} • Timeline: {project.timeline}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/proyectos/${project.id}`}>
                              Ver Detalles
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quotations" className="space-y-4">
            {quotations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay cotizaciones</h3>
                  <p className="text-muted-foreground text-center">
                    Las cotizaciones de los proveedores aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {quotations.map((quotation) => (
                  <motion.div
                    key={quotation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="card-hover">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{quotation.title}</CardTitle>
                            <CardDescription>
                              Para: {quotation.project.title} • {quotation.provider.name}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getQuotationStatusColor(quotation.status)} text-white`}>
                              {quotation.status === 'PENDING' ? 'Pendiente' :
                               quotation.status === 'ACCEPTED' ? 'Aceptada' :
                               quotation.status === 'REJECTED' ? 'Rechazada' : 'Retirada'}
                            </Badge>
                            <span className="text-lg font-semibold">
                              ${quotation.totalCost.toLocaleString()} {quotation.currency}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {quotation.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Timeline: {quotation.timeline} • Metodología: {quotation.methodology}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/cotizaciones/${quotation.id}`}>
                              Ver Cotización
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <SAPChatBot />
    </div>
  )
}
