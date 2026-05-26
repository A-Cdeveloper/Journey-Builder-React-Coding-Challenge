import { describe, expect, it } from "vitest";
import { globalNamespaces } from "@/config/globalNamespaces.ts";
import { getGlobalSourceGroups } from "@/features/prefill/prefillDataSources/globalSource.ts";

describe("getGlobalSourceGroups", () => {
  it("returns a group for each configured global namespace", () => {
    const groups = getGlobalSourceGroups();

    expect(groups.map((group) => group.id).sort()).toEqual(
      globalNamespaces.map((namespace) => namespace.id).sort(),
    );
  });

  it("maps each configured field to a global PrefillSelection", () => {
    const groups = getGlobalSourceGroups();

    for (const namespace of globalNamespaces) {
      const group = groups.find((item) => item.id === namespace.id);

      expect(group?.label).toBe(namespace.label);
      expect(group?.options).toHaveLength(namespace.fields.length);

      for (const field of namespace.fields) {
        const option = group?.options.find(
          (item) => item.label === field.title,
        );

        expect(option?.selection).toEqual({
          kind: "global",
          namespace: namespace.id,
          fieldKey: field.key,
        });
      }
    }
  });
});
