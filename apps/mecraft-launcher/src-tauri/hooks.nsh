!macro NSIS_HOOK_POSTINSTALL
  ; Create Desktop Shortcut for meCraft Hub
  CreateShortCut "$DESKTOP\meCraft.lnk" "$INSTDIR\mecraft-launcher.exe" "" "$INSTDIR\mecraft-launcher.exe" 0
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  ; Clean up Desktop Shortcut upon uninstall
  Delete "$DESKTOP\meCraft.lnk"
!macroend
