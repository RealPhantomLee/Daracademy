# Daracademy — Claude Code Project Guide

## Project Overview

Daracademy is a premium tutoring platform centered around Dara (educator) and Noah (3D Turkish Angora cat companion). The platform serves students, parents/guardians, and admins with personalized learning experiences, progress tracking, and achievement systems.

## Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Framework     | Next.js 15 + TypeScript + Tailwind v4           |
| Monorepo      | pnpm workspaces + Turborepo v2                  |
| Database      | Supabase Postgres + Prisma ORM                  |
| Auth          | Auth.js v4 (next-auth) + OAuth + Credentials    |
| Animations    | Framer Motion + XState (Noah)                   |
| 3D Character  | Three.js + React Three Fiber (Noah placeholder) |
| Hosting       | Vercel (per-app)                                |
| Analytics     | PostHog                                         |
| Notifications | Resend (email) + in-app                         |
| File Storage  | Cloudflare R2 (stub)                            |

## Monorepo Structure

```
Daracademy.com/
├── packages/        # Shared packages (config, database, auth, ui, animations, noah-engine, analytics, notifications)
├── apps/            # Four Next.js applications
│   ├── marketing-site        # daracademy.com (homepage, hero, about, sections)
│   ├── student-dashboard     # student.daracademy.com (assignments, messages, schedule)
│   ├── guardian-dashboard    # guardian.daracademy.com (student monitoring, payments)
│   └── admin-dashboard       # admin.daracademy.com (management, analytics, titles)
├── .github/workflows/ci.yml  # TypeScript + ESLint checks
└── turbo.json               # Monorepo build config
```

## Key Commands

### Development

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all apps in dev mode
pnpm dev:marketing        # Start only marketing site
pnpm dev:student          # Start only student dashboard
```

### Quality

```bash
pnpm typecheck            # Run TypeScript checks
pnpm lint                 # Run ESLint
pnpm format               # Format code with Prettier
pnpm build                # Production build all apps
```

### Database

```bash
pnpm db:generate          # Generate Prisma client
pnpm db:migrate           # Apply pending migrations
pnpm db:push              # Push schema to database
pnpm db:seed              # Seed titles and schedule data
pnpm db:studio            # Open Prisma Studio GUI
```

### Git

```bash
git status
git add <files>
git commit -m "message"
git push origin <branch>
```

## Environment Setup

### Local Development

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Set required variables in `.env.local`:
   - `DATABASE_URL` — Supabase connection (pooler, port 6543)
   - `DIRECT_URL` — Supabase direct connection (port 5432, for migrations)
   - `NEXTAUTH_SECRET` — Run: `openssl rand -base64 32`
   - Other OAuth, Stripe, R2 vars can stay as STUB until accounts are created

3. Run migrations and seed:

```bash
pnpm db:migrate
pnpm db:seed
```

### Third-Party Accounts

When setting up, replace STUB values in `.env.local`:

- **Calendly**: Set `NEXT_PUBLIC_CALENDLY_URL` (webhook auto-activates)
- **Stripe**: Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` (payments go live)
- **Resend**: Set `RESEND_API_KEY` (emails send for real)
- **Cloudflare R2**: Set `R2_ACCOUNT_ID`, access keys (file uploads work)
- **PostHog**: Set `NEXT_PUBLIC_POSTHOG_KEY` (analytics active)

## Apps at a Glance

### Marketing Site (`apps/marketing-site`)

- **Purpose**: Public landing page, conversion funnel
- **Routes**: /, /about, /subjects, /schedule, /auth/signin
- **Features**: Hero with Noah animation, 8 sections, day/night theme, Calendly embed
- **Animation intensity**: HIGH (8/10)
- **Audience**: Prospective students + parents

### Student Dashboard (`apps/student-dashboard`)

- **Purpose**: Student learning hub
- **Routes**: /dashboard (overview, assignments, messages, schedule, profile)
- **Features**: Assignment submission, messaging inbox, session calendar, title badges, planner
- **Animation intensity**: LOW (3/10)
- **Auth**: Student + Guardian roles

### Guardian Dashboard (`apps/guardian-dashboard`)

- **Purpose**: Parent/guardian supervision center
- **Routes**: /dashboard (overview, student progress, payments, messaging)
- **Features**: Student monitoring, grade tracking, payment history, communication
- **Animation intensity**: LOW (3/10)
- **Auth**: Guardian role only

