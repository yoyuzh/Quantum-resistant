param(
    [string]$HostAddress = "127.0.0.1",
    [int]$Port = 8000,
    [switch]$StrictPort
)

$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RepoRoot

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

$PythonExe = Resolve-PythonCommand
$Arguments = @("-u", "start.py", "--host", $HostAddress, "--port", $Port)
if ($StrictPort) {
    $Arguments += "--strict-port"
}

& $PythonExe @Arguments
exit $LASTEXITCODE
