// Emails the team each time someone joins (or rejoins) the waitlist, with where they came from.
import { sendEmail, SUPPORT_EMAIL, type ResendEnv } from './resend'

/** Inbox that gets the sign-up notifications */
export const NOTIFY_EMAIL = SUPPORT_EMAIL

export interface WaitlistSignup {
  email: string
  source: string | null
  utm: { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_content: string | null }
  /** Active (not unsubscribed) sign-ups including this one, if known */
  total: number | null
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function sendWaitlistNotification(env: ResendEnv, s: WaitlistSignup): Promise<boolean> {
  const fields: [string, string][] = [
    ['Email', s.email],
    ['Signed up from', s.source ?? 'unknown'],
    ['utm_source', s.utm.utm_source ?? '-'],
    ['utm_medium', s.utm.utm_medium ?? '-'],
    ['utm_campaign', s.utm.utm_campaign ?? '-'],
    ['utm_content', s.utm.utm_content ?? '-'],
  ]
  const intro = `New waitlist sign-up on soloherbox.com${s.total ? `. The list now has ${s.total} people.` : '.'}`
  const row = ([label, value]: [string, string]) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#9B7B45;font-size:12px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">${label}</td><td style="padding:4px 0;color:#2A1020;">${escapeHtml(value)}</td></tr>`
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2A1020;">
<p style="margin:0 0 16px;">${escapeHtml(intro)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0">${fields.map(row).join('')}</table>
</div>`
  const text = `${intro}\n\n${fields.map(([l, v]) => `${l}: ${v}`).join('\n')}`

  return sendEmail(env, {
    to: [NOTIFY_EMAIL],
    subject: `New waitlist sign-up: ${s.email}${s.utm.utm_source ? ` (${s.utm.utm_source})` : ''}`.replace(/[\r\n]+/g, ' '),
    html,
    text,
  })
}
