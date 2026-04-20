# 13. Contact Form

## Goal

Let visitors reach the publisher via a spam-resistant contact form that is required for AdSense approval and compliant with privacy law.

## Dependencies

- [03. API Foundation](./03-api-foundation.md).
- [11. Mandatory AdSense Pages](./11-mandatory-adsense-pages.md) (the contact page shell).

## Scope

In scope:

- Public contact endpoint with abuse protection.
- Persistence of submissions for audit.
- Email notification to the publisher.
- Locale-aware UI and server-side validation.

Out of scope:

- Ticketing, threaded replies, or CRM features.
- Admin inbox UI (feature 15 surfaces it).

## Backend work

- `POST /contact` `{ name, email, subject, message, locale, honeypot, captchaToken? }`:
  - Zod validation (length limits, email shape, subject ≤ 120 chars, message ≤ 5000 chars).
  - Honeypot field — any submission with it filled is silently dropped.
  - Cloudflare Turnstile (free) token verification when present; falls back to rate limiting when not.
  - Throttle: 5 submissions per IP per hour and per email per day.
  - Persist to `contact_messages` with IP (hashed), user agent (hashed), locale, and timestamps.
  - Send notification email via Resend to the publisher inbox with the full message body, reply-to = the visitor's email.
  - Send a localized acknowledgement email to the visitor ("we received your message").
- On abusive patterns (repeat offenders, obvious spam scoring via simple heuristics) auto-block the IP for 24 h.
- Sentry tag for contact-form errors so we catch delivery failures.

## Frontend work

- `/[locale]/contact` page (shell from feature 11) renders the form:
  - Fields: Name, Email, Subject, Message, hidden honeypot, Turnstile widget.
  - `react-hook-form` + `zod` resolver; inline errors, one `aria-describedby` per field.
  - Submit button has busy state and disables during submission.
  - Success: inline confirmation + toast with the ticket reference (`contact_messages.id`).
  - Failure: inline retry with a friendly error.
- Turnstile widget loads only after the user focuses the form (defer script) to keep LCP untouched.
- Form respects `prefers-reduced-motion`; error states rely on text + color + icon (not color alone).
- Localized server-side rendered copy so no client JS is required for the form to render.

## Acceptance criteria

- End-to-end submission delivers an email to the publisher and an acknowledgement to the visitor.
- Honeypot submissions are never delivered and never persisted as non-spam.
- Rate limits enforced (integration test).
- Form passes axe-core with zero violations and is fully operable via keyboard.
- Localized error messages in all three locales.

## Related docs

- [`docs/product_idea.md`](../docs/product_idea.md)
- [`docs/accessibility.md`](../docs/accessibility.md)
