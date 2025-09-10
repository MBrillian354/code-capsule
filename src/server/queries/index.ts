import 'server-only'
import { redirect } from 'next/navigation'
import type { User, CapsuleWithProgress } from '@/lib/definitions'
import { getSession as _getSession } from '@/server/auth/session'
import { getUserByEmail as _getUserByEmail, createUser as _createUser, getUserById } from '@/server/repositories/users.repo'
import { insertCapsule as _insertCapsule, getCapsule as _getCapsule, listCapsulesByUser, listCapsulesWithCreator, getCapsuleWithCreator } from '@/server/repositories/capsules.repo'
import { getUserCapsule as _getUserCapsule, upsertUserCapsule as _upsertUserCapsule, listUserCapsules, listBookmarkedCapsules, listCapsulesWithUserProgress as _listCapsulesWithUserProgress } from '@/server/repositories/userCapsules.repo'

// Auth helpers with same shape as previous DAL
export const getSession = _getSession

export async function verifySession() {
  const session = await _getSession()
  if (!session.isAuth || !session.userId) {
    redirect('/login')
  }
  return { isAuth: true as const, userId: session.userId! }
}

export const getUserByEmail = _getUserByEmail
export const createUser = (name: string, email: string, hashedPassword: string) => _createUser({ name, email, hashedPassword })

export const insertCapsule = _insertCapsule

export const getCapsule = _getCapsule
export const getUserCapsule = _getUserCapsule
export const upsertUserCapsule = _upsertUserCapsule

export const getUser = async (): Promise<User | null> => {
  const sess = await verifySession()
  return getUserById(sess.userId)
}

export const getUserCapsules = async (userId: string) => listCapsulesByUser(userId)

export const getUserCapsulesWithProgress = async (userId: string): Promise<CapsuleWithProgress[]> => {
  return (await listUserCapsules(userId)) as unknown as CapsuleWithProgress[]
}

type ProgressRow = CapsuleWithProgress
export const getContinueLearningCapsule = async (userId: string): Promise<CapsuleWithProgress | null> => {
  const items = await listUserCapsules(userId) as unknown as ProgressRow[]
  const progressed = items.filter((c) => (c.overall_progress ?? 0) > 0)
  progressed.sort((a, b) => {
    const la = a.last_accessed ? Date.parse(a.last_accessed) : 0
    const lb = b.last_accessed ? Date.parse(b.last_accessed) : 0
    if (lb !== la) return lb - la
    const ca = a.created_at ? Date.parse(a.created_at) : 0
    const cb = b.created_at ? Date.parse(b.created_at) : 0
    return cb - ca
  })
  return progressed[0] ?? null
}

export const getRecentlyCreatedCapsules = async (userId: string, limit = 3): Promise<CapsuleWithProgress[]> => {
  const items = (await listCapsulesByUser(userId)) as unknown as CapsuleWithProgress[]
  return items.slice(0, limit)
}

export const getBookmarkedCapsules = async (userId: string, limit = 20, offset = 0) => listBookmarkedCapsules(userId, limit, offset)

export const getAllPublicCapsules = async (limit = 20, offset = 0) => listCapsulesWithCreator(limit, offset)

export const getAllPublicCapsulesWithUserProgress = async (userId: string | null, limit = 20, offset = 0) => {
  if (userId) return _listCapsulesWithUserProgress(userId, limit, offset)
  return listCapsulesWithCreator(limit, offset)
}

export const getCapsuleWithUserProgress = async (capsuleId: string, userId?: string | null) => {
  const base = await getCapsuleWithCreator(capsuleId)
  if (!base) return null
  if (!userId) return base
  const uc = await _getUserCapsule(userId, capsuleId)
  return {
    ...base,
    last_page_read: uc?.last_page_read ?? null,
    overall_progress: uc?.overall_progress ?? null,
    bookmarked_date: uc?.bookmarked_date ?? null,
    last_accessed: uc?.last_accessed ?? null,
  }
}
