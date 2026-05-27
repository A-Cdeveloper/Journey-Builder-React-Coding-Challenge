import { useState } from "react";
import { ToggleSwitch } from "@/components/ToggleSwitch.tsx";
import { PrefillField } from "@/features/prefill/PrefillField.tsx";
import type { FormDefinition } from "@/types/graph.ts";
import type { NodePrefillMappings } from "@/types/prefill.ts";

type PrefillFieldListProps = {
  selectedNodeId: string;
  formDefinition: FormDefinition;
  nodeMappings?: NodePrefillMappings;
  formatMapping: (fieldKey: string) => string | undefined;
  onFieldClick: (fieldKey: string) => void;
  onClearField: (fieldKey: string) => void;
};

export function PrefillFieldList({
  selectedNodeId,
  formDefinition,
  nodeMappings,
  formatMapping,
  onFieldClick,
  onClearField,
}: PrefillFieldListProps) {
  const [disabledByNodeId, setDisabledByNodeId] = useState<
    Record<string, boolean>
  >({});

  const disabledPrefill = disabledByNodeId[selectedNodeId] ?? false;

  const setDisabledPrefill = (disabled: boolean) => {
    setDisabledByNodeId((prev) => ({
      ...prev,
      [selectedNodeId]: disabled,
    }));
  };

  const { properties, required = [] } = formDefinition.field_schema;
  const fields = Object.entries(properties);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-800">
          Prefill fields for this form
        </span>
        <ToggleSwitch
          checked={!disabledPrefill}
          ariaLabel="Prefill fields for this form"
          onCheckedChange={(enabled) => setDisabledPrefill(!enabled)}
        />
      </div>

      <div
        className={`space-y-2 ${disabledPrefill ? "pointer-events-none opacity-50" : ""}`}
      >
        {fields.map(([fieldKey, property]) => (
          <PrefillField
            key={fieldKey}
            fieldKey={fieldKey}
            property={property}
            isRequired={required.includes(fieldKey)}
            mappingText={
              nodeMappings?.[fieldKey] ? formatMapping(fieldKey) : undefined
            }
            disabledPrefill={disabledPrefill}
            onFieldClick={onFieldClick}
            onClearField={onClearField}
          />
        ))}
      </div>
    </>
  );
}
