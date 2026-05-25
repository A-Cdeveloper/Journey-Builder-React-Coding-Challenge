import { useQuery } from "@tanstack/react-query";
import { fetchGraph } from "@/features/graph/api/fetchGraph.ts";

export const graphQueryKey = ["graph"] as const;

export function useFetchGraph() {
  return useQuery({
    queryKey: graphQueryKey,
    queryFn: fetchGraph,
  });
}
