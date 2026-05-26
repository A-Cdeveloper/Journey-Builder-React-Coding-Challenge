import { Modal } from "@/components/Modal.tsx";
import { PrefillSourcePicker } from "@/features/prefill/modal/PrefillSourcePicker.tsx";
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
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {!targetNodeId || !targetFieldKey ? (
        <p className="text-sm text-slate-600">Choose a prefill source.</p>
      ) : (
        <PrefillSourcePicker
          graph={graph}
          targetNodeId={targetNodeId}
          onPick={onPick}
        />
      )}
    </Modal>
  );
}
