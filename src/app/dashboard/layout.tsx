import React from 'react'
import { verifySession, getUser } from '@/lib/dal'
import DashboardClient from '@/app/ui/dashboard/dashboard-client'

export default async function Layout({ children }: { children: React.ReactNode }) {
  // This will redirect to login if not authenticated
  await verifySession()
  
  // Get the authenticated user's data
  const user = await getUser()

  return <DashboardClient user={user}>{children}</DashboardClient>
}

// Personalized dashboard must be dynamic
export const dynamic = 'force-dynamic'
