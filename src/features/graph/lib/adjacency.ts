import type { GraphNode } from "@/types/graph.ts";

function findNode(nodes: GraphNode[], nodeId: string): GraphNode | undefined {
  return nodes.find((node) => node.id === nodeId);
}

/**
 * Direct prerequisite node ids for `nodeId` (one hop via `data.prerequisites`).
 */
export function getDirectPredecessorIds(
  nodes: GraphNode[],
  nodeId: string,
): string[] {
  const node = findNode(nodes, nodeId);
  if (!node) return [];
  return [...node.data.prerequisites];
}

/**
 * Ancestors at 2+ hops via prerequisites. Excludes direct prerequisites so the
 * picker can list direct and transitive groups separately.
 */
export function getTransitivePredecessorIds(
  nodes: GraphNode[],
  nodeId: string,
): string[] {
  const directIds = new Set(getDirectPredecessorIds(nodes, nodeId));
  const visited = new Set<string>();
  const queue = [...directIds];
  const result: string[] = [];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const current = findNode(nodes, currentId);
    if (!current) continue;

    for (const parentId of current.data.prerequisites) {
      if (visited.has(parentId)) continue;
      visited.add(parentId);

      if (!directIds.has(parentId)) {
        result.push(parentId);
      }

      queue.push(parentId);
    }
  }

  return result;
}
