import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function get_project_settings(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_project_settings", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function set_project_setting(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("set_project_setting", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function run_project(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("run_project", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function stop_project(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("stop_project", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function export_project(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("export_project", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}

export const PROJECT_TOOL_DEFS = [
  { name: "get_project_settings", description: "Get Godot project settings.", inputSchema: { type: "object", properties: { prefix: { type: "string" } } } },
  { name: "set_project_setting", description: "Set a Godot project setting.", inputSchema: { type: "object", properties: { setting: { type: "string" }, value: { type: "any" } }, required: ["setting", "value"] } },
  { name: "run_project", description: "Run the Godot project.", inputSchema: { type: "object", properties: {} } },
  { name: "stop_project", description: "Stop the running Godot project.", inputSchema: { type: "object", properties: {} } },
  { name: "export_project", description: "Export the project via preset.", inputSchema: { type: "object", properties: { preset: { type: "string" }, output_path: { type: "string" } }, required: ["preset", "output_path"] } }
];
