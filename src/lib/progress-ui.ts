import type { ProgressStep } from '@/lib/validators'

export const stepMessages: Record<ProgressStep, string> = {
  fetching: 'Fetching content from URL...',
  extracting: 'Extracting main content...',
  chunking: 'Processing content...',
  generating: 'Generating capsule with AI...',
  finalizing: 'Saving capsule...',
  completed: 'Capsule created successfully!',
  failed: 'Failed to create capsule',
}

export const stepProgress: Record<ProgressStep, number> = {
  fetching: 20,
  extracting: 40,
  chunking: 60,
  generating: 80,
  finalizing: 95,
  completed: 100,
  failed: 0,
}

export const stepOrder: ProgressStep[] = [
  'fetching',
  'extracting',
  'chunking',
  'generating',
  'finalizing',
  'completed',
  'failed',
]
