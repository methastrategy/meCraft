param(
    [Parameter(Mandatory = $true)]
    [string] $InstallerUrl,
    [Parameter(Mandatory = $true)]
    [string] $ManifestOutput,
    [ValidateSet('stable', 'preview')]
    [string] $Channel = 'stable'
)

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$launcher = Join-Path $repo 'apps/mecraft-launcher'
$certificateThumbprint = $env:MECRAFT_SIGNING_THUMBPRINT
$timestampUrl = $env:MECRAFT_SIGNING_TIMESTAMP_URL
if ($certificateThumbprint -notmatch '^[0-9A-Fa-f]{40}$') {
    throw 'MECRAFT_SIGNING_THUMBPRINT must identify the Windows code-signing certificate.'
}
$timestamp = $null
if (-not [Uri]::TryCreate($timestampUrl, [UriKind]::Absolute, [ref]$timestamp) -or $timestamp.Scheme -ne 'https') {
    throw 'MECRAFT_SIGNING_TIMESTAMP_URL must be an HTTPS timestamp server.'
}
if (-not $env:TAURI_SIGNING_PRIVATE_KEY -and -not $env:TAURI_SIGNING_PRIVATE_KEY_PATH) {
    throw 'Configure the Tauri updater signing key in the environment.'
}
$certificate = Get-Item -LiteralPath "Cert:/CurrentUser/My/$certificateThumbprint" -ErrorAction Stop
if (-not $certificate.HasPrivateKey -or $certificate.NotAfter -le (Get-Date)) {
    throw 'The Windows code-signing certificate must be current and have its private key.'
}

$configPath = Join-Path $env:TEMP ("mecraft-signed-build-" + [guid]::NewGuid().ToString('N') + '.json')
$originalSigningKey = $env:TAURI_SIGNING_PRIVATE_KEY
$originalTestManifest = $env:MECRAFT_TEST_MANIFEST
$originalTestInstaller = $env:MECRAFT_TEST_INSTALLER
$config = @{
    bundle = @{
        createUpdaterArtifacts = $true
        windows = @{
            certificateThumbprint = $certificateThumbprint
            digestAlgorithm = 'sha256'
            timestampUrl = $timestampUrl
        }
    }
} | ConvertTo-Json -Depth 5
try {
    # The Tauri build command reads key contents, not the signer CLI's path variable.
    if (-not $env:TAURI_SIGNING_PRIVATE_KEY -and $env:TAURI_SIGNING_PRIVATE_KEY_PATH) {
        $env:TAURI_SIGNING_PRIVATE_KEY = [IO.File]::ReadAllText($env:TAURI_SIGNING_PRIVATE_KEY_PATH).Trim()
        if (-not $env:TAURI_SIGNING_PRIVATE_KEY) { throw 'The updater signing key file is empty.' }
    }
    [IO.File]::WriteAllText($configPath, $config)
    Push-Location $repo
    try {
        npm run desktop:build --workspace=@mecraft/launcher -- --bundles msi --config $configPath
        if ($LASTEXITCODE -ne 0) { throw 'Signed Launcher build failed.' }
        $version = (Get-Content -Raw -LiteralPath (Join-Path $launcher 'package.json') | ConvertFrom-Json).version
        $installer = Join-Path $launcher "src-tauri/target/release/bundle/msi/meCraft_$($version)_x64_en-US.msi"
        $signature = Get-AuthenticodeSignature -LiteralPath $installer
        if ($signature.Status -ne 'Valid' -or $signature.SignerCertificate.Thumbprint -ne $certificateThumbprint) {
            throw 'Installer Authenticode signature or publisher did not match the configured certificate.'
        }
        node scripts/create-launcher-update-manifest.mjs $installer "$installer.sig" $InstallerUrl $ManifestOutput $Channel
        if ($LASTEXITCODE -ne 0) { throw 'Signed update manifest creation failed.' }
        $env:MECRAFT_TEST_MANIFEST = (Resolve-Path -LiteralPath $ManifestOutput).Path
        $env:MECRAFT_TEST_INSTALLER = $installer
        cargo test --locked --manifest-path apps/mecraft-launcher/src-tauri/Cargo.toml --lib launcher_update::tests::downloads_and_verifies_signed_release_over_http -- --ignored
        if ($LASTEXITCODE -ne 0) { throw 'Signed release download verification failed.' }
    } finally {
        Pop-Location
    }
} finally {
    $env:TAURI_SIGNING_PRIVATE_KEY = $originalSigningKey
    $env:MECRAFT_TEST_MANIFEST = $originalTestManifest
    $env:MECRAFT_TEST_INSTALLER = $originalTestInstaller
    Remove-Item -LiteralPath $configPath -Force -ErrorAction SilentlyContinue
}
