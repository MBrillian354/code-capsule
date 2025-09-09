import { z } from 'zod'

export const CapsulePageSchema = z.object({
  page: z.number().int().positive(),
  page_title: z.string().min(1).max(120),
  body: z.string().min(1),
})

export const CapsuleSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  pages: z.array(CapsulePageSchema).min(1),
})

export type CapsuleValidated = z.infer<typeof CapsuleSchema>

export const CreateByUrlSchema = z.object({ url: z.string().url() })
