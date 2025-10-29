
'use client'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function MensajesPage() {
  const conversaciones = [
    {
      id: 1,
      empresa: "SAP Experts Global",
      ultimoMensaje: "Hemos revisado tu proyecto y tenemos algunas preguntas...",
      fecha: "Hace 2 horas",
      noLeidos: 2,
      proyecto: "Migración S/4HANA"
    },
    {
      id: 2,
      empresa: "Innovate SAP Solutions",
      ultimoMensaje: "Adjuntamos la propuesta técnica solicitada",
      fecha: "Ayer",
      noLeidos: 0,
      proyecto: "Implementación SuccessFactors"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">Mensajes</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Conversaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {conversaciones.map((conv) => (
                    <div 
                      key={conv.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{conv.empresa}</h3>
                        {conv.noLeidos > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conv.noLeidos}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {conv.proyecto}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.ultimoMensaje}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conv.fecha}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <CardHeader className="border-b">
                  <CardTitle>SAP Experts Global</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Migración S/4HANA - Último mensaje hace 2 horas
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col h-full p-0">
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg max-w-xs">
                        <p className="text-sm">
                          Hemos revisado tu proyecto de migración. ¿Podrías 
                          proporcionarnos más detalles sobre las customizaciones actuales?
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Hace 2 horas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                        <p className="text-sm">
                          Claro, adjunto el documento con todas las customizaciones.
                        </p>
                        <p className="text-xs opacity-80 mt-1">
                          Hace 1 hora
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <Button onClick={() => alert('Mensaje enviado')}>
                        Enviar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
