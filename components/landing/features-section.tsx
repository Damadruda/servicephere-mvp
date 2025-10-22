
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Shield, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Award, 
  Zap 
} from 'lucide-react'

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Partners Verificados',
    description: 'Todos nuestros consultores están certificados y verificados por SAP®.'
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Búsqueda Inteligente',
    description: 'Encuentra expertos por módulo SAP®, industria y nivel de certificación con IA.'
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Comunicación Directa',
    description: 'Chatea directamente con consultores y gestiona todo desde la plataforma.'
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Pagos Seguros',
    description: 'Sistema de escrow y procesamiento seguro con transparencia total.'
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Garantía de Calidad',
    description: 'Sistema de reseñas y calificaciones para asegurar la mejor experiencia.'
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Asistente SAP® AI',
    description: 'Chatbot especialista que te guía en cada paso de tu proyecto.'
  }
]

export function FeaturesSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-4xl font-bold mb-4"
          >
            ¿Por qué elegir <span className="text-primary">Servicephere</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Plataforma innovadora que revoluciona la contratación de servicios empresariales. 
            Simplifica la búsqueda, contratación y gestión de proyectos SAP® especializados 
            con tecnología de vanguardia.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 rounded-lg border bg-card card-hover"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
