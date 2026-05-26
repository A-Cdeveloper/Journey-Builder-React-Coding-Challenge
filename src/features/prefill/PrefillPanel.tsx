import { useFetchGraph } from "@/features/graph/hooks/useFetchGraph.ts";
import { PrefillFieldList } from "@/features/prefill/PrefillFieldList.tsx";
import { PrefillFieldModal } from "@/features/prefill/PrefillFieldModal.tsx";
import { usePrefillFieldModal } from "@/features/prefill/hooks/usePrefillFieldModal.ts";
import { formatMapping } from "@/features/prefill/prefillDataSources/formatMapping.ts";
import type { PrefillMappingsState } from "@/types/prefill.ts";

type PrefillPanelProps = {
  selectedNodeId: string | null;
  prefillMappings: PrefillMappingsState;
  onPrefillMappingsChange: (next: PrefillMappingsState) => void;
};

export function PrefillPanel({
  selectedNodeId,
  prefillMappings,
  onPrefillMappingsChange,
}: PrefillPanelProps) {
  const { data } = useFetchGraph();

  const selectedNode = data?.nodes.find((node) => node.id === selectedNodeId);
  const formDefinition = data?.forms.find(
    (form) => form.id === selectedNode?.data.component_id,
  );

  const nodeMappings =
    selectedNodeId !== null ? prefillMappings[selectedNodeId] : undefined;

  const {
    activeFieldKey,
    isModalOpen,
    modalTitle,
    openField,
    closeModal,
    pickMapping,
  } = usePrefillFieldModal({
    selectedNodeId,
    formDefinition,
    prefillMappings,
    onPrefillMappingsChange,
  });

  const formatFieldMapping = (fieldKey: string) =>
    formatMapping({
      selection: nodeMappings?.[fieldKey],
      graph: data,
    });

  const clearFieldMapping = (fieldKey: string) => {
    if (!selectedNodeId) return;
    if (!prefillMappings[selectedNodeId]?.[fieldKey]) return;

    const current = prefillMappings[selectedNodeId] ?? {};
    const rest = Object.fromEntries(
      Object.entries(current).filter(([key]) => key !== fieldKey),
    );

    onPrefillMappingsChange({
      ...prefillMappings,
      [selectedNodeId]: rest,
    });
  };

  let content = (
    <p className="text-sm text-slate-500">
      Select a form from the list to configure field prefill.
    </p>
  );

  if (selectedNode) {
    content = (
      <>
        <h2 className="mb-2 font-semibold">
          Prefill -{" "}
          <span className="font-normal text-slate-800">
            {selectedNode.data.name}
          </span>
        </h2>
        {formDefinition && selectedNodeId ? (
          <PrefillFieldList
            selectedNodeId={selectedNodeId}
            formDefinition={formDefinition}
            nodeMappings={nodeMappings}
            formatMapping={formatFieldMapping}
            onFieldClick={openField}
            onClearField={clearFieldMapping}
          />
        ) : (
          <p className="mt-2 text-sm text-red-600">Form definition not found</p>
        )}
      </>
    );
  }

  return (
    <>
      <section className="rounded-lg border border-slate-200 bg-white px-6 py-4 shadow-sm">
        {content}
      </section>

      <PrefillFieldModal
        open={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        graph={data}
        targetNodeId={selectedNodeId}
        targetFieldKey={activeFieldKey}
        onPick={pickMapping}
      />
    </>
  );
}
