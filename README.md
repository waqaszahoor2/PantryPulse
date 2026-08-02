# PantryPulse – Household Grocery Tracking & Food Waste Reduction

PantryPulse is a production-quality, secure, responsive web application built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase. It helps households manage grocery inventories, receive expiry warnings, reduce food waste, and track savings.

## Key Features

- **Pantry Management**: Full CRUD operations for groceries with categories, quantities, prices, storage locations, package opened status, and custom notes.
- **Rule-Based Risk Engine**: Transparent 0–100 urgency score calculating risk levels (Low, Medium, High, Expired) based on expiry date, opened status, storage location, perishability, and duplicate availability.
- **Shopping List & Duplicate Detection**: Plan grocery purchases and receive intelligent warnings when adding items already stored in your pantry. Move purchased items to your pantry with one click.
- **Support & Gmail Compose Integration**: Dedicated `/support` route allowing users to prepare support queries with full validation and open Gmail Compose directly (`https://mail.google.com/mail/?view=cm&fs=1&to=...`) or use a `mailto:` fallback without backend email keys.
- **Inventory Event Logging**: Complete audit log recorded in Supabase (`inventory_events`) for tracking all additions, edits, consumption, donations, and waste entries.
- **Dynamic Analytics & Charts**: Real-time outcome charts (consumed vs wasted vs donated), weekly waste trends, waste by category, and financial impact (money saved vs lost).
- **Public Interactive Sandbox Demo**: Dedicated `/demo` route allowing unauthenticated users to explore the application safely with isolated sample data without touching production database tables.
- **Enterprise-Grade Security**: Row Level Security (RLS) policies on all tables (`auth.uid() = user_id`), secure server-side account deletion via `/api/account/delete`, Zod schema validation, Content Security Policy (CSP), rate limiting, and secret key protection.
- **Complete Legal & Food Safety Coverage**: Dedicated routes for `/privacy`, `/terms`, `/food-safety`, and `/support`.
- **Data Mobility**: Complete JSON and CSV data exports plus options to clear individual data layers or delete your account.

---

## Support Email Configuration

Support queries are directed to a fixed recipient configured via environment variables.

### 1. Environment Variable setup (`.env.local`):

```env
NEXT_PUBLIC_SUPPORT_EMAIL=your-support-email@gmail.com
```

- In `.env.example`: `NEXT_PUBLIC_SUPPORT_EMAIL=support@example.com`
- This recipient is immutable and cannot be altered by user form inputs or URL parameters.

### 2. How the Gmail Integration Works:
- The support form validates full name, user email, category, subject (3–120 chars), and message (10–2,000 chars).
- Clicking **"Send query with Gmail"** opens Gmail Compose in a new browser tab using `window.open(gmailUrl, "_blank", "noopener,noreferrer")`.
- The URL parameters (`to`, `su`, `body`) are safely constructed using `URLSearchParams` / `encodeURIComponent`.
- Users manually review the message in Gmail and press **Send** in Gmail to deliver their query.
- A secondary **"Use another email app"** button provides a `mailto:` fallback.

---

## Getting Started

### 1. Run Locally (Demo Sandbox Mode)

```bash
# Clone the repository
git clone https://github.com/waqaszahoor2/PantryPulse.git
cd pantrypulse-complete-project

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Demo mode operates instantly using browser local storage without requiring external database keys.

---

### 2. Connect Supabase Database

1. Create a project at [Supabase](https://supabase.com).
2. Open the Supabase **SQL Editor** and run the contents of `database/schema.sql`.
3. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
NEXT_PUBLIC_SUPPORT_EMAIL=your-support-email@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. In Supabase **Authentication -> URL Configuration**, add your local site URL (`http://localhost:3000`) and your production Vercel URL to the Redirect URLs list.

---

### 3. Deploy to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables under **Project Settings -> Environment Variables**:
   - `NEXT_PUBLIC_DATA_MODE` = `supabase`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` *(Mark as Sensitive)*
   - `NEXT_PUBLIC_SUPPORT_EMAIL` = `your-support-email@gmail.com`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy the production branch.

---

## Security Architecture & Checklist

- [x] **Row Level Security (RLS)**: Active on `profiles`, `pantry_items`, `inventory_events`, `shopping_list`, and `app_notifications`.
- [x] **Client-Side Secret Protection**: `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to Node.js server runtime routes (`app/api/account/delete/route.ts`).
- [x] **URL & Form Security**: All Gmail and mailto URL parameters are encoded using `URLSearchParams` / `encodeURIComponent`. Raw user input is never injected dangerously.
- [x] **Zod & Form Validation**: Support messages are validated (subject: 3–120 chars, message: 10–2,000 chars) before generating email URLs.
- [x] **Account Deletion Protocol**: Requires authenticated user session, rate-limited IP check, origin validation, and explicit user typed confirmation (`DELETE`).
- [x] **Security Headers**: Configured in `next.config.ts` (CSP, Referrer-Policy, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, HSTS).

---

## Testing & Code Quality

```bash
# Typecheck TypeScript files
npm run typecheck

# Run Vitest unit tests (includes risk engine and support URL encoder tests)
npm test

# Build production bundle
npm run build
```

---

## Project Structure

```text
app/                     Next.js App Router pages and API routes
├── (app)/               Protected application views (dashboard, pantry, shopping, insights, settings)
├── (auth)/              Authentication routes (login, signup, forgot-password, reset-password)
├── demo/                Public interactive demo sandbox
├── support/             Dedicated Contact Support page (/support)
├── privacy/             Public Privacy Policy
├── terms/               Public Terms of Service
├── food-safety/         Public Food Safety Disclaimer
└── api/                 Secure server API routes
components/              Modular UI components and recharts views
├── support/             SupportForm component
database/schema.sql      Complete Supabase SQL schema, RLS policies, and triggers
lib/                     Data provider, risk engine, support url builders, and Supabase client initializers
tests/                   Vitest unit tests for risk engine and support email generators
```

---

## Food Safety Notice

PantryPulse provides storage, expiry, and planning estimates only. It does not determine whether food is safe to consume. Always follow package instructions and official food-safety guidance. When uncertain, discard the product.

---

## License

© 2026 PantryPulse. All rights reserved.
