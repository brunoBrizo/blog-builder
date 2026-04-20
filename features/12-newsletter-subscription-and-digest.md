# 12. Newsletter Subscription & Weekly Digest

## Goal

Let visitors subscribe to a weekly digest of new articles per locale, with compliant double opt-in, one-click unsubscribe, and bulk-sender-compliant headers. Emails must be free to send at current volume (Resend free tier).

## Dependencies

- [02. Database & Data Layer](./02-database-and-data-layer.md) (`newsletter_subscribers`, `newsletter_digests` tables).
- [03. API Foundation](./03-api-foundation.md).
- [04. Web Foundation](./04-web-foundation.md) (sticky newsletter component placeholder).

## Scope

In scope:

- Public subscribe endpoint with double opt-in.
- Confirmation email per locale.
- One-click unsubscribe link + HTTP endpoint compliant with Gmail/Yahoo 2024 bulk-sender rules.
- Weekly digest build + send job, triggered by `pg_cron`.
- Transactional email templates (confirm, unsubscribe-success, weekly digest) per locale.
- Sticky newsletter form wired to the backend.

Out of scope:

- Paid newsletter tiers, drip sequences, cross-sell — not in the product scope.
- Admin UI for the subscriber list (feature 15).

## Backend work

- `POST /newsletter/subscribe` `{ email, locale, consent: true }`:
  - Validates email and locale via Zod.
  - Rate-limited per IP and per email.
  - Upserts into `newsletter_subscribers` with `confirmed_at = null`, generates `confirmation_token` (random 32 bytes, URL-safe), stores `unsubscribe_token` (separate random token).
  - Sends the confirmation email via Resend in the subscriber's locale.
- `GET /newsletter/confirm?token=...`:
  - Marks `confirmed_at = now()` if token matches and is < 7 days old; returns a redirect to `/[locale]/newsletter/confirmed`.
- `POST /newsletter/unsubscribe` and `GET /newsletter/unsubscribe?token=...`:
  - Both honor one-click unsubscribe (RFC 8058). The `POST` variant requires no body and no auth — just the valid token in the URL.
  - Sets `unsubscribed_at = now()` and sends no further emails to that address.
- Weekly digest builder:
  - Supabase `pg_cron` job runs once per week (Monday 13:00 UTC) and calls `POST /internal/newsletter/digest` with the `CRON_SHARED_SECRET` header.
  - The API groups confirmed subscribers by locale, builds one digest per locale containing every article published in the last 7 days in that locale, renders a React-Email template, and dispatches via Resend in batches of 100 with individual unsubscribe tokens.
  - Each digest is logged into `newsletter_digests` with `{ locale, sentAt, articleIds, recipientCount }`.
- Resend integration:
  - Configure SPF, DKIM, and DMARC records on the sending domain (captured in `docs/tech-stack.md` deployment notes).
  - Every outbound email sets the `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers using the token above.
  - Set `Precedence: bulk` on digests, not on confirmation emails.
- Implement email templates with `@react-email/components` in `libs/ui/emails`:
  - `ConfirmSubscriptionEmail` (per locale).
  - `UnsubscribedEmail` (per locale).
  - `WeeklyDigestEmail` (per locale) — lists article cards with title, TL;DR, category, cover, and the unsubscribe footer.
- All templates share a common layout (logo, footer, contact link, legal line) and pass accessibility checks (semantic HTML, alt text, 44px tap targets in mobile mail clients).
- Suppression list: once unsubscribed, the email cannot resubscribe within 30 days unless they explicitly request it (prevents accidental re-adds).

## Frontend work

- `NewsletterForm` component (sticky on every page) wired to `POST /newsletter/subscribe`:
  - Email input with HTML5 + Zod validation.
  - Localized labels, helper text, success/failure states.
  - Uses `react-hook-form` + `zod` resolver.
  - Shows toast "Check your inbox to confirm" on success.
  - Respects `prefers-reduced-motion` for entry/exit animations.
- `/[locale]/newsletter/confirmed` — static success page with a CTA back to the homepage.
- `/[locale]/newsletter/unsubscribed` — static success page.
- `/[locale]/newsletter/unsubscribe?token=...` — client-side flow that fires the one-click POST and shows a minimal spinner then success.
- Footer and legal pages link to "Manage subscription" which routes to the unsubscribe flow.

## Acceptance criteria

- A full subscribe → confirm → digest → unsubscribe cycle works end-to-end against a staging Resend project.
- Mail-Tester score ≥ 9/10 on the confirmation and digest emails (SPF, DKIM, DMARC, unsubscribe headers present).
- One-click unsubscribe (Gmail "Unsubscribe" button) removes the subscriber without them loading the site.
- Digest arrives once per week, lists the correct articles per locale, and never includes unpublished drafts.
- Rate-limiter blocks > 5 subscribe attempts per IP per minute.
- Subscribers bounced (hard bounce from Resend webhook) are auto-marked unsubscribed.

## Related docs

- [`docs/product_idea.md`](../docs/product_idea.md)
- [`docs/tech-stack.md`](../docs/tech-stack.md)
