import type { PrefillSourceGroup } from "@/features/prefill/prefillDataSources/index.ts";
import type { BlueprintGraph } from "@/types/graph.ts";

export function buildFormSourceGroups(
  graph: BlueprintGraph,
  nodeIds: string[],
): PrefillSourceGroup[] {
  const groups: PrefillSourceGroup[] = [];

  for (const nodeId of nodeIds) {
    const node = graph.nodes.find((item) => item.id === nodeId);
    if (!node) continue;

    const form = graph.forms.find((item) => item.id === node.data.component_id);
    if (!form) continue;

    const options = Object.entries(form.field_schema.properties).map(
      ([fieldKey, prop]) => ({
        id: `${nodeId}:${fieldKey}`,
        label: prop.title ?? fieldKey,
        selection: {
          kind: "form" as const,
          formNodeId: nodeId,
          fieldKey,
        },
      }),
    );

    if (options.length === 0) continue;

    groups.push({
      id: nodeId,
      label: node.data.name,
      options,
    });
  }

  return groups;
}
