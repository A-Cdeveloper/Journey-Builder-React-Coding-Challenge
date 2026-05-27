import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGraph } from "@/features/graph/api/fetchGraph.ts";
import { mockGraph } from "@/__tests__/mockGraph.ts";

describe("fetchGraph", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed graph JSON when fetch succeeds", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGraph),
    } as Response);

    await expect(fetchGraph()).resolves.toEqual(mockGraph);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("throws when the response is not OK", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    await expect(fetchGraph()).rejects.toThrow(
      "Graph fetch failed: 500 Internal Server Error",
    );
  });
});
