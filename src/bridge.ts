// Bridge: WebSocket SERVER that Godot GDScript plugin connects to as CLIENT.
// Architecture: Node.js (WS Server on port 8098) ←→ Godot Plugin (WS Client)

import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import type { BridgeCommand, BridgeResponse } from "./types.js";

const WS_PORT = parseInt(process.env.GODOT_WS_PORT ?? "8098", 10);
const COMMAND_TIMEOUT_MS = 20000; // Godot ops can be slower

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
      console.error(`[GodotBridge] Waiting for Godot to connect on ws://localhost:${WS_PORT}`);
    });

    this.wss.on("error", (err) => {
      console.error("[GodotBridge] Server error:", err.message);
    });
  }

  get isConnected(): boolean {
    return this.client !== null && this.client.readyState === WebSocket.OPEN;
  }

  async send(command: string, params: Record<string, unknown> = {}): Promise<unknown> {
    if (!this.isConnected) {
      for (let i = 0; i < 150; i++) {
        await new Promise(r => setTimeout(r, 100));
        if (this.isConnected) break;
      }
      if (!this.isConnected) {
        throw new Error(
          "Godot editor is not connected. Open Godot with the Lentera MCP Plugin enabled, or use launch_editor first."
        );
      }
    }

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

  async close(): Promise<void> {
    this.client?.close();
    await new Promise<void>((resolve) => this.wss.close(() => resolve()));
  }
}

export const bridge = new GodotBridge();

export async function bridgeCall(command: string, params: Record<string, unknown> = {}): Promise<unknown> {
  return bridge.send(command, params);
}
