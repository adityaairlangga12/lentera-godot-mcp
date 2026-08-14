// Shared types for lentera-godot-mcp

export interface BridgeCommand {
  id: string;
  command: string;
  params: Record<string, unknown>;
}

export interface BridgeResponse {
  id: string;
  result?: unknown;
  error?: string;
}

export interface ToolResult {
  content: Array<{ type: "text"; text: string } | { type: "image"; data: string; mimeType: string }>;
  isError?: boolean;
}

// Lentera Pudar Physics Layers
export const LENTERA_PHYSICS_LAYERS = {
  world: 1,
  player: 2,
  enemy: 3,
  attack_hitbox: 4,
  hurtbox: 5,
  interactable: 6,
} as const;

// Godot project path
export const GODOT_PROJECT_PATH = process.env.GODOT_PROJECT_PATH ??
  "D:\\GodotProjects\\Lentera-Pudar";
