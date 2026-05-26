import { describe, expect, it } from "vitest";
import {
  getDirectPredecessorIds,
  getTransitivePredecessorIds,
} from "@/features/graph/lib/adjacency.ts";
import { mockNodes } from "@/__tests__/mockGraph.ts";

const sortIds = (ids: string[]) => [...ids].sort();

describe("getDirectPredecessorIds", () => {
  it("returns an empty array when the node has no prerequisites", () => {
    expect(getDirectPredecessorIds(mockNodes, "form-a")).toEqual([]);
  });

  it("returns the single direct prerequisite for a one-parent node", () => {
    expect(getDirectPredecessorIds(mockNodes, "form-b")).toEqual(["form-a"]);
    expect(getDirectPredecessorIds(mockNodes, "form-d")).toEqual(["form-b"]);
    expect(getDirectPredecessorIds(mockNodes, "form-e")).toEqual(["form-c"]);
  });

  it("returns all direct prerequisites for a node with multiple parents", () => {
    expect(sortIds(getDirectPredecessorIds(mockNodes, "form-f"))).toEqual([
      "form-d",
      "form-e",
    ]);
  });

  it("returns an empty array for an unknown node id", () => {
    expect(getDirectPredecessorIds(mockNodes, "form-z")).toEqual([]);
  });
});

describe("getTransitivePredecessorIds", () => {
  it("returns an empty array when the node has no prerequisites", () => {
    expect(getTransitivePredecessorIds(mockNodes, "form-a")).toEqual([]);
  });

  it("returns an empty array when every ancestor is only one hop away", () => {
    expect(getTransitivePredecessorIds(mockNodes, "form-b")).toEqual([]);
    expect(getTransitivePredecessorIds(mockNodes, "form-c")).toEqual([]);
  });

  it("returns grandparent ids reachable in two or more hops", () => {
    expect(getTransitivePredecessorIds(mockNodes, "form-d")).toEqual([
      "form-a",
    ]);
    expect(getTransitivePredecessorIds(mockNodes, "form-e")).toEqual([
      "form-a",
    ]);
  });

  it("returns multi-hop ancestors and excludes direct prerequisites", () => {
    const direct = new Set(getDirectPredecessorIds(mockNodes, "form-f"));
    const transitive = getTransitivePredecessorIds(mockNodes, "form-f");

    expect(sortIds(transitive)).toEqual(["form-a", "form-b", "form-c"]);
    for (const id of transitive) {
      expect(direct.has(id)).toBe(false);
    }
  });
});
