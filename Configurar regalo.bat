@echo off
where py >nul 2>nul
if %errorlevel% equ 0 (
    py -3 "%~dp0configurar.py"
) else (
    python "%~dp0configurar.py"
)
if errorlevel 1 (
    echo Necesitas Python 3 con Tkinter para abrir el editor local.
    pause
)
