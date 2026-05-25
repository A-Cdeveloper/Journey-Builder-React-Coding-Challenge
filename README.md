# Journey Builder — Frontend

React app for the [Avantos Journey Builder coding challenge](https://fluttering-atmosphere-1b5.notion.site/Journey-Builder-React-Coding-Challenge-190d5fe264fa80cba39ec21afc6d42ec).

## Repository layout

```
Journey-Builder/
├── frontend/                 # React app (this project)
└── frontendchallengeserver/  # mock API for local development
```

## Prerequisites

- Node.js 20+
- npm 10+

## Run locally

Use two terminals.

### 1\. Mock API

```
cd ../frontendchallengeserver
npm install   # first time only
npm start
```

Runs on port **3000**. Graph endpoint shape:

```
GET /api/v1/{tenantId}/actions/blueprints/{blueprintId}/graph/
```

### 2\. Environment variables

```
cd frontend
cp .env.example .env.development
```

Set `VITE_TENANT_ID` and `VITE_BLUEPRINT_ID` in `.env.development`. For the bundled mock, copy `tenant_id` and `id` from `../frontendchallengeserver/graph.json`. Do not commit `.env.development`.

| Variable                | Role                                                     |
| ----------------------- | -------------------------------------------------------- |
| `VITE_API_PROXY_TARGET` | Origin of the mock server (e.g. `http://localhost:3000`) |
| `VITE_TENANT_ID`        | `{tenantId}` in the graph URL                            |
| `VITE_BLUEPRINT_ID`     | `{blueprintId}` in the graph URL                         |

### 3\. Frontend

```
npm install   # first time only
npm run dev
```

Open **http://localhost:5173**.

### 4\. Verify

- **Mock:** with both ids set in `.env.development`, open  
  `{VITE_API_PROXY_TARGET}/api/v1/{VITE_TENANT_ID}/actions/blueprints/{VITE_BLUEPRINT_ID}/graph/`  
  in the browser (substitute your env values). Response should be JSON.
- **Frontend:** `npm run dev` starts without a missing-env error. If `VITE_TENANT_ID` or `VITE_BLUEPRINT_ID` is unset, the app reports that `.env.development` is required.

## Scripts

| Command           | Purpose                  |
| ----------------- | ------------------------ |
| `npm run dev`     | Development server       |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | ESLint                   |
| `npm test`        | Vitest                   |

## Tech stack

- React 19, TypeScript, Vite 8
- Tailwind CSS v4
- TanStack Query v5
- Vitest

## Configuration

- **Vite proxy** (`vite.config.ts`): forwards `/api` to `VITE_API_PROXY_TARGET` in development.
- **Graph URL** (`src/config/constants.ts`): built from `VITE_TENANT_ID` and `VITE_BLUEPRINT_ID`.
- **Env guard** (`src/utils/requireEnv.ts`): required variables must be set at startup.

### Env files

| File               | In git |
| ------------------ | ------ |
| `.env.example`     | Yes    |
| `.env.development` | No     |

## Source layout

```
src/
├── config/constants.ts
├── utils/requireEnv.ts
├── App.tsx
└── main.tsx
```
