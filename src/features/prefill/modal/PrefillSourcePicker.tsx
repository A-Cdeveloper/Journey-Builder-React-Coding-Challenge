import { useState } from "react";
import { PrefillSourceGroup } from "@/features/prefill/modal/PrefillSourceGroup.tsx";
import { getPrefillSourceGroups } from "@/features/prefill/prefillDataSources/index.ts";
import type { BlueprintGraph } from "@/types/graph.ts";
import type { PrefillSelection } from "@/types/prefill.ts";

type PrefillSourcePickerProps = {
  graph: BlueprintGraph | undefined;
  targetNodeId: string;
  onPick: (selection: PrefillSelection) => void;
};

export function PrefillSourcePicker({
  graph,
  targetNodeId,
  onPick,
}: PrefillSourcePickerProps) {
  const sourceGroups = getPrefillSourceGroups({ graph, targetNodeId });
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    setOpenGroupId((current) => (current === groupId ? null : groupId));
  };

  if (sourceGroups.length === 0) {
    return <p className="text-sm text-slate-600">No data sources available.</p>;
  }

  return (
    <div className="flex min-h-80 flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Available data
      </p>
      <div className="overflow-y-auto rounded-md border border-slate-200">
        {sourceGroups.map((group) => (
          <PrefillSourceGroup
            key={group.id}
            group={group}
            isOpen={openGroupId === group.id}
            onToggle={() => toggleGroup(group.id)}
            onPick={onPick}
          />
        ))}
      </div>
    </div>
  );
}
