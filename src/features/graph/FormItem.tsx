import type { GraphNode } from "@/types/graph.ts";

type FormItemProps = {
  node: GraphNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
};

export default function FormItem({
  node,
  isSelected,
  onSelect,
}: FormItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      aria-pressed={isSelected}
      aria-label={`Select form ${node.data.name}`}
      className={`w-full cursor-pointer rounded-md p-2 text-left text-sm ${
        isSelected
          ? "bg-slate-200 font-medium text-slate-900"
          : "text-slate-800 hover:bg-slate-100"
      }`}
    >
      {node.data.name}
    </button>
  );
}
