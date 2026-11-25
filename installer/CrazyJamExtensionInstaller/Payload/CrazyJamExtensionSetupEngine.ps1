# CrazyJam Extension Setup Engine
# Installs all DAW extensions: FL Studio, Cubase, Pro Tools.
param([switch]$Silent)

$ErrorActionPreference = "Stop"
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = "C:\Users\kpasc\source\repos\constellation\crazyjam\backend"
$FlStudioScripts = "$env:USERPROFILE\Documents\Image-Line\FL Studio\Settings\Piano roll scripts"
$FlStudioHardware = "$env:USERPROFILE\Documents\Image-Line\FL Studio\Settings\Hardware"
$CubaseDir = "$env:USERPROFILE\Documents\Steinberg\Cubase\MIDI Remote\Driver Scripts\Local"
$StartupDir = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"

Write-Host "Installing CrazyJam DAW Extensions..."

# 1. Bridge deps
& "$BackendDir\.venv\Scripts\python.exe" -m pip install -q "numpy>=1.26" librosa soundfile scipy pretty-midi rtmidi 2>$null

# 2. FL Studio scripts
Copy-Item "$Here\fl-studio\*.pyscript" -Destination $FlStudioScripts -Force
$ctrlDir = Join-Path $FlStudioHardware "CrazyJam Controller"
if (-not (Test-Path $ctrlDir)) { New-Item -ItemType Directory -Path $ctrlDir | Out-Null }
Copy-Item "$Here\fl-studio\CrazyJam Controller\device_CrazyJam Controller.py" -Destination $ctrlDir -Force

# 3. Cubase script
$cubCtrlDir = Join-Path $CubaseDir "CrazyJam Controller"
if (-not (Test-Path $cubCtrlDir)) { New-Item -ItemType Directory -Path $cubCtrlDir | Out-Null }
Copy-Item "$Here\cubase\CrazyJam Controller\CrazyJam_CrazyJam Controller.js" -Destination $cubCtrlDir -Force

# 4. Bridge monitor startup
$shortcut = Join-Path $StartupDir "CrazyJam Bridge Monitor.lnk"
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($shortcut)
$sc.TargetPath = "powershell.exe"
$sc.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$BackendDir\bridge_monitor.ps1`""
$sc.Save()

# 5. Start bridge
Start-Process -FilePath "$BackendDir\.venv\Scripts\python.exe" -ArgumentList '-m','uvicorn','bridge.bridge_app:app','--host','127.0.0.1','--port','8787','--log-level','warning' -WorkingDirectory $BackendDir -WindowStyle Hidden

Write-Host "Done. Open your DAW and run the CrazyJam scripts."
