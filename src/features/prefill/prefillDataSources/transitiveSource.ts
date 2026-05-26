import { getTransitivePredecessorIds } from "@/features/graph/lib/adjacency.ts";
import { buildFormSourceGroups } from "@/features/prefill/prefillDataSources/formSourceGroups.ts";
import type { PrefillSourceGroup } from "@/features/prefill/prefillDataSources/index.ts";
import type { BlueprintGraph } from "@/types/graph.ts";

export function getTransitiveSourceGroups(
  graph: BlueprintGraph,
  targetNodeId: string,
): PrefillSourceGroup[] {
  const nodeIds = getTransitivePredecessorIds(graph.nodes, targetNodeId);
  return buildFormSourceGroups(graph, nodeIds);
}
