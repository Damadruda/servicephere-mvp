
import { Suspense } from 'react'
import { ProjectsExplorer } from '@/components/projects/projects-explorer'
import { SAPChatBot } from '@/components/sap-chatbot'

export const metadata = {
  title: 'Explorar Proyectos SAP - SAP Marketplace',
  description: 'Descubre oportunidades de proyectos SAP disponibles para consultores'
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Proyectos SAP Disponibles</h1>
          <p className="text-muted-foreground">
            Encuentra oportunidades de implementación y consultoría SAP
          </p>
        </div>
        
        <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
          <ProjectsExplorer />
        </Suspense>
      </main>
      <SAPChatBot />
    </div>
  )
}
