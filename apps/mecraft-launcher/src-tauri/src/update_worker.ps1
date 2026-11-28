$ErrorActionPreference = 'Stop'
$target = $env:MECRAFT_UPDATE_TARGET
$installer = $env:MECRAFT_UPDATE_INSTALLER
$backup = $env:MECRAFT_UPDATE_BACKUP
$expectedHash = $env:MECRAFT_UPDATE_SHA256
$expectedVersion = $env:MECRAFT_UPDATE_VERSION
$registryPath = $env:MECRAFT_UPDATE_REGISTRY
$resultPath = $env:MECRAFT_UPDATE_RESULT
$recoveryShortcut = $env:MECRAFT_UPDATE_RECOVERY_SHORTCUT
$started = $false
$alreadyRunning = $false
$updateLock = $null

function Write-UpdateResult([string]$value) {
    $next = $resultPath + '.next'
    $previous = $resultPath + '.previous'
    $data = [Text.UTF8Encoding]::new($false).GetBytes($value)
    $stream = [IO.FileStream]::new($next, [IO.FileMode]::Create, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $stream.Write($data, 0, $data.Length)
        $stream.Flush($true)
    } finally {
        $stream.Dispose()
    }
    if ([IO.File]::Exists($resultPath)) {
        if ([IO.File]::Exists($previous)) { [IO.File]::Delete($previous) }
        [IO.File]::Replace($next, $resultPath, $previous)
        [IO.File]::Delete($previous)
    } else {
        [IO.File]::Move($next, $resultPath)
    }
}

function Remove-RecoveryShortcut {
    if (-not [IO.File]::Exists($recoveryShortcut)) { return }
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($recoveryShortcut)
    if ($shortcut.TargetPath -ieq $backup) {
        [IO.File]::Delete($recoveryShortcut)
    }
}

