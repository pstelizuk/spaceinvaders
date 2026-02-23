Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName Microsoft.VisualBasic

# Start HTTP server in background (ignore if already running)
$serverRunning = netstat -ano 2>$null | Select-String ':8765.*LISTENING'
if (-not $serverRunning) {
    $root = Split-Path $PSScriptRoot -Parent
    Start-Process python -ArgumentList '-m', 'http.server', '8765' -WorkingDirectory $root -WindowStyle Hidden
    Start-Sleep -Milliseconds 800
}

$proc = Get-Process -Name 'Code' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $proc) { Write-Host 'VS Code non trouve'; exit 1 }

try {
    [Microsoft.VisualBasic.Interaction]::AppActivate('Visual Studio Code') | Out-Null
} catch {
    # Fallback: use window handle via Win32 API
    Add-Type @"
      using System;
      using System.Runtime.InteropServices;
      public class Win32 {
        [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
      }
"@
    [Win32]::SetForegroundWindow($proc.MainWindowHandle) | Out-Null
}
Start-Sleep -Milliseconds 500

[System.Windows.Forms.SendKeys]::SendWait('^+p')
Start-Sleep -Milliseconds 700

[System.Windows.Forms.SendKeys]::SendWait('Simple Browser{:} Show')
Start-Sleep -Milliseconds 500

[System.Windows.Forms.SendKeys]::SendWait('{ENTER}')
Start-Sleep -Milliseconds 700

[System.Windows.Forms.SendKeys]::SendWait('http://localhost:8765/tests/visual-tests.html')
[System.Windows.Forms.SendKeys]::SendWait('{ENTER}')
Write-Host 'OK - Simple Browser ouvert'
