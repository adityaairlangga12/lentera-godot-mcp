import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function simulate_click(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("simulate_click", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function simulate_keyboard(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("simulate_keyboard", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function simulate_mouse_move(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("simulate_mouse_move", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export const INPUT_TOOL_DEFS = [
  { name: "simulate_click", description: "Simulate a mouse click in the running project.", inputSchema: { type: "object", properties: { x: { type: "number" }, y: { type: "number" }, button: { type: "number" } }, required: ["x", "y"] } },
  { name: "simulate_keyboard", description: "Simulate keyboard input in the running project.", inputSchema: { type: "object", properties: { keycode: { type: "number" }, pressed: { type: "boolean" } }, required: ["keycode", "pressed"] } },
  { name: "simulate_mouse_move", description: "Simulate mouse movement in the running project.", inputSchema: { type: "object", properties: { x: { type: "number" }, y: { type: "number" } }, required: ["x", "y"] } }
];
