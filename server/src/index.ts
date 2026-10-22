import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'

const app = express()
const PORT = process.env.PORT ?? 3001
const isProd = process.env.NODE_ENV === 'production'

app.use(cors({ origin: isProd ? false : 'http://localhost:3000' }))
app.use(express.json())

// In production, serve the built React app
if (isProd) {
  const staticPath = path.join(__dirname, '../../client/dist')
  app.use(express.static(staticPath))
}

// Simple lead-capture endpoint — wire to your email/CRM/Stripe in production
app.post('/api/subscribe', (req: Request, res: Response) => {
  const { name, email, box, purchaseType } = req.body as {
    name?: string
    email?: string
    box?: string
    purchaseType?: string
  }

  if (!name || !email || !box) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  // Log the lead (replace with Stripe / Klaviyo / Mailchimp integration)
  console.log(`[Lead] ${name} <${email}> — ${box} — ${purchaseType}`)

  res.json({ success: true })
})

// Local stand-in for the Cloudflare /api/contact function (messages are only logged here)
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, topic, message } = req.body as Record<string, string | undefined>
  if (!name || !email || !message) {
    res.status(400).json({ ok: false, error: 'Please fill in your name, email and message.' })
    return
  }
  console.log(`[Contact] ${name} <${email}> (${topic}): ${message}`)
  res.json({ ok: true })
})

// Catch-all: serve React app in production
if (isProd) {
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`SoloHer server running on http://localhost:${PORT}`)
})
