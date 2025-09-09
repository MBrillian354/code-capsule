// Client-safe shared types for capsule creation

export type CreateCapsuleApiResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export type { ProgressUpdate } from '@/lib/validators'
