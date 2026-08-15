import { spawn } from "node:child_process";
import { bridgeCall, bridge } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function launch_editor(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    if (bridge.isConnected) {
      const result = await bridgeCall("launch_editor", args);
      return ok(result);
    }
    const godotPath = process.env.GODOT_PATH ?? "C:\\Users\\ADIT\\Downloads\\Godot_v4.7.1-stable_win64.exe\\Godot_v4.7.1-stable_win64.exe";
    const projectPath = process.env.GODOT_PROJECT_PATH ?? "D:\\GodotProjects\\Lentera-Pudar";
    const child = spawn(godotPath, ["--editor", "--path", projectPath], {
      detached: true,
      stdio: "ignore"
    });
    child.unref();

    // Wait up to 10s for connection
    for (let i = 0; i < 50; i++) {
      await new Promise(r => setTimeout(r, 200));
      if (bridge.isConnected) break;
    }

    return ok({ status: "launched", godot_path: godotPath, project_path: projectPath, connected: bridge.isConnected });
  } catch (e) { return err((e as Error).message); }
}

export async function attach_project(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("attach_project", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function detach_project(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("detach_project", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_editor_status(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_editor_status", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_debug_output(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_debug_output", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export const EDITOR_TOOL_DEFS = [
  { name: "launch_editor", description: "Launch the Godot Editor with Lentera Pudar project.", inputSchema: { type: "object", properties: {} } },
  { name: "attach_project", description: "Attach to an already running Godot Editor.", inputSchema: { type: "object", properties: {} } },
  { name: "detach_project", description: "Detach from the Godot Editor.", inputSchema: { type: "object", properties: {} } },
  { name: "get_editor_status", description: "Get the current status of the Godot Editor connection.", inputSchema: { type: "object", properties: {} } },
  { name: "get_debug_output", description: "Get recent debug output from the Godot Editor.", inputSchema: { type: "object", properties: {} } }
];
