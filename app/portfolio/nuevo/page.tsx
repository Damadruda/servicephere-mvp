
'use client'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function NuevoPortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">Agregar Proyecto al Portfolio</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre del Proyecto
                  </label>
                  <input 
                    type="text" 
                    placeholder="ej. Implementación S/4HANA para Manufactura"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cliente (Opcional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="ej. Empresa ABC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción del Proyecto
                </label>
                <textarea 
                  rows={4}
                  placeholder="Describe los objetivos, alcance y resultados obtenidos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Módulos SAP Implementados
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                    <Badge variant="outline">FI</Badge>
                    <Badge variant="outline">CO</Badge>
                    <Badge variant="outline">MM</Badge>
                    <Badge variant="outline">SD</Badge>
                    <Button variant="ghost" size="sm" onClick={() => alert('Función en desarrollo')}>
                      + Agregar
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Industria
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Seleccionar industria</option>
                    <option>Manufactura</option>
                    <option>Retail</option>
                    <option>Servicios Financieros</option>
                    <option>Healthcare</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duración (meses)
                  </label>
                  <input 
                    type="number" 
                    placeholder="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tamaño del Equipo
                  </label>
                  <input 
                    type="number" 
                    placeholder="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Año de Finalización
                  </label>
                  <input 
                    type="number" 
                    placeholder="2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Resultados Clave
                </label>
                <textarea 
                  rows={3}
                  placeholder="ej. Reducción del 30% en tiempo de procesamiento de órdenes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    alert('Proyecto agregado al portfolio exitosamente')
                    window.location.href = '/dashboard'
                  }}
                >
                  Agregar al Portfolio
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
