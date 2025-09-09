import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import postgres from 'postgres'
import type { User } from '@/lib/definitions'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId as string }
})

export const getSession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return { isAuth: false, userId: null }
  }

  return { isAuth: true, userId: session.userId as string }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const users = await sql<User[]>`
      SELECT id, name, email FROM users WHERE id = ${session.userId}
    `
    const user = users[0]
    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})

export const getUserByEmail = cache(async (email: string) => {
  try {
    const users = await sql<User[]>`
      SELECT * FROM users WHERE email = ${email}
    `
    return users[0]
  } catch (error) {
    console.log('Failed to fetch user by email')
    return null
  }
})
