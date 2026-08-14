// Screenshot capture for Godot editor window
import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const GODOT_WINDOW_TITLE = process.env.GODOT_WINDOW_TITLE ?? "Godot";

export async function captureGodotWindow(): Promise<{ base64: string; width: number; height: number }> {
  const tmpPath = join(tmpdir(), `lentera_godot_${randomUUID()}.png`).replace(/\\/g, "\\\\");

  const script = `
Add-Type -ReferencedAssemblies System.Drawing, System.Windows.Forms -TypeDefinition @'
using System;
using System.Drawing;
using System.Runtime.InteropServices;
public static class WinCapture {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }
    public static Bitmap CaptureWindow(IntPtr hwnd) {
        RECT rect;
        GetWindowRect(hwnd, out rect);
        int w = rect.Right - rect.Left;
        int h = rect.Bottom - rect.Top;
        var bmp = new Bitmap(w, h);
        using (var g = Graphics.FromImage(bmp))
            g.CopyFromScreen(rect.Left, rect.Top, 0, 0, new Size(w, h));
        return bmp;
    }
}
'@

$procs = Get-Process | Where-Object { $_.MainWindowTitle -like "*${GODOT_WINDOW_TITLE}*" -and $_.MainWindowHandle -ne 0 }
if (-not $procs) { throw "Godot window not found. Is Godot editor open?" }
$proc = $procs | Select-Object -First 1
[WinCapture]::SetForegroundWindow($proc.MainWindowHandle) | Out-Null
Start-Sleep -Milliseconds 200
$bmp = [WinCapture]::CaptureWindow($proc.MainWindowHandle)
$bmp.Save("${tmpPath}", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "$($bmp.Width)x$($bmp.Height)"
$bmp.Dispose()
`;

  const output = await new Promise<string>((resolve, reject) => {
    execFile(
      "powershell",
      ["-NonInteractive", "-NoProfile", "-Command", script],
      { timeout: 12000 },
      (err, stdout, stderr) => {
        if (err) reject(new Error(stderr.trim() || err.message));
        else resolve(stdout.trim());
      }
    );
  });

  const [w, h] = output.split("x").map(Number);
  const data = await readFile(tmpPath.replace(/\\\\/g, "\\"));
  await unlink(tmpPath.replace(/\\\\/g, "\\")).catch(() => {});
  return { base64: data.toString("base64"), width: w, height: h };
}
