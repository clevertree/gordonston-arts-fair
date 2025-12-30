# gordonston-arts-fair Copilot Instructions

## Project Overview
Next.js art fair website with artist profiles, event scheduling, and ticketing.

### Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (schema.sql provided)
- **E2E Testing:** Cypress
- **Build:** Next.js + MDX support

### Key Features
- Artist directory
- Event management
- Ticket sales
- Admin panel (likely in `app/(admin)/`)

## Project Structure

### App Routes
```
app/
├── layout.tsx           - Root layout
├── template.tsx         - Template wrapper
├── globals.scss         - Global styles
├── (admin)/            - Admin routes (protected)
├── (artist)/           - Artist routes
└── (landing)/          - Public landing pages
```

### Key Directories
- `components/` - Reusable React components
- `fragments/` - GraphQL fragments (if using GraphQL)
- `pages/` - Additional page routes (if mixed routing)
- `public/` - Static assets
- `scripts/` - Build/utility scripts
- `template/` - Content templates
- `util/` - Utility functions
- `cypress/` - E2E tests

## Database

### Schema
`schema.sql` contains PostgreSQL schema for:
- Artists
- Events
- Tickets
- Users
- etc.

### Setup
```bash
psql < schema.sql
```

### Environment
Need `.env.local` with database connection:
```
DATABASE_URL=postgresql://user:pass@localhost/gordonston_arts
```

## Configuration Files

### Build Config
- `next.config.mjs` - Next.js configuration
- `postcss.config.js` - PostCSS/Tailwind
- `tailwind.config.ts` - Tailwind CSS theme
- `tsconfig.json` - TypeScript settings
- `export.csv` - Data export (likely artists/events)

### MDX Support
- `mdx-components.tsx` - Custom MDX components
- Content can use `.mdx` files

### Middleware
- `middleware.ts` - Request/response middleware (routing, auth, redirects)

## Development

### Local Setup
```bash
npm install
npm run dev  # starts Next.js dev server
```

### Build
```bash
npm run build
npm start
```

### Testing
```bash
npm run test        # unit/integration tests (if configured)
npm run cypress     # E2E tests with Cypress
```

### Cypress Config
- `cypress.config.ts` - Test configuration
- `cypress/` - Test files
- Likely tests for critical user flows (ticket purchase, artist search, etc.)

## Middleware

### Request Processing (`middleware.ts`)
Common middleware patterns:
- Authentication/authorization
- Route protection (admin routes)
- URL redirects
- Locale/i18n handling

Check middleware for:
- Protected routes
- API key validation
- CORS handling

## Admin Panel (`(admin)/`)

### Features
- Artist management (add/edit/delete)
- Event scheduling
- Ticket inventory
- Sales reporting
- User management (likely)

### Authentication
- Check middleware for auth requirements
- Likely session/JWT based
- Protected routes behind auth wrapper

## Artist Routes (`(artist)/`)

### Features
- Artist profiles
- Portfolio/media display
- Event listings
- Contact/booking info

## Landing Routes (`(landing)/`)

### Features
- Homepage
- Event calendar
- Artist directory
- Ticketing interface
- FAQ/About pages

## Components & Styling

### Tailwind CSS
- Custom theme in `tailwind.config.ts`
- May have brand colors (art fair specific)
- Responsive design patterns

### SCSS
- Global styles in `globals.scss`
- `layout.module.css` - Layout-specific CSS
- Component-level CSS modules (if using)

### Custom Components
Check `components/` for reusable UI:
- Navigation
- Cards (artist, event, ticket)
- Forms (artist creation, ticket purchase)
- Modals/dialogs

## Types

### TypeScript Definitions (`types.ts`)
Core types:
- `Artist` - Artist profile
- `Event` - Event data
- `Ticket` - Ticket information
- `User` - User account

## Data Export

### export.csv
Likely contains:
- Artist information
- Event schedules
- Ticket sales data

Used for:
- Data backup
- External analysis
- Integration with other systems

## Development Workflow

### Adding Features
1. Create route in `app/(section)/`
2. Add component in `components/`
3. Update database schema if needed
4. Add Cypress test in `cypress/`
5. Style with Tailwind

### Database Changes
1. Update `schema.sql`
2. Create migration (if using migrations)
3. Update TypeScript types in `types.ts`
4. Test with local database

### Deployment
Likely deployed on Vercel (Next.js native):
```bash
# Vercel CLI
vercel deploy --prod
```

## Common Issues

### Database Connection
- Check `DATABASE_URL` in `.env.local`
- Verify PostgreSQL is running
- Check schema initialized: `psql < schema.sql`

### Cypress Tests Failing
- Ensure dev server running: `npm run dev`
- Check selectors in tests against rendered HTML
- May need to update after UI changes

### Build Errors
- Clear `.next/` cache: `rm -rf .next`
- Reinstall: `npm install`
- Check TypeScript: `npx tsc --noEmit`

## Key Files
- `next.config.mjs` - Framework config
- `app/layout.tsx` - Root layout
- `middleware.ts` - Request middleware
- `types.ts` - TypeScript definitions
- `schema.sql` - Database schema
- `cypress.config.ts` - E2E test config
