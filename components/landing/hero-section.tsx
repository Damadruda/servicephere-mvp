
'use client'

import { Button } from '@/components/ui/button'
import { Search, Users, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Transforma tu contratación de{' '}
                <span className="text-primary">servicios empresariales</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Plataforma innovadora que conecta empresas con Partners SAP 
                y partners de élite. Gestiona proyectos con seguridad garantizada y 
                transparencia total. Tu transformación digital comienza aquí.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base">
                <Link href="/servicios">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Servicios
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-base">
                <Link href="/registro">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Ofrecer Servicios
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>500+ Partners certificados</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span>1000+ Proyectos exitosos</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <Image
                src="https://www.geckoboard.com/uploads/Sales-YTD-dashboard-example-1efebb.png"
                alt="Servicephere - Dashboard Analytics de Servicios Empresariales"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
