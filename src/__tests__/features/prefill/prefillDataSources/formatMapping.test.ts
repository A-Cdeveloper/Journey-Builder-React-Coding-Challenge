import { describe, expect, it } from "vitest";
import { formatMapping } from "@/features/prefill/prefillDataSources/formatMapping.ts";
import { mockGraph } from "@/__tests__/mockGraph.ts";

describe("formatMapping", () => {
  it("returns undefined when graph is missing", () => {
    expect(
      formatMapping({
        selection: { kind: "form", formNodeId: "form-b", fieldKey: "field1" },
        graph: undefined,
      }),
    ).toBeUndefined();
  });

  it("returns undefined when selection is missing", () => {
    expect(
      formatMapping({
        selection: undefined,
        graph: mockGraph,
      }),
    ).toBeUndefined();
  });

  it("formats a global selection as namespace and field titles", () => {
    expect(
      formatMapping({
        selection: {
          kind: "global",
          namespace: "actionProperties",
          fieldKey: "actionId",
        },
        graph: mockGraph,
      }),
    ).toBe("Action Properties › Action ID");
  });

  it("formats a form selection as source form name and field title", () => {
    expect(
      formatMapping({
        selection: {
          kind: "form",
          formNodeId: "form-b",
          fieldKey: "field1",
        },
        graph: mockGraph,
      }),
    ).toBe("Form B › Field 1");
  });
});
