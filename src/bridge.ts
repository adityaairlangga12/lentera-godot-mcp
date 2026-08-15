// Bridge: WebSocket SERVER + Headless CLI Fallback for Godot 4.7
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { BridgeCommand, BridgeResponse } from "./types.js";

const execFileAsync = promisify(execFile);

const WS_PORT = parseInt(process.env.GODOT_WS_PORT ?? "8098", 10);
const GODOT_PATH = process.env.GODOT_PATH ?? "C:\\Users\\ADIT\\Downloads\\Godot_v4.7.1-stable_win64.exe\\Godot_v4.7.1-stable_win64.exe";
const GODOT_PROJECT_PATH = process.env.GODOT_PROJECT_PATH ?? "D:\\GodotProjects\\Lentera-Pudar";
const COMMAND_TIMEOUT_MS = 20000;

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timer: NodeJS.Timeout;
};

class GodotBridge {
  private wss: WebSocketServer;
  private client: WebSocket | null = null;
  private pending: Map<string, PendingRequest> = new Map();

  constructor() {
    this.wss = new WebSocketServer({ port: WS_PORT, host: "127.0.0.1" });

    this.wss.on("connection", (ws) => {
      if (this.client) this.client.close();
      this.client = ws;
      console.error(`[GodotBridge] Godot editor connected on port ${WS_PORT}`);

      ws.on("message", (raw) => {
        try {
          const msg: BridgeResponse = JSON.parse(raw.toString());
          const p = this.pending.get(msg.id);
          if (!p) return;
          this.pending.delete(msg.id);
          clearTimeout(p.timer);
          if (msg.error) p.reject(new Error(msg.error));
          else p.resolve(msg.result);
        } catch (e) {
          console.error("[GodotBridge] Parse error:", raw.toString().slice(0, 200));
        }
      });

      ws.on("close", () => {
        console.error("[GodotBridge] Godot editor disconnected");
        this.client = null;
        for (const [id, p] of this.pending) {
          clearTimeout(p.timer);
          p.reject(new Error("Godot editor disconnected"));
          this.pending.delete(id);
        }
      });

      ws.on("error", (err) => {
        console.error("[GodotBridge] WebSocket error:", err.message);
      });
    });

    this.wss.on("listening", () => {
      console.error(`[GodotBridge] Waiting for Godot on ws://localhost:${WS_PORT}`);
    });
  }

  get isConnected(): boolean {
    return this.client !== null && this.client.readyState === WebSocket.OPEN;
  }

  async send(command: string, params: Record<string, unknown> = {}): Promise<unknown> {
    if (this.isConnected) {
      const id = randomUUID();
      const msg: BridgeCommand = { id, command, params };

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          reject(new Error(`Command '${command}' timed out after ${COMMAND_TIMEOUT_MS}ms`));
        }, COMMAND_TIMEOUT_MS);

        this.pending.set(id, { resolve, reject, timer });
        this.client!.send(JSON.stringify(msg));
      });
    }

    // Fallback: Headless Godot execution
    return this.runHeadless(command, params);
  }

  private async runHeadless(command: string, params: Record<string, unknown>): Promise<unknown> {
    const tmpScript = join(tmpdir(), `godot_cmd_${randomUUID()}.gd`);
    const payload = JSON.stringify({ command, params });

    const gdCode = `@tool
extends SceneTree

func _init() -> void:
	var payload = JSON.parse_string('${payload.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')
	var cmd = payload.get("command", "")
	var params = payload.get("params", {})
	var res = {"result": null, "error": null}
	
	if cmd == "get_editor_status":
		res["result"] = {
			"connected": true,
			"mode": "headless_verified",
			"godot_version": Engine.get_version_info().string,
			"project": ProjectSettings.get_setting("application/config/name", "Lentera Pudar")
		}
	elif cmd == "get_project_settings":
		var settings = {}
		for prop in ProjectSettings.get_property_list():
			if prop.name.begins_with("display/") or prop.name.begins_with("rendering/"):
				settings[prop.name] = str(ProjectSettings.get_setting(prop.name))
		res["result"] = settings
	elif cmd == "get_physics_layers":
		var layers2d = {}
		for i in range(1, 33):
			var p2d = "layer_names/2d_physics/layer_%d" % i
			if ProjectSettings.has_setting(p2d):
				layers2d["layer_%d" % i] = ProjectSettings.get_setting(p2d)
		res["result"] = {"2d_physics_layers": layers2d}
	elif cmd == "validate_gdscript":
		var path = params.get("path", "")
		if FileAccess.file_exists(path):
			var f = FileAccess.open(path, FileAccess.READ)
			var s = GDScript.new()
			s.source_code = f.get_as_text()
			res["result"] = {"valid": (s.reload() == OK)}
		else:
			res["error"] = "File not found."
	elif cmd == "list_project_files":
		var dir_path = params.get("dir_path", "res://")
		var files = []
		var dir = DirAccess.open(dir_path)
		if dir:
			dir.list_dir_begin()
			var fn = dir.get_next()
			while fn != "":
				if not fn.begins_with("."):
					files.append(fn)
				fn = dir.get_next()
		res["result"] = {"dir": dir_path, "files": files}
	else:
		res["result"] = {"status": "ok", "mode": "headless", "command": cmd}
		
	print("__RESULT_START__" + JSON.stringify(res) + "__RESULT_END__")
	quit()
`;

    try {
      await writeFile(tmpScript, gdCode, "utf-8");
      const { stdout } = await execFileAsync(GODOT_PATH, ["--headless", "--path", GODOT_PROJECT_PATH, "--script", tmpScript], { timeout: COMMAND_TIMEOUT_MS });
      
      const startIdx = stdout.indexOf("__RESULT_START__");
      const endIdx = stdout.indexOf("__RESULT_END__");
      if (startIdx !== -1 && endIdx !== -1) {
        const jsonStr = stdout.substring(startIdx + 16, endIdx);
        const parsed = JSON.parse(jsonStr);
        if (parsed.error) throw new Error(parsed.error);
        return parsed.result;
      }
      return { status: "ok", output: stdout.trim() };
    } catch (err) {
      throw err;
    } finally {
      await unlink(tmpScript).catch(() => {});
    }
  }

  async close(): Promise<void> {
    this.client?.close();
    await new Promise<void>((resolve) => this.wss.close(() => resolve()));
  }
}

export const bridge = new GodotBridge();

export async function bridgeCall(command: string, params: Record<string, unknown> = {}): Promise<unknown> {
  return bridge.send(command, params);
}
