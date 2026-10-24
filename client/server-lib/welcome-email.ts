// Waitlist welcome email, sent through Resend (https://resend.com) when someone joins.
// The copy and design come straight from mockups/email/ (the approved drafts), so edit those files.
import { unsubscribeUrl } from './unsubscribe-token'
// Wrangler bundles .html and .txt imports as plain text
import htmlTemplate from '../../mockups/email/waitlist-welcome.html'
import textTemplate from '../../mockups/email/waitlist-welcome.txt'

export const SITE_URL = 'https://www.soloherbox.com'
const FROM = 'SoloHer <hello@soloherbox.com>'
const REPLY_TO = 'support@soloherbox.com'

export interface WelcomeEnv {
  RESEND_API_KEY?: string
  UNSUBSCRIBE_SECRET?: string
}

/** Sends the welcome email. Returns false (and sends nothing) until both secrets are set. */
export async function sendWelcomeEmail(env: WelcomeEnv, email: string): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.UNSUBSCRIBE_SECRET) return false

  const unsubscribe = await unsubscribeUrl(SITE_URL, env.UNSUBSCRIBE_SECRET, email)
  const [subjectLine, ...textLines] = textTemplate.replace(/\r\n/g, '\n').split('\n')
  const subject = subjectLine.replace(/^Subject:\s*/, '')
  // Drop the drafting notes (HTML comment) at the top of the design file
  const html = htmlTemplate.replace(/<!--[\s\S]*?-->\s*/, '').split('{{UNSUBSCRIBE_URL}}').join(unsubscribe)
  const text = textLines.join('\n').trim().split('{{UNSUBSCRIBE_URL}}').join(unsubscribe)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      reply_to: REPLY_TO,
      subject,
      html,
      text,
      // Lets Gmail / Apple Mail show their own one-click Unsubscribe button (RFC 8058)
      headers: {
        'List-Unsubscribe': `<${unsubscribe}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  })
  if (!res.ok) console.error('Welcome email failed', res.status, await res.text())
  return res.ok
}
