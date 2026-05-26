/**
 * Sample picker groups for unit tests only — not used by the app at runtime.
 *
 * Use with `filterSourceGroups` and similar tests that need a ready-made
 * `PrefillSourceGroup[]` without building from `mockGraph`.
 *
 * For tests that build groups from the DAG, use `mockGraph` + `getPrefillSourceGroups` instead.
 */

import type { PrefillSourceGroup } from "@/features/prefill/prefillDataSources/index.ts";

export const mockSourceGroups: PrefillSourceGroup[] = [
  {
    id: "g1",
    label: "Action Properties",
    options: [
      {
        id: "o1",
        label: "Action ID",
        selection: { kind: "global", namespace: "action", fieldKey: "id" },
      },
      {
        id: "o2",
        label: "Started At",
        selection: { kind: "global", namespace: "action", fieldKey: "started" },
      },
    ],
  },
  {
    id: "g2",
    label: "Form B",
    options: [
      {
        id: "o3",
        label: "Email",
        selection: { kind: "form", formNodeId: "form-b", fieldKey: "email" },
      },
    ],
  },
];
