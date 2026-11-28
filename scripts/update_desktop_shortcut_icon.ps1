$WshShell = New-Object -ComObject WScript.Shell
$repoRoot = Split-Path -Parent $PSScriptRoot
$iconPath = Join-Path $repoRoot 'apps\mecraft-launcher\src-tauri\icons\icon.ico'
$lnkPath = "C:\Users\Public\Desktop\meCraft.lnk"
if (Test-Path $lnkPath) {
    $Shortcut = $WshShell.CreateShortcut($lnkPath)
    $Shortcut.IconLocation = "$iconPath,0"
    $Shortcut.Save()
    Write-Output "Successfully updated Public Desktop shortcut icon location!"
}

$userLnk = [System.IO.Path]::Combine([System.Environment]::GetFolderPath("Desktop"), "meCraft.lnk")
if (Test-Path $userLnk) {
    $Shortcut2 = $WshShell.CreateShortcut($userLnk)
    $Shortcut2.IconLocation = "$iconPath,0"
    $Shortcut2.Save()
    Write-Output "Successfully updated User Desktop shortcut icon location!"
}
