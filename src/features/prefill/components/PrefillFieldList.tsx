import type { FormDefinition } from "@/types/graph.ts";
import { PrefillField } from "@/features/prefill/components/PrefillField.tsx";

type PrefillFieldListProps = {
  formDefinition: FormDefinition;
  onFieldClick: (fieldKey: string) => void;
};

export function PrefillFieldList({
  formDefinition,
  onFieldClick,
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
        />
      ))}
    </div>
  );
}
