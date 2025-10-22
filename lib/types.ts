
// Extended NextAuth types
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      userType: 'CLIENT' | 'PROVIDER'
      isVerified: boolean
    } & DefaultSession['user']
  }

  interface User {
    userType: 'CLIENT' | 'PROVIDER'
    isVerified: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType: 'CLIENT' | 'PROVIDER'
    isVerified: boolean
  }
}

// Application types
export interface ClientProfile {
  id: string
  companyName: string
  industry: string
  companySize: string
  website?: string
  description?: string
  logo?: string
  country: string
  city: string
  contactName: string
  contactTitle: string
  phoneNumber?: string
}

export interface ProviderProfile {
  id: string
  companyName: string
  description: string
  website?: string
  logo?: string
  country: string
  city: string
  foundedYear?: number
  employeeCount: string
  isPartner: boolean
  partnerLevel?: 'SILVER' | 'GOLD' | 'PLATINUM'
  partnerSince?: Date
  averageRating: number
  totalProjects: number
  totalReviews: number
  certifications: Certification[]
  competencies: ProviderCompetency[]
  specializations: ProviderSpecialization[]
  portfolioItems: PortfolioItem[]
}

export interface Certification {
  id: string
  name: string
  level: 'ASSOCIATE' | 'SPECIALIST' | 'PROFESSIONAL'
  sapModule: string
  obtainedDate: Date
  expiryDate?: Date
  certificateId?: string
  isVerified: boolean
}

export interface ProviderCompetency {
  id: string
  lobName: string
  level: 'ESSENTIAL' | 'ADVANCED' | 'EXPERT'
  isVerified: boolean
  obtainedDate: Date
}

export interface ProviderSpecialization {
  id: string
  name: string
  sapProduct: string
  isVerified: boolean
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  industry: string
  sapModules: string[]
  methodology: string
  projectValue?: string
  duration: string
  teamSize?: string
  clientTestimonial?: string
  screenshot?: string
  startDate: Date
  endDate: Date
  isPublic: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  requirements: string
  industry: string
  sapModules: string[]
  methodology?: string
  budget: string
  timeline: string
  teamSize?: string
  status: 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  publishedAt?: Date
  deadline?: Date
  country: string
  city?: string
  isRemote: boolean
  client: {
    id: string
    name: string
    clientProfile?: ClientProfile
  }
  quotations?: Quotation[]
  _count?: {
    quotations: number
  }
}

export interface Quotation {
  id: string
  title: string
  description: string
  approach: string
  timeline: string
  totalCost: number
  currency: string
  teamComposition?: string
  methodology: string
  paymentTerms: string
  includedServices: string[]
  assumptions?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  validUntil: Date
  submittedAt: Date
  respondedAt?: Date
  project: Project
  provider: {
    id: string
    name: string
    providerProfile?: ProviderProfile
  }
}

export const SAP_MODULES = [
  { value: 'FI', label: 'Finance (FI)' },
  { value: 'CO', label: 'Controlling (CO)' },
  { value: 'SD', label: 'Sales & Distribution (SD)' },
  { value: 'MM', label: 'Materials Management (MM)' },
  { value: 'PP', label: 'Production Planning (PP)' },
  { value: 'PM', label: 'Plant Maintenance (PM)' },
  { value: 'PS', label: 'Project System (PS)' },
  { value: 'HR', label: 'Human Resources (HR)' },
  { value: 'WM', label: 'Warehouse Management (WM)' },
  { value: 'QM', label: 'Quality Management (QM)' }
]

export const INDUSTRIES = [
  { value: 'manufacturing', label: 'Manufactura' },
  { value: 'retail', label: 'Retail' },
  { value: 'finance', label: 'Financiero' },
  { value: 'healthcare', label: 'Salud' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'automotive', label: 'Automotriz' },
  { value: 'technology', label: 'Tecnología' },
  { value: 'consulting', label: 'Consultoría' },
  { value: 'other', label: 'Otro' }
]

export const BUDGET_RANGES = [
  { value: '10k-50k', label: '$10K - $50K' },
  { value: '50k-100k', label: '$50K - $100K' },
  { value: '100k-250k', label: '$100K - $250K' },
  { value: '250k-500k', label: '$250K - $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m+', label: '$1M+' }
]

export const TIMELINE_RANGES = [
  { value: '1-3m', label: '1-3 meses' },
  { value: '3-6m', label: '3-6 meses' },
  { value: '6-12m', label: '6-12 meses' },
  { value: '12m+', label: '12+ meses' }
]
