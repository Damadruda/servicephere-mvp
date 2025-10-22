
'use client'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProyectoDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge variant="outline" className="mb-2">Proyecto Activo</Badge>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Migración SAP ECC a S/4HANA Cloud
            </h1>
            <p className="text-muted-foreground">
              Publicado hace 3 días • ID: {params.id}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Descripción del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Empresa manufacturera busca migrar de SAP ECC 6.0 a S/4HANA Cloud. 
                    Operamos en 3 países con 500+ usuarios. Requerimos migración completa 
                    con mínimo downtime.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2">Módulos Actuales</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">FI</Badge>
                        <Badge variant="secondary">CO</Badge>
                        <Badge variant="secondary">MM</Badge>
                        <Badge variant="secondary">SD</Badge>
                        <Badge variant="secondary">PP</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Industria</h3>
                      <Badge>Manufactura</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requerimientos Técnicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Migración de datos históricos (5 años)</li>
                    <li>Integración con sistemas legacy</li>
                    <li>Capacitación de usuarios finales</li>
                    <li>Soporte post Go-Live (6 meses)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Proyecto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-semibold">Presupuesto:</span>
                    <p className="text-muted-foreground">$500K - $1M USD</p>
                  </div>
                  <div>
                    <span className="font-semibold">Timeline:</span>
                    <p className="text-muted-foreground">12-18 meses</p>
                  </div>
                  <div>
                    <span className="font-semibold">Ubicación:</span>
                    <p className="text-muted-foreground">México, Colombia, Perú</p>
                  </div>
                  <div>
                    <span className="font-semibold">Cotizaciones:</span>
                    <p className="text-muted-foreground">8 recibidas</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => alert('Función de cotización en desarrollo')}
                  >
                    Enviar Cotización
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/mensajes'}
                  >
                    Contactar Cliente
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => alert('Proyecto guardado en favoritos')}
                  >
                    Guardar Proyecto
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
