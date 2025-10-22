
'use client'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProveedorDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">SAP Experts Global</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>Gold Partner</Badge>
                    <Badge variant="outline">Verificado</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Consultora especializada en implementaciones SAP S/4HANA con más de 15 años 
                    de experiencia. Hemos completado más de 200 proyectos exitosos en América Latina.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Especializaciones</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">S/4HANA</Badge>
                        <Badge variant="secondary">SuccessFactors</Badge>
                        <Badge variant="secondary">Ariba</Badge>
                        <Badge variant="secondary">BTP</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Certificaciones</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">FI Specialist</Badge>
                        <Badge variant="secondary">MM Professional</Badge>
                        <Badge variant="secondary">SD Specialist</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio de Proyectos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold">Migración S/4HANA - Empresa Manufacturera</h3>
                      <p className="text-sm text-muted-foreground">
                        Migración completa de SAP ECC a S/4HANA Cloud para empresa con 500+ usuarios
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">FI</Badge>
                        <Badge variant="outline">CO</Badge>
                        <Badge variant="outline">MM</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-semibold">País:</span>
                    <p className="text-muted-foreground">México</p>
                  </div>
                  <div>
                    <span className="font-semibold">Empleados:</span>
                    <p className="text-muted-foreground">51-100</p>
                  </div>
                  <div>
                    <span className="font-semibold">Fundada:</span>
                    <p className="text-muted-foreground">2008</p>
                  </div>
                  <div>
                    <span className="font-semibold">Calificación:</span>
                    <p className="text-muted-foreground">4.8/5 (32 reviews)</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => window.location.href = `/proveedores/${params.id}/contactar`}>
                    Contactar Proveedor
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => alert('Función en desarrollo - Ver portfolio completo')}
                  >
                    Ver Portfolio Completo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => alert('Función en desarrollo - Solicitar cotización')}
                  >
                    Solicitar Cotización
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
