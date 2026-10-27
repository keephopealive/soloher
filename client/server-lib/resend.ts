// Minimal Resend client (https://resend.com/docs/api-reference/emails/send-email).
// The API key is the Cloudflare Pages secret RESEND_API_KEY; without it nothing is sent.

export const FROM = 'SoloHer <hello@soloherbox.com>'
export const SUPPORT_EMAIL = 'support@soloherbox.com'

export interface ResendEnv {
  RESEND_API_KEY?: string
}

export interface EmailMessage {
  to: string[]
  subject: string
  html: string
  text: string
  reply_to?: string
  headers?: Record<string, string>
}

/** Returns false (and sends nothing) when the API key isn't set or Resend rejects the email. */
export async function sendEmail(env: ResendEnv, message: EmailMessage): Promise<boolean> {
  if (!env.RESEND_API_KEY) return false
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, ...message }),
  })
  if (!res.ok) console.error('Email failed', res.status, await res.text())
  return res.ok
}
