# Journey Builder — Frontend

React + TypeScript submission for the [Avantos Journey Builder coding challenge](https://fluttering-atmosphere-1b5.notion.site/Journey-Builder-React-Coding-Challenge-190d5fe264fa80cba39ec21afc6d42ec).

For a selected form node, you map each field to a value from **direct prerequisites**, **transitive prerequisites**, or **global namespaces** (Action Properties, Client Organisation Properties). The modal lists every option from `getPrefillSourceGroups()`; UI code does not branch on source type.

---

## Features

- **Form list** — nodes from the blueprint graph, with loading and error states
- **Prefill panel** — per-field mapping, display label, and clear (×)
- **Source picker modal** — grouped “Available data”, search, expandable sections
- **Per-form toggle** — disable prefill for the active form without losing stored mappings
- **Extensible sources** — new globals via config; new categories via `prefillDataSources/`

---

## Run locally

The blueprint graph comes from Avantos’s mock server in a **separate** repo. Run both processes.

### 1\. Mock server (port 3000)

```
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd frontendchallengeserver
npm install
npm start
```

`GET /api/v1/{tenantId}/actions/blueprints/{blueprintId}/graph/` — data from `graph.json`.

### 2\. This app (port 5173)

From the directory that contains `package.json`:

```
# first time only:
git clone https://github.com/A-Cdeveloper/Journey-Builder-React-Coding-Challenge.git
cd Journey-Builder-React-Coding-Challenge

# every time (or after clone):
git pull
cp .env.example .env.development   # first time only; skip if file exists
npm install
npm run dev
```

Open **http://localhost:5173**. Pick a form in the **sidebar**; the prefill panel is on the right.

Do not commit `.env.development`.

### Environment variables

| Variable                | Purpose                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `VITE_API_PROXY_TARGET` | Mock API origin; Vite proxies `/api` here in dev                    |
| `VITE_TENANT_ID`        | Tenant segment in the graph URL — use `tenant_id` from `graph.json` |
| `VITE_BLUEPRINT_ID`     | Blueprint segment — use `id` from `graph.json`                      |

`src/utils/requireEnv.ts` fails fast if required values are missing. The graph URL is built in `src/config/constants.ts`.

---

## Run tests

```
npm test                # watch mode
npm run test:run        # single run (CI-friendly)
npm run test:coverage   # coverage report (text + html)
```

Coverage is intentionally focused on **pure logic** (`adjacency`, `prefillDataSources`, `fetchGraph`). Presentational components, `App.tsx`, types, config, and providers are excluded from coverage.

---

## Architecture at a glance

**Graph (read-only)** — Fetched with TanStack Query in `useFetchGraph` (`features/graph/api/fetchGraph.ts`). Shared across the sidebar and prefill panel.

**Prefill mappings (client)** — `prefillMappings` state in `App.tsx`: `Record<nodeId, Record<fieldKey, PrefillSelection>>`. Session-only; refresh clears it. State is keyed by **canvas node id**, not form schema id, so two nodes using the same form keep separate mappings. The `PrefillSelection` union in `src/types/prefill.ts` is the UI model and is intended to map to API `input_mapping` when persistence exists.

**UI flow** — `FormList` → `PrefillPanel` → `PrefillFieldList` (per-form “Prefill fields for this form” toggle) → `PrefillFieldModal` with `PrefillSourcePicker`. Search in the modal uses `filterSourceGroups.ts` (matches group or option labels).

**Upstream forms** — `features/graph/lib/adjacency.ts` walks `nodes[].data.prerequisites` for direct (1-hop) and transitive (2+ hop) predecessors. `nodes[].data.component_id` links each node to `forms[].id`; fields come from `forms[].field_schema.properties`.

**Build** — Production build uses Vite 8 / Rolldown `codeSplitting` groups (`react-vendor`, `query-vendor`, `vendor`) so library chunks stay cacheable across deploys when only app code changes. Tree-shaking is handled by the production bundler; no extra app config required.

**React Compiler** — Enabled via `@vitejs/plugin-react` + `babel-plugin-react-compiler`. Some explicit `useMemo` / `useCallback` / `memo` remain on hot paths for predictable behaviour if the feature set grows.

---

## Adding a new data source

The modal does not know about “direct” or “global”. It only shows the list returned by `getPrefillSourceGroups()` in `prefillDataSources/index.ts`.

That list is built from three modules today:

- `globalSource.ts` → reads `config/globalNamespaces.ts`
- `directSource.ts` → fields from **direct** prerequisite forms
- `transitiveSource.ts` → fields from forms **further up** the chain (2+ hops)

You do **not** change the UI (`PrefillSourcePicker`, modal, field rows) when adding a source.

---

### A) New global field (easiest)

Open `src/config/globalNamespaces.ts` and add a field (or copy the shape of `clientOrganisationProperties` for a new group).

Done — the picker and chip label update automatically.

---

### B) New group from the graph (copy an existing file)

1.  Copy `directSource.ts` or `transitiveSource.ts` to a new file.
2.  Change which `adjacency.ts` helper you use if needed (`getDirectPredecessorIds` vs `getTransitivePredecessorIds`).
3.  In `prefillDataSources/index.ts`, add one more spread in the `return` array, e.g. `...getAnotherSourceGroups(graph, targetNodeId)`.

Order in the array = order of sections in the modal.

---

## Project layout

```
src/
  App.tsx                          # selectedNodeId + prefillMappings
  config/
    constants.ts                   # graph API URL
    globalNamespaces.ts            # global picker groups
  types/
    graph.ts
    prefill.ts                     # PrefillSelection, PrefillMappingsState
  utils/requireEnv.ts
  components/                      # Modal, Loader, SearchInput, ToggleSwitch, …
  providers/                       # React Query
  features/
    graph/
      FormList.tsx, FormItem.tsx
      api/fetchGraph.ts
      hooks/useFetchGraph.ts
      lib/adjacency.ts             # direct / transitive prerequisites
    prefill/
      PrefillPanel.tsx
      PrefillFieldList.tsx, PrefillField.tsx, PrefillFieldModal.tsx
      hooks/usePrefillFieldModal.ts
      modal/                       # PrefillSourcePicker, PrefillSourceGroup
      prefillDataSources/          # index, direct, transitive, global, filter, format
  __tests__/                       # Vitest — mirrors features/ + shared fixtures
```

## npm scripts

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Development server           |
| `npm run build`         | Typecheck + production build |
| `npm run preview`       | Preview production build     |
| `npm run lint`          | ESLint                       |
| `npm test`              | Vitest (watch)               |
| `npm run test:run`      | Vitest single run            |
| `npm run test:coverage` | Vitest with coverage         |
| `npm run format`        | Prettier write               |
| `npm run format:check`  | Prettier check               |

**Stack:** React 19, TypeScript, Vite 8 (Rolldown), Tailwind CSS 4, TanStack Query 5, React Compiler, Vitest, ESLint, Prettier, Husky + lint-staged + commitlint.
