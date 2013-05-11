@ECHO OFF

REM make sure we don't stomp variables in calling script
SETLOCAL

REM the location of this batch file
SET SOURCE="%~dp0"

REM target location
SET TARGET=%1

IF [%TARGET%]==[] GOTO FAIL

GOTO OK

:FAIL

ECHO Must supply target folder parameter, e.g.:
ECHO.
ECHO   deploy.bat ../deploy/lib/moonstone
ECHO.
GOTO :EOF

:OK

REM copy assets
XCOPY %SOURCE%images\*.* %TARGET%\images\ /Q /E 
XCOPY %SOURCE%fonts\* %TARGET%\fonts\ /Q /E 

ENDLOCAL
