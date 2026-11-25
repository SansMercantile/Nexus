# CrazyJam Bridge launcher — starts the localhost companion app for FL Studio.
# Run from the backend dir. Requires the same .env as the main backend (AWS creds).
$env:CRAZYJAM_API = if ($env:CRAZYJAM_API) { $env:CRAZYJAM_API } else { "http://127.0.0.1:8000" }
Write-Host "Starting CrazyJam Bridge on http://127.0.0.1:8787 (cloud API: $env:CRAZYJAM_API)"
& ".\.venv\Scripts\python.exe" -m uvicorn bridge.bridge_app:app --host 127.0.0.1 --port 8787 --log-level info
