import 'server-only'
import type { User } from '@/lib/definitions'
import { sql } from '@/server/db/client'

export async function getUserById(id: string): Promise<User | null> {
  const rows = await sql<User[]>`SELECT id, name, email, password FROM users WHERE id = ${id}`
  return rows[0] ?? null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await sql<User[]>`SELECT id, name, email, password FROM users WHERE email = ${email}`
  return rows[0] ?? null
}

export async function createUser(params: { id?: string; name: string; email: string; hashedPassword: string }): Promise<string> {
  const id = params.id ?? crypto.randomUUID()
  await sql`INSERT INTO users (id, name, email, password) VALUES (${id}, ${params.name}, ${params.email}, ${params.hashedPassword})`
  return id
}
