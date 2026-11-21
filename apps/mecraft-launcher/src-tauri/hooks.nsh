!macro NSIS_HOOK_POSTINSTALL
  ; Automatically launch meCraft Launcher upon installation finish
  Exec '"$INSTDIR\mecraft-launcher.exe"'
!macroend
