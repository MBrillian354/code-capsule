import 'server-only'
import TurndownService from 'turndown'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'
import unfluff from 'unfluff'

export function isValidHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw)
    if (!['http:', 'https:'].includes(u.protocol)) return false
    // Disallow obvious local/private
    const host = u.hostname.toLowerCase()
    if (process.env.BLOCK_PRIVATE_URLS === '1') {
      const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(host)
      const isLocal = host === 'localhost' || host.endsWith('.local') || host.endsWith('.home')
      const isPrivateIp = isIp && (
        host.startsWith('10.') ||
        host.startsWith('127.') ||
        host.startsWith('192.168.') ||
        host.startsWith('172.16.') || host.startsWith('172.17.') || host.startsWith('172.18.') || host.startsWith('172.19.') || host.startsWith('172.2')
      )
      if (isLocal || isPrivateIp) return false
    }
    return true
  } catch {
    return false
  }
}

export async function fetchHtml(url: string, opts?: { timeoutMs?: number }): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 15000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (CapsuleBot/1.0; +https://example.com)'
      },
      redirect: 'follow',
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(timeout)
  }
}

export type Extracted = { title?: string; contentHtml: string }

export function extractMainContent(url: string, html: string): Extracted {
  const dom = new JSDOM(html, { url })
  const doc = dom.window.document
  const reader = new Readability(doc)
  const article = reader.parse()
  if (article?.content) {
    return { title: article.title || undefined, contentHtml: article.content }
  }
  // Fallback to unfluff
  const data = unfluff(html)
  const combined = `<article>${data.text}</article>`
  return { title: data.title || undefined, contentHtml: combined }
}

export function htmlToMarkdown(html: string): string {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })
  return td.turndown(html)
}

export type Chunk = { index: number; markdown: string }

export function chunkMarkdown(md: string, opts?: { maxLen?: number }): Chunk[] {
  const maxLen = opts?.maxLen ?? 2200
  // Try split by H2/H3 first
  const parts = md.split(/\n(?=##?\s+)/g)
  const chunks: Chunk[] = []
  let buffer = ''
  let idx = 0
  const flush = () => {
    const text = buffer.trim()
    if (text) chunks.push({ index: idx++, markdown: text })
    buffer = ''
  }
  for (const p of parts) {
    if ((buffer + '\n' + p).length > maxLen) {
      flush()
      buffer = p
    } else {
      buffer = buffer ? buffer + '\n' + p : p
    }
  }
  flush()
  if (chunks.length === 0) {
    // size-based fallback
    for (let i = 0; i < md.length; i += maxLen) {
      chunks.push({ index: chunks.length, markdown: md.slice(i, i + maxLen) })
    }
  }
  return chunks
}

export function summarizeChunkForLLM(md: string, limit = 500): string {
  const s = md.replace(/\s+/g, ' ').trim()
  return s.slice(0, limit)
}
