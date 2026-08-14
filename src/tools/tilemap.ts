import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function set_tilemap_cell(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("set_tilemap_cell", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function clear_tilemap_cell(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("clear_tilemap_cell", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function get_tilemap_info(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_tilemap_info", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function fill_tilemap_region(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("fill_tilemap_region", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export const TILEMAP_TOOL_DEFS = [
  { name: "set_tilemap_cell", description: "Set a cell in a TileMapLayer.", inputSchema: { type: "object", properties: { node_path: { type: "string" }, pos: { type: "object" }, source_id: { type: "number" }, atlas_coords: { type: "object" } }, required: ["node_path", "pos", "source_id", "atlas_coords"] } },
  { name: "clear_tilemap_cell", description: "Clear a cell in a TileMapLayer.", inputSchema: { type: "object", properties: { node_path: { type: "string" }, pos: { type: "object" } }, required: ["node_path", "pos"] } },
  { name: "get_tilemap_info", description: "Get info about a TileMapLayer.", inputSchema: { type: "object", properties: { node_path: { type: "string" } }, required: ["node_path"] } },
  { name: "fill_tilemap_region", description: "Fill a region in a TileMapLayer with a specific tile.", inputSchema: { type: "object", properties: { node_path: { type: "string" }, start_pos: { type: "object" }, end_pos: { type: "object" }, source_id: { type: "number" }, atlas_coords: { type: "object" } }, required: ["node_path", "start_pos", "end_pos", "source_id", "atlas_coords"] } }
];
