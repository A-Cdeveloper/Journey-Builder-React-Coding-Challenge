import { requireEnv } from "../utils/requireEnv";

export const TENANT_ID = requireEnv(
  "VITE_TENANT_ID",
  import.meta.env.VITE_TENANT_ID,
);

export const BLUEPRINT_ID = requireEnv(
  "VITE_BLUEPRINT_ID",
  import.meta.env.VITE_BLUEPRINT_ID,
);

/** Relative URL for graph fetch (proxied to mock in dev). */
export const GRAPH_PATH = `/api/v1/${TENANT_ID}/actions/blueprints/${BLUEPRINT_ID}/graph/`;
