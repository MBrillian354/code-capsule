import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { redirect } from 'next/navigation'
import postgres from 'postgres'
import type { User } from '@/lib/definitions'

/**
 * Data Access Layer (DAL)
 *
 * This module provides minimal, server-side data access helpers used across the
 * application. It uses the `postgres` client configured via
 * `process.env.POSTGRES_URL` and exposes cached helpers for session
 * verification, user retrieval, and user creation.
 *
 * Notes:
 * - All functions here are designed to run on the server (Next.js server
 *   components / API routes). The file starts with `server-only` to enforce that.
 * - `cache` from React is used to memoize results during a single server
 *   instance lifecycle for performance. Be mindful of cache invalidation when
 *   making changes that should be immediately visible.
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export const verifySession = cache(async () => {
  /**
   * Verify the current request's session cookie and redirect if not
   * authenticated.
   *
   * Behavior:
   * - Reads the `session` cookie using Next's cookies helper.
   * - Attempts to decrypt the cookie payload via `decrypt`.
   * - If no valid session or userId exists, redirects the user to `/login`.
   *
   * Returns:
   * - { isAuth: true, userId: string } when authenticated.
   *
   * Side effects:
   * - Will trigger a client redirect using Next's `redirect` when the
   *   session is missing or invalid. Calling code should expect this side
   *   effect (i.e. this function does not return a falsy value on failure).
   */
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId as string }
})

export const getSession = cache(async () => {
  /**
   * Read the current request session cookie and return an auth shape.
   *
   * Returns:
   * - { isAuth: false, userId: null } when there is no valid session.
   * - { isAuth: true, userId: string } when a valid session exists.
   *
   * Note: unlike `verifySession`, this function does not redirect on missing
   * session; it returns the auth state instead and lets the caller decide how
   * to handle unauthenticated requests.
   */
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return { isAuth: false, userId: null }
  }

  return { isAuth: true, userId: session.userId as string }
})

export const getUser = cache(async () => {
  /**
   * Fetch the currently authenticated user's public profile data.
   *
   * Contract:
   * - Inputs: none (reads session from cookies)
   * - Outputs: User | null
   * - Errors: Returns null when user can't be fetched or session is missing.
   *
   * Edge cases:
   * - If `verifySession` triggers a redirect, this function will not reach
   *   the database call in that execution path.
   */
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
  /**
   * Retrieve a user record by email.
   *
   * Parameters:
   * - email: string - the email address to look up.
   *
   * Returns:
   * - User | null - the first matching user or null on error / not found.
   *
   * Note: this function is cached; if you need the absolute latest row from
   * the DB for the same email within the same server lifecycle, avoid the
   * cached helper and query directly.
   */
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

export const createUser = async (name: string, email: string, hashedPassword: string) => {
  /**
   * Create a new user record.
   *
   * Parameters:
   * - name: string - user's display name
   * - email: string - user's email (should be unique)
   * - hashedPassword: string - password hash (passwords must be hashed by caller)
   *
   * Returns:
   * - string: newly created user's ID on success
   *
   * Throws:
   * - Error when insertion fails. Callers should catch and handle this.
   */
  try {
    const userId = crypto.randomUUID()
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword})
    `
    return userId
  } catch (error) {
    console.log('Failed to create user')
    throw new Error('Failed to create user')
  }
}
