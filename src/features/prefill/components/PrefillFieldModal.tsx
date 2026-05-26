import { Modal } from "@/components/Modal.tsx";
import {
  getPrefillSourceGroups,
  type PrefillSourceGroup,
} from "@/features/prefill/prefillDataSources/index.ts";
import type { BlueprintGraph } from "@/types/graph.ts";
import type { PrefillSelection } from "@/types/prefill.ts";

type PrefillFieldModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  graph: BlueprintGraph | undefined;
  targetNodeId: string | null;
  targetFieldKey: string | null;
  onPick: (selection: PrefillSelection) => void;
};

export function PrefillFieldModal({
  open,
  title,
  onClose,
  graph,
  targetNodeId,
  targetFieldKey,
  onPick,
}: PrefillFieldModalProps) {
  const sourceGroups = getPrefillSourceGroups({ graph, targetNodeId });

  const renderGroup = (group: PrefillSourceGroup) => (
    <div key={group.id}>
      <p className="text-sm font-medium text-slate-800">{group.label}</p>
      <div className="mt-1 space-y-1 pl-3">
        {group.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="w-full rounded-md px-2 py-1 text-left text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => onPick(option.selection)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {!targetNodeId || !targetFieldKey ? (
        <p className="text-sm text-slate-600">Choose a prefill source.</p>
      ) : sourceGroups.length === 0 ? (
        <p className="text-sm text-slate-600">No data sources available.</p>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Available data
          </p>
          <div className="space-y-3">{sourceGroups.map(renderGroup)}</div>
        </div>
      )}
    </Modal>
  );
}
