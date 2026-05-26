import type { PrefillSourceGroup as PrefillSourceGroupData } from "@/features/prefill/prefillDataSources/index.ts";
import type { PrefillSelection } from "@/types/prefill.ts";

type PrefillSourceGroupProps = {
  group: PrefillSourceGroupData;
  isOpen: boolean;
  onToggle: () => void;
  onPick: (selection: PrefillSelection) => void;
};

export function PrefillSourceGroup({
  group,
  isOpen,
  onToggle,
  onPick,
}: PrefillSourceGroupProps) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-base hover:bg-slate-50"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          className={`inline-block text-lg leading-none text-slate-500 transition-transform ${isOpen ? "rotate-90" : ""}`}
          aria-hidden
        >
          ›
        </span>
        <span className="font-medium text-slate-800">{group.label}</span>
      </button>

      {isOpen && (
        <ul className="list-none space-y-0 pb-2 pl-8 pr-1">
          {group.options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                className="w-full rounded-sm px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-green-50 hover:text-green-800"
                onClick={() => onPick(option.selection)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
