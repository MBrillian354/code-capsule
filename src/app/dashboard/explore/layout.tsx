import React from 'react'
import { getSession, getUser } from '@server/queries'
import ExploreClient from './ExploreClient'

export default async function ExploreLayout({ children }: { children: React.ReactNode }) {
  // Get session without requiring authentication (since this is public)
  const session = await getSession()
  
  // Get user data if authenticated
  const user = session.isAuth ? await getUser() : null

  return <ExploreClient user={user}>{children}</ExploreClient>
}
