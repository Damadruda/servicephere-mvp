import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sapKnowledgeData = [
  // PARA CLIENTES - PROJECT SCOPING
  {
    title: "¿Qué módulos SAP necesito para mi empresa?",
    content: "La selección de módulos SAP depende de los procesos de negocio que quieras digitalizar:\n\n• **SAP FI (Financial)**: Contabilidad, cuentas por cobrar/pagar, reporting financiero\n• **SAP CO (Controlling)**: Control de costos, centros de beneficio, análisis de rentabilidad\n• **SAP SD (Sales & Distribution)**: Gestión de ventas, facturación, despachos\n• **SAP MM (Materials Management)**: Compras, inventarios, proveedores\n• **SAP PP (Production Planning)**: Manufactura, planificación, MRP\n• **SAP HCM (Human Capital Management)**: Nómina, recursos humanos\n\nRecomendación: Comienza con los módulos core (FI/CO) y expande gradualmente según necesidades.",
    category: "MODULES" as any,
    tags: ["módulos", "fi", "co", "sd", "mm", "pp", "hcm", "selección"],
    sapModules: ["FI", "CO", "SD", "MM", "PP", "HCM"],
    difficulty: "BEGINNER" as any,
    userType: "CLIENT" as any as any
  },
  {
    title: "¿Cuánto cuesta una implementación SAP S/4HANA?",
    content: "Los costos de implementación SAP S/4HANA varían según múltiples factores:\n\n**Factores que afectan el costo:**\n• Tamaño de la empresa (usuarios, volumen de transacciones)\n• Módulos requeridos\n• Complejidad de procesos actuales\n• Nivel de customización necesario\n• Metodología (Greenfield vs Brownfield)\n\n**Rangos típicos:**\n• Pequeña empresa (50-100 usuarios): $200K - $500K\n• Mediana empresa (100-500 usuarios): $500K - $2M\n• Gran empresa (500+ usuarios): $2M - $10M+\n\n**Componentes del costo:**\n• Licencias SAP (40-50%)\n• Servicios de implementación (35-45%)\n• Hardware e infraestructura (10-15%)\n• Training y change management (5-10%)\n\nRecomendación: Solicita cotizaciones específicas a múltiples proveedores SAP certificados.",
    category: "PRICING" as any,
    tags: ["costo", "precio", "s4hana", "implementación", "presupuesto"],
    sapModules: ["S4HANA"],
    difficulty: "BEGINNER" as any,
    userType: "CLIENT" as any as any
  },
  {
    title: "¿Cuánto tiempo toma una implementación SAP?",
    content: "Los tiempos de implementación SAP dependen del scope y complejidad:\n\n**Factores que afectan el timeline:**\n• Número de módulos\n• Complejidad de procesos de negocio\n• Nivel de customización\n• Disponibilidad del equipo cliente\n• Calidad de datos maestros\n• Metodología utilizada\n\n**Estimaciones típicas:**\n• **Implementación básica (2-3 módulos)**: 6-12 meses\n• **Implementación estándar (4-6 módulos)**: 12-18 meses\n• **Implementación compleja (6+ módulos)**: 18-24 meses\n• **Migración de ECC a S/4HANA**: 6-15 meses\n\n**Fases del proyecto:**\n1. Planning y Design: 25-30%\n2. Build y Configuration: 35-40%\n3. Testing e Integration: 20-25%\n4. Deployment y Go-Live: 10-15%\n\nRecomendación: Planifica con un buffer de 20-30% adicional para contingencias.",
    category: "IMPLEMENTATION" as any,
    tags: ["tiempo", "duración", "timeline", "fases", "proyecto"],
    sapModules: ["S4HANA"],
    difficulty: "BEGINNER" as any,
    userType: "CLIENT" as any
  },
  {
    title: "¿Cuáles son los principales riesgos en un proyecto SAP?",
    content: "Los proyectos SAP tienen riesgos inherentes que deben gestionarse:\n\n**Riesgos principales:**\n\n• **Scope creep**: Expansión no controlada del alcance\n  - Mitigation: Definir scope claramente, change control process\n\n• **Calidad de datos**: Datos maestros inconsistentes o incorrectos\n  - Mitigation: Data cleansing antes de migración, governance estricta\n\n• **Resistencia al cambio**: Usuario final no adopta nuevo sistema\n  - Mitigation: Change management, training extensivo, early involvement\n\n• **Customizaciones excesivas**: Demasiadas modificaciones al estándar\n  - Mitigation: Seguir best practices, minimizar customizaciones\n\n• **Integración compleja**: Problemas conectando sistemas legacy\n  - Mitigation: Architecture review, testing exhaustivo\n\n• **Go-live issues**: Problemas en arranque producción\n  - Mitigation: Cutover planning, rollback strategy, support 24/7\n\n**Estrategias de mitigación:**\n• Metodología probada (SAP Activate)\n• Equipo experimentado\n• Testing riguroso\n• Communication constante\n• Executive sponsorship",
    category: "BEST_PRACTICES" as any,
    tags: ["riesgos", "mitigación", "scope creep", "datos", "cambio"],
    sapModules: ["GENERAL"],
    difficulty: "INTERMEDIATE" as any,
    userType: "CLIENT" as any
  },

  // PARA PROVEEDORES - TECHNICAL CONSULTATION
  {
    title: "¿SAP Activate o ASAP para mi proyecto?",
    content: "La elección entre SAP Activate y ASAP depende del tipo de proyecto:\n\n**SAP Activate (Recomendado para S/4HANA):**\n• Metodología ágil e híbrida\n• Enfoque en best practices pre-configuradas\n• Ideal para S/4HANA Cloud y On-Premise\n• Accelerators y templates incluidos\n• Fases: Prepare, Explore, Realize, Deploy, Run\n• Timeline más corto para implementaciones estándar\n\n**ASAP (Legacy para ECC):**\n• Metodología waterfall tradicional\n• Más customización y flexibilidad\n• Mejor para proyectos ECC complejos\n• Fases: Project Preparation, Business Blueprint, Realization, Final Preparation, Go Live & Support\n• Mayor control sobre cada fase\n\n**Recomendaciones por escenario:**\n• **S/4HANA Greenfield**: SAP Activate (definitivamente)\n• **S/4HANA Brownfield**: SAP Activate con ajustes\n• **ECC implementation**: ASAP o híbrido\n• **Proyectos complejos/legacy**: ASAP o metodología personalizada\n\n**Factores decisivos:**\n• Nivel de estandarización deseado\n• Timeline del proyecto\n• Experiencia del equipo\n• Complejidad de requerimientos",
    category: "METHODOLOGY" as any,
    tags: ["activate", "asap", "metodología", "s4hana", "ecc"],
    sapModules: ["S4HANA", "ECC"],
    difficulty: "INTERMEDIATE" as any,
    userType: "PROVIDER" as any
  },
  {
    title: "¿On-Premise, Cloud o Hybrid para mi cliente?",
    content: "La arquitectura óptima depende de múltiples factores del cliente:\n\n**SAP S/4HANA Cloud (SaaS):**\n✅ **Ventajas:**\n• Menor TCO y tiempo de implementación\n• Actualizaciones automáticas\n• Infraestructura gestionada por SAP\n• Escalabilidad automática\n\n❌ **Limitaciones:**\n• Menos flexibilidad en customizaciones\n• Dependencia de conectividad\n• Menor control sobre datos\n\n**SAP S/4HANA On-Premise:**\n✅ **Ventajas:**\n• Control total sobre sistema y datos\n• Customizaciones ilimitadas\n• Integración más fácil con sistemas legacy\n• Compliance más sencillo para industrias reguladas\n\n❌ **Desventajas:**\n• Mayor TCO y complejidad de mantenimiento\n• Actualizaciones manuales\n• Requiere equipo IT interno\n\n**Híbrido:**\n• Combina lo mejor de ambos mundos\n• Core processes en cloud, específicos on-premise\n• Integración via SAP Cloud Connector\n\n**Criterios de decisión:**\n• Industria y regulaciones\n• Nivel de customización requerido\n• Madurez IT del cliente\n• Presupuesto disponible\n• Estrategia de datos\n• Conectividad y geografía",
    category: "ARCHITECTURE" as any,
    tags: ["cloud", "on-premise", "hybrid", "arquitectura", "saaS"],
    sapModules: ["S4HANA"],
    difficulty: "ADVANCED" as any,
    userType: "PROVIDER" as any
  },
  {
    title: "¿Qué certificaciones SAP necesito como consultor?",
    content: "Las certificaciones SAP varían según tu especialización y nivel:\n\n**Niveles de Certificación:**\n\n**1. Associate Level (Entry)**\n• SAP Certified Application Associate\n• Ideal para consultores junior\n• Cubre conocimientos fundamentales\n• Ejemplo: C_TS4FI_2021 (S/4HANA Finance)\n\n**2. Specialist Level (Mid)**\n• SAP Certified Application Specialist\n• Para consultores con experiencia\n• Enfoque en áreas específicas\n• Ejemplo: E_S4HCON2022 (S/4HANA Conversion)\n\n**3. Professional Level (Senior)**\n• SAP Certified Application Professional\n• Para consultores senior/arquitectos\n• Conocimientos avanzados y best practices\n• Ejemplo: P_S4FIN_2021 (S/4HANA Finance)\n\n**Certificaciones más demandadas 2024:**\n• S/4HANA Finance (FI/CO)\n• S/4HANA Sales & Distribution\n• S/4HANA Materials Management\n• SAP Analytics Cloud\n• SAP SuccessFactors\n• SAP Ariba\n\n**Estrategia de certificación:**\n1. Empieza con Associate en tu área core\n2. Gana experiencia práctica (6-12 meses)\n3. Avanza a Specialist/Professional\n4. Considera certificaciones complementarias\n\n**Costo típico:** $500-800 USD por examen\n**Validez:** 2-3 años (requiere recertificación)",
    category: "CERTIFICATION" as any,
    tags: ["certificaciones", "associate", "specialist", "professional", "examen"],
    sapModules: ["S4HANA", "SuccessFactors", "Ariba"],
    difficulty: "BEGINNER" as any,
    userType: "PROVIDER" as any
  },

  // PARA AMBOS - GENERAL SUPPORT
  {
    title: "¿Cómo publicar un proyecto en el marketplace?",
    content: "Guía paso a paso para publicar proyectos exitosamente:\n\n**Paso 1: Preparación**\n• Define claramente el scope y objetivos\n• Identifica módulos SAP requeridos\n• Establece presupuesto y timeline\n• Reúne documentos de procesos actuales\n\n**Paso 2: Crear el proyecto**\n• Accede a 'Publicar Proyecto' en tu dashboard\n• Selecciona template según tipo de proyecto\n• Completa información básica:\n  - Título descriptivo y claro\n  - Industria y tamaño de empresa\n  - Ubicación y preferencia remoto/presencial\n\n**Paso 3: Detalles técnicos**\n• Módulos SAP específicos\n• Tipo de implementación (nueva, migración, optimización)\n• Metodología preferida\n• Integraciones requeridas\n• Requerimientos de compliance\n\n**Paso 4: Criterios de evaluación**\n• Peso de experiencia vs precio\n• Certificaciones requeridas\n• Experiencia en tu industria\n• Referencias verificables\n\n**Paso 5: Review y publicación**\n• Revisa vista previa\n• Verifica score de calidad (>7/10)\n• Publica y recibe notificación de aprobación\n\n**Tips para mejores resultados:**\n• Sé específico en requerimientos\n• Incluye contexto de negocio\n• Define success criteria claros\n• Responde rápido a proveedores",
    category: "PLATFORM_HELP" as any,
    tags: ["publicar", "proyecto", "marketplace", "guía", "paso a paso"],
    sapModules: ["GENERAL"],
    difficulty: "BEGINNER" as any,
    userType: "CLIENT" as any
  },
  {
    title: "¿Cómo escribir una cotización ganadora?",
    content: "Guía para proveedores para crear cotizaciones competitivas:\n\n**Estructura recomendada:**\n\n**1. Executive Summary**\n• Entendimiento del problema cliente\n• Propuesta de valor única\n• Resumen de approach y timeline\n• Investment summary\n\n**2. Company Credentials**\n• Certificaciones SAP relevantes\n• Experiencia en la industria del cliente\n• Proyectos similares (3-5 casos)\n• Referencias verificables\n\n**3. Technical Approach**\n• Metodología detallada (SAP Activate/ASAP)\n• Architecture overview\n• Integration strategy\n• Risk mitigation plan\n\n**4. Project Plan**\n• Fases detalladas con deliverables\n• Timeline realista con milestones\n• Resource allocation\n• Testing strategy\n\n**5. Team Structure**\n• Roles y responsabilidades\n• CV resumidos de consultores clave\n• Certificaciones del equipo\n• Allocation percentage\n\n**6. Investment**\n• Breakdown detallado por fase/módulo\n• Assumptions claras\n• Payment terms\n• What's included/excluded\n\n**Best practices:**\n• Personaliza para cada cliente\n• Usa templates pero adapta contenido\n• Include visual elements (diagramas)\n• Proofread multiple times\n• Submit antes del deadline\n\n**Common mistakes:**\n• Generic proposals\n• Precios muy bajos (red flag)\n• Timeline irreales\n• Falta de detail en approach",
    category: "BEST_PRACTICES" as any,
    tags: ["cotización", "propuesta", "ganar", "estructura", "tips"],
    sapModules: ["GENERAL"],
    difficulty: "INTERMEDIATE" as any,
    userType: "PROVIDER" as any
  },
  {
    title: "¿Cómo funciona el sistema de escrow?",
    content: "El sistema de escrow garantiza pagos seguros para ambas partes:\n\n**¿Qué es escrow?**\n• Servicio de custodia de fondos neutral\n• Dinero se retiene hasta completar milestones\n• Protección tanto para cliente como proveedor\n• Liberación automática o manual según acuerdo\n\n**Flujo del proceso:**\n\n**1. Setup del proyecto**\n• Cliente deposita fondos según cronograma\n• Fondos quedan en cuenta escrow segura\n• Proveedor puede ver fondos disponibles\n\n**2. Milestone completion**\n• Proveedor marca milestone como completado\n• Cliente tiene 5 días hábiles para aprobar\n• Si no hay objeción, liberación automática\n• Si hay disputa, fondos quedan retenidos\n\n**3. Liberación de fondos**\n• Fondos se transfieren a cuenta proveedor\n• Fee del marketplace se deduce (5%)\n• Cliente recibe factura automáticamente\n\n**Fees del sistema:**\n• Cliente paga: 2.5% del valor proyecto\n• Proveedor paga: 5% de cada pago recibido\n• Processing fees: según método de pago\n• No hay fees ocultos\n\n**Beneficios:**\n• **Clientes**: Pagan solo por trabajo completado\n• **Proveedores**: Garantía de pago por trabajo entregado\n• **Ambos**: Dispute resolution profesional\n\n**Métodos de pago aceptados:**\n• Tarjetas de crédito/débito\n• Transferencias bancarias\n• PayPal y digital wallets\n• Criptomonedas (en países seleccionados)",
    category: "PLATFORM_HELP" as any,
    tags: ["escrow", "pagos", "seguro", "milestone", "fees"],
    sapModules: ["GENERAL"],
    difficulty: "BEGINNER" as any,
    userType: "CLIENT" as any
  }
]

