
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AcercaPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">Acerca de SAP Marketplace</h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
              <p className="text-muted-foreground leading-relaxed">
                SAP Marketplace es la plataforma líder B2B que conecta empresas que necesitan 
                servicios SAP con consultoras y partners certificados de clase mundial. 
                Facilitamos el acceso a expertise especializado en implementación, 
                consultoría y soporte de todas las soluciones SAP.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">¿Por qué SAP Marketplace?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Para Empresas</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Acceso a consultores SAP verificados</li>
                    <li>• Cotizaciones competitivas</li>
                    <li>• Transparencia en precios y timelines</li>
                    <li>• Calificaciones y referencias reales</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Para Proveedores</h3>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Oportunidades globales de proyectos</li>
                    <li>• Validación de expertise y certificaciones</li>
                    <li>• Herramientas de gestión de propuestas</li>
                    <li>• Crecimiento de portfolio</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Nuestro Compromiso</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nos especializamos exclusivamente en el ecosistema SAP, garantizando 
                que tanto clientes como proveedores encuentren exactamente lo que necesitan 
                para el éxito de sus proyectos de transformación digital.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
