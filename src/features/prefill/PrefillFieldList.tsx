import type { FormDefinition } from "@/types/graph.ts";
import type { NodePrefillMappings } from "@/types/prefill.ts";
import { PrefillField } from "@/features/prefill/PrefillField.tsx";

type PrefillFieldListProps = {
  formDefinition: FormDefinition;
  nodeMappings?: NodePrefillMappings;
  formatMapping: (fieldKey: string) => string | undefined;
  onFieldClick: (fieldKey: string) => void;
  onClearField: (fieldKey: string) => void;
};

export function PrefillFieldList({
  formDefinition,
  nodeMappings,
  formatMapping,
  onFieldClick,
  onClearField,
}: PrefillFieldListProps) {
  const { properties, required = [] } = formDefinition.field_schema;
  const fields = Object.entries(properties);

  return (
    <div className="mt-4 space-y-2">
      {fields.map(([fieldKey, property]) => (
        <PrefillField
          key={fieldKey}
          fieldKey={fieldKey}
          property={property}
          isRequired={required.includes(fieldKey)}
          onOpen={() => onFieldClick(fieldKey)}
          mappingText={
            nodeMappings?.[fieldKey] ? formatMapping(fieldKey) : undefined
          }
          onClear={() => onClearField(fieldKey)}
        />
      ))}
    </div>
  );
}
