// Client-safe shared types for capsule creation

export type CreateCapsuleApiResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export type { ProgressUpdate } from '@/lib/validators'

// Client-facing capsule shape used by the reader UI
export type CapsulePageClient = { page: number; page_title?: string; body: string }

export type CapsuleClient = {
  id: string
  title: string
  description: string
  content: CapsulePageClient[]
  last_page_read?: number
  overall_progress?: number
  bookmarked_date?: string
  last_accessed?: string
}
