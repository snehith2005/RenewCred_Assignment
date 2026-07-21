# RenewCred CMS — Frontend Engineering Assignment

A production-style headless CMS: authenticated admins manage page content as
structured "blocks" (headers, paragraphs, nested lists, tables, LaTeX
equations); the public RenewCred site renders that content dynamically via
API rather than hardcoding it.

## 1. Architecture Overview

```
renewcred-cms/
├── backend/            Express + MongoDB API (auth + content)
├── admin-frontend/     Next.js + Redux Toolkit admin panel (port 3001)
├── public-frontend/    Next.js public site, SSR from the API (port 3000)
└── docker-compose.yml  Wires Mongo + all three services together
```

**Why this split:** the admin CMS and public site have different auth
requirements, deploy cadences, and audiences, so they're separate Next.js
apps rather than one app with a `/admin` route. They talk to the same
Express API over two route groups:

- `/api/v1/content/*` — JWT-protected, used only by the admin panel (create,
  edit, delete, list pages in any status).
- `/api/v1/public/*` — open, read-only, used only by the public site
  (returns **published** pages only).

### Content model: blocks, not rigid fields

A `Page` is `{ title, slug, status, category, icon, excerpt, blocks[] }`.
Each block is `{ type, data, order }` where `type` is one of `header`,
`paragraph`, `list`, `table`, `equation`, and `data` is validated against a
per-type Zod schema on the way in. This is the key design decision the
assignment asks about:

- A flat schema (`title`, `body`, `image`) can't represent a page that mixes
  long-form text, a nested list, a table, and an equation in any order.
- A single rich-text HTML field can represent that, but then the public
  frontend has to trust/sanitize arbitrary HTML, and structured data like
  table rows or equations gets awkward to query, validate, or restyle later.
- The block array is a middle ground: each block is small, typed, and
  independently validated, but the page itself is just an ordered list, so
  new block types (e.g. `image`, `quote`) can be added later without a
  migration for pages that don't use them.

Lists support **arbitrary nesting** via a recursive `children` field on each
list item, both in the editor (`ListItemsEditor.js`) and the renderer
(`NestedList.js`).

Equations store raw LaTeX and a `displayMode` flag; the public site renders
them with KaTeX (`react-katex`), matching the reference document's
suggested stack.

`category`, `icon`, and `excerpt` are optional page metadata I added beyond
the base spec, so that a "hub" page (like the Standards index in the Figma
file) can list other pages as cards without hardcoding which slugs belong
together — the public site just queries
`GET /api/v1/public/pages?category=standards`.

### State management: Redux Toolkit vs local state

- **Redux** (`admin-frontend/src/store`): auth session/token, and the pages
  list + "page currently being edited". This is server-derived data that
  needs to survive navigation between the dashboard and the editor, and
  that multiple components (sidebar, dashboard, editor) all read.
- **Local component state** (`useState`): the actual form fields while
  editing a page (title, slug, block contents) and all UI-only state (which
  block is expanded, TOC search filter). This data doesn't need to be
  global — nothing outside the form cares about it until "Save" is clicked.

### Authentication

Simple JWT auth: `POST /api/v1/auth/login` verifies a bcrypt-hashed
password and returns a signed JWT; the admin frontend stores it and attaches
it as a `Bearer` token via an axios interceptor. `protectRoute` middleware
guards every `/api/v1/content/*` route. Logout just discards the token
client-side (JWTs are stateless) — the `/auth/logout` endpoint exists mainly
so the API surface is consistent and there's a hook point for token
revocation later if needed.

## 2. Assumptions

1. **No direct Figma access.** I don't have Figma tooling available, so I
   worked from screenshots shared in conversation rather than the live
   file. The public site's visual design (navbar, Standards hub with icon
   cards, individual Standard pages with a numbered sidebar table of
   contents) is a best-effort match to those screenshots, not a pixel-exact
   implementation.
