# Live Quiz Scoring

A small realtime quiz scoreboard built with Next.js, Clerk, and Convex.

## Setup

```bash
npm install
cp .env.example .env.local
npx convex dev
npm run dev
```

## Environment variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_FRONTEND_API_URL=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
ADMINEMAILS=imrito18@gmail.com
NEXT_PUBLIC_ADMINEMAILS=imrito18@gmail.com
```

Configure the same admin list in the Convex environment as well:

```bash
ADMINEMAILS=imrito18@gmail.com
```

The email `imrito18@gmail.com` receives scorer/admin access. Other authenticated users receive viewer access.

## Clerk setup

1. Create a Clerk app.
2. Copy the publishable and secret keys to `.env.local`.
3. Activate the Convex integration in Clerk and copy the Clerk Frontend API URL into `CLERK_FRONTEND_API_URL`.

## Convex setup

1. Run `npx convex dev`.
2. Set `CLERK_FRONTEND_API_URL` in the active Convex deployment environment to the same Clerk Frontend API URL. The app's `convex/auth.config.ts` uses it to validate Clerk tokens.
3. Set `ADMINEMAILS` in the Convex deployment environment so server-side authorization works for mutations.
4. Run `npx convex dev` again to sync `auth.config.ts` to the deployment.

## Production deployment

Deploy Convex first so its schema and functions exist before the Vercel app uses them.

1. Log in and set the production-only Convex auth variables:
    ```bash
    npx convex login
    npx convex env --prod set CLERK_FRONTEND_API_URL 'https://your-clerk-frontend-api-url'
    npx convex env --prod set ADMINEMAILS 'imrito18@gmail.com'
    ```
2. Deploy the Convex functions and schema to production:
    ```bash
    npx convex deploy
    ```
3. In the Convex dashboard, open the production deployment settings and copy its deployment URL and HTTP actions URL. These are production values, not `http://127.0.0.1:3210` / `3211`.
4. Link the Next.js project to Vercel, then add these variables to the Vercel **Production** environment: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `NEXT_PUBLIC_ADMINEMAILS`. Use the two URLs from the production Convex deployment and the production Clerk API keys. Never use a `NEXT_PUBLIC_` prefix for a secret.
5. Verify the production build locally and deploy:

    ```bash
    npm run build
    npx vercel login
    npx vercel link
    npx vercel --prod
    ```

    Alternatively, configure the Vercel production variables in Project Settings → Environment Variables before running `npx vercel --prod`.

## App flow

- Signed-in admins can create teams with an optional preliminary starting score.
- Admins can quickly find teams by team or member name, award preset or custom points, correct scores, and delete teams.
- Starting scores, awards, and corrections are recorded in score history. Deleting a team also deletes its history.
- Signed-in non-admin users can view live standings and team history.
- Standings update automatically through Convex reactive queries.
