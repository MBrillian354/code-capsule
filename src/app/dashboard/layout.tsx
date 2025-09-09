import React from 'react'
import { verifySession } from '@/lib/dal'
import DashboardClient from '@/app/dashboard/dashboard-client'

export default async function Layout({ children }: { children: React.ReactNode }) {
  // This will redirect to login if not authenticated
  await verifySession()

  return <DashboardClient>{children}</DashboardClient>
}
