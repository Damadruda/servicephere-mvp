
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ClientDashboard } from '@/components/dashboard/client-dashboard'
import { ProviderDashboard } from '@/components/dashboard/provider-dashboard'

export const metadata = {
  title: 'Dashboard - SAP Marketplace',
  description: 'Panel de control de SAP Marketplace'
}

export default async function DashboardPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  if (session.user.userType === 'CLIENT') {
    return <ClientDashboard />
  } else {
    return <ProviderDashboard />
  }
}
