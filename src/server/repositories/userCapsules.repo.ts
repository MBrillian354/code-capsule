import 'server-only'
import { sql } from '@/server/db/client'

export async function getUserCapsule(userId: string, capsuleId: string) {
  const rows = await sql`SELECT id, user_id, capsule_id, last_page_read, overall_progress, bookmarked_date, last_accessed FROM user_capsules WHERE user_id = ${userId} AND capsule_id = ${capsuleId}`
  return rows[0] ?? null
}

export async function upsertUserCapsule(params: {
  userId: string
  capsuleId: string
  lastPageRead?: number | null
  overallProgress?: number | null
  bookmarkedDate?: string | null
  lastAccessed?: string | null
}) {
  const { userId, capsuleId, lastPageRead, overallProgress, bookmarkedDate, lastAccessed } = params
  const providedLastPage = Object.prototype.hasOwnProperty.call(params, 'lastPageRead')
  const providedProgress = Object.prototype.hasOwnProperty.call(params, 'overallProgress')
  const providedBookmarked = Object.prototype.hasOwnProperty.call(params, 'bookmarkedDate')
  const providedLastAccessed = Object.prototype.hasOwnProperty.call(params, 'lastAccessed')

  const existing = await sql`SELECT id FROM user_capsules WHERE user_id = ${userId} AND capsule_id = ${capsuleId}`
  if (existing.length) {
    const id = existing[0].id as string
    if (providedLastPage) {
      await sql`UPDATE user_capsules SET last_page_read = ${lastPageRead ?? null} WHERE user_id = ${userId} AND capsule_id = ${capsuleId}`
    }
    if (providedProgress) {
      await sql`UPDATE user_capsules SET overall_progress = ${overallProgress ?? null} WHERE user_id = ${userId} AND capsule_id = ${capsuleId}`
    }
    if (providedBookmarked) {
      await sql`UPDATE user_capsules SET bookmarked_date = ${bookmarkedDate ?? null} WHERE user_id = ${userId} AND capsule_id = ${capsuleId}`
    }
    if (providedLastAccessed) {
      await sql`UPDATE user_capsules SET last_accessed = ${lastAccessed ?? null} WHERE user_id = ${userId} AND capsule_id = ${capsuleId}`
    }
    return id
  }
  const id = crypto.randomUUID()
  await sql`INSERT INTO user_capsules (id, user_id, capsule_id, last_page_read, overall_progress, bookmarked_date, last_accessed) VALUES (${id}, ${userId}, ${capsuleId}, ${lastPageRead ?? null}, ${overallProgress ?? null}, ${bookmarkedDate ?? null}, ${lastAccessed ?? null})`
  return id
}

export async function listUserCapsules(userId: string) {
  return await sql`SELECT id, title, total_pages, created_at, content, uc.last_page_read, uc.overall_progress, uc.bookmarked_date, uc.last_accessed FROM capsules c LEFT JOIN user_capsules uc ON c.id = uc.capsule_id AND uc.user_id = ${userId} WHERE c.created_by = ${userId} ORDER BY uc.last_accessed DESC NULLS LAST, c.created_at DESC`
}

export async function listBookmarkedCapsules(userId: string, limit = 20, offset = 0) {
  return await sql`SELECT c.id, c.title, c.total_pages, c.created_at, c.content, u.name as creator_name, uc.last_page_read, uc.overall_progress, uc.bookmarked_date, uc.last_accessed FROM capsules c JOIN user_capsules uc ON c.id = uc.capsule_id AND uc.user_id = ${userId} LEFT JOIN users u ON c.created_by = u.id WHERE uc.bookmarked_date IS NOT NULL ORDER BY uc.bookmarked_date DESC LIMIT ${limit} OFFSET ${offset}`
}

export async function listCapsulesWithUserProgress(userId: string, limit = 20, offset = 0) {
  return await sql`SELECT c.id, c.title, c.total_pages, c.created_at, c.content, u.name as creator_name, uc.last_page_read, uc.overall_progress, uc.bookmarked_date, uc.last_accessed FROM capsules c LEFT JOIN users u ON c.created_by = u.id LEFT JOIN user_capsules uc ON c.id = uc.capsule_id AND uc.user_id = ${userId} ORDER BY c.created_at DESC LIMIT ${limit} OFFSET ${offset}`
}
