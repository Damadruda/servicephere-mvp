
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">Centro de Ayuda</h1>
          
          <div className="grid gap-6">
            <section className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Preguntas Frecuentes</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">¿Cómo funciona el marketplace?</h3>
                  <p className="text-muted-foreground">
                    Las empresas publican sus necesidades de proyectos SAP y reciben 
                    cotizaciones privadas de consultoras verificadas. También pueden 
                    explorar servicios disponibles y contactar directamente a proveedores.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">¿Cómo se verifican las certificaciones?</h3>
                  <p className="text-muted-foreground">
                    Validamos todas las certificaciones SAP directamente con la base 
                    de datos oficial de SAP y verificamos el estatus de Partner cuando aplique.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">¿Qué garantías ofrecen?</h3>
                  <p className="text-muted-foreground">
                    Facilitamos la comunicación y gestión de pagos, pero los contratos 
                    son directamente entre cliente y proveedor. Ofrecemos sistema de 
                    calificaciones para transparencia.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
              <p className="text-muted-foreground">
                ¿Necesitas ayuda adicional? Contáctanos en:
              </p>
              <div className="mt-4">
                <p><strong>Email:</strong> soporte@sapmarketplace.com</p>
                <p><strong>Teléfono:</strong> +1 (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
