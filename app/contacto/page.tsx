
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">Contacto</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Email General</h3>
                  <p className="text-muted-foreground">info@sapmarketplace.com</p>
                </div>
                <div>
                  <h3 className="font-semibold">Soporte Técnico</h3>
                  <p className="text-muted-foreground">soporte@sapmarketplace.com</p>
                </div>
                <div>
                  <h3 className="font-semibold">Ventas y Partnerships</h3>
                  <p className="text-muted-foreground">ventas@sapmarketplace.com</p>
                </div>
                <div>
                  <h3 className="font-semibold">Teléfono</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Envíanos un Mensaje</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input 
                    type="text" 
                    id="nombre" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium mb-2">
                    Mensaje
                  </label>
                  <textarea 
                    id="mensaje" 
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Enviar Mensaje
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
