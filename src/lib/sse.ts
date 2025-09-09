// Small utilities for Server-Sent Events (SSE)
// Kept framework-agnostic for reuse across API routes

export function sseFormat(event: string, data: unknown): string {
  return `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
}
