# Journey Builder — Frontend

React + TypeScript app for the [Avantos Journey Builder coding challenge](https://fluttering-atmosphere-1b5.notion.site/Journey-Builder-React-Coding-Challenge-190d5fe264fa80cba39ec21afc6d42ec).

For a selected form node, you map each field to a value from **direct prerequisites**, **transitive prerequisites**, or **global namespaces** (Action Properties, Client Organisation Properties). The modal lists every option from `getPrefillSourceGroups()`; UI code does not branch on source type.

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

From the repo root (where `package.json` lives):

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

## Architecture at a glance

**Graph (read-only)** — Fetched with TanStack Query in `useFetchGraph` (`features/graph/api/fetchGraph.ts`). Shared across the sidebar and prefill panel.

**Prefill mappings (client)** — `prefillMappings` state in `App.tsx`: `Record<nodeId, Record<fieldKey, PrefillSelection>>`. Session-only; refresh clears it. State is keyed by **canvas node id**, not form schema id, so two nodes using the same form keep separate mappings.

**UI flow** — `FormList` → `PrefillPanel` → `PrefillFieldList` (per-form “Prefill fields for this form” toggle) → `PrefillFieldModal` with `PrefillSourcePicker`. Search in the modal uses `filterSourceGroups.ts` (matches group or option labels).

**Upstream forms** — `features/graph/lib/adjacency.ts` walks `nodes[].data.prerequisites` for direct and transitive predecessors. `nodes[].data.component_id` links each node to `forms[].id`; fields come from `forms[].field_schema.properties`.

---

## Adding a new data source

### Global namespace (no new files)

Add an entry in `src/config/globalNamespaces.ts`. `globalSource.ts` exposes it in the picker automatically; `formatMapping.ts` already resolves labels from that config.

### New source category

1.  Add `src/features/prefill/prefillDataSources/<name>Source.ts` that exports `get<Name>SourceGroups(...)` returning `PrefillSourceGroup[]` (see `directSource.ts` / `globalSource.ts`).
2.  Merge its groups in `getPrefillSourceGroups()` in `prefillDataSources/index.ts` (same pattern as direct + transitive today).
3.  If the stored value is not `form` or `global`, extend `PrefillSelection` in `src/types/prefill.ts` and handle it in `formatMapping.ts`.

Form-backed sources should reuse `buildFormSourceGroups()` and adjacency helpers; globals only need config or a small dedicated module.

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
```

## npm scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Development server           |
| `npm run build`   | Typecheck + production build |
| `npm run preview` | Preview production build     |
| `npm run lint`    | ESLint                       |
| `npm run test`    | Vitest                       |
| `npm run format`  | Prettier                     |

**Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, TanStack Query 5.
