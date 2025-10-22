
'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ChatBot from '@/components/chat/ChatBot'
import ChatAnalytics from '@/components/chat/ChatAnalytics'
import { MessageSquare, BarChart3, BookOpen, Settings, HelpCircle, Zap, Users, TrendingUp } from 'lucide-react'

export default function ChatBotPage() {
  const { data: session, status } = useSession() || {}
  const [selectedTab, setSelectedTab] = useState('chat')

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/login')
  }

  const isAdmin = session?.user?.userType === 'ADMIN' as any

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Chatbot SAP
            </h1>
            <p className="text-gray-600">
              Asistencia inteligente contextual para el marketplace SAP
            </p>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Project Scoping</h3>
                  <p className="text-sm text-gray-600">Módulos, presupuestos, timelines</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Technical Consultation</h3>
                  <p className="text-sm text-gray-600">Arquitectura, metodologías</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Platform Support</h3>
                  <p className="text-sm text-gray-600">Navegación, best practices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Knowledge Base</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[700px]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Chat Interface</span>
                  </CardTitle>
                  <CardDescription>
                    Conversa con el asistente SAP para obtener ayuda especializada
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[600px] p-0">
                  <div className="h-full w-full relative">
                    <ChatBot className="static w-full h-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Tips */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Tips para mejores resultados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2">Para Clientes</Badge>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• "¿Qué módulos SAP necesito?"</li>
                      <li>• "¿Cuánto cuesta S/4HANA?"</li>
                      <li>• "¿Cuánto tarda la implementación?"</li>
                    </ul>
                  </div>
                  
                  <div>
                    <Badge variant="outline" className="mb-2">Para Proveedores</Badge>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• "¿SAP Activate o ASAP?"</li>
                      <li>• "¿On-premise o cloud?"</li>
                      <li>• "¿Qué certificaciones necesito?"</li>
                    </ul>
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">Soporte General</Badge>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• "¿Cómo publicar proyecto?"</li>
                      <li>• "¿Cómo escribir cotización?"</li>
                      <li>• "¿Cómo funciona escrow?"</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Estado del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-medium">En línea</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tiempo de respuesta promedio: ~2s
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <ChatAnalytics isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="knowledge" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Base de Conocimientos SAP</CardTitle>
                  <CardDescription>
                    Artículos y guías que alimentan las respuestas del chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { category: 'Módulos', count: 15, color: 'blue' },
                        { category: 'Implementación', count: 12, color: 'green' },
                        { category: 'Pricing', count: 8, color: 'yellow' },
                        { category: 'Metodología', count: 10, color: 'purple' },
                        { category: 'Arquitectura', count: 6, color: 'pink' },
                        { category: 'Certificaciones', count: 9, color: 'indigo' }
                      ].map((item) => (
                        <Card key={item.category} className="border-2 border-dashed">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{item.category}</span>
                              <Badge variant="secondary">{item.count} artículos</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Total Artículos</span>
                      <span className="font-semibold">60</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Más Útiles</span>
                      <span className="text-green-600 font-semibold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Actualizados</span>
                      <span className="text-blue-600 font-semibold">última semana</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isAdmin && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Gestionar Artículos
                    </Button>
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Ver Métricas Completas
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Chat</CardTitle>
                <CardDescription>
                  Configura cómo interactúa contigo el asistente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Idioma preferido</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nivel de detalle</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="basic">Básico</option>
                    <option value="detailed">Detallado</option>
                    <option value="expert">Experto</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="proactive" className="rounded" />
                  <label htmlFor="proactive" className="text-sm">
                    Recibir sugerencias proactivas
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Gestiona cómo recibes las notificaciones del chat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email" className="rounded" defaultChecked />
                  <label htmlFor="email" className="text-sm">
                    Notificaciones por email
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="browser" className="rounded" defaultChecked />
                  <label htmlFor="browser" className="text-sm">
                    Notificaciones del navegador
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="insights" className="rounded" />
                  <label htmlFor="insights" className="text-sm">
                    Insights semanales
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
