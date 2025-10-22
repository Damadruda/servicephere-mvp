
'use client'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactarProveedorPage({ params }: { params: { id: string } }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Mensaje enviado exitosamente')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">Contactar Proveedor</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>SAP Experts Global</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>País:</strong> México</p>
                  <p><strong>Especialización:</strong> S/4HANA, SuccessFactors</p>
                  <p><strong>Partner Level:</strong> Gold Partner</p>
                  <p><strong>Calificación:</strong> 4.8/5 (32 reviews)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enviar Mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Asunto
                    </label>
                    <input 
                      type="text" 
                      placeholder="ej. Consulta sobre migración S/4HANA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensaje
                    </label>
                    <textarea 
                      rows={6}
                      placeholder="Describe tu proyecto y qué tipo de servicios necesitas..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Presupuesto Aproximado
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Seleccionar rango</option>
                      <option>$50K - $100K USD</option>
                      <option>$100K - $250K USD</option>
                      <option>$250K - $500K USD</option>
                      <option>$500K+ USD</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
