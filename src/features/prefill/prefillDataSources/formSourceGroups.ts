import type { PrefillSourceGroup } from "@/features/prefill/prefillDataSources/index.ts";
import type { BlueprintGraph } from "@/types/graph.ts";
import { PredecessorTypes, type PredecessorType } from "./dataFormSources";

export function buildFormSourceGroups(
  graph: BlueprintGraph,
  nodeIds: string[],
  predecessorType: PredecessorType,
): PrefillSourceGroup[] {
  const groups: PrefillSourceGroup[] = [];

  for (const nodeId of nodeIds) {
    const node = graph.nodes.find((item) => item.id === nodeId);
    if (!node) continue;

    const form = graph.forms.find((item) => item.id === node.data.component_id);
    if (!form) continue;

    const isRequired = predecessorType === PredecessorTypes.REQUIRED;

    const options = Object.entries(form.field_schema.properties)
      .filter(([fieldKey]) =>
        isRequired ? form.field_schema.required.includes(fieldKey) : true,
      )
      .map(([fieldKey, prop]) => ({
        id: `${isRequired ? "required:" : ""}${nodeId}:${fieldKey}`,
        label: (prop.title ?? fieldKey) + (isRequired ? " (required)" : ""),
        selection: {
          kind: "form" as const,
          formNodeId: nodeId,
          fieldKey,
        },
      }));

    if (options.length === 0) continue;

    groups.push({
      id: nodeId + (isRequired ? ":required" : ""),
      label: node.data.name + (isRequired ? " (required fields)" : ""),
      options,
    });
  }

  return groups;
}
