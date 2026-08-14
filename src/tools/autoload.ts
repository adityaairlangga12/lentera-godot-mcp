import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function add_autoload(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("add_autoload", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function remove_autoload(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("remove_autoload", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function update_autoload(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("update_autoload", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function list_autoloads(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("list_autoloads", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function reload_autoload(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("reload_autoload", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}

export const AUTOLOAD_TOOL_DEFS = [
  { name: "add_autoload", description: "Add a new autoload (singleton).", inputSchema: { type: "object", properties: { name: { type: "string" }, path: { type: "string" } }, required: ["name", "path"] } },
  { name: "remove_autoload", description: "Remove an autoload.", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } },
  { name: "update_autoload", description: "Update an existing autoload path.", inputSchema: { type: "object", properties: { name: { type: "string" }, path: { type: "string" } }, required: ["name", "path"] } },
  { name: "list_autoloads", description: "List all configured autoloads.", inputSchema: { type: "object", properties: {} } },
  { name: "reload_autoload", description: "Reload an autoload at runtime.", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } }
];
