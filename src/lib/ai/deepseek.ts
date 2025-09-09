import 'server-only'
import OpenAI from 'openai'

// OpenAI-compatible client for DeepSeek
// Requires env var DEEPSEEK_API_KEY
// Optional: DEEPSEEK_BASE_URL (defaults to https://api.deepseek.com)

const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

export function createDeepseekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set')
  }
  return new OpenAI({ apiKey, baseURL })
}

export type CapsulePage = { page: number; page_title: string; body: string }

export type CapsuleGen = {
  title: string
  description: string
  pages: CapsulePage[]
}

export async function generateCapsuleWithDeepseek(input: {
  url: string
  markdown: string
  chunkSummaries: { index: number; text: string }[]
  model?: string
}): Promise<CapsuleGen> {
  const model = input.model || 'deepseek-chat'

  const system = `You are a senior technical editor who transforms articles into structured learning capsules.
- Produce concise, accurate, well-formatted Markdown.
- Keep code fences and lists where appropriate.
- Avoid hallucination; if content is missing, omit it.
- Use neutral tone.
`

  // Single JSON response containing title, description, and pages.
  const user = JSON.stringify({
    task: 'Create capsule',
    url: input.url,
    article_markdown: input.markdown,
    chunks: input.chunkSummaries,
    required_schema: {
      title: 'string',
      description: 'string',
      pages: [{ page: 'number', page_title: 'string', body: 'markdown string' }],
    },
    rules: [
      'Return strict JSON only with keys: title, description, pages',
      'pages must start at page = 1 and be sequential',
      'page_title <= 60 chars; body is Markdown',
      'No commentary outside JSON',
    ],
  })

  const client = createDeepseekClient()
  const resp = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const content = resp.choices?.[0]?.message?.content || '{}'
  return JSON.parse(content)
}
