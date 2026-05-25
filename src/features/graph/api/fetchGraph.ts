import { GRAPH_PATH } from "@/config/constants.ts";
import type { BlueprintGraph } from "@/types/graph.ts";

/** Fetches the blueprint graph; throws if the response is not OK. */
export async function fetchGraph(): Promise<BlueprintGraph> {
  const response = await fetch(GRAPH_PATH);

  if (!response.ok) {
    throw new Error(
      `Graph fetch failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  return data;
}
