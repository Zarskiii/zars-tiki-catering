# Catering inquiry delivery

## Current behavior

- With no complete EmailJS configuration (including blank or known placeholder values), the form says online sending is unavailable. **Prepare Email Request** validates required fields and shows a mailto draft, a copy button, and selectable full inquiry text. The customer must press **Send** in their email app. Opening a draft or copying text never shows a sent confirmation or resets the form.
- With all three settings present, **Send Quote Request** calls EmailJS. Only a successful service response clears the form and confirms that the email service accepted the request. This is not proof of inbox delivery.
- Rejected requests, network errors, and a 20-second timeout retain all fields and offer manual email. A timeout cannot cancel the underlying EmailJS request; a later response will not clear the form or change the error into success. Retrying or manually emailing after an uncertain outcome can produce a duplicate.
- The form does not log inquiry data or raw provider errors, nor does it save inquiries in browser storage. Users should keep or copy their details before closing the page.
- Package links use router paths such as `/?package=Small%20Event%20Package#contact`. Under this site's HashRouter, the browser URL ends in `#/?package=Small%20Event%20Package#contact`. Contact reads React Router's location, not `window.location.search`. Legacy `/#contact?package=...` router links remain supported. Only known packages are accepted. Choosing another package preserves customer-written details and updates the explicit package field.

## Setup still required

No working EmailJS settings, mailbox access, or current public deployment were established during this repair. The fallback reuses the existing public address, `aloha@zarstikishack.com`; it does not verify that the mailbox is active or monitored. **Confirm this address with the business before deploying.** If it changes, update `CATERING_EMAIL` in `src/lib/catering-inquiry.ts` and the public email in `src/components/Footer.tsx`.

To enable online submission:

1. Connect an email service in the business's EmailJS account and create a catering inquiry template.
2. Set the template's **To Email** to the verified business mailbox in the EmailJS dashboard. Do not take the recipient from customer input. Use the connected service's verified sender, and set **Reply To** to `{{from_email}}`.
3. Configure the following exact template variables:

   | Variable | Content |
   | --- | --- |
   | `{{from_name}}` | Customer name |
   | `{{from_email}}` | Customer email / Reply To |
   | `{{phone}}` | Optional phone |
   | `{{event_date}}` | Optional event date |
   | `{{event_type}}` | Optional event type |
   | `{{guest_count}}` | Optional guest count |
   | `{{location}}` | Optional event location |
   | `{{package_name}}` | Selected catering package |
   | `{{message}}` | Inquiry text, also prefixed with the package when selected |

4. Copy `.env.example` to `.env.local` and fill in:

   ```dotenv
   VITE_EMAILJS_SERVICE_ID=
   VITE_EMAILJS_TEMPLATE_ID=
   VITE_EMAILJS_PUBLIC_KEY=
   ```

   Leave all values blank to deliberately use manual email. A partially configured form also uses manual email. Restart Vite after local changes. These values are read at **build time**; rebuild and redeploy after changing them.
5. Configure the actual website origin in EmailJS's allowed-origin settings and review account quotas and abuse controls. Keep private service credentials in EmailJS, never in the frontend.

All `VITE_*` values are publicly readable in the built JavaScript. The EmailJS public key is a browser identifier, **not a secret**. Never put an EmailJS private key, mail password, SMTP credentials, or another provider's secret into these variables or source code. Populated `.env*` files are ignored by Git; `.env.example` contains only blank values.

## Deployment configuration

The repository contains a Vite app with `base: "/zars-tiki-catering/"` and a HashRouter. Confirm the target host/path before deployment; a root custom-domain deployment needs its Vite base configured appropriately.

For the existing Vite GitHub Pages workflow (`.github/workflows/deploy.yml`), set repository **Actions variables** named `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY`. That workflow passes them to the build after running tests, type checks, and lint. Missing values intentionally produce the manual-email experience. For a different host, supply the same variables to its build environment. Do not configure only runtime variables on a static host.

There is also a historical `.github/workflows/nextjs.yml` workflow that runs `next build`, but this repository has no Next.js dependency and builds with Vite. Confirm the intended deployment workflow and disable/remove that stale Next.js workflow before deploying; it is not part of this form repair. The presence of Pages workflows does not establish whether a website is currently live.

This change does not publish a site or send a live test inquiry. Merging to `main` can trigger the repository's existing deployment workflows, so complete the configuration and workflow review first.

## Verification before release

Automated checks:

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

The Vitest/Testing Library suite mocks EmailJS, checks every package from the home and catering pages, and verifies that details survive errors and manual-email preparation. Automated success tests prove UI behavior for service responses, not real delivery.

Manually verify using non-sensitive test data in the intended deployment:

1. Confirm all four package choices on both pages prefill the chosen package and event type; confirm switching packages preserves edited event details.
2. With EmailJS unset, complete the form and verify the explicit **not sent** message. Open the draft on desktop and mobile; ensure all fields appear and manually press Send. If the app is absent or truncates a long mailto body, use the full inquiry text or copy button. Confirm clipboard denial still leaves selectable text.
3. With EmailJS configured, submit one identifiable test inquiry. Confirm it arrives in the intended mailbox (including spam checks), includes all fields/package, and Reply targets the customer's test address. A successful API response alone is insufficient.
4. Test a service rejection and an offline connection. Confirm there is no sent confirmation, the fields remain, the button becomes usable again, and manual email is offered. A stalled request should show the same recovery path after 20 seconds.
5. Check the browser console and deployed bundle for accidental inquiry logging/private credentials. Confirm the mailbox is monitored and only then release.
