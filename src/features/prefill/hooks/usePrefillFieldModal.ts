import { useState } from "react";
import type { FormDefinition } from "@/types/graph.ts";
import type {
  PrefillMappingsState,
  PrefillSelection,
} from "@/types/prefill.ts";

type UsePrefillFieldModalInput = {
  selectedNodeId: string | null;
  formDefinition: FormDefinition | undefined;
  prefillMappings: PrefillMappingsState;
  onPrefillMappingsChange: (next: PrefillMappingsState) => void;
};

export function usePrefillFieldModal({
  selectedNodeId,
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
    activeFieldProperty !== undefined && selectedNodeId !== null;

  const modalTitle =
    isModalOpen && activeFieldProperty
      ? `Select data to prefill ${activeFieldProperty.title ?? activeFieldKey}`
      : "Prefill";

  const closeModal = () => setActiveFieldKey(null);

  const pickMapping = (selection: PrefillSelection) => {
    if (!selectedNodeId || !activeFieldKey) return;

    onPrefillMappingsChange({
      ...prefillMappings,
      [selectedNodeId]: {
        ...prefillMappings[selectedNodeId],
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
