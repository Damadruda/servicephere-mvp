
'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Award, Building, TrendingUp, Users } from 'lucide-react'

interface StatProps {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
}

function AnimatedStat({ icon, value, label, suffix = '' }: StatProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        const increment = value / 50
        const interval = setInterval(() => {
          setCount((prev) => {
            if (prev >= value) {
              clearInterval(interval)
              return value
            }
            return Math.min(prev + increment, value)
          })
        }, 30)
        return () => clearInterval(interval)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center group"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div className="text-3xl lg:text-4xl font-bold text-foreground">
        {Math.round(count)}{suffix}
      </div>
      <div className="text-muted-foreground mt-1">{label}</div>
    </motion.div>
  )
}

export function StatsSection() {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: 500,
      label: 'Partners Certificados',
      suffix: '+'
    },
    {
      icon: <Building className="h-8 w-8 text-primary" />,
      value: 1000,
      label: 'Proyectos Completados',
      suffix: '+'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      value: 95,
      label: 'Tasa de Éxito',
      suffix: '%'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      value: 250,
      label: 'Empresas Transformadas',
      suffix: '+'
    }
  ]

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Transformando empresas con <span className="text-primary">SAP®</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nuestros números reflejan la excelencia y la confianza que miles de empresas 
            han depositado en Servicephere y nuestros partners certificados.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
