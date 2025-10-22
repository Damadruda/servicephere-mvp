
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import ChatBot from '@/components/chat/ChatBot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Servicephere - Conecta tu empresa con expertos certificados SAP®',
  description: 'Plataforma innovadora que transforma la contratación de servicios empresariales. Conecta tu empresa con Partners SAP, compara propuestas inteligentemente y gestiona proyectos con seguridad garantizada.',
  keywords: [
    'Servicephere',
    'Partners SAP',
    'servicios SAP®',
    'implementación SAP®',
    'S/4HANA®',
    'marketplace B2B',
    'SAP® FI',
    'SAP® MM', 
    'SAP® SD',
    'SAP® HR',
    'expertos certificados',
    'plataforma empresarial',
    'soluciones tecnológicas'
  ],
  authors: [{ name: 'Servicephere Team' }],
  openGraph: {
    title: 'Servicephere - Transforma tu contratación de servicios empresariales',
    description: 'Conecta tu empresa con Partners SAP y gestiona proyectos con seguridad garantizada',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Servicephere',
    images: [
      {
        url: '/servicephere-logo.png',
        width: 1200,
        height: 630,
        alt: 'Servicephere - Plataforma de servicios empresariales'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicephere - Conecta con Partners SAP',
    description: 'Plataforma innovadora para contratar servicios empresariales especializados',
    images: ['/servicephere-logo.png']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          
          {/* Floating ChatBot */}
          <ChatBot />
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
