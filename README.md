# camOS

> A collection of sites created to help CAM music producers, engineers, music artists, and developers.

**camOS** is a personal operating desk for the CAM ecosystem: one installable web app that brings music releases, a brand shop, tasks, a lab, a ledger, trading, a private vault, authenticator codes, ideas, marketing and analytics together in one place. It is built by and for **Cam Leinad** and the **CAM ALL MAY** team, and runs under the **Classic Brand** label out of Matugga.

- **Live app:** https://camOS.uwon.workers.dev (Cloudflare Workers)
- **Repository:** https://github.com/Classic4440/camOS (`main` branch)

---

## Team and credits

Huge shout-out to everyone who builds, backs and runs camOS.

| Person | Role |
| --- | --- |
| **DanielMac** | Admin |
| **Cam Leinad** | Assistant developer |
| **Cam All May** | Main sponsor and record label |

Created by **Cam Leinad** and the **CAM ALL MAY** team. Thank you to every collaborator and developer who has contributed code, ideas, music and support along the way.

---

## What is inside

The app opens behind an owner lock and, once signed in, loads the desk. Everything lives inside a single shell with a sidebar index on desktop and a bottom dock plus index drawer on mobile.

### Primary workspaces

| Route | Workspace | Purpose |
| --- | --- | --- |
| `/` | Home | The desk overview |
| `/command` | Brief | Daily command brief |
| `/personal` | Tasks | Tasks and decisions |
| `/music` | Cam Leinad | Music workspace, including releases |
| `/brand` | Classic Brand | Brand shop, jobs and quotes |
| `/lab` | Lab | Experiments and creative lab |
| `/finance` | Ledger | Ledger and transactions |

### Library

| Route | Workspace | Purpose |
| --- | --- | --- |
| `/trading` | Trading | Trades |
| `/learn` | Learning | Learning notes and study |
| `/vault` | Vault | Private notes |
| `/codes` | Codes | Authenticator and auth codes |
| `/ideas` | Ideas | Idea capture |
| `/marketing` | Marketing | Campaigns |
| `/analytics` | Analytics | Charts and numbers |
| `/settings` | Settings | Theme, density and preferences |

### Desk features

- **Command palette:** press `Ctrl` / `⌘` + `K`, or `/`, to search every record, jump to any workspace, or create something new.
- **Quick create:** new task, decision, release, job, quote, ledger entry, trade, note, idea or campaign from anywhere.
- **Keyboard shortcuts:** press `?` for the list. `G` then `H` Home, `C` Brief, `P` Tasks, `M` Cam Leinad, `B` Classic Brand, `L` Lab, `F` Ledger, `T` Trading, `V` Vault, `O` Codes, `S` Settings.
- **Themes and density:** paper (light) and ink (dark) themes, with adjustable density.
- **Desk sync:** once the owner is signed in, desk data syncs in the background.
- **Mobile friendly:** bottom dock for Home, Music, Shop and Lab, with a full index drawer.
- **Accessible:** skip-to-desk link, labelled controls and keyboard navigation throughout.

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | React 19, TanStack Start, TanStack Router, TanStack Query, TanStack Table |
| Language and build | TypeScript, Vite, Nitro |
| Styling and UI | Tailwind CSS v4, Radix UI primitives, lucide-react, cmdk, sonner, vaul, recharts |
| State and forms | zustand, react-hook-form, zod |
| Backend and data | Supabase (`@supabase/supabase-js`), PostgreSQL (`pg`, Kysely, PGlite) |
| Auth | Better Auth, jose |
| Hosting | Cloudflare Workers (live app), Vercel configuration included |
| Quality | ESLint, Prettier, Playwright, Node test runner |

---

## Project structure

```text
camOS/
├── src/
│   ├── routes/        File-based routes (__root, _app layout and every workspace page)
│   ├── components/    UI, including the camOS shell, owner lock and shared controls
│   ├── lib/           Desk store, search, sync, owner session, auth and data helpers
│   ├── router.tsx     Router setup
│   └── styles.css     Tailwind entry and theme tokens
├── server/            Server middleware
├── public/            Static assets
├── migrations/        Database migrations (auth)
├── supabase/          Supabase migrations
├── scripts/           Build, migrate, preview and check scripts
├── artifacts/         Generated artifacts
├── attachments/       Project attachments
├── screenshots/       QA screenshots
├── vite.config.ts     Vite configuration
├── vercel.json        Vercel configuration
└── package.json       Scripts and dependencies
```

---

## Getting started

Requires **Node 22**.

```bash
npm install
npm run dev
```

The dev server listens on `0.0.0.0:8080`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build, then run database migrations |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Preview the built app |
| `npm run db:migrate` | Apply database migrations |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run check:auth` | Check the auth invariant |
| `npm test` | Run script and unit tests |

---

## Deployment

- **Live:** Cloudflare Workers at `camOS.uwon.workers.dev`.
- **Backend:** Supabase.
- **Config:** a `vercel.json` is included for Vercel deployments.
- Never commit secrets or `.env` files. Environment values are injected by the platform at deploy time.

---

## Roadmap

- **Auth app section:** a dedicated place to store all your own 2FA and authenticator codes inside camOS, so you have a pure auth code backup you control instead of relying on random third-party apps.

---

## Contributing

Collaborators push to `main` or open a pull request. Please run `npm run typecheck` and `npm run lint` before pushing.

---

## License and ownership

camOS is a private project of **Cam Leinad**, **CAM ALL MAY** and the Classic Brand team. All rights reserved.
