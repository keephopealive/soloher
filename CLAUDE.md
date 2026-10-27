# SoloHer website: project reference

SoloHer is a subscription box for women: each box pairs a 375 mL wine, a bath bomb and an
original short story around a mood. This file is the source of truth for what the site does,
how it is built and deployed, and the decisions behind it. **Keep it updated when features change.**

## One codebase, two versions

Both versions are built from `master` (work on `main-updates`, then merge). Everything is shared; only the
calls to action differ, set by `VITE_SALES_MODE` (read in `client/src/config.ts` as `WAITLIST_MODE`).

| | Waitlist version (public now) | Selling version (testing) |
|---|---|---|
| `VITE_SALES_MODE` | `waitlist` (in `.env.cloudflare`) | unset / `sell` |
| Live at | https://www.soloherbox.com (Cloudflare Pages project `soloher`, also soloher.pages.dev) | https://keephopealive.github.io/soloher (GitHub Pages) |
| Calls to action | Hero email form, navbar + box cards open `WaitlistModal` | Subscribe / Gift buttons, order `Modal.tsx` (no real checkout yet) |
| Deploy (in `client/`) | `npm run deploy:cloudflare` | `npm run deploy` |
| Local preview | `npm run dev:waitlist` (port 3002, launch entry `soloher-waitlist`) | `npm run dev` (port 3000) |

- Waitlist version per component: Hero shows `WaitlistForm`; box cards show "Launching soon", "Join the Waitlist" (box name saved as source) and the prices as a note, replacing the Monthly/One-time toggle; navbar CTA reads "Join the Waitlist". Customizer, Log in, FAQ, Contact, footer and legal popups are identical.
- `deploy:cloudflare` only runs on `master` (`scripts/check-branch.mjs`).
- **Launch day**: set `VITE_SALES_MODE=sell` in `.env.cloudflare`, run `npm run deploy:cloudflare`, then attach the custom domain.
- The old `presale` branch is retired (kept for history; its old site code no longer gets updates).

## Domain (soloherbox.com, registered and DNS at GoDaddy)

- `www` is a CNAME to `soloher.pages.dev`, added as a custom domain on the Cloudflare Pages project (set up 2026-10-23).
- Bare `soloherbox.com` (A `@`) still points to an old GoDaddy Website Builder site; plan: GoDaddy Forwarding (301, forward only) to https://www.soloherbox.com.
- **Don't touch**: `qr` CNAME to dns-soloher.liquorpilot.com (QR code, plus its `_...qr` acm-validation record), `pay` (GoDaddy paylinks), other `_...acm-validations.aws` records, Google Workspace email records (MX, SPF/TXT, `google._domainkey`, `_dmarc`).

## Working rules (from the user)

- **Deploys are manual**: only deploy when the user asks. They rejected automatic (GitHub Actions) deploys.
- **`master` and `presale` stay synced with GitHub**: a local `.git/hooks/post-commit` hook auto-pushes them after every commit (log: `.git/autopush.log`). Push manually if a push failed.
- Commit messages end with the Co-Authored-By line from the system reminder.
- Don't invent claims in copy (launch dates, "real authors", discounts, reviews). Flag unverified claims.
- Prefer showing the change on localhost and verifying before reporting done.

## Tech stack and layout

- `client/`: React 18 + TypeScript + Vite 5. All styles in `client/src/index.css` (CSS variables, no CSS framework).
- `client/functions/api/*.ts`: Cloudflare Pages Functions (run only on Cloudflare, not GitHub Pages).
- `client/server-lib/`: code shared by functions (e.g. signed unsubscribe tokens).
- `client/db/waitlist-schema.sql`: D1 schema. `client/wrangler.toml`: Pages config + D1 binding `DB`.
- `server/`: original Express dev server (`POST /api/subscribe` only logs leads). Used by `npm run dev` locally; not deployed anywhere.
- `mockups/`: design assets not shipped with the site (box illustration, email draft).
- Fonts: Cormorant Garamond (serif) + DM Sans (sans), from Google Fonts.

