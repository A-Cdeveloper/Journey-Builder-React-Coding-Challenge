import { globalNamespaces } from "@/config/globalNamespaces.ts";
import type { PrefillSourceGroup } from "@/features/prefill/prefillDataSources/index.ts";

export function getGlobalSourceGroups(): PrefillSourceGroup[] {
  return globalNamespaces.map((namespace) => ({
    id: namespace.id,
    label: namespace.label,
    options: namespace.fields.map((field) => ({
      id: `global:${namespace.id}:${field.key}`,
      label: field.title,
      selection: {
        kind: "global",
        namespace: namespace.id,
        fieldKey: field.key,
      },
    })),
  }));
}
