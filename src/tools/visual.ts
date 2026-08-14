import { bridgeCall } from "../bridge.js";
import { captureGodotWindow } from "../screenshot.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function take_screenshot(_args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const { base64, width, height } = await captureGodotWindow();
    return {
      content: [
        { type: "text", text: `Godot screenshot captured: ${width}x${height}px` },
        { type: "image", data: base64, mimeType: "image/png" },
      ],
    };
  } catch (e) { return err((e as Error).message); }
}

export async function get_ui_elements(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_ui_elements", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function zoom_editor(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("zoom_editor", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function focus_editor_window(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("focus_editor_window", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}

export const VISUAL_TOOL_DEFS = [
  { name: "take_screenshot", description: "Capture the Godot editor window as an image.", inputSchema: { type: "object", properties: {} } },
  { name: "get_ui_elements", description: "Get UI elements visible in the running project.", inputSchema: { type: "object", properties: {} } },
  { name: "zoom_editor", description: "Zoom the Godot 2D editor.", inputSchema: { type: "object", properties: { zoom_level: { type: "number" } }, required: ["zoom_level"] } },
  { name: "focus_editor_window", description: "Bring Godot editor window to front.", inputSchema: { type: "object", properties: {} } }
];
