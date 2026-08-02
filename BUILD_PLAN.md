# PantryPulse build plan

## Product goal
Build a public, responsive food-inventory application that mirrors the supplied green desktop and mobile design while remaining practical, secure, and ready for Supabase.

## Implementation order used
1. Create the visual system and responsive navigation.
2. Build the landing, authentication, dashboard, pantry, item-entry, shopping, recommendation, insight, notification, and settings screens.
3. Add a working demo-data repository so the application can be reviewed before a database is connected.
4. Add a Supabase repository path, authentication utilities, SQL schema, indexes, and Row Level Security policies.
5. Add form validation, secure account deletion, environment-variable handling, and HTTP security headers.
6. Add browser notification permission, service-worker registration, local expiry reminders, and PWA metadata.
7. Run type checking, tests, and a production build.

## Database switch
The application starts with `NEXT_PUBLIC_DATA_MODE=demo`. After running `database/schema.sql` in Supabase and adding the environment variables, change it to `supabase`.
