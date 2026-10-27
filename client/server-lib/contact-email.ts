// Emails each Contact section message to the support inbox. Reply goes straight to the visitor.
import { sendEmail, SUPPORT_EMAIL, type ResendEnv } from './resend'

export interface ContactMessage {
  name: string
  email: string
  topic: string
  message: string
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function sendContactEmail(env: ResendEnv, m: ContactMessage): Promise<boolean> {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#9B7B45;font-size:12px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">${label}</td><td style="padding:4px 0;color:#2A1020;">${escapeHtml(value)}</td></tr>`
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2A1020;">
<p style="margin:0 0 16px;">New message from the Contact form on soloherbox.com. Reply to this email to answer ${escapeHtml(m.name)} directly.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">${row('Name', m.name)}${row('Email', m.email)}${row('Topic', m.topic)}</table>
<div style="padding:16px 20px;background:#FAF5F8;border-left:3px solid #C9A96E;white-space:pre-wrap;">${escapeHtml(m.message)}</div>
</div>`
  const text = `New message from the Contact form on soloherbox.com. Reply to this email to answer ${m.name} directly.

Name: ${m.name}
Email: ${m.email}
Topic: ${m.topic}

${m.message}`

  return sendEmail(env, {
    to: [SUPPORT_EMAIL],
    reply_to: m.email,
    subject: `Contact form: ${m.topic} from ${m.name}`.replace(/[\r\n]+/g, ' '),
    html,
    text,
  })
}
