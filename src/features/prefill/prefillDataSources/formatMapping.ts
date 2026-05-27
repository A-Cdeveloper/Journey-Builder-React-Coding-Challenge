import { globalNamespaces } from "@/config/globalNamespaces.ts";
import type { BlueprintGraph } from "@/types/graph.ts";
import type { PrefillSelection } from "@/types/prefill.ts";

type FormatMappingInput = {
  selection: PrefillSelection | undefined;
  graph: BlueprintGraph | undefined;
};

/**
 * Builds the label shown next to a prefilled field (e.g. `Form A › Email`).
 * Returns `undefined` when there is no selection or graph context.
 */
export function formatMapping({
  selection,
  graph,
}: FormatMappingInput): string | undefined {
  if (!selection || !graph) return undefined;

  if (selection.kind === "global") {
    const namespace = globalNamespaces.find(
      (item) => item.id === selection.namespace,
    );
    const field = namespace?.fields.find(
      (item) => item.key === selection.fieldKey,
    );
    const left = namespace?.label ?? selection.namespace;
    const right = field?.title ?? selection.fieldKey;
    return `${left} › ${right}`;
  }

  const sourceNode = graph.nodes.find(
    (node) => node.id === selection.formNodeId,
  );
  const sourceForm = graph.forms.find(
    (form) => form.id === sourceNode?.data.component_id,
  );
  const sourceProp = sourceForm?.field_schema.properties[selection.fieldKey];

  const left = sourceNode?.data.name ?? selection.formNodeId;
  const right = sourceProp?.title ?? selection.fieldKey;
  return `${left} › ${right}`;
}