function Remove-StagedInstaller {
    $file = [IO.Path]::GetFullPath($installer)
    $directory = [IO.Path]::GetDirectoryName($file)
    $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\')
    if ([IO.Path]::GetFileName($file) -notin @('installer.exe', 'installer.msi') -or
        [IO.Path]::GetDirectoryName($directory) -ine $tempRoot -or
        -not [IO.Path]::GetFileName($directory).StartsWith('mecraft-update-', [StringComparison]::OrdinalIgnoreCase)) { return }
    $directoryInfo = Get-Item -LiteralPath $directory -Force
    if ($directoryInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) { return }
    if ([IO.File]::Exists($file)) {
        $fileInfo = Get-Item -LiteralPath $file -Force
        if ($fileInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) { return }
        if ((Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash -ine $expectedHash) { return }
        [IO.File]::Delete($file)
    }
    if (-not [IO.Directory]::EnumerateFileSystemEntries($directory).GetEnumerator().MoveNext()) {
        [IO.Directory]::Delete($directory)
    }
}

for ($attempt = 0; $attempt -lt 300; $attempt++) {
    try {
        $updateLock = [IO.File]::Open($env:MECRAFT_UPDATE_LOCK, [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
        break
    } catch [IO.IOException] {
        Start-Sleep -Milliseconds 100
    }
}
if ($null -eq $updateLock) {
    try { Remove-StagedInstaller } catch { }
    exit 3
}

try {
    $parentId = [int]$env:MECRAFT_UPDATE_PARENT
    if ($parentId -gt 0) {
        try { Wait-Process -Id $parentId -Timeout 30 -ErrorAction Stop } catch {
            if (Get-Process -Id $parentId -ErrorAction SilentlyContinue) {
                $alreadyRunning = $true
                throw 'Launcher did not exit.'
            }
        }
    }
    $registered = (Get-ItemProperty -LiteralPath $registryPath -ErrorAction Stop).InstallLocation
    if (-not $registered) { throw 'Registered installation location is missing.' }
    $registered = [IO.Path]::GetFullPath($registered.Trim('"')).TrimEnd('\', '/')
    $target = [IO.Path]::GetFullPath($target)
    if ([IO.Path]::GetFileName($target) -ine 'mecraft-launcher.exe' -or
        [IO.Path]::GetDirectoryName($target) -ine $registered) {
        throw 'The current Launcher is not the registered installation.'
    }
    if ((Get-FileHash -LiteralPath $installer -Algorithm SHA256).Hash -ine $expectedHash) {
        throw 'The staged installer was modified.'
    }
    if (-not (Test-Path -LiteralPath $target -PathType Leaf)) { throw 'Current Launcher is missing.' }
    $running = @(Get-Process -Name 'mecraft-launcher' -ErrorAction SilentlyContinue | Where-Object {
        try { $_.Path -ieq $target } catch { $false }
    })
    if ($running.Count -gt 0) {
        $alreadyRunning = $true
        throw 'Launcher was opened while the update was starting.'
    }
    $currentVersion = $null
    $updateVersion = $null
    if ([Version]::TryParse((Get-Item -LiteralPath $target).VersionInfo.ProductVersion, [ref]$currentVersion) -and
        [Version]::TryParse($expectedVersion, [ref]$updateVersion) -and $currentVersion -ge $updateVersion) {
        Start-Process -FilePath $target
        $updateLock.Dispose()
        try { Remove-StagedInstaller } catch { }
        exit 0
    }
    [IO.File]::Copy($target, $backup, $false)
    $backupHash = (Get-FileHash -LiteralPath $backup).Hash
    if ($backupHash -ne (Get-FileHash -LiteralPath $target).Hash) {
        throw 'Could not verify the recovery copy.'
    }
    if ([IO.File]::Exists($recoveryShortcut)) { throw 'Recovery shortcut already exists.' }
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($recoveryShortcut)
    $shortcut.TargetPath = $backup
    $shortcut.WorkingDirectory = [IO.Path]::GetDirectoryName($backup)
    $shortcut.Description = 'Open the previous meCraft version after an interrupted update.'
    $shortcut.Save()
    if (-not [IO.File]::Exists($recoveryShortcut)) { throw 'Could not create recovery shortcut.' }
    $started = $true
    Write-UpdateResult "in_progress`n$backup`n$backupHash`n$env:MECRAFT_UPDATE_BOOT_UPTIME"
    if ([IO.Path]::GetExtension($installer) -ieq '.msi') {
        $msiexec = Join-Path $env:SystemRoot 'System32\msiexec.exe'
        $log = Join-Path ([IO.Path]::GetDirectoryName($resultPath)) 'launcher-msi-update.log'
        $process = Start-Process -FilePath $msiexec -ArgumentList '/i', ('"' + $installer + '"'), '/qn', '/norestart', '/L*v', ('"' + $log + '"') -Verb RunAs -Wait -PassThru
        if ($process.ExitCode -notin @(0, 3010)) { throw "MSI returned exit code $($process.ExitCode). See $log" }
    } else {
        $process = Start-Process -FilePath $installer -ArgumentList '/S', '/UPDATE' -Wait -PassThru -WindowStyle Hidden
        if ($process.ExitCode -ne 0) { throw "Installer returned exit code $($process.ExitCode)." }
    }
    $installed = Get-Item -LiteralPath $target
    if ($installed.VersionInfo.ProductVersion -ne $expectedVersion) { throw 'Installed version does not match the update.' }
    Write-UpdateResult 'installed'
    Start-Process -FilePath $target
    $updateLock.Dispose()
    try { Remove-RecoveryShortcut } catch { }
    try { Remove-StagedInstaller } catch { }
} catch {
    $result = 'failed'
    $launchPath = $target
    if ($started) {
        try {
            # MSI may already have rolled back; do not require another write to Program Files.
            if (-not [IO.File]::Exists($target) -or
                (Get-FileHash -LiteralPath $backup).Hash -ne (Get-FileHash -LiteralPath $target).Hash) {
                [IO.File]::Copy($backup, $target, $true)
            }
            if ((Get-FileHash -LiteralPath $backup).Hash -ne (Get-FileHash -LiteralPath $target).Hash) {
                throw 'The restored Launcher does not match the recovery copy.'
            }
            $result = 'restored'
        } catch {
            $result = "recovery_required`n$backup`n$backupHash`n$env:MECRAFT_UPDATE_BOOT_UPTIME"
            $launchPath = $backup
        }
    }
    try { Write-UpdateResult $result } catch { exit 2 }
    if ($result -ne 'recovery_required') {
        try { Remove-RecoveryShortcut } catch { }
    }
    $updateLock.Dispose()
    if (-not $alreadyRunning -and (Test-Path -LiteralPath $launchPath -PathType Leaf)) {
        try { Start-Process -FilePath $launchPath } catch { }
    }
    try { Remove-StagedInstaller } catch { }
    exit 1
}
