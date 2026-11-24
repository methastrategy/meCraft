$WshShell = New-Object -ComObject WScript.Shell
$lnkPath = "C:\Users\Public\Desktop\meCraft.lnk"
if (Test-Path $lnkPath) {
    $Shortcut = $WshShell.CreateShortcut($lnkPath)
    $Shortcut.IconLocation = "D:\METHA\Projects\meCraft-Project\apps\mecraft-launcher\src-tauri\icons\icon.ico,0"
    $Shortcut.Save()
    Write-Output "Successfully updated Public Desktop shortcut icon location!"
}

$userLnk = [System.IO.Path]::Combine([System.Environment]::GetFolderPath("Desktop"), "meCraft.lnk")
if (Test-Path $userLnk) {
    $Shortcut2 = $WshShell.CreateShortcut($userLnk)
    $Shortcut2.IconLocation = "D:\METHA\Projects\meCraft-Project\apps\mecraft-launcher\src-tauri\icons\icon.ico,0"
    $Shortcut2.Save()
    Write-Output "Successfully updated User Desktop shortcut icon location!"
}
