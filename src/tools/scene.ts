import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function create_scene(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("create_scene", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function open_scene(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("open_scene", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function save_scene(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("save_scene", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function close_scene(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("close_scene", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_scene_tree(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_scene_tree", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_scene_dependencies(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("get_scene_dependencies", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
  }

export const SCENE_TOOL_DEFS = [
  { name: "create_scene", description: "Create a new scene.", inputSchema: { type: "object", properties: { root_type: { type: "string" }, name: { type: "string" } } } },
  { name: "open_scene", description: "Open a scene file.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "save_scene", description: "Save the current scene.", inputSchema: { type: "object", properties: { path: { type: "string" } } } },
  { name: "close_scene", description: "Close the current scene.", inputSchema: { type: "object", properties: { save: { type: "boolean" } } } },
  { name: "get_scene_tree", description: "Get the node tree of the current scene.", inputSchema: { type: "object", properties: {} } },
  { name: "get_scene_dependencies", description: "Get external dependencies of a scene file.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } }
];
