
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ReviewsHub } from '@/components/reviews/reviews-hub'

export const metadata: Metadata = {
  title: 'Centro de Reviews y Calificaciones - SAP Marketplace',
  description: 'Sistema bidireccional verificado de reviews y calificaciones entre clientes y proveedores SAP'
}

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  return <ReviewsHub />
}
