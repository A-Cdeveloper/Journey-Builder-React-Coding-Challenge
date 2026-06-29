import { ErrorState } from "@/components/ErrorState.tsx";
import { Loader } from "@/components/Loader.tsx";
import { useFetchGraph } from "@/features/graph/hooks/useFetchGraph.ts";
import FormItem from "./FormItem.tsx";
import {
  getDirectPredecessorIds,
  getTransitivePredecessorIds,
} from "./lib/adjacency.ts";

type FormListProps = {
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

export function FormList({ selectedNodeId, onSelectNode }: FormListProps) {
  const { data, isPending, isError, error, refetch } = useFetchGraph();

  const formNodes = data?.nodes ?? [];

  const directParentsIds = getDirectPredecessorIds(formNodes, selectedNodeId);
  const transitiveParantsIds = getTransitivePredecessorIds(
    formNodes,
    selectedNodeId,
  );

  const directParentStyle = "border-2 border-green-700";
  const transitiveParentStyle = "border-2 border-blue-700";

  let content = (
    <div className="space-y-1">
      {formNodes.map((node) => (
        <FormItem
          key={node.id}
          itemId={node.id}
          itemName={node.data.name}
          isSelected={node.id === selectedNodeId}
          classes={`${directParentsIds.includes(node.id) ? directParentStyle : ""} ${transitiveParantsIds.includes(node.id) ? transitiveParentStyle : ""}`}
          onSelect={onSelectNode}
        />
      ))}
    </div>
  );

  if (isPending) {
    content = <Loader label="Loading forms…" />;
  }

  if (isError) {
    content = (
      <ErrorState
        error={error}
        fallbackMessage="Failed to load forms"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-bold">Forms</h2>
      {content}
    </section>
  );
}
