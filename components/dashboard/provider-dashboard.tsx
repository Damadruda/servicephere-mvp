
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Briefcase, MessageSquare, Star, DollarSign, Award } from 'lucide-react'
import Link from 'next/link'
import { SAPChatBot } from '@/components/sap-chatbot'
import { SetupWizard } from '@/components/onboarding/setup-wizard'
import { Project, Quotation, PortfolioItem } from '@/lib/types'
import { motion } from 'framer-motion'

export function ProviderDashboard() {
  const { data: session } = useSession()
  const [opportunities, setOpportunities] = useState<Project[]>([])
  const [myQuotations, setMyQuotations] = useState<Quotation[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [stats, setStats] = useState({
    totalQuotations: 0,
    acceptedQuotations: 0,
    totalEarnings: 0,
    averageRating: 0,
    profileViews: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('opportunities')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [opportunitiesRes, quotationsRes, portfolioRes, statsRes] = await Promise.all([
        fetch('/api/projects/opportunities'),
        fetch('/api/quotations/my-quotations'),
        fetch('/api/portfolio/my-items'),
        fetch('/api/dashboard/provider-stats')
      ])

      if (opportunitiesRes.ok) {
        const opportunitiesData = await opportunitiesRes.json()
        setOpportunities(opportunitiesData)
      }

      if (quotationsRes.ok) {
        const quotationsData = await quotationsRes.json()
        setMyQuotations(quotationsData)
      }

      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json()
        setPortfolio(portfolioData)
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
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
            <h1 className="text-3xl font-bold">Dashboard del Proveedor</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus servicios y oportunidades SAP
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href="/perfil">
                <Award className="h-4 w-4 mr-2" />
                Mi Perfil
              </Link>
            </Button>
            <Button asChild>
              <Link href="/portfolio/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Proyecto
              </Link>
            </Button>
          </div>
        </div>

        {/* Setup Wizard for new providers */}
        <div className="mb-8">
          <SetupWizard />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuotations}</div>
                <p className="text-xs text-muted-foreground">
                  Enviadas
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
                <CardTitle className="text-sm font-medium">Aceptadas</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.acceptedQuotations}</div>
                <p className="text-xs text-muted-foreground">
                  Proyectos ganados
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
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.totalEarnings.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total generado
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
                <CardTitle className="text-sm font-medium">Calificación</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Promedio
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vistas</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.profileViews}</div>
                <p className="text-xs text-muted-foreground">
                  Del perfil
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="opportunities" onClick={() => setActiveTab('opportunities')}>
              Nuevas Oportunidades
              {opportunities.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {opportunities.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="quotations" onClick={() => setActiveTab('quotations')}>Mis Cotizaciones</TabsTrigger>
            <TabsTrigger value="portfolio" onClick={() => setActiveTab('portfolio')}>Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            {opportunities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay oportunidades nuevas</h3>
                  <p className="text-muted-foreground text-center">
                    Las nuevas oportunidades de proyectos SAP aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {opportunities.map((project) => (
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
                            <CardDescription>
                              {project.industry} • {project.sapModules.join(', ')} • {project.client.name}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-600">
                              {project.budget}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {project.timeline}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            📍 {project.country} {project.isRemote && '• Remoto disponible'}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/proyectos/${project.id}`}>
                                Ver Detalles
                              </Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/proyectos/${project.id}/cotizar`}>
                                Enviar Cotización
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quotations" className="space-y-4">
            {myQuotations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay cotizaciones</h3>
                  <p className="text-muted-foreground text-center">
                    Tus cotizaciones enviadas aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myQuotations.map((quotation) => (
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
                              Para: {quotation.project.title}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(quotation.status)} text-white`}>
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

          <TabsContent value="portfolio" className="space-y-4">
            {portfolio.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Award className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Portfolio vacío</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Muestra tus proyectos exitosos para atraer más clientes.
                  </p>
                  <Button asChild>
                    <Link href="/portfolio/nuevo">
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Proyecto
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="card-hover">
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>
                          {item.industry} • {item.sapModules.join(', ')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>{item.methodology} • {item.duration}</span>
                          <span>{item.projectValue}</span>
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
