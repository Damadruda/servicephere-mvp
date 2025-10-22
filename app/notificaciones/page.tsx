
'use client'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function NotificacionesPage() {
  const notificaciones = [
    {
      id: 1,
      tipo: "nueva_cotizacion",
      titulo: "Nueva cotización recibida",
      mensaje: "SAP Experts Global ha enviado una cotización para tu proyecto de migración S/4HANA",
      fecha: "Hace 1 hora",
      leida: false
    },
    {
      id: 2,
      tipo: "proyecto_actualizado",
      titulo: "Proyecto actualizado",
      mensaje: "El estado de tu proyecto 'Implementación SuccessFactors' ha cambiado a 'En Progreso'",
      fecha: "Hace 3 horas",
      leida: false
    },
    {
      id: 3,
      tipo: "mensaje",
      titulo: "Nuevo mensaje",
      mensaje: "Innovate SAP Solutions te ha enviado un mensaje sobre el proyecto de integración",
      fecha: "Ayer",
      leida: true
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-primary">Notificaciones</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alert('Todas las notificaciones marcadas como leídas')}
            >
              Marcar todas como leídas
            </Button>
          </div>
          
          <div className="space-y-4">
            {notificaciones.map((notif) => (
              <Card 
                key={notif.id} 
                className={`cursor-pointer transition-colors ${!notif.leida ? 'border-primary/20 bg-primary/5' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notif.titulo}</h3>
                        {!notif.leida && <Badge variant="destructive" className="text-xs">Nuevo</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notif.mensaje}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notif.fecha}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => alert('Abriendo notificación...')}
                    >
                      Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {notificaciones.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    No tienes notificaciones pendientes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
