
import { Suspense } from 'react'
import { ServicesExplorer } from '@/components/services/services-explorer'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SAPChatBot } from '@/components/sap-chatbot'

export const metadata = {
  title: 'Explorar Servicios SAP - SAP Marketplace',
  description: 'Encuentra los mejores consultores y partners SAP certificados para tu proyecto'
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorar Servicios SAP</h1>
          <p className="text-muted-foreground">
            Encuentra consultores certificados y partners SAP para tu proyecto de transformación digital
          </p>
        </div>
        
        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <ServicesExplorer />
        </Suspense>
      </main>
      <Footer />
      <SAPChatBot />
    </div>
  )
}