2. **Static nav chrome.** The navbar's "Buyers / Suppliers / Climate & Us /
   Science / Contact Us" links are presentational placeholders (the design
   didn't show what those pages contain). Only "Standards" is wired to real
   dynamic content, since that's the section actually demonstrated in the
   screenshots.
3. **Sidebar TOC numbering.** The Figma reference shows headings like
   `2.1.2 Future Versions` with a matching nested sidebar outline. Rather
   than add a separate "depth" field to maintain by hand, the sidebar
   derives nesting from the leading number in the heading text itself
   (`2.1.2` → depth 2). Admins are expected to type the number into the
   header text.
4. **Version dropdown / "View consultation" / "View Feedback" menu** shown
   in one screenshot was treated as a future enhancement, not implemented,
   given the assignment's time constraints — documented here rather than
   silently dropped.
5. **MongoDB** was chosen (over Postgres/Prisma) because the block model's
   `data` field is intentionally variable-shaped per block type, which
   suits a document store more naturally than a relational schema.

## 3. Setup Instructions

### Prerequisites
- Node.js v18.x or v20.x
- Docker & Docker Compose (for the containerized route)
- MongoDB (only if running without Docker)

### Option A — Docker Compose (recommended)

```bash
# from the repo root
cp backend/.env.example backend/.env
# edit backend/.env if you want different JWT secret / seed credentials

docker compose up --build
```

This starts:
- MongoDB on `27017`
- Backend API on `http://localhost:5000`
- Admin panel on `http://localhost:3001`
- Public site on `http://localhost:3000`

Then seed the database with an admin user and sample content (run once,
after the backend container is up):

```bash
docker compose exec backend npm run seed
```

### Option B — Run locally without Docker

```bash
# 1. Backend
cd backend
cp .env.example .env      # edit MONGO_URI to point at your local Mongo
npm install
npm run seed               # creates admin user + sample pages
npm run dev                 # http://localhost:5000

# 2. Admin frontend (new terminal)
cd admin-frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:3001

# 3. Public frontend (new terminal)
cd public-frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:3000
```

## 4. Sample / Seed Credentials

After running `npm run seed` (or `docker compose exec backend npm run seed`):

| Field    | Value                    |
|----------|---------------------------|
| Email    | `admin@renewcred.com`     |
| Password | `Admin@12345`              |

(Configurable via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in
`backend/.env` before seeding.)

The seed script also creates two sample pages:
- `/` (slug `home`) — demonstrates headers, paragraphs, a nested list, a
  table, and both inline and block-mode equations.
- `/ev` (slug `ev`, category `standards`) — demonstrates the numbered
  heading / sidebar-TOC documentation layout, visible at `/standards`.

## 5. Environment Variables

See `backend/.env.example`, `admin-frontend/.env.example`, and
`public-frontend/.env.example`. Key ones:

- `MONGO_URI` — Mongo connection string
- `JWT_SECRET` / `JWT_EXPIRES_IN` — token signing
- `NEXT_PUBLIC_API_URL` — API base URL each frontend calls

## 6. Troubleshooting

**Public site shows "Content not available yet" / "Page not found" when running via Docker Compose, but the admin panel works fine.**
This happens if the public frontend's server-side data fetching (`getServerSideProps`) tries to reach the API at `localhost:5000` — inside a container, `localhost` means "this container," not the backend container. Fixed via `public-frontend`'s `API_INTERNAL_URL=http://backend:5000/api/v1` runtime env var in `docker-compose.yml`, which routes server-side requests over the Docker network instead of back out to the host. If you rename the backend service in `docker-compose.yml`, update this hostname to match.

## 7. What I'd do next with more time

- Swap the plain `<input>`/`<textarea>` block editors for a real rich-text
  editor (TipTap) for the `paragraph` block specifically, while keeping the
  structured editors for list/table/equation.
- Add optimistic UI + toast notifications instead of inline success/error
  banners in the admin panel.
- Add integration tests for the content API (Jest + Supertest) and
  component tests for `BlockRenderer`.
- Wire up the version-history / "View consultation" pattern seen in the
  Figma screenshots.
