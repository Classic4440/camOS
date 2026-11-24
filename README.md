# camOS

**The personal operating desk for Cam Leinad / DanielMac.**

camOS is the private command centre that manages day-to-day life and work: music releases, brand, tasks, ledger, vault, lab, ideas, marketing, analytics and authenticator codes. Everything else in the CAM stack feeds into or is directed from here.

- **Live app:** https://camOS.uwon.workers.dev  
- **Repository:** https://github.com/Classic4440/camOS (`main`)

---

## Start here if you are a developer

If someone tells you “look at camOS”, this README is the map of the whole system.

### The four repos (exact links)

| Repo | Visibility | What it is | When to open it |
|------|------------|------------|-----------------|
| **[camOS](https://github.com/Classic4440/camOS)** (this) | Public | Private owner desk — life, work, releases, brand, vault, codes | Always start here for context and navigation |
| **[NoteLab2](https://github.com/Classic4440/NoteLab2)** | Private | Creation + learning workspace (FL Studio style recipes, piano roll, AI studio, lessons) | When building or fixing creation / generation / “Send to Lanes” |
| **[lanes](https://github.com/Classic4440/lanes)** | Public | Deep audio analysis + multi-track studio (tempo, key, stems, MIDI, arrangement, AudioMass) | When working on analysis, stems, MIDI conversion, or the studio timeline |
| **[camleinad](https://github.com/Classic4440/camleinad)** | Private | Public artist website (releases, player, journal, socials) | When changing what fans see on the public site |

> **Do not use** `camleinad-public` — it is archived. Active public-site work is in the private **camleinad** repo.

Canonical detailed architecture & integration status:  
→ [NoteLab2/docs/SYSTEM_MAP.md](https://github.com/Classic4440/NoteLab2/blob/main/docs/SYSTEM_MAP.md)

### How the pieces connect

```
NoteLab2          →  create / learn / generate ideas, recipes, MIDI
       ↓ “Send to Lanes”
lanes             →  analyse, stem-separate, edit, arrange, bounce
       ↓ hand-off
camOS /music      →  manage the release, tasks, brand, decisions
       ↓ publish
camleinad         →  public face (what the world sees)
```

camOS sits in the middle of daily operations. Music created in NoteLab2 and refined in lanes is managed as releases inside camOS and then published to camleinad.

### Quick navigation for common tasks

| You need to… | Go to this repo |
|--------------|-----------------|
| Understand the overall system | **camOS** (this README) + NoteLab2 SYSTEM_MAP |
| Change the public artist site | **camleinad** |
| Work on creation tools, recipes, piano roll, AI Studio | **NoteLab2** |
| Work on analysis, stems, MIDI, timeline, AudioMass | **lanes** |
| Change tasks, ledger, vault, brand shop, releases, codes | **camOS** |
| Add or fix “Send to Lanes” | **NoteLab2** + **lanes** |
| Publish a release to the public site | **camOS** `/music` → **camleinad** |

---

## Access model

camOS is a **private, single-owner desk**. It is not a multi-user product.

| Layer | Behaviour |
|-------|-----------|
| **Front door** | Every visit is gated by the **Owner Lock** (email + password via Supabase Auth). Unauthenticated users never reach the desk. |
| **Sign-up** | Public registration is **closed**. New accounts are blocked on the frontend and by a database trigger after the first owner exists. |
| **Inside** | After successful sign-in the full desk loads (sidebar, workspaces, sync). |
| **`/codes`** | Internal **authenticator backup** tool (TOTP secrets for GitHub, Discord, etc.). Not the login MFA step. Only reachable after sign-in. |

There is no MFA challenge on the Owner Lock login screen — only standard Supabase email/password.

---

## What lives inside the desk

Once signed in, everything is in one shell: sidebar on desktop, bottom dock + index drawer on mobile.

### Primary workspaces

| Route | Workspace | Purpose |
|-------|-----------|---------|
| `/` | Home | Desk overview |
| `/command` | Brief | Daily command brief |
| `/personal` | Tasks | Tasks and decisions |
| `/music` | Cam Leinad | Music workspace & releases (bridge to public site) |
| `/brand` | Classic Brand | Brand shop, jobs, quotes |
| `/lab` | Lab | Experiments and creative lab |
| `/finance` | Ledger | Ledger and transactions |

### Library

| Route | Workspace | Purpose |
|-------|-----------|---------|
| `/trading` | Trading | Trades |
| `/learn` | Learning | Learning notes and study |
| `/vault` | Vault | Private notes |
| `/codes` | Codes | Authenticator / TOTP backup vault |
| `/ideas` | Ideas | Idea capture |
| `/marketing` | Marketing | Campaigns |
| `/analytics` | Analytics | Charts and numbers |
| `/settings` | Settings | Theme, density, preferences |

### Desk features

- **Command palette:** `Ctrl` / `⌘` + `K` or `/` — search everything, jump to any workspace, create new items
- **Quick create:** task, decision, release, job, quote, ledger entry, trade, note, idea, campaign from anywhere
- **Keyboard shortcuts:** press `?` for the list (`G` then letter for go-to)
- **Themes:** paper (light) and ink (dark), adjustable density
- **Desk sync:** background sync once the owner is signed in
- Mobile-friendly and keyboard-accessible throughout

---

## Team

| Person | Role |
|--------|------|
| **DanielMac** | Admin / owner |
| **Cam Leinad** | Artist identity & assistant developer |
| **Cam All May** | Main sponsor and record label |

Built by and for Cam Leinad and the CAM ALL MAY team under the Classic Brand label (Matugga).

---

## Tech stack

| Layer | Tools |
|-------|-------|
| Framework | React 19, TanStack Start / Router / Query / Table |
| Language & build | TypeScript, Vite, Nitro |
| Styling & UI | Tailwind CSS v4, Radix, lucide-react, cmdk, sonner, vaul, recharts |
| State & forms | zustand, react-hook-form, zod |
| Backend & data | Supabase, PostgreSQL (pg, Kysely, PGlite) |
| Auth | Supabase Auth + Owner Lock gate |
| Hosting | Cloudflare Workers (live), Vercel config included |
| Quality | ESLint, Prettier, Playwright, Node test runner |

---

## Project structure

```text
camOS/
├── src/
│   ├── routes/        File-based routes (__root, _app layout, every workspace)
│   ├── components/    Shell, Owner Lock, shared UI
│   ├── lib/           Desk store, search, sync, owner session, auth, data
│   ├── router.tsx
│   └── styles.css     Theme tokens
├── server/            Server middleware
├── public/            Static assets
├── migrations/        DB migrations (auth)
├── supabase/          Supabase migrations (Owner Lock RLS)
├── scripts/
├── artifacts/
├── attachments/
├── screenshots/
├── vite.config.ts
├── vercel.json
└── package.json
```

---

## Getting started

Requires **Node 22**.

```bash
npm install
npm run dev
```

Dev server listens on `0.0.0.0:8080`.

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build + migrations |
| `npm run preview` | Preview production build |
| `npm run db:migrate` | Apply migrations |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run check:auth` | Auth invariant check |
| `npm test` | Tests |

---

## Deployment & secrets

- **Live:** Cloudflare Workers → `camOS.uwon.workers.dev`
- **Backend:** Supabase (RLS locked to `authenticated` after owner migration)
- Never commit `.env` or real secrets. Platform injects values at deploy time.
- Service-role keys and sensitive secrets belong only in Cloudflare Worker secrets / server-side code.

---

## Contributing

Push to `main` or open a PR. Run `npm run typecheck` and `npm run lint` before pushing.

When you change how the repos relate to each other, update:
1. This README (developer map)
2. [NoteLab2/docs/SYSTEM_MAP.md](https://github.com/Classic4440/NoteLab2/blob/main/docs/SYSTEM_MAP.md) (canonical architecture)

---

## License & ownership

Private project of **Cam Leinad**, **CAM ALL MAY** and the Classic Brand team. All rights reserved.

---

## Changelog

**2026-11-24**
- Rewrote README as the definitive developer entry point for the entire CAM ecosystem
- Clear 4-repo table with exact links and “when to open this repo” guidance
- Explicit data-flow diagram (NoteLab2 → lanes → camOS → camleinad)
- Quick-task navigation table so any developer (or AI) told “look at camOS” immediately knows where to go
- Marked `camleinad-public` as archived / wrong target
- Pointed to canonical SYSTEM_MAP in NoteLab2
