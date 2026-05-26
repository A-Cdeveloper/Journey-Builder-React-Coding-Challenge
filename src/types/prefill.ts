/**
 * UI model for prefill — what the user picks in the modal.
 * Maps to API `input_mapping` expressions later when persisting.
 */

export type NodeId = string;
export type FieldKey = string;

export type PrefillSelection =
  | { kind: "form"; formNodeId: NodeId; fieldKey: FieldKey }
  | { kind: "global"; namespace: string; fieldKey: FieldKey };

/** Per-field selections for one form node being edited. */
export type NodePrefillMappings = Partial<Record<FieldKey, PrefillSelection>>;

/** All forms — keyed by canvas node id. */
export type PrefillMappingsState = Record<NodeId, NodePrefillMappings>;