### Admin Dashboard (`apps/admin-dashboard`)

- **Purpose**: Tutor control center
- **Routes**: /dashboard (students, guardians, sessions, titles, analytics)
- **Features**: CRUD management, analytics, title catalog, session oversight
- **Animation intensity**: LOW (3/10)
- **Auth**: Admin role only

## Database Models (Prisma)

Core entities:

- **User** — Authentication (email, OAuth providers, password hash, role)
- **StudentProfile** — Student data (grade, subjects, guardian link)
- **GuardianProfile** — Parent data (phone, linked students)
- **TutoringSession** — Scheduled lessons (Calendly integration)
- **Assignment** — Student work (title, status, file URL, due date)
- **Message** — Async messaging (student ↔ tutor ↔ parent)
- **Notification** — In-app alerts (assignments, sessions, titles)
- **Payment** — Transaction records (Stripe integration)
- **Title** — Achievement catalog (40 titles, 4 tiers)
- **UserTitle** — Earned achievements (unlock history)

See `packages/database/prisma/schema.prisma` for full schema with 16 models, 6 enums, and relationships.

## Noah 3D Character

Located in `packages/noah-engine/`. Features:

- **State machine** — 6 states (idle, welcome, notification, helper, celebration, reading)
- **Placeholder** — Animated CSS/SVG white cat (live until 3D model arrives)
- **3D support** — GLB slot ready for commissioned model swap via single boolean (`USE_3D_MODEL = true`)
- **Dialogue** — Event-driven contextual responses (non-conversational)
- **Widget** — Fixed bottom-right, available on all dashboard apps

Implementation: `packages/noah-engine/src/renderer/NoahRenderer.tsx` controls placeholder ↔ 3D swap.

## Development Workflow

1. **Create a branch**: `git checkout -b feature/my-feature`
2. **Make changes**: Edit files in `apps/` or `packages/`
3. **Test locally**: `pnpm dev:<app>` + open browser
4. **Verify quality**: `pnpm typecheck && pnpm lint`
5. **Commit**: `git add . && git commit -m "feat: description"`
6. **Push**: `git push origin feature/my-feature`
7. **Create PR**: GitHub web UI (CI runs automatically)

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

- Runs on push to main + all PRs
- Steps: pnpm install → pnpm typecheck → pnpm lint
- No tests yet (structure ready for pytest/vitest)
- No deploy yet (manual Vercel projects per app)

## Deployment

### Vercel Setup

1. Create 4 Vercel projects (one per app)
2. Connect to GitHub repo with different root directories
3. Set environment variables per app (in Vercel UI)
4. Deploy: `git push origin main` (auto-deploys via GitHub integration)

Each app has `vercel.json` with:

- Build command: `pnpm turbo run build --filter=@daracademy/<app>`
- Install command: `pnpm install`
- Output directory: `apps/<app>/.next`

### Environment Variables per App

- **All apps**: DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- **Marketing**: NEXT_PUBLIC_CALENDLY_URL
- **Dashboards**: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (when live)

## Important Notes

- **No hardcoded secrets**: Use .env.local locally, environment variables in Vercel
- **Prisma migrations**: Always use `pnpm db:migrate` before deploying schema changes
- **Noah 3D swap**: When commissioned model arrives, update `USE_3D_MODEL = true` in NoahRenderer.tsx
- **Title unlock**: Trigger via Notification event + `unlockTitle(userId, titleId)` (not yet implemented)
- **Mobile-first**: All apps responsive; test at 375px, 768px, 1440px viewports

## Common Issues

**Issue: `Cannot find module '@daracademy/xyz'`**

- Solution: Run `pnpm install` and ensure the package is in monorepo workspaces

**Issue: Dev server port in use**

- Solution: Kill existing process: `lsof -i :3000` then `kill -9 <PID>`

**Issue: Prisma schema out of sync**

- Solution: `pnpm db:push` (development) or `pnpm db:migrate` (production)

## Future Enhancements

- [ ] Tests (unit + E2E with Playwright)
- [ ] Mobile app (React Native + Expo)
- [ ] 3D Noah model integration
- [ ] Advanced analytics dashboard
- [ ] AI tutor assistant (Claude API)
- [ ] Live video sessions (Zoom integration)
- [ ] Advanced reporting for admins
