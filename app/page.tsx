
import { Suspense } from 'react'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { StatsSection } from '@/components/landing/stats-section'
import { SAPChatBot } from '@/components/sap-chatbot'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <Suspense fallback={null}>
        <SAPChatBot />
      </Suspense>
    </>
  )
}
