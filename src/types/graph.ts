/** GET /api/v1/.../actions/blueprints/.../graph/ */

export type InputMapping = Record<string, unknown>;

export type GraphNodeData = {
  name: string;
  component_id: string;
  prerequisites: string[];
  input_mapping: InputMapping;
};

export type GraphNode = {
  id: string;
  type: string;
  data: GraphNodeData;
};

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
