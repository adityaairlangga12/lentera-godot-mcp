#!/usr/bin/env node
// lentera-godot-mcp — MCP Server Main Entry Point
// Architecture: Node.js (WS Server) ←→ Godot Plugin (WS Client)

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

import { EDITOR_TOOL_DEFS, launch_editor, attach_project, detach_project, get_editor_status, get_debug_output } from "./tools/editor.js";
import { SCENE_TOOL_DEFS, create_scene, open_scene, save_scene, close_scene, get_scene_tree, get_scene_dependencies } from "./tools/scene.js";
import { NODE_TOOL_DEFS, add_node, delete_node, move_node, duplicate_node, get_node_properties, set_node_properties, get_node_signals, rename_node, reparent_node } from "./tools/node.js";
import { SCRIPT_TOOL_DEFS, attach_script, detach_script, run_gdscript, validate_gdscript } from "./tools/script.js";
import { ASSETS_TOOL_DEFS, import_sprite, list_project_files, search_project, get_resource_info, reimport_asset } from "./tools/assets.js";
import { ANIMATION_TOOL_DEFS, create_animation_library, add_animation, add_track, set_keyframe, set_animation_loop, get_animation_info } from "./tools/animation.js";
import { TILEMAP_TOOL_DEFS, set_tilemap_cell, clear_tilemap_cell, get_tilemap_info, fill_tilemap_region } from "./tools/tilemap.js";
import { SIGNAL_TOOL_DEFS, connect_signal, disconnect_signal, list_signals, emit_signal } from "./tools/signal.js";
import { AUTOLOAD_TOOL_DEFS, add_autoload, remove_autoload, update_autoload, list_autoloads, reload_autoload } from "./tools/autoload.js";
import { PROJECT_TOOL_DEFS, get_project_settings, set_project_setting, run_project, stop_project, export_project } from "./tools/project.js";
import { INPUT_TOOL_DEFS, simulate_click, simulate_keyboard, simulate_mouse_move } from "./tools/input.js";
import { VISUAL_TOOL_DEFS, take_screenshot, get_ui_elements, zoom_editor, focus_editor_window } from "./tools/visual.js";
import { PHYSICS_TOOL_DEFS, get_physics_layers, validate_collision_setup, get_collision_matrix } from "./tools/physics.js";

import "./bridge.js"; // Start WebSocket server

type ToolHandler = (args: Record<string, unknown>) => Promise<{ content: unknown[]; isError?: boolean }>;

const TOOL_HANDLERS: Record<string, ToolHandler> = {
  launch_editor, attach_project, detach_project, get_editor_status, get_debug_output,
  create_scene, open_scene, save_scene, close_scene, get_scene_tree, get_scene_dependencies,
  add_node, delete_node, move_node, duplicate_node, get_node_properties, set_node_properties, get_node_signals, rename_node, reparent_node,
  attach_script, detach_script, run_gdscript, validate_gdscript,
  import_sprite, list_project_files, search_project, get_resource_info, reimport_asset,
  create_animation_library, add_animation, add_track, set_keyframe, set_animation_loop, get_animation_info,
  set_tilemap_cell, clear_tilemap_cell, get_tilemap_info, fill_tilemap_region,
  connect_signal, disconnect_signal, list_signals, emit_signal,
  add_autoload, remove_autoload, update_autoload, list_autoloads, reload_autoload,
  get_project_settings, set_project_setting, run_project, stop_project, export_project,
  simulate_click, simulate_keyboard, simulate_mouse_move,
  take_screenshot, get_ui_elements, zoom_editor, focus_editor_window,
  get_physics_layers, validate_collision_setup, get_collision_matrix
};

const ALL_TOOLS = [
  ...EDITOR_TOOL_DEFS, ...SCENE_TOOL_DEFS, ...NODE_TOOL_DEFS, ...SCRIPT_TOOL_DEFS, ...ASSETS_TOOL_DEFS,
  ...ANIMATION_TOOL_DEFS, ...TILEMAP_TOOL_DEFS, ...SIGNAL_TOOL_DEFS, ...AUTOLOAD_TOOL_DEFS, ...PROJECT_TOOL_DEFS,
  ...INPUT_TOOL_DEFS, ...VISUAL_TOOL_DEFS, ...PHYSICS_TOOL_DEFS
];

async function main() {
  const server = new Server({ name: "lentera-godot-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: ALL_TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const handler = TOOL_HANDLERS[name];
    if (!handler) throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    return handler(args ?? {});
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[lentera-godot-mcp] Server started. Waiting for Godot connection on ws://localhost:8098");
}

main().catch(err => { console.error("Fatal error:", err); process.exit(1); });
