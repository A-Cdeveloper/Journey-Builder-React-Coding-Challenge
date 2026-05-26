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
- Select a form in the sidebar, open a field in the prefill panel, pick a source in the modal, confirm the mapping label appears, clear it with ×, and close the modal (Escape, backdrop, or close control).

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
├── config/
│   ├── constants.ts
│   └── globalNamespaces.ts   # Action / Client Organisation fields
├── types/
│   ├── graph.ts
│   └── prefill.ts            # UI mapping model (PrefillSelection)
├── utils/requireEnv.ts
├── components/               # shared UI (Modal, Loader, ErrorBoundary, …)
├── providers/                # React Query
└── features/
    ├── graph/
    │   ├── FormList.tsx, FormItem.tsx
    │   ├── api/              # fetchGraph
    │   ├── hooks/
    │   └── lib/adjacency.ts  # direct / transitive prerequisites
    └── prefill/
        ├── PrefillPanel.tsx, PrefillField*.tsx, PrefillFieldModal.tsx
        ├── hooks/            # modal open / pick / close
        └── prefillDataSources/  # direct, transitive, global → picker groups
```

## Extending prefill data sources

The picker reads a flat list of groups from `getPrefillSourceGroups()` in `src/features/prefill/prefillDataSources/index.ts`. UI components do not branch on source type.

**Add a global namespace** — append an entry to `src/config/globalNamespaces.ts`. `globalSource.ts` picks it up automatically.

**Add a new source kind** (e.g. external API):

1. Create `src/features/prefill/prefillDataSources/<name>Source.ts` exporting `get<Name>SourceGroups(...)` returning `PrefillSourceGroup[]`.
2. Spread the result in `getPrefillSourceGroups()` inside `index.ts`.
3. Extend `PrefillSelection` in `src/types/prefill.ts` if the mapping shape is new.
4. Handle the new variant in `formatMapping.ts` for chip labels.

Form DAG sources use `features/graph/lib/adjacency.ts` plus `buildFormSourceGroups()` in `formSourceGroups.ts`.

**Graph model (API):**

- `nodes[].data.component_id` matches `forms[].id`.
- Field definitions are in `forms[].field_schema.properties`.
- Dependencies appear in two equivalent shapes: `edges` (`source` → `target`, parent → child) and `nodes[].data.prerequisites` (parent node ids for that form).
- **Prefill traversal uses `prerequisites` only** — see `features/graph/lib/adjacency.ts` (`getDirectPredecessorIds`, `getTransitivePredecessorIds`). `edges` are not read by the app today; they matter for canvas-style graph UIs or if you build a parent index at parse time.
