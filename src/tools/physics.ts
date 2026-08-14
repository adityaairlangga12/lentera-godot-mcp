import { bridgeCall } from "../bridge.js";
import type { ToolResult } from "../types.js";
import { LENTERA_PHYSICS_LAYERS } from "../types.js";

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
function err(msg: string): ToolResult {
  return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
}

export async function get_physics_layers(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    const result = await bridgeCall("get_physics_layers", args);
    return ok(result);
  } catch (e) { return err((e as Error).message); }
}

export async function validate_collision_setup(args: Record<string, unknown>): Promise<ToolResult> {
  try {
    // This calls Godot to get all configured layers, then we validate against Lentera Pudar requirements
    const result = await bridgeCall("get_physics_layers", args) as Record<string, string>;
    
    const issues: string[] = [];
    for (const [layerName, layerIdx] of Object.entries(LENTERA_PHYSICS_LAYERS)) {
        const expectedName = layerName;
        const actualName = result[`layer_${layerIdx}`];
        if (!actualName) {
             issues.push(`Missing layer ${layerIdx}. Expected '${expectedName}'`);
        } else if (actualName !== expectedName) {
            issues.push(`Mismatch layer ${layerIdx}. Expected '${expectedName}', got '${actualName}'`);
        }
    }

    return ok({
        valid: issues.length === 0,
        expected: LENTERA_PHYSICS_LAYERS,
        actual: result,
        issues: issues
    });

  } catch (e) { return err((e as Error).message); }
}

export async function get_collision_matrix(args: Record<string, unknown>): Promise<ToolResult> {
    try {
      const result = await bridgeCall("get_collision_matrix", args);
      return ok(result);
    } catch (e) { return err((e as Error).message); }
}

export const PHYSICS_TOOL_DEFS = [
  { name: "get_physics_layers", description: "Get named 2D physics layers from project settings.", inputSchema: { type: "object", properties: {} } },
  { name: "validate_collision_setup", description: "Validate the project's physics layers against Lentera Pudar requirements (world, player, enemy, attack_hitbox, hurtbox, interactable).", inputSchema: { type: "object", properties: {} } },
  { name: "get_collision_matrix", description: "Get the physics layer collision matrix.", inputSchema: { type: "object", properties: {} } }
];
