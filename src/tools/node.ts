import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function add_node(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("add_node", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function delete_node(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("delete_node", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function move_node(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("move_node", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function duplicate_node(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("duplicate_node", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_node_properties(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_node_properties", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function set_node_properties(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("set_node_properties", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_node_signals(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("get_node_signals", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}

export async function rename_node(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("rename_node", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}

export async function reparent_node(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("reparent_node", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}


export const NODE_TOOL_DEFS = [
  { name: "add_node", description: "Add a new node to the scene.", inputSchema: { type: "object", properties: { parent: { type: "string" }, type: { type: "string" }, name: { type: "string" } }, required: ["type"] } },
  { name: "delete_node", description: "Delete a node from the scene.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "move_node", description: "Move a node within its parent.", inputSchema: { type: "object", properties: { path: { type: "string" }, index: { type: "number" } }, required: ["path", "index"] } },
  { name: "duplicate_node", description: "Duplicate a node.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "get_node_properties", description: "Get properties of a node.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "set_node_properties", description: "Set properties of a node.", inputSchema: { type: "object", properties: { path: { type: "string" }, properties: { type: "object" } }, required: ["path", "properties"] } },
  { name: "get_node_signals", description: "Get available signals of a node type.", inputSchema: { type: "object", properties: { type: { type: "string" } }, required: ["type"] } },
  { name: "rename_node", description: "Rename a node.", inputSchema: { type: "object", properties: { path: { type: "string" }, new_name: { type: "string" } }, required: ["path", "new_name"] } },
  { name: "reparent_node", description: "Reparent a node to a new parent.", inputSchema: { type: "object", properties: { path: { type: "string" }, new_parent: { type: "string" } }, required: ["path", "new_parent"] } }
];
