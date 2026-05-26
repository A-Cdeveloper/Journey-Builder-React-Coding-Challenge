# Journey Builder — Frontend

React + TypeScript application for browsing journey blueprint forms and configuring per-field prefill mappings.

Challenge specification: [Journey Builder — React Coding Challenge](https://fluttering-atmosphere-1b5.notion.site/Journey-Builder-React-Coding-Challenge-190d5fe264fa80cba39ec21afc6d42ec).

## Repository layout

```
Journey-Builder/
├── frontend/                 # this project
└── frontendchallengeserver/  # local mock API
```

## Prerequisites

- Node.js 20+
- npm 10+

## Getting started

Run the mock API and the frontend in **two separate terminals**.

### 1. Mock API

```bash
cd ../frontendchallengeserver
npm install   # first time only
npm start
```

The server listens on **http://localhost:3000**.

Graph endpoint:

```
GET /api/v1/{tenantId}/actions/blueprints/{blueprintId}/graph/
```

### 2. Frontend environment

```bash
cd frontend
cp .env.example .env.development
```

Edit `.env.development` and set `VITE_TENANT_ID` and `VITE_BLUEPRINT_ID`. For the bundled mock data, use `tenant_id` and `id` from `../frontendchallengeserver/graph.json`.

Do not commit `.env.development`.

| Variable                | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `VITE_API_PROXY_TARGET` | Mock API origin (e.g. `http://localhost:3000`) |
| `VITE_TENANT_ID`        | Tenant segment in the graph URL                |
| `VITE_BLUEPRINT_ID`     | Blueprint segment in the graph URL             |

### 3. Frontend dev server

```bash
npm install   # first time only
npm run dev
```

Open **http://localhost:5173**.

### Smoke check

- Graph JSON loads at  
  `{VITE_API_PROXY_TARGET}/api/v1/{VITE_TENANT_ID}/actions/blueprints/{VITE_BLUEPRINT_ID}/graph/`
- The app starts without missing-environment errors.
- Select a form in the sidebar, open a field in the prefill panel, and confirm the modal opens and closes (Escape, backdrop, or close control).

## npm scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Vite development server      |
| `npm run build`        | Typecheck + production build |
| `npm run preview`      | Preview production build     |
| `npm run lint`         | ESLint                       |
| `npm run test`         | Vitest                       |
| `npm run format`       | Prettier (write)             |
| `npm run format:check` | Prettier (check)             |

## Tech stack

- React 19, TypeScript, Vite 8
- Tailwind CSS 4
- TanStack Query 5
- Vitest
- Husky, lint-staged, Commitlint

## Configuration notes

- **Dev proxy:** `vite.config.ts` forwards `/api` to `VITE_API_PROXY_TARGET`.
- **Graph URL:** assembled in `src/config/constants.ts` from env vars.
- **Env validation:** `src/utils/requireEnv.ts` fails fast when required variables are missing.
- **Imports:** `@/` maps to `src/` (Vite + TypeScript).

| File               | Tracked in git |
| ------------------ | -------------- |
| `.env.example`     | Yes            |
| `.env.development` | No             |

## Project structure

```
src/
├── App.tsx
├── main.tsx
├── config/constants.ts
├── types/graph.ts
├── utils/requireEnv.ts
├── components/          # shared UI (Modal, Loader, ErrorBoundary, …)
├── providers/           # React Query
└── features/
    ├── graph/           # fetch graph, form list
    └── prefill/         # prefill panel, fields, modal wiring
```

**Graph model (API):**

- `nodes[].data.component_id` matches `forms[].id`.
- Field definitions are in `forms[].field_schema.properties`.
- `edges` are directed (`source` → `target`) for dependency relationships between forms.
