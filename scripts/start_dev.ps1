param(
    [string]$BackendHost = "127.0.0.1",
    [int]$BackendPort = 8000,
    [string]$FrontendHost = "127.0.0.1",
    [int]$FrontendPort = 3000
)

$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$WebRoot = Join-Path $RepoRoot "web"
$BackendProcess = $null
$FrontendProcess = $null
$PythonExe = $null

function Resolve-PythonCommand {
    $VenvPython = Join-Path $RepoRoot ".venv\Scripts\python.exe"
    if (Test-Path $VenvPython) {
        return $VenvPython
    }

    $PythonCommand = Get-Command python -ErrorAction SilentlyContinue
    if ($null -ne $PythonCommand) {
        return $PythonCommand.Source
    }

    throw "Python was not found. Create .venv or install Python and add it to PATH."
}

function Stop-ChildProcess {
    param([System.Diagnostics.Process]$Process)

    if ($null -ne $Process -and -not $Process.HasExited) {
        Stop-Process -Id $Process.Id -Force -ErrorAction SilentlyContinue
    }
}

try {
    Set-Location $RepoRoot
    $PythonExe = Resolve-PythonCommand

    if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
        Write-Host "Installing frontend dependencies..."
        Push-Location $WebRoot
        npm install
        Pop-Location
    }

    Write-Host "Starting backend on http://$BackendHost`:$BackendPort"
    $BackendProcess = Start-Process `
        -FilePath $PythonExe `
        -ArgumentList @("start.py", "--host", $BackendHost, "--port", $BackendPort, "--strict-port") `
        -WorkingDirectory $RepoRoot `
        -PassThru `
        -NoNewWindow

    Write-Host "Starting frontend on http://$FrontendHost`:$FrontendPort/static/"
    $FrontendProcess = Start-Process `
        -FilePath "cmd.exe" `
        -ArgumentList @("/c", "npm run dev -- --host $FrontendHost --port $FrontendPort") `
        -WorkingDirectory $WebRoot `
        -PassThru `
        -NoNewWindow

    Write-Host ""
    Write-Host "Development services are starting:"
    Write-Host "- Backend API: http://$BackendHost`:$BackendPort"
    Write-Host "- Frontend UI: http://$FrontendHost`:$FrontendPort/static/"
    Write-Host ""
    Write-Host "Press Ctrl+C to stop both services."

    while ($true) {
        Start-Sleep -Seconds 1
        if ($BackendProcess.HasExited) {
            throw "Backend process exited with code $($BackendProcess.ExitCode)."
        }
        if ($FrontendProcess.HasExited) {
            throw "Frontend process exited with code $($FrontendProcess.ExitCode)."
        }
    }
}
finally {
    Stop-ChildProcess $FrontendProcess
    Stop-ChildProcess $BackendProcess
}
