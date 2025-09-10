import 'server-only'
import postgres from 'postgres'

// Central Postgres client for server-side data access
// Prefer importing this from repositories instead of creating new clients.

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })
