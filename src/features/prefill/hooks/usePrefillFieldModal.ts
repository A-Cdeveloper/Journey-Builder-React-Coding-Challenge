import { useState } from "react";
import type { FormDefinition, GraphNode } from "@/types/graph.ts";
import type {
  PrefillMappingsState,
  PrefillSelection,
} from "@/types/prefill.ts";

type UsePrefillFieldModalInput = {
  selectedNode: GraphNode | null;
  formDefinition: FormDefinition | undefined;
  prefillMappings: PrefillMappingsState;
  onPrefillMappingsChange: (next: PrefillMappingsState) => void;
};

/**
 * Manages the prefill source picker modal for one field on the selected form.
 * `pickMapping` writes the chosen source into `prefillMappings` and closes the modal.
 */
export function usePrefillFieldModal({
  selectedNode,
  formDefinition,
  prefillMappings,
  onPrefillMappingsChange,
}: UsePrefillFieldModalInput) {
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);

  const activeFieldProperty =
    activeFieldKey && formDefinition
      ? formDefinition.field_schema.properties[activeFieldKey]
      : undefined;

  const isModalOpen =
    activeFieldProperty !== undefined && selectedNode !== null;

  const modalTitle =
    isModalOpen && activeFieldProperty
      ? `Select data to prefill field ${activeFieldProperty.title ?? activeFieldKey} - ${selectedNode.data.name}`
      : "Prefill";

  const closeModal = () => setActiveFieldKey(null);

  const pickMapping = (selection: PrefillSelection) => {
    if (!selectedNode || !activeFieldKey) return;

    onPrefillMappingsChange({
      ...prefillMappings,
      [selectedNode.id]: {
        ...prefillMappings[selectedNode.id],
        [activeFieldKey]: selection,
      },
    });

    setActiveFieldKey(null);
  };

  return {
    activeFieldKey,
    isModalOpen,
    modalTitle,
    openField: setActiveFieldKey,
    closeModal,
    pickMapping,
  };
}
