# CrazyJam Bridge Monitor — watches for FL Studio and auto-starts the bridge (+ backend).
#
# Runs in the background (registered at Windows logon). When FL64.exe starts and the
# CrazyJam Bridge isn't already responding on http://127.0.0.1:8787, this launches the
# bridge (and the main backend first, if that isn't up either). When FL Studio closes
# and nothing else needs the bridge, it leaves it running (cheap, and FL may reopen).
#
# Install: run install_bridge_monitor.ps1 once (adds a logon Scheduled Task).

$BackendDir = "C:\Users\kpasc\source\repos\constellation\crazyjam\backend"
$Python     = Join-Path $BackendDir ".venv\Scripts\python.exe"
$BackendPort = 8000
$BridgePort  = 8787
$PollSeconds = 5

function Test-Port($port) {
    try {
        $null = Invoke-RestMethod -Uri "http://127.0.0.1:$port/health" -TimeoutSec 2 -ErrorAction Stop
        return $true
    } catch {
        # Bridge has no /health; treat any HTTP response (even 404 on /health) as up via /docs.
        try {
            $null = Invoke-WebRequest -Uri "http://127.0.0.1:$port/docs" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
            return $true
        } catch {
            return $false
        }
    }
}

function Start-CrazyJamBackend {
    if (-not (Test-Port $BackendPort)) {
        Start-Process -FilePath $Python -ArgumentList '-m','uvicorn','main:app','--host','127.0.0.1','--port',"$BackendPort",'--log-level','warning' -WorkingDirectory $BackendDir -WindowStyle Hidden
        # give it a moment to boot
        $t = 0
        while (-not (Test-Port $BackendPort) -and $t -lt 30) { Start-Sleep -Seconds 1; $t++ }
    }
}

function Start-CrazyJamBridge {
    if (-not (Test-Port $BridgePort)) {
        Start-CrazyJamBackend
        Start-Process -FilePath $Python -ArgumentList '-m','uvicorn','bridge.bridge_app:app','--host','127.0.0.1','--port',"$BridgePort",'--log-level','warning' -WorkingDirectory $BackendDir -WindowStyle Hidden
    }
}

Write-Host "CrazyJam Bridge Monitor running (watching for FL Studio)..."
while ($true) {
    $flRunning = Get-Process -Name "FL64" -ErrorAction SilentlyContinue
    if ($flRunning -and -not (Test-Port $BridgePort)) {
        Write-Host "$(Get-Date -Format 'HH:mm:ss')  FL Studio detected - starting CrazyJam Bridge"
        Start-CrazyJamBridge
    }
    Start-Sleep -Seconds $PollSeconds
}
