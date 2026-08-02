# PantryPulse

A professional, responsive food-expiry and household-waste prevention frontend based on the supplied desktop and mobile reference design.

## Included

- Desktop sidebar and mobile bottom navigation
- Landing, login, signup, dashboard, pantry, add-grocery, shopping-list, recommendations, insights, notifications, and settings pages
- Working demo mode with local browser storage
- Supabase-ready authentication and CRUD repository
- PostgreSQL schema, indexes, constraints, triggers, and Row Level Security
- Browser notification permission and service worker
- JSON data export and secure account-deletion endpoint
- Zod validation, security headers, CSP, origin checks, secret-key isolation, and rate limiting
- Responsive layouts for desktop, tablet, and mobile

## 1. Run immediately in demo mode

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Demo mode does not require a database.

## 2. Connect Supabase later

1. Create a Supabase project.
2. Run `database/schema.sql` in the Supabase SQL editor.
3. Update `.env.local`:

```env
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_SERVER_KEY
NEXT_PUBLIC_SUPPORT_EMAIL=your-public-support-gmail@gmail.com
```

4. In Supabase Authentication, add your local and Vercel URLs as allowed redirect URLs.
5. Add the same variables to Vercel. Mark `SUPABASE_SERVICE_ROLE_KEY` as sensitive and never expose it to the browser.

## 3. Deploy to Vercel

- Push this folder to GitHub.
- Import the repository into your existing Vercel account.
- Add the environment variables.
- Deploy the production branch.
- Test signup, login, data isolation, delete operations, notification permission, and mobile layout.

## Gmail use

Gmail is not used as a database. Add a dedicated public support Gmail through `NEXT_PUBLIC_SUPPORT_EMAIL`. Your private owner Gmail can remain hidden as the account used to manage Vercel, GitHub, and Supabase.

## Notifications

The included feature requests browser permission only after the user presses **Enable alerts**. It shows a local expiry reminder when the app is opened. Fully scheduled notifications while the app is closed require a Web Push subscription service and VAPID keys, which are intentionally not faked in this package.

## Security notes

- Run the supplied RLS SQL before using real user data.
- Never put `SUPABASE_SERVICE_ROLE_KEY` in a variable beginning with `NEXT_PUBLIC_`.
- Keep `.env.local` out of GitHub.
- The account-deletion API validates the user token, checks the request origin, validates the confirmation body, and rate-limits repeated attempts.
- React renders user-entered text safely; the code does not use `dangerouslySetInnerHTML`.
- Browser notifications and service workers require HTTPS in production.

## Commands

```bash
npm run dev
npm run typecheck
npm test
npm run build
```

## Project structure

```text
app/                 Next.js routes and API endpoints
components/          Responsive UI and chart components
lib/                 Data types, risk rules, data provider, Supabase clients
public/              PWA manifest, icons, and service worker
database/schema.sql  Supabase database and RLS setup
tests/               Risk-engine tests
```

## Food-safety limitation

PantryPulse provides planning estimates only. It does not determine whether food is safe to consume. Users must follow package instructions and official food-safety guidance.
