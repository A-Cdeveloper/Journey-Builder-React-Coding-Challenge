/**
 * Mini blueprint graph for unit tests only — not used by the app at runtime.
 *
 * Node ids are `form-a` … `form-f`; each links to `forms[].id` via `component_id`.
 *
 * Shape (prerequisites = upstream forms):
 *
 *   form-a
 *    /    \
 * form-b  form-c
 *    |      |
 * form-d  form-e
 *    \    /
 *    form-f
 *
 * Chains:  a → b → d → f
 *          a → c → e → f
 *
 * Useful expectations:
 * - form-f direct:     form-d, form-e
 * - form-f transitive: form-b, form-c, form-a
 * - form-d direct:     form-b  |  transitive: form-a
 * - form-e direct:     form-c  |  transitive: form-a
 * - form-b / form-c:   direct form-a  |  transitive: []
 * - form-a:            no upstream forms
 */

import type { BlueprintGraph, GraphNode } from "@/types/graph.ts";

const testFieldSchema = {
  type: "object" as const,
  properties: {
    field1: {
      avantos_type: "short-text" as const,
      type: "string",
      title: "Field 1",
    },
  },
  required: [] as string[],
};

function makeNode(
  id: string,
  name: string,
  prerequisites: string[],
): GraphNode {
  return {
    id,
    type: "form",
    data: {
      name,
      component_id: id,
      prerequisites,
      input_mapping: {},
    },
  };
}

export const mockNodes: GraphNode[] = [
  makeNode("form-a", "Form A", []),
  makeNode("form-b", "Form B", ["form-a"]),
  makeNode("form-c", "Form C", ["form-a"]),
  makeNode("form-d", "Form D", ["form-b"]),
  makeNode("form-e", "Form E", ["form-c"]),
  makeNode("form-f", "Form F", ["form-d", "form-e"]),
];

export const mockGraph: BlueprintGraph = {
  id: "bp-test",
  tenant_id: "1",
  name: "Test blueprint",
  nodes: mockNodes,
  edges: [],
  forms: mockNodes.map((node) => ({
    id: node.data.component_id,
    name: node.data.name,
    field_schema: testFieldSchema,
  })),
};
