import { describe, expect, it } from "vitest";
import { globalNamespaces } from "@/config/globalNamespaces.ts";
import {
  getDirectPredecessorIds,
  getTransitivePredecessorIds,
} from "@/features/graph/lib/adjacency.ts";
import { getPrefillSourceGroups } from "@/features/prefill/prefillDataSources/index.ts";
import { mockGraph } from "@/__tests__/mockGraph.ts";

function nodeLabel(nodeId: string): string {
  const node = mockGraph.nodes.find((item) => item.id === nodeId);
  if (!node) {
    throw new Error(`Expected mock node "${nodeId}"`);
  }
  return node.data.name;
}

describe("getPrefillSourceGroups", () => {
  it("returns only global groups when graph is missing", () => {
    const groups = getPrefillSourceGroups({
      graph: undefined,
      targetNodeId: "form-f",
    });

    expect(groups.map((group) => group.id)).toEqual(
      globalNamespaces.map((namespace) => namespace.id),
    );
  });

  it("returns only global groups when target node is missing", () => {
    const groups = getPrefillSourceGroups({
      graph: mockGraph,
      targetNodeId: null,
    });

    expect(groups.map((group) => group.id)).toEqual(
      globalNamespaces.map((namespace) => namespace.id),
    );
  });

  it("returns only global groups for a root form node", () => {
    const groups = getPrefillSourceGroups({
      graph: mockGraph,
      targetNodeId: "form-a",
    });

    expect(groups).toHaveLength(globalNamespaces.length);
    expect(groups.every((group) => group.options.length > 0)).toBe(true);
  });

  it("merges globals, then direct, then transitive form groups for form-f", () => {
    const targetNodeId = "form-f";
    const directIds = getDirectPredecessorIds(mockGraph.nodes, targetNodeId);
    const transitiveIds = getTransitivePredecessorIds(
      mockGraph.nodes,
      targetNodeId,
    );

    const groups = getPrefillSourceGroups({ graph: mockGraph, targetNodeId });

    expect(groups.map((group) => group.label)).toEqual([
      ...globalNamespaces.map((namespace) => namespace.label),
      ...directIds.map(nodeLabel),
      ...transitiveIds.map(nodeLabel),
    ]);
  });
});
