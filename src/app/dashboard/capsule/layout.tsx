import React from 'react'
import { getSession, getUser } from '@server/queries'
import ExploreClient from '../explore/ExploreClient'

export default async function CapsuleLayout({ children }: { children: React.ReactNode }) {
  // Get session without requiring authentication (since learning is public)
  const session = await getSession()
  
  // Get user data if authenticated
  const user = session.isAuth ? await getUser() : null

  return <ExploreClient user={user}>{children}</ExploreClient>
}
