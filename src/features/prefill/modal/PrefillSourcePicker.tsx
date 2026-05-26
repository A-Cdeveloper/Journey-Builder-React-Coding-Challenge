import { useState, type ReactNode } from "react";
import { SearchInput } from "@/components/SearchInput.tsx";
import { PrefillSourceGroup } from "@/features/prefill/modal/PrefillSourceGroup.tsx";
import { filterSourceGroups } from "@/features/prefill/prefillDataSources/filterSourceGroups.ts";
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = filterSourceGroups(sourceGroups, searchQuery);
  const isSearching = searchQuery.trim().length > 0;

  const toggleGroup = (groupId: string) => {
    setOpenGroupId((current) => (current === groupId ? null : groupId));
  };

  let content: ReactNode = filteredGroups.map((group) => (
    <PrefillSourceGroup
      key={group.id}
      group={group}
      isOpen={isSearching || openGroupId === group.id}
      onToggle={() => {
        if (isSearching) return;
        toggleGroup(group.id);
      }}
      onPick={onPick}
    />
  ));

  if (sourceGroups.length === 0) {
    content = (
      <p className="px-3 py-6 text-center text-sm text-slate-600">
        No data sources available for mapping.
      </p>
    );
  }

  if (sourceGroups.length !== 0 && filteredGroups.length === 0) {
    content = (
      <p className="px-3 py-6 text-center text-sm text-slate-600">
        No data sources found for &quot;{searchQuery}&quot;.
      </p>
    );
  }

  return (
    <div className="flex h-100 flex-col gap-3">
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <p className="shrink-0 text-sm font-medium uppercase tracking-wide text-slate-500">
        Available data
      </p>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-slate-200">
        {content}
      </div>
    </div>
  );
}
