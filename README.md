# Lentera Godot MCP Server

Custom Model Context Protocol (MCP) Server yang dirancang khusus untuk mengotomatisasi interaksi langsung, manipulasi scene, inspeksi node, injeksi GDScript, dan pengujian runtime pada **Godot Engine 4.x** untuk proyek *Lentera Pudar*.

---

## Arsitektur Sistem

Server ini menghubungkan AI Agent ke Godot Editor secara real-time melalui WebSocket Bridge:

- **AI Agent / Antigravity** <--> *(Stdio / MCP Protocol)* <--> **Lentera Godot MCP Server (TypeScript)**
- **Lentera Godot MCP Server** <--> *(WebSocket ws://127.0.0.1:8098)* <--> **Godot Editor Plugin (lentera_bridge)**
- **Godot Editor Plugin** <--> *(Godot Engine API / ClassDB)* <--> **Godot 4 Editor Runtime**

---

## Fitur & Kategori Tool

Server ini menyediakan lebih dari 50 tools otomasi tingkat tinggi yang dibagi ke dalam beberapa modul:

| Modul | File Handler (src/tools/) | Deskripsi Kemampuan |
|---|---|---|
| **Scene & Node** | scene.ts, 
ode.ts | Membuat, membuka, menyimpan, menutup scene (.tscn), menambah node, reparenting, modifikasi properti, dan inspeksi hierarki. |
| **Scripting** | script.ts | Attach/detach script GDScript, eksekusi skrip dinamis via un_gdscript, dan validasi sintaks GDScript. |
| **Assets & Animation** | ssets.ts, nimation.ts | Import spritesheet, inspeksi resource, pembuatan AnimationLibrary, manipulasi keyframe dan track animasi. |
| **Visual & UI** | isual.ts, input.ts | Manajemen tema, komponen UI, simulasi klik mouse, keyboard input, dan capture screenshot editor. |
| **Physics & TileMap** | physics.ts, 	ilemap.ts | Inspeksi collision matrix, manipulasi cell TileMap, dan query layer fisika 2D. |
| **Project & Editor** | project.ts, editor.ts, utoload.ts | Konfigurasi project.godot, autoload singletons (GameEvents.gd), dan kontrol eksekusi playtest (un_project). |

---

## Cara Instalasi & Menjalankan

### 1. Build Server MCP
Pastikan Anda memiliki Node.js (v18+) terinstal:
`ash
npm install
npm run build
`

### 2. Pasang Plugin ke Proyek Godot
Salin folder godot-plugin/ ke dalam proyek Godot Anda di direktori ddons/lentera_bridge/:
`
res://addons/lentera_bridge/
  ├── plugin.cfg
  ├── plugin.gd
  └── bridge_client.gd
`
Buka **Project -> Project Settings -> Plugins** di Godot dan aktifkan plugin **Lentera Godot Bridge**.

### 3. Konfigurasi di Antigravity IDE (mcp_config.json)
`json
{
  mcpServers: {
    lentera-godot: {
      command: node,
      args: [D:/GodotProjects/lentera-godot-mcp/build/index.js]
    }
  }
}
`

---

## Lisensi
Dibuat secara kustom untuk ekosistem game **Lentera Pudar**.
