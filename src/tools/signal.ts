import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function connect_signal(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("connect_signal", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function disconnect_signal(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("disconnect_signal", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function list_signals(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("list_signals", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function emit_signal(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("emit_signal", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export const SIGNAL_TOOL_DEFS = [
  { name: "connect_signal", description: "Connect a signal to a method.", inputSchema: { type: "object", properties: { source_path: { type: "string" }, signal: { type: "string" }, target_path: { type: "string" }, method: { type: "string" } }, required: ["source_path", "signal", "target_path", "method"] } },
  { name: "disconnect_signal", description: "Disconnect a signal.", inputSchema: { type: "object", properties: { source_path: { type: "string" }, signal: { type: "string" }, target_path: { type: "string" }, method: { type: "string" } }, required: ["source_path", "signal", "target_path", "method"] } },
  { name: "list_signals", description: "List signals of a node.", inputSchema: { type: "object", properties: { node_path: { type: "string" } }, required: ["node_path"] } },
  { name: "emit_signal", description: "Emit a signal on a node (runtime only).", inputSchema: { type: "object", properties: { node_path: { type: "string" }, signal: { type: "string" }, args: { type: "array" } }, required: ["node_path", "signal"] } }
];
