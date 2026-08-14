import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function attach_script(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("attach_script", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function detach_script(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("detach_script", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function run_gdscript(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("run_gdscript", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function validate_gdscript(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("validate_gdscript", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export const SCRIPT_TOOL_DEFS = [
  { name: "attach_script", description: "Attach a script to a node.", inputSchema: { type: "object", properties: { node_path: { type: "string" }, script_path: { type: "string" } }, required: ["node_path", "script_path"] } },
  { name: "detach_script", description: "Detach a script from a node.", inputSchema: { type: "object", properties: { node_path: { type: "string" } }, required: ["node_path"] } },
  { name: "run_gdscript", description: "Run an arbitrary GDScript snippet.", inputSchema: { type: "object", properties: { script: { type: "string" } }, required: ["script"] } },
  { name: "validate_gdscript", description: "Validate a GDScript file without running it.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } }
];
