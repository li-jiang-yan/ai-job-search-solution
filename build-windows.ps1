$ErrorActionPreference = 'Stop'

$repositoryDirectory = $PSScriptRoot
$frontendDirectory = Join-Path $repositoryDirectory 'vite-project'
$backendDirectory = Join-Path $repositoryDirectory 'backend'

Push-Location $frontendDirectory
try {
    npm.cmd ci
    if ($LASTEXITCODE -ne 0) { throw 'npm ci failed.' }
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'The frontend build failed.' }
}
finally {
    Pop-Location
}

Push-Location $backendDirectory
try {
    $pythonEnvironment = Join-Path $backendDirectory '.venv'
    if (-not (Test-Path -LiteralPath $pythonEnvironment)) {
        python -m venv $pythonEnvironment
    }
    $pythonExecutable = Join-Path $pythonEnvironment 'Scripts\python.exe'
    & $pythonExecutable -m pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) { throw 'Installing Python dependencies failed.' }
    & $pythonExecutable -m pip install pyinstaller
    if ($LASTEXITCODE -ne 0) { throw 'Installing PyInstaller failed.' }
    & $pythonExecutable -m PyInstaller --noconfirm --clean ai-job-search.spec
    if ($LASTEXITCODE -ne 0) { throw 'PyInstaller failed to create the executable.' }
}
finally {
    Pop-Location
}

Write-Host "Built executable: $(Join-Path $backendDirectory 'dist\IntelligentJobSearchTool.exe')"
