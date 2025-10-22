
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-32 w-96 flex-shrink-0">
              <Image
                src="/servicephere-logo-specs.png"
                alt="Servicephere"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/acerca" className="hover:text-primary transition-colors">
              Acerca de
            </Link>
            <Link href="/contacto" className="hover:text-primary transition-colors">
              Contacto
            </Link>
            <Link href="/ayuda" className="hover:text-primary transition-colors">
              Ayuda
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          © 2025 Servicephere. Transformando la contratación de servicios empresariales - Conectando empresas con expertos SAP® certificados.
        </div>
      </div>
    </footer>
  )
}
