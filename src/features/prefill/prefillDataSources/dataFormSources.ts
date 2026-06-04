import {
  getDirectPredecessorIds,
  getTransitivePredecessorIds,
} from "@/features/graph/lib/adjacency.ts";
import { buildFormSourceGroups } from "@/features/prefill/prefillDataSources/formSourceGroups.ts";
import type { PrefillSourceGroup } from "@/features/prefill/prefillDataSources/index.ts";
import type { BlueprintGraph } from "@/types/graph.ts";

export const PredecessorTypes = {
  DIRECT: "direct",
  TRANSITIVE: "transitive",
  REQUIRED: "required",
} as const;

export type PredecessorType =
  (typeof PredecessorTypes)[keyof typeof PredecessorTypes];

export function getFormDataSourceGroups(
  graph: BlueprintGraph,
  targetNodeId: string,
  predecessorType: PredecessorType,
): PrefillSourceGroup[] {
  const nodeIds = [] as string[];

  switch (predecessorType) {
    case PredecessorTypes.DIRECT:
      nodeIds.push(...getDirectPredecessorIds(graph.nodes, targetNodeId));
      break;
    case PredecessorTypes.TRANSITIVE:
      nodeIds.push(...getTransitivePredecessorIds(graph.nodes, targetNodeId));
      break;
    case PredecessorTypes.REQUIRED:
      nodeIds.push(...getDirectPredecessorIds(graph.nodes, targetNodeId));
      break;
    default:
      throw new Error(`Invalid predecessor type: ${predecessorType}`);
  }

  return buildFormSourceGroups(graph, nodeIds, predecessorType);
}
