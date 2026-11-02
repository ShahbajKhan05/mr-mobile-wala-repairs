# MR MOBILE WALA REPAIRS

MR MOBILE WALA REPAIRS is a Next.js repair-shop management application for Rewa. It manages customers, devices, repair jobs, inventory, payments, invoices, private customer tracking, and seven-day repair warranties.

## Features

- Customer and device management
- Repair jobs with four progress photos and Supabase Storage
- Repair statuses: Received, Part Ordered, Repairing, Ready
- Payment status and seven-day warranty management
- Printable job invoices
- Secure, expiring private customer tracking links
- Manual WhatsApp sharing through `wa.me`
- Dashboard, analytics, inventory, and shop settings
- Public repair-service website and privacy/terms pages

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Supabase database, authentication helpers, and Storage
- Recharts for analytics
- Lucide React icons

## Project structure

```text
src/app/             App Router pages and API routes
src/components/      Shared admin and public React components
src/lib/             Supabase, jobs, inventory, auth, settings, and warranty logic
public/              Images, videos, favicons, and brand assets
supabase/            SQL migrations for shared application data
```

## Installation

Requirements:

- Node.js 20 or newer
- npm
- A Supabase project

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Configure these variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `ADMIN_SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Never commit `.env.local` or expose server-side secret values.

## Supabase setup

1. Configure the Supabase environment variables listed above.
2. Keep the existing application tables and data. The repair workflow uses `customers`, `repair_jobs`, `job_photos`, `job_events`, and `customer_access_tokens`.
3. Keep the private Storage bucket named `repair-photos`; repair images must not be made public.
4. Open Supabase Dashboard → SQL Editor and run the migration file `supabase/migrations/202611030001_shared_settings_inventory.sql`. It creates only `shop_settings` and `inventory_parts`; it does not drop or reset existing tables or storage objects.
5. The migration enables RLS and intentionally adds no public policies. The protected Next.js admin API uses the server-side Supabase key after checking the admin session.
6. Confirm the API environment variables point to the same Supabase project before testing.

Do not delete, truncate, or recreate existing repair/customer records or the `repair-photos` bucket.

## Repair job workflow

1. Register the customer.
2. Register the device.
3. Create the repair job.
4. Upload up to four repair photos to `repair-photos`.
5. Move the repair through Received, Part Ordered, Repairing, and Ready.
6. Record payment as Pending or Paid.
7. Share the invoice and private tracking link manually.

## Customer private tracking

Private tracking uses random, one-year access tokens. Only a SHA-256 hash is stored in the database; the raw token is shared with the customer. The API validates expiry and revocation before returning that job's data. Tracking, warranty, and invoice pages are private and marked noindex. If a link expires or is revoked, ask the shop to generate a fresh link.

## Payment and warranty

Warranty expires exactly 7 × 24 hours after the original `paid_at` timestamp.

- The first transition to Paid establishes the authoritative `paid_at` timestamp.
- Repeated Paid submissions do not change `paid_at` or extend the expiry.
- Moving payment back to Pending hides the active warranty but preserves the original payment timestamp and warranty history.
- Marking the same job Paid again reuses the original timestamp; it does not restart the warranty.
- The warranty duration setting is fixed at 7 days and cannot override this rule.

## Invoice PDF

Paid invoices are available to admins from the job detail page and to customers from their private tracking link. Both support browser print/save-to-PDF behavior. Customer invoice access requires the unique private token; no public job-number lookup is provided.

## WhatsApp sharing

WhatsApp sharing is manual through `wa.me` links. The application does not send WhatsApp API messages automatically.

## Images and Storage

Repair jobs support four photos stored in Supabase Storage. The existing bucket must remain `repair-photos`; files are signed for temporary private access.

## Build and quality checks

```bash
npx tsc --noEmit
npm run build
npm run lint
git diff --check
```

## Testing

Automated test files are not currently included. Validate changes with TypeScript, the production build, ESLint, and targeted route/UI checks.

Important workflow checks:

- Create, update, and ready a repair job.
- Upload four photos and verify signed photo access.
- Verify the first Paid transition sets `paid_at`.
- Verify repeated Paid submissions preserve `paid_at`.
- Compare warranty dates in admin, invoice, and private tracking.
- Generate, open, expire, and revoke tracking links as supported by the API.
- Verify public Warranty Card navigation and the admin Warranty Cards sidebar page.
- Verify customer warranty and paid invoice links from the private tracking page.
- Verify the warranty expires exactly 168 hours after the original payment timestamp.
- Verify inventory and settings persist across browsers/devices after the shared-data migration is applied.
- Verify mobile navigation and invoice printing.

## Deployment

Deploy to a Next.js-compatible host such as Vercel:

1. Set all documented environment variables on the deployment platform.
2. Point Supabase environment URLs to the intended project.
3. Run TypeScript, build, lint, and diff checks.
4. Deploy only after reviewing and approving the build.
5. Verify public pages, admin login, private tracking, Storage access, and API routes.

## Security

- Keep `SUPABASE_SECRET_KEY`, `ADMIN_SESSION_SECRET`, admin credentials, and `.env.local` off the client.
- Private tracking links are access-controlled and must remain indexed `noindex`.
- Validate API inputs and preserve admin authorization checks.
- Do not weaken RLS, remove tracking-token expiry, or expose service-role credentials.
- Do not modify production database records for development or testing.

## Troubleshooting

### Supabase environment errors

Confirm all required environment variable names are present. Do not copy actual secrets into source or documentation.

### Admin login failures

Verify `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`. Restart the development server after changing `.env.local`.

### Missing repair photos

Confirm the `repair-photos` bucket exists, the server key is permitted to sign/read/delete objects, and file paths belong to existing jobs.

### Private tracking link fails

Generate a fresh link from the admin job page. Confirm the token has not expired and that the job still exists.

### Build or lint failures

Run TypeScript first, then the production build, then lint. Track pre-existing repository findings separately from errors introduced by a change.
