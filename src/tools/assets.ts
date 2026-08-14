import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function import_sprite(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("import_sprite", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function list_project_files(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("list_project_files", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function search_project(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("search_project", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_resource_info(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("get_resource_info", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}

export async function reimport_asset(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("reimport_asset", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}

export const ASSETS_TOOL_DEFS = [
  { name: "import_sprite", description: "Import a sprite into the project.", inputSchema: { type: "object", properties: { source_path: { type: "string" }, target_path: { type: "string" } }, required: ["source_path", "target_path"] } },
  { name: "list_project_files", description: "List files in the Godot project.", inputSchema: { type: "object", properties: { dir_path: { type: "string", default: "res://" } } } },
  { name: "search_project", description: "Search for files in the Godot project.", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
  { name: "get_resource_info", description: "Get info about a Godot resource.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "reimport_asset", description: "Reimport a project asset.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } }
];
