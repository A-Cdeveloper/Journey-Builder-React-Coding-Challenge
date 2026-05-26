import type { FormFieldProperty } from "@/types/graph.ts";

type PrefillFieldProps = {
  fieldKey: string;
  property: FormFieldProperty;
  isRequired: boolean;
  onOpen: () => void;
};

export function PrefillField({
  fieldKey,
  property,
  isRequired,
  onOpen,
}: PrefillFieldProps) {
  const label = property.title ?? fieldKey;

  return (
    <button
      type="button"
      className="w-full cursor-pointer rounded-md border border-dashed border-slate-300 px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
      onClick={onOpen}
    >
      {label}
      {isRequired && (
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      )}
    </button>
  );
}
