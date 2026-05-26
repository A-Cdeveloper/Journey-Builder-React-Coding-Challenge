import { describe, expect, it } from "vitest";
import { filterSourceGroups } from "@/features/prefill/prefillDataSources/filterSourceGroups.ts";
import { mockSourceGroups } from "@/__tests__/mockSourceGroups.ts";

describe("filterSourceGroups", () => {
  it("returns all groups when the search query is empty or whitespace", () => {
    expect(filterSourceGroups(mockSourceGroups, "")).toBe(mockSourceGroups);
    expect(filterSourceGroups(mockSourceGroups, "   ")).toBe(mockSourceGroups);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterSourceGroups(mockSourceGroups, "zzzzz")).toEqual([]);
  });

  it("keeps the full group when the group label matches", () => {
    const result = filterSourceGroups(mockSourceGroups, "action");

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("g1");
    expect(result[0]?.options).toHaveLength(2);
  });

  it("filters options when only an option label matches", () => {
    const result = filterSourceGroups(mockSourceGroups, "email");
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("g2");
    expect(result[0]?.options).toHaveLength(1);
    expect(result[0]?.options[0]?.label).toBe("Email");
  });
});
