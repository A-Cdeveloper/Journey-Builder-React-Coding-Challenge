import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { globalNamespaces } from "@/config/globalNamespaces.ts";
import { PrefillSourcePicker } from "@/features/prefill/modal/PrefillSourcePicker.tsx";
import { mockGraph } from "@/__tests__/mockGraph.ts";

const onPick = vi.fn();
const namespace = globalNamespaces[0]!;
const field = namespace.fields[0]!;

function renderPicker() {
  render(
    <PrefillSourcePicker
      graph={mockGraph}
      targetNodeId="form-f"
      onPick={onPick}
    />,
  );
}

describe("PrefillSourcePicker", () => {
  afterEach(() => vi.clearAllMocks());

  it("renders source groups for the target form", () => {
    renderPicker();

    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: new RegExp(namespace.label, "i") }),
    ).toBeInTheDocument();
  });

  it("shows a message when search matches nothing", async () => {
    const user = userEvent.setup();
    renderPicker();

    await user.type(screen.getByLabelText("Search"), "zzzz");

    expect(
      screen.getByText('No data sources found for "zzzz".'),
    ).toBeInTheDocument();
  });

  it("calls onPick when a source option is selected", async () => {
    const user = userEvent.setup();
    renderPicker();

    await user.click(
      screen.getByRole("button", { name: new RegExp(namespace.label, "i") }),
    );
    await user.click(screen.getByRole("button", { name: field.title }));

    expect(onPick).toHaveBeenCalledOnce();
    expect(onPick).toHaveBeenCalledWith({
      kind: "global",
      namespace: namespace.id,
      fieldKey: field.key,
    });
  });
});