export async function seedSAPKnowledge() {
  console.log('🌱 Iniciando seed de SAP Knowledge Base...')

  try {
    // Limpiar conocimiento existente
    await prisma.sAPKnowledge.deleteMany({})
    console.log('🧹 Limpiado conocimiento existente')

    // Crear entradas de conocimiento
    const created = await prisma.sAPKnowledge.createMany({
      data: sapKnowledgeData
    })

    console.log(`✅ Creados ${created.count} artículos de conocimiento SAP`)

    // Crear algunos votos de ejemplo para simular popularidad
    const knowledgeItems = await prisma.sAPKnowledge.findMany()
    
    for (const item of knowledgeItems.slice(0, 3)) {
      await prisma.sAPKnowledge.update({
        where: { id: item.id },
        data: {
          helpfulVotes: Math.floor(Math.random() * 20) + 5,
          unhelpfulVotes: Math.floor(Math.random() * 3),
          viewCount: Math.floor(Math.random() * 100) + 20
        }
      })
    }

    console.log('📊 Agregados votos y visualizaciones de ejemplo')
    console.log('🎉 Seed de SAP Knowledge completado exitosamente!')

  } catch (error) {
    console.error('❌ Error en seed de SAP Knowledge:', error)
    throw error
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedSAPKnowledge()
    .then(() => {
      console.log('✨ Proceso completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}