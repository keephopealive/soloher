// Usage: node scripts/unsubscribe-link.mjs someone@example.com [siteUrl]
// Prints the signed unsubscribe link for an address (same format as server-lib/unsubscribe-token.ts).
// Reads UNSUBSCRIBE_SECRET from client/.dev.vars (local only, never committed).
import { createHmac } from 'node:crypto'
import { readFileSync } from 'node:fs'

const email = (process.argv[2] ?? '').trim().toLowerCase()
const siteUrl = (process.argv[3] ?? 'https://soloher.pages.dev').replace(/\/$/, '')
if (!email) {
  console.error('Usage: node scripts/unsubscribe-link.mjs someone@example.com [siteUrl]')
  process.exit(1)
}

const vars = readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8')
const secret = vars.match(/^UNSUBSCRIBE_SECRET=(.+)$/m)?.[1]?.trim()
if (!secret) {
  console.error('UNSUBSCRIBE_SECRET is missing from client/.dev.vars')
  process.exit(1)
}

const token = createHmac('sha256', secret).update(`unsubscribe:${email}`).digest('base64url')
console.log(`${siteUrl}/api/unsubscribe?e=${encodeURIComponent(email)}&t=${token}`)