### Build targets
- `vite.config.ts`: `base` is `/soloher/` (GitHub Pages) or `/` with `--mode cloudflare`.
- `.env.production` / `.env.cloudflare` set `VITE_SITE_URL`, used in `index.html` link-preview tags (`%VITE_SITE_URL%`).
- Dev server: port 3000 (`/soloher/`), proxies `/api` to the Express server on 3001. `.claude/launch.json` has `soloher` and `soloher-api` entries.
- Vite watches with polling (`usePolling`) because the Windows watcher missed rapid saves and served stale files.
- Wrangler is pinned to **3.114.17** (last version supporting this machine's Node 20; Wrangler 4 needs Node 22).

## Page structure and features

Section order: **hero → boxes → story → FAQ → contact → footer**. Testimonials are hidden on both sites (main: commented out in `App.tsx` and `NAV_LINKS`, easy to restore). Backgrounds alternate light/pink.

### Global
- **Age gate** (`AgeGate.tsx`): full-screen 21+ check on first visit; "under 21" blocks with a go-back link; answer remembered in `localStorage` (`soloher-age-verified`).
- **Dark mode** (`useTheme.ts`): sun/moon toggle in the navbar. Saved in `localStorage` (`soloher-theme`); first visit follows the device setting; inline script in `index.html` applies the theme before paint (no flash). Dark palette = `:root[data-theme="dark"]` variables in `index.css` (deep plum, brighter rose, same gold). Theme-able values (hero gradient, navbar/menu backgrounds, overlays, photo glow) are CSS variables; add new colors as variables, not hard-coded.
- **Navbar**: SOLOHER wordmark image, links from shared `NAV_LINKS` (main: Boxes · Experience · FAQ · Contact; Experience = story section) (also used by the phone menu and footer), theme toggle, "Log in" button (icon only on phones; also in the phone menu), CTA button. Log in and footer "My Account" open `AccountModal.tsx`, an "Accounts are coming soon" placeholder with the support email (main only). Phone menu is rendered via a portal to `<body>` (the scrolled navbar's `backdrop-filter` otherwise traps it).
- **Gentle scroll snapping** between sections on screens > 900px (`scroll-snap-type: y proximity`). Sections are sized to fit a 1440×900 screen.
- **Legal popups** (`LegalModal.tsx`): Privacy Policy, Terms of Service, Age Verification from the footer. **Draft text, needs lawyer review.** Main site: short versions, no "last updated" date, no claims about how card data is stored, refund terms match the FAQ.
- **Branding**: logo from the brand artwork in `client/src/assets/` (`logo-wordmark.webp` navbar, `logo-full.webp` footer/age gate); `public/favicon.png` is the plant mark. On light backgrounds the logo gold is deepened via `--logo-on-light`.
- **Google Analytics 4**: property for www.soloherbox.com, measurement ID `G-PCEV1D7VVM` in `VITE_GA_ID` (`.env.cloudflare` only). A small plugin in `vite.config.ts` adds the gtag to production builds when it's set, so GitHub Pages and local dev send nothing. Waitlist sign-ups fire a `generate_lead` event (with `source`) from `WaitlistForm.tsx`. No cookie banner yet.
- **Link previews**: `public/og-image.jpg` (1200×630), title "SoloHer | The Moment Is Yours.".

### Hero
- Headline "The ___ Is *Yours.*" with the word rotating Evening → Moment → Time every 3 s (crossfade; respects reduced motion).
- Product photo: `assets/story-box.webp` (complete open-box cut-out). The user tried and rejected a flat-lay alternative; earlier photo had a clipped corner.
- Main: buttons "Start My Monthly Ritual · $99.99" and "Gift One Ritual · $124.99" scroll to the boxes with Monthly / One-time preselected. Pre-sale: inline waitlist email form.
- "Discover" cue scrolls to the boxes.

### Boxes ("Choose Your Experience")
- Three cards in `BoxSelector.tsx`. Rows align across cards via CSS subgrid (`.box-card` spans 10 shared rows; 11 where the pairing customizer is present).
- **Catalog** (main site, from branch `main-updates`): `client/src/data/products.ts` holds all wines, bath bombs and boxes (recommended pairing per box). Cards, customizer and order modal read from it; add products there only.
- **Pairing customizer** (main site): "Customize your pairing" on each card opens `PairingCustomizer.tsx` (story locked, wines grouped under Red / White / Rosé headings with a color swatch and matching tile edge (--wine-red/white/rose), bath bombs as tiles, recommended first with a badge, "Reset to recommended"). Card then shows a "Customized" tag, "Edit your pairing" and "Reset to recommended"; the order modal shows and sends the pairing. Defaults chosen for the sample: every box offers all wines / bath bombs, prices unchanged, choice not yet saved per subscriber month.
- Each card: mood, name, tagline, "Your story" panel, "Paired with" wine + bath bomb (gold SVG line icons, one-line notes).

| Box | Mood | Story | Wine | Bath bomb |
|---|---|---|---|---|
| The Velvet Hour | Tender · Romantic | A slow-burn story of longing and surrender | King Estate Pinot Noir (red), Willamette Valley 2023 | Lavender Rosemary |
| The Midnight Bloom | Bold · Confident | A story where desire meets its match | Chalk Hill Chardonnay (white) | Oatmeal Milk & Honey |
| The Crimson Reverie | Deep · Adventurous | A tale of complete surrender and discovery | Whispering Angel Rosé, Château d'Esclans, Côtes de Provence 2025 | Honeysuckle |

- Inventory the user listed: King Estate Pinot (75), Justin Cabernet (50), Chalk Hill Chardonnay (40), Silverado Sauvignon Blanc (60), Whispering Angel (50), Hampton Water Rosé (35); bath bombs Lavender Rosemary (100), Oatmeal Milk & Honey (100), Honeysuckle (50), Cherry Almond (50). Tasting notes are general style notes, not from the wineries.
- **Main**: per-card Monthly / One-time gift toggle ("Save $25" badge on Monthly); button "Subscribe · $99.99/mo" or "Gift Once · $124.99"; note "Billed monthly · Cancel anytime" / "One-time charge · No subscription". Clicking opens `Modal.tsx` (name + email); **no real checkout yet**.
- **Pre-sale**: "Launching soon" + "Join the Waitlist" (opens `WaitlistModal`, records the box name as source).
- Prices: monthly $99.99, one-time $124.99.

### Story section
- Headline "Some stories are meant to be shared. / *This one is meant for you.*"; photo with a gold callout to the book ("Original story / Written by real authors. Yours only." — unverified claim); features: Original story / 375 mL wine / Bath bomb.

### Testimonials (hidden for now)
- Carousel mixing reviews and social posts with filter chips, arrows, gentle auto-advance (5 s, pauses on hover/touch, stops when the visitor interacts). **Reviews and "SAMPLE POST" social cards are placeholders**; removed on pre-sale (no customers yet).

### Contact (main only)
- `Contact.tsx`, last section: intro + form (name, email, topic, message, honeypot `website`; topics General question / My order / My account / Press or partnerships). Posts to `/api/contact`: Cloudflare function `functions/api/contact.ts` saves to D1 table `contact_messages` (schema `db/contact-schema.sql`); locally the Express server logs it. On GitHub Pages the form can't send (no functions) and shows an error. Footer "Contact Us" links here. Each message is also emailed to support@soloherbox.com via Resend (`server-lib/contact-email.ts`, reply-to = the visitor); support@ is an alias on the marketing@soloherbox.com Google Workspace user. Shared Resend helper: `server-lib/resend.ts`.

### FAQ, footer
- FAQ accordion (`FAQ.tsx`), answers are arrays of paragraphs. Main site has the user-approved copy (packaging: no SoloHer branding on the shipping box; story; cancel before next billing date + prepaid refund; curated boxes get a new story, wines and bath bombs monthly; delivery typically 3 to 7 business days once shipped; subscribers can change box options; no refunds once shipped, matching the Terms). Presale FAQ still has the old copy. Cancel/change answers assume customer accounts (not built yet);
- Footer: full logo, Explore (shared nav links minus Contact), Support (Contact Us, Shipping Info, Returns/Exchanges opens the refund FAQ via `openFaq('refunds')`, My Account), Follow (Instagram/TikTok @soloherbox, new tab), legal links.
- Support email `support@soloherbox.com` (`SUPPORT_EMAIL` in `FAQ.tsx` and `server-lib/resend.ts`), linked in the refund answer and account popup; alias of marketing@soloherbox.com.

## Waitlist and unsubscribe (Cloudflare)

- **Account**: separate SoloHer Cloudflare account (soloherbox@gmail.com), fully separate from the user's other accounts. Wrangler is logged in on this machine.
- **Database**: D1 `soloher-waitlist`, table `waitlist(id, email UNIQUE, source, created_at, unsubscribed_at)`. View in the dashboard: Storage & Databases → D1 → soloher-waitlist → Explore Data. Query: `npx wrangler d1 execute soloher-waitlist --remote --command "SELECT ..."`.
- **Sign-up** (`functions/api/waitlist.ts`, used by the waitlist version; local Express stub logs sign-ups): validates email, lowercases, honeypot field `website` drops bots, re-joining clears `unsubscribed_at`.
- **Unsubscribe** (`functions/api/unsubscribe.ts`): signed links `/api/unsubscribe?e=<email>&t=<HMAC>`; GET shows a confirm page (link scanners can't unsubscribe anyone), POST unsubscribes; supports RFC 8058 one-click. Secret `UNSUBSCRIBE_SECRET` is a Cloudflare Pages secret plus a local copy in `client/.dev.vars` (gitignored). Print a link: `node client/scripts/unsubscribe-link.mjs <email>`.
- GitHub Pages can't run functions; email unsubscribe links point to www.soloherbox.com (the Cloudflare site).
- **Welcome email** (`server-lib/welcome-email.ts`): sent via Resend to new or returning (previously unsubscribed) sign-ups, in the background (`waitUntil`); repeat sign-ups get nothing. Copy and design are imported straight from `mockups/email/waitlist-welcome.html` / `.txt` (edit those; the .txt first line is the subject). From `SoloHer <hello@soloherbox.com>`, reply-to support@soloherbox.com, per-person unsubscribe link + `List-Unsubscribe` headers. Sends nothing until the Pages secret `RESEND_API_KEY` is set (Resend needs soloherbox.com verified via its DNS records at GoDaddy). Logo at https://www.soloherbox.com/email-logo.png (`client/public/`). Mailing address in the footer: 100 N HOWARD ST #STE R, Spokane, WA, 99201, USA. Future marketing sends must skip unsubscribed addresses.
- Test entry `deploy-check@soloher-test.invalid` is in the live list (user chose to keep it).

## Gotchas learned

- Setting secrets by piping from PowerShell adds a trailing newline: use `printf '%s' "$value" | npx wrangler pages secret put ...` from bash. Pages secrets need a redeploy to take effect.
- A brand-new pages.dev address can return 522 for a few minutes; browsers may cache failed images (hard refresh).
- The browser preview pane doesn't run animations/smooth scroll while hidden; verify by measuring, not only screenshots.
- Never edit text files with PowerShell `Get-Content`/`Set-Content` (Windows PowerShell 5.1 misreads UTF-8 and adds a BOM, garbling →, ·, é). Use the Edit tool or node.
- Text with `text-transform: uppercase` turns "mL" into "ML": wrap it in `.keep-case`.
- Background reshuffles: when adding/removing a section, re-alternate `--bg` / `--bg-2`.

## Open items

- Real checkout and subscription billing (Stripe or a subscription platform); main-site sign-up modal saves nothing.
- Custom domain (buy/connect in Cloudflare), then update `.env.cloudflare` and email sender.
- Real reviews and social posts; lawyer review of legal text; alcohol shipping licensing.
- Ad pixels (Meta/TikTok) before running the planned ~$3k/month paid ads; GA4 is in place.
- `npm audit` reports dependency vulnerabilities to address.
