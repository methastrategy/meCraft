$ErrorActionPreference = 'Stop'
$testDir = Join-Path $env:TEMP ("mecraft-worker-test-" + [guid]::NewGuid().ToString('N'))
$registry = 'HKCU:/Software/meCraftWorkerTest-' + [guid]::NewGuid().ToString('N')
New-Item -ItemType Directory -Path $testDir | Out-Null
New-Item -Path $registry | Out-Null
try {
    $target = Join-Path $testDir 'mecraft-launcher.exe'
    $old = Join-Path $testDir 'old.exe'
    $new = Join-Path $testDir 'new.exe'
    $installer = Join-Path $testDir 'installer.exe'
    $marker = Join-Path $testDir 'started.txt'
    $oldSource = @(
        'using System; using System.IO; using System.Reflection; using System.Threading;'
        '[assembly: AssemblyFileVersion("1.0.7.0")] [assembly: AssemblyInformationalVersion("1.0.7")]'
        'public static class OldApp { public static void Main() { File.AppendAllText(Environment.GetEnvironmentVariable("MECRAFT_TEST_STARTED"), "old"); int delay; if (int.TryParse(Environment.GetEnvironmentVariable("MECRAFT_TEST_HOLD_MS"), out delay)) Thread.Sleep(delay); } }'
    ) -join [Environment]::NewLine
    $newSource = @(
        'using System; using System.IO; using System.Reflection;'
        '[assembly: AssemblyFileVersion("1.0.8.0")] [assembly: AssemblyInformationalVersion("1.0.8")]'
        'public static class NewApp { public static void Main() { File.AppendAllText(Environment.GetEnvironmentVariable("MECRAFT_TEST_STARTED"), "new"); } }'
    ) -join [Environment]::NewLine
    $installerSource = @(
        'using System; using System.IO; using System.Threading;'
        'public static class TestInstaller { public static int Main() {'
        'File.Copy(Environment.GetEnvironmentVariable("MECRAFT_TEST_NEW_EXE"), Environment.GetEnvironmentVariable("MECRAFT_UPDATE_TARGET"), true);'
        'int delay; if (int.TryParse(Environment.GetEnvironmentVariable("MECRAFT_TEST_INSTALLER_DELAY"), out delay)) Thread.Sleep(delay);'
        'return int.Parse(Environment.GetEnvironmentVariable("MECRAFT_TEST_EXIT_CODE")); } }'
    ) -join [Environment]::NewLine
    Add-Type -TypeDefinition $oldSource -OutputAssembly $old -OutputType WindowsApplication
    Add-Type -TypeDefinition $newSource -OutputAssembly $new -OutputType WindowsApplication
    Add-Type -TypeDefinition $installerSource -OutputAssembly $installer -OutputType WindowsApplication
    # MSI INSTALLDIR properties retain their final separator.
    Set-ItemProperty -LiteralPath $registry -Name InstallLocation -Value ($testDir + '\')
    $env:MECRAFT_UPDATE_TARGET = $target
    $env:MECRAFT_UPDATE_INSTALLER = $installer
    $env:MECRAFT_UPDATE_SHA256 = (Get-FileHash -LiteralPath $installer).Hash
    $env:MECRAFT_UPDATE_VERSION = '1.0.8'
    $env:MECRAFT_UPDATE_PARENT = '0'
    $env:MECRAFT_UPDATE_BOOT_UPTIME = '123456'
    $env:MECRAFT_UPDATE_REGISTRY = $registry
    $env:MECRAFT_UPDATE_RESULT = Join-Path $testDir 'result.txt'
    $env:MECRAFT_UPDATE_LOCK = Join-Path $testDir 'update.lock'
    $env:MECRAFT_UPDATE_RECOVERY_SHORTCUT = Join-Path $testDir 'meCraft Recovery.lnk'
    $env:MECRAFT_TEST_STARTED = $marker
    $env:MECRAFT_TEST_NEW_EXE = $new
    $worker = Join-Path $PSScriptRoot '../src/update_worker.ps1'
    $powershell = Join-Path $env:SystemRoot 'System32/WindowsPowerShell/v1.0/powershell.exe'
    $env:PSModulePath = Join-Path $env:SystemRoot 'System32/WindowsPowerShell/v1.0/Modules'

    [IO.File]::Copy($old, $target, $true)
    $env:MECRAFT_TEST_EXIT_CODE = '0'
    $env:MECRAFT_UPDATE_BACKUP = Join-Path $testDir 'lock-backup.exe'
    $heldLock = [IO.File]::Open($env:MECRAFT_UPDATE_LOCK, [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
    try {
        $waitingWorker = Start-Process -FilePath $powershell -ArgumentList '-NoProfile', '-NonInteractive', '-File', $worker -PassThru -WindowStyle Hidden
        Start-Sleep -Milliseconds 700
        $waitingWorker.Refresh()
        if ($waitingWorker.HasExited -or (Get-FileHash $target).Hash -ne (Get-FileHash $old).Hash) {
            throw 'The worker did not wait for the update lock'
        }
    } finally {
        $heldLock.Dispose()
    }
    if (-not $waitingWorker.WaitForExit(20000) -or $waitingWorker.ExitCode -ne 0) {
        throw 'The worker did not resume after the update lock was released'
    }
    for ($attempt = 0; $attempt -lt 30 -and -not (Test-Path -LiteralPath $marker); $attempt++) {
        Start-Sleep -Milliseconds 100
    }
    if (-not (Test-Path -LiteralPath $marker) -or [IO.File]::ReadAllText($marker) -ne 'new') {
        throw 'The worker did not start the new Launcher after the lock was released'
    }

    Get-Process -Name 'mecraft-launcher' -ErrorAction SilentlyContinue | Where-Object { $_.Path -ieq $target } | ForEach-Object {
        if (-not $_.WaitForExit(5000)) { throw 'The test Launcher did not exit' }
    }
    foreach ($requestedVersion in @('1.0.8', '1.0.7')) {
        Remove-Item -LiteralPath $marker
        $env:MECRAFT_TEST_EXIT_CODE = '5'
        $env:MECRAFT_UPDATE_VERSION = $requestedVersion
        $env:MECRAFT_UPDATE_BACKUP = Join-Path $testDir 'already-current-backup.exe'
        $process = Start-Process -FilePath $powershell -ArgumentList '-NoProfile', '-NonInteractive', '-File', $worker -Wait -PassThru -WindowStyle Hidden
        for ($attempt = 0; $attempt -lt 30 -and -not (Test-Path -LiteralPath $marker); $attempt++) {
            Start-Sleep -Milliseconds 100
        }
        if ($process.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $marker) -or
            [IO.File]::ReadAllText($marker) -ne 'new' -or (Test-Path -LiteralPath $env:MECRAFT_UPDATE_BACKUP)) {
            throw "Already-current Launcher was not reopened for requested version $requestedVersion"
        }
        Get-Process -Name 'mecraft-launcher' -ErrorAction SilentlyContinue | Where-Object { $_.Path -ieq $target } | ForEach-Object {
            if (-not $_.WaitForExit(5000)) { throw 'The test Launcher did not exit' }
        }
    }
    $env:MECRAFT_UPDATE_VERSION = '1.0.8'
    [IO.File]::Copy($old, $target, $true)
    if (Test-Path -LiteralPath $marker) { Remove-Item -LiteralPath $marker }
    $env:MECRAFT_TEST_HOLD_MS = '5000'
    $env:MECRAFT_UPDATE_BACKUP = Join-Path $testDir 'already-running-backup.exe'
    $runningApp = Start-Process -FilePath $target -PassThru -WindowStyle Hidden
    try {
        for ($attempt = 0; $attempt -lt 30 -and -not (Test-Path -LiteralPath $marker); $attempt++) {
            Start-Sleep -Milliseconds 100
        }
        $process = Start-Process -FilePath $powershell -ArgumentList '-NoProfile', '-NonInteractive', '-File', $worker -Wait -PassThru -WindowStyle Hidden
        $runningApp.Refresh()
        if ($process.ExitCode -ne 1 -or $runningApp.HasExited -or (Test-Path -LiteralPath $env:MECRAFT_UPDATE_BACKUP)) {
            throw 'The worker interfered with an already-running Launcher'
        }
        if ([IO.File]::ReadAllText($marker) -ne 'old') { throw 'The worker started an extra Launcher' }
    } finally {
        if (-not $runningApp.HasExited) { Stop-Process -Id $runningApp.Id }
        Remove-Item Env:MECRAFT_TEST_HOLD_MS -ErrorAction SilentlyContinue
    }

    foreach ($case in @(
        @{ Name = 'success'; InstallerExit = '0'; WorkerExit = 0; Expected = $new; Version = '1.0.8'; Started = 'new' },
        @{ Name = 'rollback'; InstallerExit = '5'; WorkerExit = 1; Expected = $old; Version = '1.0.8'; Started = 'old' },
        @{ Name = 'wrong-version'; InstallerExit = '0'; WorkerExit = 1; Expected = $old; Version = '1.0.9'; Started = 'old' }
    )) {
        Get-Process -Name 'mecraft-launcher' -ErrorAction SilentlyContinue | Where-Object { $_.Path -ieq $target } | ForEach-Object {
            if (-not $_.WaitForExit(5000)) { throw 'The test Launcher did not exit' }
        }
        [IO.File]::Copy($old, $target, $true)
        if (Test-Path -LiteralPath $marker) { Remove-Item -LiteralPath $marker }
        $env:MECRAFT_TEST_EXIT_CODE = $case.InstallerExit
        $env:MECRAFT_UPDATE_VERSION = $case.Version
        $env:MECRAFT_UPDATE_BACKUP = Join-Path $testDir ($case.Name + '-backup.exe')
        $process = Start-Process -FilePath $powershell -ArgumentList '-NoProfile', '-NonInteractive', '-File', $worker -Wait -PassThru -WindowStyle Hidden
        if ($process.ExitCode -ne $case.WorkerExit) { throw "$($case.Name) worker returned $($process.ExitCode)" }
        if ((Get-FileHash -LiteralPath $target).Hash -ne (Get-FileHash -LiteralPath $case.Expected).Hash) {
            throw "$($case.Name) left the wrong Launcher executable"
        }
        if ((Get-FileHash -LiteralPath $env:MECRAFT_UPDATE_BACKUP).Hash -ne (Get-FileHash -LiteralPath $old).Hash) {
            throw "$($case.Name) did not preserve the previous executable"
        }
        if ($case.WorkerExit -eq 1 -and [IO.File]::ReadAllText($env:MECRAFT_UPDATE_RESULT) -ne 'restored') {
            throw 'Rollback did not report that the previous version was restored'
        }
        if (Test-Path -LiteralPath $env:MECRAFT_UPDATE_RECOVERY_SHORTCUT) {
            throw "$($case.Name) left an unnecessary recovery shortcut"
        }
        for ($attempt = 0; $attempt -lt 30 -and -not (Test-Path -LiteralPath $marker); $attempt++) {
            Start-Sleep -Milliseconds 100
        }
        if (-not (Test-Path -LiteralPath $marker) -or [IO.File]::ReadAllText($marker) -ne $case.Started) {
            throw "$($case.Name) did not start the expected Launcher"
        }
    }
    Get-Process -Name 'mecraft-launcher' -ErrorAction SilentlyContinue | Where-Object { $_.Path -ieq $target } | ForEach-Object {
        if (-not $_.WaitForExit(5000)) { throw 'The test Launcher did not exit' }
    }
    $savedTemp = $env:TEMP
    $savedTmp = $env:TMP
    try {
        $env:TEMP = $testDir
        $env:TMP = $testDir
        $staging = Join-Path $testDir ('mecraft-update-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $staging | Out-Null
        $stagedInstaller = Join-Path $staging 'installer.exe'
        [IO.File]::Copy($installer, $stagedInstaller)
        [IO.File]::Copy($old, $target, $true)
        $env:MECRAFT_UPDATE_INSTALLER = $stagedInstaller
        $env:MECRAFT_UPDATE_BACKUP = Join-Path $testDir 'cleanup-backup.exe'
        $env:MECRAFT_TEST_EXIT_CODE = '0'
        $env:MECRAFT_UPDATE_VERSION = '1.0.8'
        $process = Start-Process -FilePath $powershell -ArgumentList '-NoProfile', '-NonInteractive', '-File', $worker -Wait -PassThru -WindowStyle Hidden
        if ($process.ExitCode -ne 0 -or (Test-Path -LiteralPath $staging)) {
            throw 'Successful update did not clean its staged installer'
        }
        if (-not (Test-Path -LiteralPath $env:MECRAFT_UPDATE_BACKUP)) {
            throw 'Installer cleanup removed the recovery copy'
        }
    } finally {
        $env:TEMP = $savedTemp
        $env:TMP = $savedTmp
        $env:MECRAFT_UPDATE_INSTALLER = $installer
    }
    Get-Process -Name 'mecraft-launcher' -ErrorAction SilentlyContinue | Where-Object { $_.Path -ieq $target } | ForEach-Object {
        if (-not $_.WaitForExit(5000)) { throw 'The test Launcher did not exit' }
    }
    [IO.File]::Copy($old, $target, $true)
    if (Test-Path -LiteralPath $env:MECRAFT_UPDATE_RESULT) { Remove-Item -LiteralPath $env:MECRAFT_UPDATE_RESULT }
    if (Test-Path -LiteralPath $marker) { Remove-Item -LiteralPath $marker }
    $env:MECRAFT_TEST_INSTALLER_DELAY = '2500'
    $env:MECRAFT_TEST_EXIT_CODE = '0'
    $env:MECRAFT_UPDATE_VERSION = '1.0.8'
    $env:MECRAFT_UPDATE_BACKUP = Join-Path $testDir 'interrupted-backup.exe'
    $interrupted = Start-Process -FilePath $powershell -ArgumentList '-NoProfile', '-NonInteractive', '-File', $worker -PassThru -WindowStyle Hidden
    try {
        for ($attempt = 0; $attempt -lt 100 -and -not (Test-Path -LiteralPath $env:MECRAFT_UPDATE_RESULT); $attempt++) {
            Start-Sleep -Milliseconds 100
        }
        if (-not (Test-Path -LiteralPath $env:MECRAFT_UPDATE_RESULT)) { throw 'Update journal was not written' }
        if (-not [IO.File]::ReadAllText($env:MECRAFT_UPDATE_RESULT).StartsWith("in_progress`n")) {
            throw 'Update journal did not record the in-progress state'
        }
        $activeInstaller = $null
        for ($attempt = 0; $attempt -lt 50 -and $null -eq $activeInstaller; $attempt++) {
            $activeInstaller = Get-Process -Name 'installer' -ErrorAction SilentlyContinue | Where-Object { $_.Path -ieq $installer } | Select-Object -First 1
            if ($null -eq $activeInstaller) { Start-Sleep -Milliseconds 50 }
        }
        if ($null -eq $activeInstaller) { throw 'The test installer did not start' }
        Stop-Process -Id $interrupted.Id
        [void]$interrupted.WaitForExit(5000)
        if (-not $activeInstaller.WaitForExit(10000)) { throw 'The test installer did not exit' }
        if ((Get-FileHash -LiteralPath $env:MECRAFT_UPDATE_BACKUP).Hash -ne (Get-FileHash -LiteralPath $old).Hash) {
            throw 'Interrupted update did not retain the previous version'
        }
        if (-not [IO.File]::ReadAllText($env:MECRAFT_UPDATE_RESULT).Contains($env:MECRAFT_UPDATE_BACKUP)) {
            throw 'Interrupted update did not retain the recovery path'
        }
        if (-not [IO.File]::ReadAllText($env:MECRAFT_UPDATE_RESULT).Contains('123456')) {
            throw 'Interrupted update did not record the uptime needed for recovery'
        }
        $shell = New-Object -ComObject WScript.Shell
        $shortcut = $shell.CreateShortcut($env:MECRAFT_UPDATE_RECOVERY_SHORTCUT)
        if (-not (Test-Path -LiteralPath $env:MECRAFT_UPDATE_RECOVERY_SHORTCUT) -or $shortcut.TargetPath -ine $env:MECRAFT_UPDATE_BACKUP) {
            throw 'Interrupted update did not preserve a usable recovery shortcut'
        }
        Start-Process -FilePath $env:MECRAFT_UPDATE_RECOVERY_SHORTCUT
        for ($attempt = 0; $attempt -lt 30 -and -not (Test-Path -LiteralPath $marker); $attempt++) {
            Start-Sleep -Milliseconds 100
        }
        if (-not (Test-Path -LiteralPath $marker) -or [IO.File]::ReadAllText($marker) -ne 'old') {
            throw 'Recovery shortcut did not open the previous Launcher'
        }
    } finally {
        if (-not $interrupted.HasExited) { Stop-Process -Id $interrupted.Id }
        Remove-Item Env:MECRAFT_TEST_INSTALLER_DELAY -ErrorAction SilentlyContinue
    }
    'Update worker success and rollback checks passed.'
} finally {
    Remove-Item -LiteralPath $registry -ErrorAction SilentlyContinue
}
