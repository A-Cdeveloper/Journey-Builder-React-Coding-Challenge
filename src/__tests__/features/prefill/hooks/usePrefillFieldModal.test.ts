import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePrefillFieldModal } from "@/features/prefill/hooks/usePrefillFieldModal.ts";
import { mockGraph } from "@/__tests__/mockGraph.ts";
import type { PrefillSelection } from "@/types/prefill.ts";

const selectedNode = mockGraph.nodes[0]!;
const formDefinition = mockGraph.forms.find(
  (form) => form.id === selectedNode.data.component_id,
)!;
const fieldKey = Object.keys(formDefinition.field_schema.properties)[0]!;
const fieldTitle = formDefinition.field_schema.properties[fieldKey]?.title;

const selection: PrefillSelection = {
  kind: "form",
  formNodeId: mockGraph.nodes[1]!.id,
  fieldKey,
};

describe("usePrefillFieldModal", () => {
  it("opens and closes the modal for a field", () => {
    const { result } = renderHook((props) => usePrefillFieldModal(props), {
      initialProps: {
        selectedNode,
        formDefinition,
        prefillMappings: {},
        onPrefillMappingsChange: vi.fn(),
      },
    });

    expect(result.current.isModalOpen).toBe(false);

    act(() => {
      result.current.openField(fieldKey);
    });
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.modalTitle).toBe(
      `Select data to prefill field ${fieldTitle ?? fieldKey} - ${selectedNode.data.name}`,
    );

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isModalOpen).toBe(false);
  });

  it("calls onPrefillMappingsChange and closes the modal on pickMapping", () => {
    const onPrefillMappingsChange = vi.fn();
    const { result } = renderHook((props) => usePrefillFieldModal(props), {
      initialProps: {
        selectedNode,
        formDefinition,
        prefillMappings: {},
        onPrefillMappingsChange,
      },
    });

    act(() => {
      result.current.openField(fieldKey);
    });
    act(() => {
      result.current.pickMapping(selection);
    });

    expect(onPrefillMappingsChange).toHaveBeenCalledOnce();
    expect(onPrefillMappingsChange).toHaveBeenCalledWith({
      [selectedNode.id]: { [fieldKey]: selection },
    });
    expect(result.current.isModalOpen).toBe(false);
  });

  it("ignores pickMapping when no field is active", () => {
    const onPrefillMappingsChange = vi.fn();
    const { result } = renderHook((props) => usePrefillFieldModal(props), {
      initialProps: {
        selectedNode,
        formDefinition,
        prefillMappings: {},
        onPrefillMappingsChange,
      },
    });

    act(() => {
      result.current.pickMapping(selection);
    });
    expect(onPrefillMappingsChange).not.toHaveBeenCalled();
  });

  it("does not open the modal without a selected node", () => {
    const { result } = renderHook((props) => usePrefillFieldModal(props), {
      initialProps: {
        selectedNode: null,
        formDefinition,
        prefillMappings: {},
        onPrefillMappingsChange: vi.fn(),
      },
    });

    act(() => {
      result.current.openField(fieldKey);
    });
    expect(result.current.isModalOpen).toBe(false);
  });
});
