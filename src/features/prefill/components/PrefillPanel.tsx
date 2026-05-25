import { useFetchGraph } from "@/features/graph/hooks/useFetchGraph";

type PrefillPanelProps = {
  selectedNodeId: string | null;
};

export function PrefillPanel({ selectedNodeId }: PrefillPanelProps) {
  const { data } = useFetchGraph();

  const selectedNode = data?.nodes.find((node) => node.id === selectedNodeId);

  if (!selectedNodeId || !selectedNode) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Select a form from the list to configure field prefill.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-sm font-medium text-slate-700">Prefill</h2>
      <p className="text-sm text-slate-800">{selectedNode.data.name}</p>
      <p className="mt-4 text-sm text-slate-500">
        Field prefill configuration will go here.
      </p>
    </section>
  );
}
