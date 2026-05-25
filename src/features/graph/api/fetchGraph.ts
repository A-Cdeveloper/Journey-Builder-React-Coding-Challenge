import { GRAPH_PATH } from "@/config/constants.ts";
import type { BlueprintGraph } from "@/types/graph.ts";

//const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchGraph(): Promise<BlueprintGraph> {
  //await sleep(1000);

  const response = await fetch(GRAPH_PATH);

  if (!response.ok) {
    throw new Error(
      `Graph fetch failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  return data;
}
