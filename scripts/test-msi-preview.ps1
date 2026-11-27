param(
    [switch]$Install,
    [ValidatePattern('^\d+\.\d+\.\d+$')]
    [string]$Version
)
$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not $Version) { $Version = (Get-Content -LiteralPath (Join-Path $repo 'apps/mecraft-launcher/package.json') -Raw | ConvertFrom-Json).version }
$version = $Version
$msi = Join-Path $repo "apps/mecraft-launcher/src-tauri/target/release/bundle/msi/meCraft MSI Preview_$($version)_x64_en-US.msi"
if (-not (Test-Path -LiteralPath $msi)) { throw 'Build the isolated MSI Preview first.' }
$installer = New-Object -ComObject WindowsInstaller.Installer
$database = $installer.OpenDatabase($msi, 0)
$view = $database.OpenView('SELECT * FROM Property')
$view.Execute()
$properties = @{}
while ($record = $view.Fetch()) { $properties[$record.StringData(1)] = $record.StringData(2) }
$view.Close()
if ($properties.ProductName -ne 'meCraft MSI Preview' -or $properties.UpgradeCode -ne '{574CD39E-3CA0-438F-A42A-04979D3A3C5A}') {
    throw 'Package identity is not the isolated MSI Preview.'
}
$baselines = @()
foreach ($name in @('meCraft', 'meCraft Preview')) {
    $key = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$name"
    if (Test-Path -LiteralPath $key) {
        $entry = Get-ItemProperty -LiteralPath $key
        $exe = Join-Path ($entry.InstallLocation.Trim('"')) 'mecraft-launcher.exe'
        $baselines += @{ Name=$name; Registry=$key; Version=$entry.DisplayVersion; Path=$exe; Hash=(Get-FileHash -LiteralPath $exe -Algorithm SHA256).Hash }
    }
}
Write-Output "MSI identity verified: $($properties.ProductName) $($properties.ProductVersion)"
if (-not $Install) { Write-Output 'Read-only audit complete. Use -Install to run the isolated installation test.'; exit 0 }
$testDir = Join-Path $env:LOCALAPPDATA 'meCraft-dev\msi-preview-test'
New-Item -ItemType Directory -Path $testDir -Force | Out-Null
$baselines | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $testDir 'baseline.json') -Encoding UTF8
$log = Join-Path $testDir 'install.log'
$engine = Join-Path $env:SystemRoot 'System32\msiexec.exe'
$process = Start-Process -FilePath $engine -ArgumentList '/i', ('"'+$msi+'"'), '/passive', '/norestart', '/L*v', ('"'+$log+'"') -Verb RunAs -Wait -PassThru
if ($process.ExitCode -notin @(0,3010)) { throw "MSI install failed: $($process.ExitCode). Log: $log" }
$installed = Get-ItemProperty -LiteralPath 'HKLM:\Software\meCraft\meCraft MSI Preview'
$target = Join-Path $installed.InstallLocation 'mecraft-launcher.exe'
if ((Get-Item -LiteralPath $target).VersionInfo.ProductVersion -ne $version) { throw 'Installed Preview version does not match the package.' }
foreach ($baseline in $baselines) {
    $entry = Get-ItemProperty -LiteralPath $baseline.Registry
    if ($entry.DisplayVersion -ne $baseline.Version -or (Get-FileHash -LiteralPath $baseline.Path -Algorithm SHA256).Hash -ne $baseline.Hash) {
        throw "The existing $($baseline.Name) installation changed unexpectedly."
    }
}
Write-Output "PASS: MSI Preview $version installed; existing Launcher versions and executable hashes preserved."
Write-Output "Installed executable: $target"
Write-Output "Installer log: $log"
if ($process.ExitCode -eq 3010) { Write-Output 'Windows Installer requested a restart; restart before testing updates.' }
