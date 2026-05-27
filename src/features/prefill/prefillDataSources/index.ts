import { getDirectSourceGroups } from "@/features/prefill/prefillDataSources/directSource.ts";
import { getGlobalSourceGroups } from "@/features/prefill/prefillDataSources/globalSource.ts";
import { getTransitiveSourceGroups } from "@/features/prefill/prefillDataSources/transitiveSource.ts";
import type { BlueprintGraph } from "@/types/graph.ts";
import type { PrefillSelection } from "@/types/prefill.ts";

export type PrefillSourceOption = {
  id: string;
  label: string;
  selection: PrefillSelection;
};

export type PrefillSourceGroup = {
  id: string;
  label: string;
  options: PrefillSourceOption[];
};

type GetPrefillSourceGroupsInput = {
  graph: BlueprintGraph | undefined;
  targetNodeId: string | null;
};

/**
 * Source groups for the modal "Available data" list: global namespaces first,
 * then direct prerequisite forms, then transitive (2+ hop) forms.
 * Without graph or target node, only global groups are returned.
 */
export function getPrefillSourceGroups({
  graph,
  targetNodeId,
}: GetPrefillSourceGroupsInput): PrefillSourceGroup[] {
  const groups = getGlobalSourceGroups();

  if (!graph || !targetNodeId) return groups;

  return [
    ...groups,
    ...getDirectSourceGroups(graph, targetNodeId),
    ...getTransitiveSourceGroups(graph, targetNodeId),
  ];
}
