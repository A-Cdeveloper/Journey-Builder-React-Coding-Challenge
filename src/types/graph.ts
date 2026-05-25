/**
 * Types for GET /api/v1/{tenant}/actions/blueprints/{id}/graph/.
 *
 * A canvas {@link GraphNode} links to a {@link FormDefinition} via
 * `node.data.component_id === form.id`. Prefill mappings live on each node
 * in `data.input_mapping` (keys match `field_schema.properties`).
 */

/** Per-field prefill values on a graph node (API shape; refined in prefill types later). */
export type InputMapping = Record<string, unknown>;

export type GraphNodeData = {
  name: string;
  /** References {@link FormDefinition.id} for form nodes. */
  component_id: string;
  prerequisites: string[];
  input_mapping: InputMapping;
};

export type GraphNode = {
  id: string;
  type: string;
  data: GraphNodeData;
};

/** Directed edge: data flows from `source` to `target` (predecessor → successor). */
export type GraphEdge = {
  source: string;
  target: string;
};

export type AvantosFieldType =
  | "button"
  | "checkbox-group"
  | "multi-line-text"
  | "multi-select"
  | "object-enum"
  | "short-text";

export type FormFieldItems = {
  type: string;
  enum?: string[];
};

/** JSON Schema property for one form field (subset used by the mock API). */
export type FormFieldProperty = {
  avantos_type: AvantosFieldType;
  type: string;
  title?: string;
  format?: string;
  enum?: string[] | null;
  items?: FormFieldItems;
  uniqueItems?: boolean;
};

export type FormFieldSchema = {
  type: "object";
  properties: Record<string, FormFieldProperty>;
  required: string[];
};

/** Form catalog entry; field list comes from `field_schema`. */
export type FormDefinition = {
  id: string;
  name: string;
  field_schema: FormFieldSchema;
};

export type FormGraphNode = GraphNode & { type: "form" };

export type BlueprintGraph = {
  id: string;
  tenant_id: string;
  name: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
};
