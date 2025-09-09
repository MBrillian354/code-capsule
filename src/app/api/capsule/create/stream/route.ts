import { NextResponse } from 'next/server'
import { createCapsuleFromUrl } from '@/lib/capsules'
import { CreateByUrlSchema } from '@/lib/validators'
import { sseFormat } from '@/lib/sse'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  const parsed = CreateByUrlSchema.safeParse({ url })
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder()

      const send = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(sseFormat(event, payload)))
      }

      try {
        // Kick off progress
        send('progress', { step: 'fetching', message: 'Fetching content from URL...' })

        const result = await createCapsuleFromUrl(parsed.data.url, (update) => {
          send('progress', update)
        })

        if (result.ok) {
          send('completed', { id: result.id })
        } else {
          send('failed', { error: result.error })
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error'
        send('failed', { error })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
