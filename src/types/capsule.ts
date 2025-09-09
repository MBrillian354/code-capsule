// Client-safe shared types for capsule creation

export type CreateCapsuleApiResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export type ProgressUpdate = {
  step:
    | 'fetching'
    | 'extracting'
    | 'chunking'
    | 'generating'
    | 'finalizing'
    | 'completed'
    | 'failed'
  message: string
  error?: string
  capsuleId?: string
}
