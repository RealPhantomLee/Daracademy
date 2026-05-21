# Daracademy Prisma Migrations

This directory contains database migrations for Daracademy. Migrations are applied sequentially to evolve the database schema over time.

## Setup

Before applying migrations, set up your database environment variables:

```bash
# Set Supabase URLs in .env.local (or your deployment config)
export DATABASE_URL="postgresql://user:password@host:5432/daracademy"
export DIRECT_URL="postgresql://user:password@host:5432/daracademy"
export SHADOW_DATABASE_URL="postgresql://user:password@host:5432/daracademy_shadow"
```

See [Prisma documentation](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database) for shadow database setup.

## Applying Migrations

```bash
# Apply all pending migrations
pnpm --filter @daracademy/database db:migrate

# Generate Prisma Client after schema changes
pnpm --filter @daracademy/database db:generate

# View interactive database explorer
pnpm --filter @daracademy/database db:studio
```

## Database Schema

The Daracademy database includes:

### Core Models

- **User** — Authentication, roles (Student, Tutor, Guardian, Admin)
- **StudentProfile** — Grade level, school, learning goals, availability
- **GuardianProfile** — Emergency contact, notification preferences
- **TutoringSession** — Scheduled sessions between tutor and student
- **SessionFeedback** — Ratings and comments after sessions

### Academic Models

- **Assignment** — Tasks assigned by tutors with due dates and grades
- **Payment** — Stripe integration for session payments
- **Title** — Achievement badges (Bronze, Silver, Gold, Platinum tiers)
- **UserTitle** — Earned titles linked to users

### Communication Models

- **Message** — Direct messages between users
- **Notification** — In-app notifications (session reminders, assignments, etc.)
- **Inquiry** — Contact form submissions from public visitors

### Schedule & Auth Models

- **Schedule** — Weekly availability for tutors
- **Account** — NextAuth provider accounts
- **Session** — NextAuth session tokens
- **VerificationToken** — Email verification tokens

### Enums

- **UserRole**: STUDENT, TUTOR, GUARDIAN, ADMIN
- **SessionStatus**: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
- **AssignmentStatus**: ASSIGNED, IN_PROGRESS, SUBMITTED, GRADED, RETURNED
- **NotificationType**: SESSION_REMINDER, ASSIGNMENT_DUE, ASSIGNMENT_GRADED, MESSAGE, PAYMENT_RECEIVED, TUTOR_REQUEST
- **PaymentStatus**: PENDING, COMPLETED, FAILED, REFUNDED
- **TitleTier**: BRONZE, SILVER, GOLD, PLATINUM

## First Migration (0_init)

The initial migration creates all base tables and relationships. It will be auto-generated when you first run:

```bash
pnpm --filter @daracademy/database db:migrate
```

This triggers Prisma to:

1. Create the migration file from the schema
2. Apply it to your database
3. Seed the database with initial titles

## Seeding

After the initial migration, seed the database with title data:

```bash
pnpm --filter @daracademy/database db:seed
```

This populates the `Title` table with 40 achievement titles across the four tiers (10 per tier).

## Development Workflow

When modifying `schema.prisma`:

```bash
# Make changes to schema.prisma
# ...

# Create and apply the migration
pnpm --filter @daracademy/database db:migrate --name <description>

# Regenerate Prisma Client
pnpm --filter @daracademy/database db:generate
```

## Production Deployment

Use the safer `db:push` for production (no rollback, introspection-friendly):

```bash
pnpm --filter @daracademy/database db:push
```

Or use migrations with explicit versions:

```bash
pnpm --filter @daracademy/database db:migrate deploy
```

See [Prisma deployment docs](https://www.prisma.io/docs/orm/prisma-migrate/environments/production-troubleshooting) for more details.
