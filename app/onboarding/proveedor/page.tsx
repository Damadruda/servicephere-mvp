
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tooltip } from '@/components/ui/tooltip'
import { CheckCircle, AlertCircle, Upload, Plus, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

export default function ProviderOnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    companyName: '',
    legalName: '',
    taxId: '',
    website: '',
    foundedYear: 2020,
    employeeCount: '11-50',
    country: '',
    city: '',
    
    // Paso 2: Descripción de servicios
    description: '',
    specializations: [] as string[],
    industries: [] as string[],
    sapPartnerLevel: '',
    
    // Paso 3: Certificaciones
    certifications: [] as any[],
    
    // Paso 4: Portfolio
    portfolioProjects: [] as any[],
    
    // Paso 5: Contacto y verificación
    contactName: '',
    contactTitle: '',
    phoneNumber: '',
    linkedinProfile: '',
  })

  const steps: OnboardingStep[] = [
    {
      id: 'basic-info',
      title: 'Información Básica',
      description: 'Datos legales y corporativos de tu empresa',
      completed: false,
      required: true
    },
    {
      id: 'services',
      title: 'Servicios SAP',
      description: 'Especializations y nivel de partner SAP',
      completed: false,
      required: true
    },
    {
      id: 'certifications',
      title: 'Certificaciones',
      description: 'Certificaciones SAP del equipo',
      completed: false,
      required: true
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Proyectos anteriores y casos de éxito',
      completed: false,
      required: true
    },
    {
      id: 'verification',
      title: 'Verificación',
      description: 'Contacto y documentos de verificación',
      completed: false,
      required: true
    },
    {
      id: 'review',
      title: 'Revisión Final',
      description: 'Confirma tu información y envía para aprobación',
      completed: false,
      required: true
    }
  ]

  const progress = (currentStep + 1) / steps.length * 100

  const sapModules = [
    'FI (Finanzas)', 'CO (Controlling)', 'MM (Materiales)', 'SD (Ventas)',
    'PP (Producción)', 'HCM/SuccessFactors', 'Ariba', 'Concur', 'S/4HANA',
    'BTP', 'Analytics Cloud', 'Integration'
  ]

  const industries = [
    'Manufactura', 'Retail', 'Servicios Financieros', 'Healthcare',
    'Petróleo y Gas', 'Utilities', 'Gobierno', 'Educación'
  ]

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const validateCurrentStep = () => {
    // Validación básica por step
    switch (currentStep) {
      case 0:
        return formData.companyName && formData.country && formData.city
      case 1:
        return formData.description && formData.specializations.length > 0
      case 2:
        return formData.certifications.length > 0
      case 3:
        return formData.portfolioProjects.length >= 2
      case 4:
        return formData.contactName && formData.phoneNumber
      default:
        return true
    }
  }

  const handleSpecializationToggle = (specialization: string) => {
    const current = formData.specializations
    const index = current.indexOf(specialization)
    
    if (index > -1) {
      setFormData({
        ...formData,
        specializations: current.filter(s => s !== specialization)
      })
    } else {
      setFormData({
        ...formData,
        specializations: [...current, specialization]
      })
    }
  }

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        {
          id: Date.now(),
          module: '',
          level: 'Associate',
          consultant: '',
          certificationNumber: '',
          expiryDate: '',
          document: null,
          verified: false
        }
      ]
    })
  }

  const addPortfolioProject = () => {
    setFormData({
      ...formData,
      portfolioProjects: [
        ...formData.portfolioProjects,
        {
          id: Date.now(),
          title: '',
          client: '',
          description: '',
          modules: [],
          duration: '',
          teamSize: '',
          budget: '',
          results: '',
          completedYear: new Date().getFullYear()
        }
      ]
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/onboarding/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/onboarding/confirmacion')
      } else {
        alert('Error al enviar la información. Por favor intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión. Por favor intenta de nuevo.')
    }
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Onboarding de Proveedor SAP
          </h1>
          <p className="text-muted-foreground">
            Completa tu perfil para comenzar a recibir oportunidades de proyectos SAP
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">
                Paso {currentStep + 1} de {steps.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% completado
              </div>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-xs">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center ${
                    index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  ) : index === currentStep ? (
                    <div className="w-4 h-4 rounded-full bg-primary mr-1" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground mr-1" />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Información Básica de la Empresa
                    <Tooltip content="Esta información será visible en tu perfil público">
                      <HelpCircle className="w-4 h-4 ml-2 text-muted-foreground" />
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nombre Comercial *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="ej. SAP Experts Global"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Razón Social *
                      </label>
                      <input
                        type="text"
                        value={formData.legalName}
                        onChange={(e) => setFormData({...formData, legalName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Nombre legal completo"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        RUC/NIT/Tax ID *
                      </label>
                      <input
                        type="text"
                        value={formData.taxId}
                        onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://www.empresa.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Año de Fundación
                      </label>
                      <input
                        type="number"
                        value={formData.foundedYear}
                        onChange={(e) => setFormData({...formData, foundedYear: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Número de Empleados
                      </label>
                      <select
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-100">51-100</option>
                        <option value="101-500">101-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        País *
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccionar país</option>
                        <option value="Mexico">México</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Peru">Perú</option>
                        <option value="Chile">Chile</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Brasil">Brasil</option>
                        <option value="España">España</option>
                        <option value="USA">Estados Unidos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Ciudad principal"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Servicios y Especializations SAP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descripción de Servicios *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Describe los servicios SAP que ofrece tu empresa, experiencia y diferenciadores..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Especializations en Módulos SAP * (selecciona al menos 1)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {sapModules.map((module) => (
                        <div
                          key={module}
                          onClick={() => handleSpecializationToggle(module)}
                          className={`p-2 border rounded cursor-pointer transition-colors ${
                            formData.specializations.includes(module)
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-sm font-medium">{module}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nivel de Partner SAP
                    </label>
                    <select
                      value={formData.sapPartnerLevel}
                      onChange={(e) => setFormData({...formData, sapPartnerLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">No somos Partner oficial</option>
                      <option value="Silver">Silver Partner</option>
                      <option value="Gold">Gold Partner</option>
                      <option value="Platinum">Platinum Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Industrias de Experiencia
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {industries.map((industry) => (
                        <div
                          key={industry}
                          onClick={() => {
                            const current = formData.industries
                            const index = current.indexOf(industry)
                            if (index > -1) {
                              setFormData({...formData, industries: current.filter(i => i !== industry)})
                            } else {
                              setFormData({...formData, industries: [...current, industry]})
                            }
                          }}
                          className={`p-2 border rounded cursor-pointer transition-colors ${
                            formData.industries.includes(industry)
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-sm">{industry}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Certificaciones SAP
                    <Button onClick={addCertification} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Certificación
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.certifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <p>Agrega al menos una certificación SAP de tu equipo</p>
                    </div>
                  ) : (
                    formData.certifications.map((cert, index) => (
                      <Card key={cert.id} className="border-2">
                        <CardContent className="pt-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Módulo SAP *
                              </label>
                              <select
                                value={cert.module}
                                onChange={(e) => {
                                  const updated = [...formData.certifications]
                                  updated[index].module = e.target.value
                                  setFormData({...formData, certifications: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="">Seleccionar módulo</option>
                                {sapModules.map(module => (
                                  <option key={module} value={module}>{module}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Nivel *
                              </label>
                              <select
                                value={cert.level}
                                onChange={(e) => {
                                  const updated = [...formData.certifications]
                                  updated[index].level = e.target.value
                                  setFormData({...formData, certifications: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="Associate">Associate</option>
                                <option value="Specialist">Specialist</option>
                                <option value="Professional">Professional</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Consultor Certificado *
                              </label>
                              <input
                                type="text"
                                value={cert.consultant}
                                onChange={(e) => {
                                  const updated = [...formData.certifications]
                                  updated[index].consultant = e.target.value
                                  setFormData({...formData, certifications: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Nombre del consultor"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Número de Certificación
                              </label>
                              <input
                                type="text"
                                value={cert.certificationNumber}
                                onChange={(e) => {
                                  const updated = [...formData.certifications]
                                  updated[index].certificationNumber = e.target.value
                                  setFormData({...formData, certifications: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="ej. C_TS4FI_2021"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">
                              Certificado PDF (Opcional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Arrastra el archivo aquí o haz clic para seleccionar
                              </p>
                              <Badge variant="outline" className="mt-2">
                                Verificación Automática Disponible
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Portfolio de Proyectos
                    <Button onClick={addPortfolioProject} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Proyecto
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.portfolioProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Tooltip content="Se requieren mínimo 2 proyectos para activar tu perfil">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        </Tooltip>
                        <p>Agrega al menos 2 proyectos para demostrar tu experiencia</p>
                        <Button onClick={addPortfolioProject} className="mt-4" variant="outline">
                          Usar Template de Proyecto
                        </Button>
                      </div>
                    </div>
                  ) : (
                    formData.portfolioProjects.map((project, index) => (
                      <Card key={project.id} className="border-2">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Proyecto {index + 1}
                            <Badge variant="outline" className="ml-2">
                              Template: Migración S/4HANA
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Título del Proyecto *
                              </label>
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => {
                                  const updated = [...formData.portfolioProjects]
                                  updated[index].title = e.target.value
                                  setFormData({...formData, portfolioProjects: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="ej. Migración S/4HANA para Empresa Manufacturera"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Cliente (Opcional/Anónimo)
                              </label>
                              <input
                                type="text"
                                value={project.client}
                                onChange={(e) => {
                                  const updated = [...formData.portfolioProjects]
                                  updated[index].client = e.target.value
                                  setFormData({...formData, portfolioProjects: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="ej. Empresa Global de Manufactura"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Descripción del Proyecto *
                            </label>
                            <textarea
                              value={project.description}
                              onChange={(e) => {
                                const updated = [...formData.portfolioProjects]
                                updated[index].description = e.target.value
                                setFormData({...formData, portfolioProjects: updated})
                              }}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Describe los objetivos, alcance y challenges del proyecto..."
                            />
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Duración
                              </label>
                              <input
                                type="text"
                                value={project.duration}
                                onChange={(e) => {
                                  const updated = [...formData.portfolioProjects]
                                  updated[index].duration = e.target.value
                                  setFormData({...formData, portfolioProjects: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="ej. 12 meses"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Tamaño del Equipo
                              </label>
                              <input
                                type="text"
                                value={project.teamSize}
                                onChange={(e) => {
                                  const updated = [...formData.portfolioProjects]
                                  updated[index].teamSize = e.target.value
                                  setFormData({...formData, portfolioProjects: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="ej. 5 consultores"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Año de Finalización
                              </label>
                              <input
                                type="number"
                                value={project.completedYear}
                                onChange={(e) => {
                                  const updated = [...formData.portfolioProjects]
                                  updated[index].completedYear = parseInt(e.target.value)
                                  setFormData({...formData, portfolioProjects: updated})
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                min="2000"
                                max={new Date().getFullYear()}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Resultados Clave *
                            </label>
                            <textarea
                              value={project.results}
                              onChange={(e) => {
                                const updated = [...formData.portfolioProjects]
                                updated[index].results = e.target.value
                                setFormData({...formData, portfolioProjects: updated})
                              }}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="ej. Reducción del 30% en tiempo de procesamiento, go-live exitoso sin disrupciones..."
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto y Verificación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nombre del Contacto Principal *
                      </label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Persona responsable de la cuenta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Cargo/Título
                      </label>
                      <input
                        type="text"
                        value={formData.contactTitle}
                        onChange={(e) => setFormData({...formData, contactTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="ej. Gerente General, CTO"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="+52 55 1234-5678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Perfil LinkedIn (Opcional)
                      </label>
                      <input
                        type="url"
                        value={formData.linkedinProfile}
                        onChange={(e) => setFormData({...formData, linkedinProfile: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://linkedin.com/in/usuario"
                      />
                    </div>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                        Proceso de Verificación
                      </h4>
                      <div className="text-sm space-y-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Auto</Badge>
                          <span>Verificación de certificaciones SAP (1-2 horas)</span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Manual</Badge>
                          <span>Validación de portfolio y referencias (2-3 días)</span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Final</Badge>
                          <span>Aprobación administrativa (1 día)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}

            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Revisión Final</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Información Básica</h4>
                      <div className="space-y-1 text-sm">
                        <div><strong>Empresa:</strong> {formData.companyName}</div>
                        <div><strong>País:</strong> {formData.country}</div>
                        <div><strong>Empleados:</strong> {formData.employeeCount}</div>
                        <div><strong>Partner SAP:</strong> {formData.sapPartnerLevel || 'No'}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Especializations</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.specializations.map(spec => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Certificaciones</h4>
                      <div className="space-y-1 text-sm">
                        {formData.certifications.map((cert, index) => (
                          <div key={index}>
                            <Badge variant="outline">{cert.level}</Badge> {cert.module} - {cert.consultant}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Portfolio</h4>
                      <div className="space-y-1 text-sm">
                        {formData.portfolioProjects.map((project, index) => (
                          <div key={index}>• {project.title} ({project.completedYear})</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        ¡Perfil Completo!
                      </h4>
                      <p className="text-sm">
                        Tu perfil está listo para revisión. Una vez aprobado, comenzarás a 
                        recibir oportunidades de proyectos SAP que coincidan con tu expertise.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>
          
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!validateCurrentStep()}
              >
                Siguiente
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!validateCurrentStep()}
                className="bg-green-600 hover:bg-green-700"
              >
                Enviar para Aprobación
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
