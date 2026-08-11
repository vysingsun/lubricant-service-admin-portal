# Lubricant Service Admin Portal

Nuxt admin portal for lubricant store vendors: manage a store's products,
variants and pricing, staff, and view order history. Talks to the
`lubricant-service-backend` NestJS API, and logs in directly against
kot-preng-api (the backend only verifies tokens, it doesn't issue them).

## Stack

- Nuxt 4 + TypeScript, Nuxt UI 4
- Pinia for app/auth state, `@pinia/colada` for server-state caching
  (queries and mutations against the NestJS API — no plain
  `useFetch`/`useAsyncData` for API data)
- `@nuxtjs/i18n` with English (default) and Khmer

## Project layout

Feature-based, under `app/`:

- `features/auth` — login form, auth Pinia store (token + role/userId
  cookies — kot-preng-api's JWT doesn't carry role, so those come from
  the login response body, not from decoding the token), `useAuth()`
  composable
- `features/stores-management` — store list query and the "current store"
  selection used to scope products/staff/orders requests
- `features/products` — product list/detail queries, create/update
  mutations, variant + price-tier + image-upload mutations, form
  components
- `features/staff` — `store_admins` query/mutations and UI
- `features/orders` — read-only store order history query and table
- `shared/` — cross-feature components (sidebar, language switcher, store
  switcher), the `useApi()` fetch wrapper, currency utilities

Actual routes live in `app/pages/*` (required by Nuxt's file-based
router) and compose the feature components above. `components` and
`imports.dirs` in `nuxt.config.ts` are configured to auto-import from
these nested feature folders since they're outside Nuxt's default
top-level `components/`/`composables/` directories.

## Branding

- Primary color `#2563eb`, secondary `#78D64A` — defined as full Tailwind
  color scales in `app/assets/css/main.css` (`@theme static` block) and
  wired up via `ui.colors` in `app/app.config.ts`.
- Font: Google Sans, resolved and self-hosted automatically by Nuxt's
  built-in font pipeline at build time (falls back to Roboto/system UI if
  that resolution ever fails, e.g. fully offline).

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env` and fill in the values:

   | Variable                        | Description                                                                 |
   | -------------------------------- | ----------------------------------------------------------------------------- |
   | `NUXT_PUBLIC_API_BASE_URL`       | Base URL of the `lubricant-service-backend` NestJS API.                     |
   | `NUXT_PUBLIC_KOT_PRENG_API_URL`  | Base URL of kot-preng-api, used directly for login.                         |

3. Run in dev mode:

   ```bash
   pnpm run dev
   ```

4. Sign in at `/login` with a kot-preng-api **Vendor** account. `/dashboard`,
   `/products`, `/staff`, and `/orders` require auth (see
   `app/middleware/auth.ts`). Any other role logs into kot-preng-api fine
   but is turned away at this portal — see `auth.store.ts`.

## Notes on auth

Login calls kot-preng-api's `POST /auth/login` directly with
`{ identifier, password }` (`identifier` is an email or phone — there's
no separate phone field). Its response is `{ success, data: { user, token } }`,
where `user.role.role_name` is the only place the role appears — the JWT
itself only carries `_id`/`identifier`. So the token and `{ userId, role }`
are both cached in `useCookie` cookies (not `httpOnly`) from that response
body, and the token is attached as a `Bearer` header to every backend
request via `useApi()`. This is the simpler of the two approaches the
original spec called out; if you need the hardened version, swap it for a
Nuxt server route that sets an `httpOnly` cookie and proxies backend calls
server-side.

## Scripts

- `pnpm run dev` — dev server
- `pnpm run build` — production build
- `pnpm run typecheck` — `vue-tsc` via `nuxt typecheck`
- `pnpm run lint` — ESLint
