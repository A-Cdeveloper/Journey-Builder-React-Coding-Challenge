import {
  getDirectPredecessorIds,
  getTransitivePredecessorIds,
} from "@/features/graph/lib/adjacency.ts";
import { buildFormSourceGroups } from "@/features/prefill/prefillDataSources/formSourceGroups.ts";
import type { PrefillSourceGroup } from "@/features/prefill/prefillDataSources/index.ts";
import type { BlueprintGraph } from "@/types/graph.ts";

export function getFormDataSourceGroups(
  graph: BlueprintGraph,
  targetNodeId: string,
  predecessorType: "direct" | "transitive",
): PrefillSourceGroup[] {
  const nodeIds =
    predecessorType === "direct"
      ? getDirectPredecessorIds(graph.nodes, targetNodeId)
      : getTransitivePredecessorIds(graph.nodes, targetNodeId);

  return buildFormSourceGroups(graph, nodeIds);
}
