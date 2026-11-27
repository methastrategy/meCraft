param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^\d+\.\d+\.\d+$')]
    [string]$Version
)

$ErrorActionPreference = 'Stop'
$repository = Split-Path -Parent $PSScriptRoot
$keyPath = Join-Path $env:LOCALAPPDATA 'meCraft-dev\signing\launcher-preview.key'
if (-not (Test-Path -LiteralPath $keyPath -PathType Leaf)) {
    throw "Private Preview updater key was not found at $keyPath"
}

$passwordPointer = [IntPtr]::Zero
try {
    $passwordPath = Join-Path $env:LOCALAPPDATA 'meCraft-dev\signing\launcher-preview.password'
    if (Test-Path -LiteralPath $passwordPath -PathType Leaf) {
        $env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = [IO.File]::ReadAllText($passwordPath).TrimEnd()
    } else {
        $securePassword = Read-Host 'Preview updater key password (input hidden)' -AsSecureString
        $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
        $env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
    }
    $env:TAURI_SIGNING_PRIVATE_KEY_PATH = $keyPath
    & node (Join-Path $PSScriptRoot 'create-private-msi-preview.mjs') $Version
    if ($LASTEXITCODE -ne 0) { throw "Private MSI Preview signing failed with exit code $LASTEXITCODE" }
} finally {
    Remove-Item Env:\TAURI_SIGNING_PRIVATE_KEY_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:\TAURI_SIGNING_PRIVATE_KEY_PATH -ErrorAction SilentlyContinue
    if ($passwordPointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
    }
}
