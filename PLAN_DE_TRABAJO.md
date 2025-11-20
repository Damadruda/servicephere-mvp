# 📋 PLAN DE TRABAJO - SERVICEPHERE MVP

**Fecha de creación:** 20 de Noviembre, 2025
**Última actualización:** 20 de Noviembre, 2025
**Estado general:** En planificación

---

## 📊 RESUMEN EJECUTIVO

Este documento contiene el plan de trabajo completo para las mejoras y correcciones identificadas en Servicephere MVP.

### Estadísticas Generales
- **Total de cambios identificados:** 32
- **Bugs críticos:** 3
- **Mejoras de alta prioridad:** 13
- **Mejoras de media prioridad:** 11
- **Mejoras futuras/innovaciones:** 5
- **Tiempo estimado total (Sprints 1-3):** 37-55 horas (1-2 semanas)
- **Tiempo estimado innovaciones:** 2-4 meses

---

## 🎯 OBJETIVOS PRINCIPALES

1. **Hacer funcionar lo básico** - Arreglar bugs críticos que impiden uso
2. **Mejorar experiencia de usuario** - Corregir problemas de UX evidentes
3. **Establecer terminología consistente** - Partners vs Consultores
4. **Innovar con IA** - Integrar assessment inteligente
5. **Optimizar seguridad** - Visibilidad correcta de proyectos

---

## 🔴 PRIORIDAD CRÍTICA (Sprint 1 - Esta Semana)

### ⚠️ BLOQUEANTES - NO FUNCIONA

#### 1. LOGIN DE PARTNERS NO FUNCIONA
- **ID:** CRIT-001
- **Estado:** ❌ Pendiente
- **Prioridad:** Crítica
- **Impacto:** Partners no pueden acceder a la plataforma
- **Tiempo estimado:** 2-3 horas
- **Archivos afectados:**
  - `app/api/auth/[...nextauth]/route.ts`
  - `app/(auth)/login/page.tsx`
  - `lib/auth.ts`
- **Pasos a seguir:**
  1. Verificar configuración NextAuth para userType PROVIDER
  2. Revisar validación de credenciales
  3. Testear flujo completo de login
  4. Verificar redirección post-login
- **Criterios de éxito:**
  - [ ] Partner puede hacer login exitosamente
  - [ ] Redirección correcta al dashboard de partner
  - [ ] Sesión persiste correctamente

---

#### 2. PUBLICAR PROYECTO NO FUNCIONA
- **ID:** CRIT-002
- **Estado:** ❌ Pendiente
- **Prioridad:** Crítica
- **Impacto:** Clientes no pueden publicar proyectos (función core)
- **Tiempo estimado:** 2-4 horas
- **Archivos afectados:**
  - `app/proyectos/nuevo/page.tsx`
  - `app/api/projects/create/route.ts`
- **Síntomas:**
  - Click en "Publicar" no hace nada
  - No muestra errores
  - Se queda en la misma página
- **Pasos a seguir:**
  1. Verificar envío de datos del formulario
  2. Revisar validación en API route
  3. Verificar permisos de base de datos
  4. Añadir logs de debug
  5. Testear con datos de prueba
- **Criterios de éxito:**
  - [ ] Proyecto se crea en base de datos
  - [ ] Usuario recibe confirmación
  - [ ] Proyecto aparece en listado
  - [ ] Validaciones funcionan correctamente

---

#### 3. FALTA RECUPERAR CONTRASEÑA
- **ID:** CRIT-003
- **Estado:** ❌ Pendiente
- **Prioridad:** Crítica
- **Impacto:** Usuarios no pueden recuperar acceso si olvidan contraseña
- **Tiempo estimado:** 3-4 horas
- **Archivos a crear/modificar:**
  - `app/(auth)/forgot-password/page.tsx` (crear)
  - `app/api/auth/forgot-password/route.ts` (crear)
  - `app/api/auth/reset-password/route.ts` (crear)
  - `app/(auth)/reset-password/[token]/page.tsx` (crear)
