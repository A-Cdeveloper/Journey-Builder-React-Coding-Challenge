import { memo } from "react";
import type { FormFieldProperty } from "@/types/graph.ts";

type PrefillFieldProps = {
  fieldKey: string;
  property: FormFieldProperty;
  isRequired: boolean;
  onFieldClick: (fieldKey: string) => void;
  onClearField: (fieldKey: string) => void;
  mappingText?: string;
  disabledPrefill?: boolean;
};

export const PrefillField = memo(function PrefillField({
  fieldKey,
  property,
  isRequired,
  onFieldClick,
  onClearField,
  mappingText,
  disabledPrefill,
}: PrefillFieldProps) {
  const label = property.title ?? fieldKey;

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-md border border-dashed border-slate-300 px-3 py-2 text-left text-sm text-slate-800">
      <span className="min-w-0">
        {label}
        {isRequired && (
          <span className="ml-0.5 text-red-600" aria-hidden>
            *
          </span>
        )}
      </span>
      {mappingText ? (
        <div className="flex shrink-0 items-center justify-end gap-2 rounded-md bg-slate-100 ps-2 py-0">
          <span className="text-xs text-slate-700">{mappingText}</span>
          <button
            type="button"
            className="grid size-6 place-items-center text-sm font-semibold text-slate-700 disabled:pointer-disabled disabled:cursor-not-allowed"
            aria-label="Clear prefill"
            onClick={() => onClearField(fieldKey)}
            disabled={disabledPrefill}
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-green-600 hover:bg-slate-50 disabled:pointer-disabled disabled:cursor-not-allowed disabled:text-slate-400"
          onClick={() => {
            if (!disabledPrefill) onFieldClick(fieldKey);
          }}
          disabled={disabledPrefill}
        >
          Set prefill
        </button>
      )}
    </div>
  );
});
