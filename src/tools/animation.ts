import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function create_animation_library(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("create_animation_library", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function add_animation(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("add_animation", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function add_track(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("add_track", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function set_keyframe(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("set_keyframe", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function set_animation_loop(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("set_animation_loop", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_animation_info(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_animation_info", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export const ANIMATION_TOOL_DEFS = [
  { name: "create_animation_library", description: "Create a new AnimationLibrary.", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "add_animation", description: "Add an animation to a library.", inputSchema: { type: "object", properties: { library_path: { type: "string" }, name: { type: "string" }, length: { type: "number" } }, required: ["library_path", "name", "length"] } },
  { name: "add_track", description: "Add a track to an animation.", inputSchema: { type: "object", properties: { library_path: { type: "string" }, anim_name: { type: "string" }, track_type: { type: "string" }, track_path: { type: "string" } }, required: ["library_path", "anim_name", "track_type", "track_path"] } },
  { name: "set_keyframe", description: "Set a keyframe on a track.", inputSchema: { type: "object", properties: { library_path: { type: "string" }, anim_name: { type: "string" }, track_idx: { type: "number" }, time: { type: "number" }, value: { type: "object" } }, required: ["library_path", "anim_name", "track_idx", "time", "value"] } },
  { name: "set_animation_loop", description: "Set the loop mode of an animation.", inputSchema: { type: "object", properties: { library_path: { type: "string" }, anim_name: { type: "string" }, loop_mode: { type: "number" } }, required: ["library_path", "anim_name", "loop_mode"] } },
  { name: "get_animation_info", description: "Get info about an animation.", inputSchema: { type: "object", properties: { library_path: { type: "string" }, anim_name: { type: "string" } }, required: ["library_path", "anim_name"] } }
];