- **Funcionalidad requerida:**
  1. Formulario de solicitud (email)
  2. Generación de token de recuperación
  3. Envío de email con link
  4. Página de reset con token
  5. Actualización de contraseña
- **Criterios de éxito:**
  - [ ] Link "¿Olvidaste tu contraseña?" en login
  - [ ] Email se envía correctamente
  - [ ] Token expira después de 1 hora
  - [ ] Password se actualiza correctamente
  - [ ] Usuario puede hacer login con nueva contraseña

---

## 🟡 PRIORIDAD ALTA (Sprint 1 - Esta Semana)

### 🐛 BUGS DE INTERFAZ

#### 4. HEADERS DUPLICADOS
- **ID:** HIGH-001
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 1-2 horas
- **Páginas afectadas:**
  - Publicar proyectos (Paso 1, 2, 3)
  - Notificaciones
  - Reviews
  - Asistente SAP
- **Archivos probables:**
  - `app/layout.tsx`
  - `components/layout/header.tsx`
- **Solución:**
  - Verificar estructura de layouts anidados
  - Asegurar un solo header por página
- **Criterios de éxito:**
  - [ ] Solo un header visible en todas las páginas

---

#### 5. FOOTERS DUPLICADOS
- **ID:** HIGH-002
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 30 minutos
- **Solución:** Junto con headers (#4)
- **Criterios de éxito:**
  - [ ] Solo un footer visible en todas las páginas

---

### 📝 TERMINOLOGÍA INCONSISTENTE

#### 6. CAMBIAR "CONSULTORES" POR "PARTNERS SAP"
- **ID:** HIGH-003
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 1-2 horas
- **Ubicaciones identificadas:**
  - Página publicar proyectos: "conectar con los mejores consultores SAP"
  - Recomendaciones: "Tu proyecto llegará solo a consultores"
  - Matching: descripción de matching preciso
  - Vista final publicación: "conectar con consultores SAP"
  - Explorar servicios: referencias a consultores
  - Visibilidad proyecto: "todos los consultores"
- **Método:**
  - Buscar globalmente: "consultor" (case insensitive)
  - Reemplazar contextualizadamente
- **Nueva terminología:**
  - "Partners SAP" → Empresas consultoras
  - "Consultores SAP" → Si se refiere a personas individuales
- **Criterios de éxito:**
  - [ ] Todo el sitio usa "Partners SAP" consistentemente
  - [ ] Documentación actualizada

---

#### 7. TEXTOS REGISTRO PARTNERS INCORRECTOS
- **ID:** HIGH-004
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 30 minutos
- **Problema actual:**
  - "Describe tu empresa y sus necesidades"
  - Suena a que está buscando servicios, no ofreciéndolos
- **Nuevo texto sugerido:**
  - "Describe tu empresa y los servicios SAP que ofreces"
  - "Cuéntanos sobre tu experiencia y especialización en SAP"
- **Archivo:** `app/onboarding/proveedor/page.tsx`
- **Criterios de éxito:**
  - [ ] Texto refleja que partner ofrece servicios

---

### ⚙️ FUNCIONALIDAD FALTANTE

#### 8. FALTA CAMPO "CARGO" EN REGISTRO PARTNERS
- **ID:** HIGH-005
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 30 minutos
- **Archivo:** `app/onboarding/proveedor/page.tsx`
- **Implementación:**
  - Añadir campo "Cargo" o "Posición"
  - Validación requerida
  - Guardar en `ProviderProfile.contactTitle`
- **Criterios de éxito:**
  - [ ] Campo visible en formulario
  - [ ] Validación funciona
  - [ ] Datos se guardan correctamente

---

#### 9. BOTÓN "BUSCAR" EN EXPLORAR SERVICIOS
- **ID:** HIGH-006
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 1 hora
- **Problema:** Solo tiene "Limpiar filtros", no ejecuta búsqueda
- **Archivo:** `app/oportunidades/page.tsx` o similar
- **Implementación:**
  - Añadir botón "Buscar" o "Aplicar filtros"
  - Ejecutar query con filtros seleccionados
- **Criterios de éxito:**
  - [ ] Botón visible y funcional
  - [ ] Búsqueda se ejecuta al hacer click
  - [ ] Resultados se filtran correctamente

---

#### 10. PROYECTOS PUBLICADOS NO APARECEN EN LISTADO
- **ID:** HIGH-007
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 2-3 horas
- **Problema:** Usuario publica proyecto pero no aparece en "Ver Proyectos"
- **Archivos:**
  - `app/proyectos/page.tsx`
  - `app/api/projects/public/route.ts`
- **Investigar:**
  - Query de filtrado
  - Permisos de visibilidad
  - Status del proyecto al publicar
- **Criterios de éxito:**
  - [ ] Proyectos publicados aparecen inmediatamente
  - [ ] Filtros funcionan correctamente
  - [ ] Visibilidad según tipo de usuario

---

#### 11. IMAGEN REPETIDA "PUBLICAR PROYECTO"
- **ID:** HIGH-008
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 30 minutos
- **Problema:** Imagen aparece en cada paso innecesariamente
- **Solución:** Mostrar solo en paso 1 o en página final
- **Criterios de éxito:**
  - [ ] Imagen aparece solo donde tiene sentido

---

#### 12. ARCHIVO ADJUNTO MENCIONADO REPETIDAMENTE
- **ID:** HIGH-009
- **Estado:** ❌ Pendiente
- **Prioridad:** Alta
- **Tiempo estimado:** 15 minutos
- **Problema:** Se menciona en Paso 2 y 3 sin necesidad
- **Solución:** Eliminar referencias redundantes
- **Criterios de éxito:**
  - [ ] Texto de archivo adjunto aparece solo una vez

---

#### 13-16. OTROS CAMBIOS ALTA PRIORIDAD
- Ver sección completa abajo

---

## 🟠 PRIORIDAD MEDIA (Sprint 2 - Próxima Semana)

### 🎨 MEJORAS DE UX

#### 17. NAVEGACIÓN NO POSICIONA ARRIBA
- **ID:** MED-001
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 30 minutos
- **Problema:** Al cambiar de paso, página queda en posición scroll anterior
- **Solución:**
  ```javascript
  window.scrollTo(0, 0)
  // o usar Next.js scroll behavior
  ```
- **Archivos:** Wizard de creación de proyectos
- **Criterios de éxito:**
  - [ ] Cada cambio de paso posiciona arriba

---

#### 18. UNIFICAR PERFIL Y CONFIGURACIÓN
- **ID:** MED-002
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 2-3 horas
- **Sugerencia usuario:** No tiene sentido tenerlos separados
- **Implementación:**
  - Tabs dentro de una sola página
  - "Perfil" | "Configuración" | "Seguridad"
- **Criterios de éxito:**
  - [ ] Una sola página con tabs
  - [ ] Navegación más intuitiva

---

#### 19. MEJORAR VISUALIZACIÓN CUADROS INFORMATIVOS
- **ID:** MED-003
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 2-3 horas
- **Feedback:** "Ocupen menos espacio, sean más visuales"
- **Implementación:**
  - Rediseñar cards informativas
  - Usar íconos más prominentes
  - Layout más compacto
- **Criterios de éxito:**
  - [ ] Diseño más limpio y profesional
  - [ ] Menos espacio vertical

---

#### 20. CAMBIAR ÍCONO COHETE
- **ID:** MED-004
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 30 minutos
- **Feedback:** "Muy usado en todos los sitios"
- **Sugerencias:**
  - Ícono de check/success
  - Ícono de handshake (conexión)
  - Ícono custom de Servicephere
- **Criterios de éxito:**
  - [ ] Ícono más profesional y único

---

### 🔧 MEJORAS FUNCIONALES

#### 21. OPCIÓN "NINGUNA" EN METODOLOGÍA
- **ID:** MED-005
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 30 minutos
- **Implementación:**
  - Añadir opción "Sin preferencia" o "A definir"
  - Hacer campo opcional
- **Criterios de éxito:**
  - [ ] Campo puede quedar sin selección

---

#### 22. AGREGAR MÓDULOS SAP FALTANTES
- **ID:** MED-006
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 1-2 horas
- **Investigar:**
  - Qué módulos específicos faltan
  - Nomenclatura correcta SAP
- **Criterios de éxito:**
  - [ ] Lista completa de módulos SAP actuales

---

#### 23. MEJORAR LISTA DE INDUSTRIAS (D&B STANDARD)
- **ID:** MED-007
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 2-3 horas
- **Implementación:**
  - Investigar nomenclatura D&B
  - Reemplazar lista actual
  - Mapear industrias existentes
- **Referencia:** https://www.dnb.com/
- **Criterios de éxito:**
  - [ ] Lista usa estándar reconocido
  - [ ] Migracion de datos existentes

---

#### 24. AGREGAR INTEGRACIONES SAP A SAP
- **ID:** MED-008
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 1 hora
- **Problema:** Solo lista sistemas no-SAP
- **Solución:** Añadir opciones de integración entre módulos SAP
- **Criterios de éxito:**
  - [ ] Opciones SAP disponibles
  - [ ] Diferenciadas claramente

---

#### 25-27. OTROS CAMBIOS MEDIA PRIORIDAD
- Ver listado completo abajo

---

## 🟢 PRIORIDAD BAJA / FUTURAS (Sprints 4+)

### 🤖 INNOVACIONES CON IA

#### 28. ASSESSMENT SAP CON IA INTEGRADO ⭐⭐⭐
- **ID:** INNOV-001
- **Estado:** ❌ Pendiente (Planificación)
- **Prioridad:** Baja (pero estratégicamente importante)
- **Tiempo estimado:** 2-3 semanas
- **Complejidad:** Alta

**Concepto:**
Integrar un asistente de IA dentro del flujo de creación de proyecto que guíe al cliente con preguntas inteligentes y sugiera el alcance basado en mejores prácticas SAP.

**Flujo propuesto:**
1. Cliente empieza a crear proyecto
2. En lugar de formulario tradicional, aparece asistente IA
3. Asistente hace preguntas sobre el negocio:
   - "¿Qué procesos quieres mejorar?"
   - "¿Qué problemas actuales tienes?"
   - "¿Qué sistemas usas ahora?"
4. IA analiza respuestas
5. IA sugiere:
   - Módulos SAP apropiados
   - Alcance funcional
   - Mejores prácticas
   - Timeline estimado
6. Cliente puede:
   - Aceptar sugerencias
   - Modificar
   - Rechazar y completar manual

**Tecnología sugerida:**
- OpenAI GPT-4 con embeddings de documentación SAP
- Base de conocimiento:
  - Documentación oficial SAP
  - Casos de éxito
  - Mejores prácticas
  - Industrias y sus necesidades típicas

**Beneficios:**
- ✅ Diferenciación competitiva
- ✅ Mejor calidad de proyectos publicados
- ✅ Reduce tiempo de creación
- ✅ Educa a clientes sobre SAP
- ✅ Matching más preciso con partners

**Archivos involucrados:**
- Crear: `components/projects/ai-assessment.tsx`
- Crear: `app/api/ai/assessment/route.ts`
- Modificar: `app/proyectos/nuevo/page.tsx`
- Crear: Base de datos de conocimiento SAP

**Pasos de implementación:**
1. [ ] Diseñar flujo de conversación
2. [ ] Crear base de conocimiento SAP
3. [ ] Implementar componente de chat
4. [ ] Integrar con OpenAI API
5. [ ] Crear lógica de sugerencias
6. [ ] Testing exhaustivo
7. [ ] Refinamiento basado en feedback

**Criterios de éxito:**
- [ ] 80%+ de clientes completan assessment
- [ ] Sugerencias son relevantes (feedback positivo)
- [ ] Proyectos tienen mejor calidad de información
- [ ] Tiempo de creación se reduce o mantiene igual

---

#### 29. IA PARA MAPEO BUSINESS → SAP
- **ID:** INNOV-002
- **Estado:** ❌ Pendiente (Planificación)
- **Prioridad:** Baja
- **Tiempo estimado:** 3-4 semanas
- **Complejidad:** Alta

**Concepto:**
Cliente describe necesidades en términos de negocio, IA traduce a capacidades y módulos SAP específicos.

**Ejemplo:**
```
Cliente dice: "Necesito controlar mejor mi inventario y automatizar compras"

IA analiza y sugiere:
✓ SAP MM (Materials Management)
  - Gestión de compras
  - Inventario en tiempo real
  - Automatización de reorden
✓ SAP WM (Warehouse Management)
  - Optimización de almacén
✓ Integraciones recomendadas
  - Con SAP FI para control de costos
  - Con SAP SD si hay despachos

Timeline estimado: 6-9 meses
Complejidad: Media
Partners sugeridos: [Lista de partners especializados]
```

**Implementación:**
- Base de conocimiento extensa de SAP
- Training de modelo con casos reales
- Validación con expertos SAP
- Actualización continua

---

#### 30. PREGUNTAS GUIADAS POR SECCIÓN
- **ID:** INNOV-003
- **Estado:** ❌ Pendiente
- **Prioridad:** Baja
- **Tiempo estimado:** 2-3 semanas
- **Complejidad:** Media-Alta

**Concepto:**
En cada sección del formulario de proyecto, hacer preguntas específicas que guíen al cliente.

**Ejemplo Sección "Alcance Funcional":**

```
Asistente: "Vamos a definir el alcance funcional.
Te haré algunas preguntas para entender mejor tus necesidades."

Q1: ¿Qué área de tu negocio necesita más mejora?
[ ] Finanzas y contabilidad
[ ] Ventas y distribución
[ ] Compras e inventario
[ ] Producción
[ ] Recursos humanos
[ ] Otra: _______

Q2: ¿Qué proceso específico quieres optimizar?
[Campo de texto con IA que sugiere módulos mientras escribe]

Q3: ¿Tu empresa ya usa algún sistema ERP?
( ) Sí - ¿Cuál? _______
( ) No

[IA genera sugerencia]

📋 ALCANCE SUGERIDO:
Basado en tus respuestas, sugerimos:

✓ SAP FI/CO (Finanzas)
✓ SAP MM (Compras)
✓ Integración con sistema actual

¿Qué te parece?
[Aceptar] [Modificar] [Rechazar]
```

---

#### 31. REDISEÑAR "PROCESOS DE NEGOCIO"
- **ID:** INNOV-004
- **Estado:** ❌ Pendiente
- **Depende de:** INNOV-002
- **Tiempo estimado:** 1-2 semanas

**Problema actual:**
Redundante con selección de módulos

**Solución:**
Que sea el cliente quien describe procesos de negocio, y la IA mapea a módulos SAP

---

### 🔒 SEGURIDAD Y PERMISOS

#### 32. LÓGICA DE VISIBILIDAD DE PROYECTOS
- **ID:** SEC-001
- **Estado:** ❌ Pendiente
- **Prioridad:** Media-Alta (debería subir)
- **Tiempo estimado:** 1-2 días
- **Complejidad:** Media

**Problema crítico:**
> "¿Clientes pueden ver proyectos de otros clientes?"

**Reglas de visibilidad correctas:**

| Tipo Proyecto | Quién puede ver |
|--------------|----------------|
| Público | Solo Partners SAP |
| Privado | Solo Partners invitados |
| Por invitación | Solo Partners específicos |

**Importante:** NUNCA cliente ve proyecto de otro cliente

**Implementación:**
```typescript
// En API de proyectos
if (userType === 'CLIENT') {
  // Cliente solo ve SUS proyectos
  where.clientId = session.user.id
} else if (userType === 'PROVIDER') {
  // Partner ve proyectos públicos o donde está invitado
  where.OR = [
    { visibility: 'PUBLIC' },
    { invitedProviders: { some: { id: session.user.id } } }
  ]
}
```

**Archivos:**
- `app/api/projects/public/route.ts`
- `app/proyectos/page.tsx`

**Criterios de éxito:**
- [ ] Clientes NO ven proyectos de otros
- [ ] Partners ven solo proyectos apropiados
- [ ] Testing exhaustivo de permisos

---

### 👥 NUEVO TIPO DE USUARIO

#### 33. PARTNER SUBIENDO PROYECTO (P2P)
- **ID:** FEAT-001
- **Estado:** ❌ Pendiente
- **Prioridad:** Baja
- **Tiempo estimado:** 1-2 semanas
- **Complejidad:** Media

**Concepto:**
Partner tiene cliente con necesidad fuera de su expertise, busca otro partner para colaborar.

**Casos de uso:**
1. Partner SAP FI tiene cliente que necesita SAP PP
2. Partner regional necesita partner en otra región
3. Partner pequeño necesita más recursos

**Flujo:**
1. Partner logeado
2. Opción "Buscar colaborador"
3. Describe necesidad (similar a crear proyecto)
4. Otros partners pueden ver y cotizar
5. Partner original selecciona colaborador
6. Trabajan juntos en proyecto del cliente

**Implementación:**
- Nuevo campo en Project: `isPartnerRequest: boolean`
- Nuevo campo: `requestingPartnerId`
- Lógica de visibilidad especial
- Split de fees/comisiones

**Beneficios:**
- Ecosistema de colaboración
- Partners no pierden clientes
- Mejor servicio al cliente final

---

### 🎨 MEJORAS DE DISEÑO

#### 34. RENOMBRAR "CHATBOT SAP"
- **ID:** DES-001
- **Estado:** ❌ Pendiente
- **Prioridad:** Baja
- **Tiempo estimado:** 30 minutos + consenso

**Sugerencias de nombres:**
- "Asistente SAP Inteligente"
- "SAP Advisor"
- "SAP Guide"
- "SAP Consultant AI"
- "SAP Navigator"
- "SAP Expert Assistant"

**Votación/Decisión pendiente**

---

#### 35. DEFINIR FORMATO AGENTE IA
- **ID:** DES-002
- **Estado:** ❌ Pendiente
- **Prioridad:** Baja
- **Tiempo estimado:** Reunión 2-3 horas

**Preguntas a responder:**
- ¿Chat tradicional o wizard guiado?
- ¿Siempre visible o solo cuando se necesita?
- ¿Proactivo o reactivo?
- ¿Integrado en páginas o separado?
- ¿Memoria de conversación?

---

#### 36. NAVEGACIÓN DESDE ASISTENTE SAP
- **ID:** DES-003
- **Estado:** ❌ Pendiente
- **Prioridad:** Baja
- **Tiempo estimado:** 1 hora

**Problema:** No puede volver a otras páginas
**Solución:** Añadir navegación consistente

---

### 🤔 DECISIONES DE ARQUITECTURA

#### 37. ¿UNIFICAR COMUNICACIÓN Y NOTIFICACIONES?
- **ID:** ARCH-001
- **Estado:** ❌ Pendiente (Requiere decisión)
- **Prioridad:** Baja
- **Tiempo:** 1 semana si se decide unificar

**Pregunta del usuario:**
> "¿Tiene sentido tener una página de comunicación y otra de notificaciones?"

**Análisis:**

**Opción A: Mantener separadas**
- Comunicación = Mensajes entre usuarios (chat)
- Notificaciones = Alertas del sistema
- Pros: Separación de responsabilidades
- Contras: Puede confundir

**Opción B: Unificar**
- Todo en una "Inbox" o "Centro de mensajes"
- Tabs: Mensajes | Notificaciones
- Pros: Más intuitivo, menos navegación
- Contras: Más complejo

**Recomendación:** Unificar para mejor UX

---

#### 38. REVISAR DASHBOARD POR TIPO USUARIO
- **ID:** ARCH-002
- **Estado:** ❌ Pendiente
- **Prioridad:** Media
- **Tiempo estimado:** 1-2 semanas

**Objetivo:**
Dashboard debe ser diferente para Cliente vs Partner

**Dashboard Cliente debe mostrar:**
- Proyectos activos
- Cotizaciones recibidas
- Contratos en progreso
- Pagos pendientes
- Reviews pendientes

**Dashboard Partner debe mostrar:**
- Oportunidades (proyectos públicos)
- Mis cotizaciones enviadas
- Contratos ganados
- Pipeline de ventas
- Métricas de performance

---

## 📅 ROADMAP DETALLADO

### Sprint 1: CRÍTICO (Semana 1)
**Objetivo:** Hacer que funcione lo básico
**Duración:** 3-4 días
**Esfuerzo:** 15-25 horas

**Tareas:**
- [x] ✅ Performance improvements (ya completado)
- [ ] CRIT-001: Arreglar login partners
- [ ] CRIT-002: Arreglar publicar proyecto
- [ ] CRIT-003: Recuperar contraseña
- [ ] HIGH-001: Headers duplicados
- [ ] HIGH-002: Footers duplicados
- [ ] HIGH-003: Cambiar terminología consultores

**Entregables:**
- Login funcional para todos
- Publicación de proyectos funcional
- Recuperación de contraseña
- UI sin duplicados
- Terminología consistente

---

### Sprint 2: COMPLETAR FUNCIONALIDAD (Semana 2)
**Objetivo:** Mejorar UX y completar básico
**Duración:** 2 días
**Esfuerzo:** 10-15 horas

**Tareas:**
- [ ] HIGH-005: Campo cargo en registro
- [ ] HIGH-006: Botón buscar
- [ ] HIGH-007: Proyectos aparecen en listado
- [ ] MED-001: Scroll top en navegación
- [ ] HIGH-008: Limpiar imagen repetida
- [ ] HIGH-009: Limpiar texto repetido
- [ ] MED-006: Agregar módulos faltantes

**Entregables:**
- Formularios completos
- Búsqueda funcional
- Proyectos visibles
- Navegación mejorada

---

### Sprint 3: REFINAR Y MEJORAR (Semanas 3-4)
**Objetivo:** Pulir detalles y mejorar
**Duración:** 3-4 días
**Esfuerzo:** 15-20 horas

**Tareas:**
- [ ] MED-002: Unificar perfil/configuración
- [ ] MED-003: Mejorar cuadros visuales
- [ ] MED-007: Lista industrias D&B
- [ ] SEC-001: Visibilidad proyectos
- [ ] ARCH-002: Dashboard por usuario
- [ ] MED-005: Opción "ninguna" metodología
- [ ] MED-008: Integraciones SAP

**Entregables:**
- UI más profesional
- Seguridad correcta
- Dashboards optimizados

---

### Sprint 4+: INNOVACIÓN (Meses 2-4)
**Objetivo:** Diferenciación con IA
**Duración:** 2-4 meses
**Esfuerzo:** Iterativo

**Fase 4.1: Assessment IA (Semanas 5-7)**
- [ ] INNOV-001: Diseñar flujo assessment
- [ ] Crear base conocimiento SAP
- [ ] Implementar chat integrado
- [ ] Testing y refinamiento

**Fase 4.2: Mapeo Inteligente (Semanas 8-11)**
- [ ] INNOV-002: IA mapeo business → SAP
- [ ] Training modelo
- [ ] Integración con assessment

**Fase 4.3: Features Avanzadas (Semanas 12-16)**
- [ ] INNOV-003: Preguntas guiadas
- [ ] FEAT-001: Partner-to-Partner
- [ ] Dashboard analytics avanzado

---

## 📊 MÉTRICAS DE ÉXITO

### Sprint 1 (Crítico)
- [ ] 100% bugs críticos resueltos
- [ ] 0 errores en flujos principales
- [ ] Login funciona para ambos tipos de usuario
- [ ] Proyectos se pueden publicar

### Sprint 2 (Completar)
- [ ] 100% funcionalidades básicas completas
- [ ] Búsqueda funcional
- [ ] Todas las páginas tienen navegación correcta

### Sprint 3 (Refinar)
- [ ] UI profesional y consistente
- [ ] Seguridad de visibilidad implementada
- [ ] Dashboards diferenciados

### Sprint 4+ (Innovar)
- [ ] 80%+ usuarios completan assessment
- [ ] Feedback positivo sobre sugerencias IA
- [ ] Tiempo de creación proyecto ≤ actual
- [ ] Calidad de proyectos mejora (menos campos vacíos)

---

## 🎯 DEFINICIONES Y ESTÁNDARES

### Terminología Oficial

| Término | Significado | Usar | No usar |
|---------|-------------|------|---------|
| **Partner SAP** | Empresa consultora certificada | ✅ | Consultor, Proveedor |
| **Cliente** | Empresa que busca servicios | ✅ | Empresa cliente |
| **Consultor** | Profesional individual | Solo si es persona | Como sinónimo de partner |
| **Proyecto** | Necesidad publicada | ✅ | Requerimiento |
| **Cotización** | Propuesta de partner | ✅ | Oferta, Propuesta |

### Estados de Tareas

- ❌ **Pendiente** - No iniciada
- 🔄 **En progreso** - Trabajando activamente
- ✅ **Completada** - Finalizada y testeada
- ⏸️ **En pausa** - Bloqueada o esperando
- 🚫 **Cancelada** - No se hará

### Prioridades

- 🔴 **Crítica** - Bloqueante, no funciona
- 🟡 **Alta** - Importante, afecta UX significativamente
- 🟠 **Media** - Mejora notable pero no urgente
- 🟢 **Baja** - Nice to have, futuro

---

## 📝 NOTAS Y CONSIDERACIONES

### Feedback Original del Usuario

> "En la página de publicar proyectos el header está duplicado"
> "Los textos no deberían hacer referencia a consultores ya que son empresas"
> "Dónde está el assessment? Porque nunca me lo ofreció al registrarme"
> "Muy bien las plantillas para la descripción de los proyectos"
> "Es redundante con la selección de módulos"
> "Una buena alternativa podría ser que en cada sección haya preguntas..."

**Conclusión:** Usuario tiene visión clara de producto centrado en IA que guía al cliente.

### Recomendaciones del Desarrollador

1. **Priorizar Sprint 1** - Sin esto, producto no es usable
2. **Assessment IA es diferenciador clave** - Invertir tiempo aquí
3. **Seguridad de visibilidad** - Subir a alta prioridad
4. **Testing exhaustivo** - Cada sprint necesita testing completo

---

## 🔗 REFERENCIAS

### Documentación Técnica
- [Prisma Schema](/prisma/schema.prisma)
- [NextAuth Config](/lib/auth.ts)
- [API Routes](/app/api/)

### Recursos Externos
- [SAP Documentation](https://help.sap.com/)
- [D&B Industry Classifications](https://www.dnb.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

## 📞 CONTACTO Y SEGUIMIENTO

**Para actualizar este documento:**
1. Cambiar estado de tareas
2. Actualizar fecha de última modificación
3. Añadir notas en sección correspondiente
4. Commit con mensaje descriptivo

**Formato de commits:**
```
[PLAN] Update task CRIT-001 status to completed
[PLAN] Add new task for feature X
[PLAN] Sprint 1 completed, update roadmap
```

---

## 📊 ESTADO ACTUAL (Snapshot)

**Última actualización:** 20 Nov 2025

| Sprint | Estado | Progreso | Siguiente paso |
|--------|--------|----------|----------------|
| Sprint 1 | 🔄 Listo para iniciar | 0% | Arreglar login partners |
| Sprint 2 | ⏸️ Esperando | 0% | Pendiente Sprint 1 |
| Sprint 3 | ⏸️ Esperando | 0% | Pendiente Sprint 2 |
| Sprint 4+ | 📋 Planificación | 0% | Documentar assessment |

**Bloqueadores actuales:** Ninguno

**Decisiones pendientes:**
- Nombre del asistente IA
- ¿Unificar comunicación/notificaciones?
- Prioridad exacta de visibilidad de proyectos

---

*Este es un documento vivo. Se actualiza conforme avanza el proyecto.*

**Versión:** 1.0
**Creado por:** Claude (AI Assistant)
**Aprobado por:** [Pendiente]
