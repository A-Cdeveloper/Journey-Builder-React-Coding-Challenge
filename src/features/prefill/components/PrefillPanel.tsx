import { useState } from "react";
import { Modal } from "@/components/Modal.tsx";
import { useFetchGraph } from "@/features/graph/hooks/useFetchGraph.ts";
import { PrefillFieldList } from "@/features/prefill/components/PrefillFieldList.tsx";

type PrefillPanelProps = {
  selectedNodeId: string | null;
};

export function PrefillPanel({ selectedNodeId }: PrefillPanelProps) {
  const { data } = useFetchGraph();
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);

  const selectedNode = data?.nodes.find((node) => node.id === selectedNodeId);
  const formDefinition = data?.forms.find(
    (form) => form.id === selectedNode?.data.component_id,
  );

  const activeFieldProperty =
    activeFieldKey && formDefinition
      ? formDefinition.field_schema.properties[activeFieldKey]
      : undefined;
  const isModalOpen =
    activeFieldProperty !== undefined && selectedNodeId !== null;

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
        {formDefinition ? (
          <PrefillFieldList
            formDefinition={formDefinition}
            onFieldClick={setActiveFieldKey}
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

      <Modal
        open={isModalOpen}
        onClose={() => setActiveFieldKey(null)}
        title={
          isModalOpen && activeFieldProperty
            ? `Select data to prefill ${activeFieldProperty.title ?? activeFieldKey}`
            : "Prefill"
        }
      >
        <p className="text-sm text-slate-600">
          Choose a prefill source (coming next).
        </p>
      </Modal>
    </>
  );
}
