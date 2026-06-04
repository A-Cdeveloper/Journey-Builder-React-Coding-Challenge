import { describe, expect, it } from "vitest";
import { buildFormSourceGroups } from "@/features/prefill/prefillDataSources/formSourceGroups.ts";
import { mockGraph } from "@/__tests__/mockGraph.ts";
import { PredecessorTypes } from "@/features/prefill/prefillDataSources/dataFormSources";

describe("buildFormSourceGroups", () => {
  it("skips unknown node ids", () => {
    expect(
      buildFormSourceGroups(mockGraph, ["form-z"], PredecessorTypes.DIRECT),
    ).toEqual([]);
  });

  it("builds a picker group for each requested node id", () => {
    const groups = buildFormSourceGroups(
      mockGraph,
      ["form-b", "form-d"],
      PredecessorTypes.DIRECT,
    );

    expect(groups.map((g) => g.id).sort()).toEqual(["form-b", "form-d"]);
    expect(groups.find((g) => g.id === "form-b")?.label).toBe("Form B");
  });

  it("maps each field to a form PrefillSelection", () => {
    const groups = buildFormSourceGroups(
      mockGraph,
      ["form-b"],
      PredecessorTypes.DIRECT,
    );
    const group = groups[0];
    const formB = mockGraph.forms.find((f) => f.id === "form-b")!;
    const fieldKey = Object.keys(formB.field_schema.properties)[0];

    expect(group?.options).toHaveLength(
      Object.keys(formB.field_schema.properties).length,
    );
    expect(group?.options[0]?.selection).toEqual({
      kind: "form",
      formNodeId: "form-b",
      fieldKey,
    });
    expect(group?.options[0]?.label).toBe(
      formB.field_schema.properties[fieldKey]?.title ?? fieldKey,
    );
  });
});
