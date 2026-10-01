@echo off
chcp 65001 > nul
echo ===================================================================
echo 🚀 Subiendo Poke_Movil a GitHub: poke_movil_escalamiento
echo ===================================================================
echo.

set "GIT_PATH=C:\Program Files\Microsoft Visual Studio\18\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd"
set "PATH=%GIT_PATH%;%PATH%"

echo 1. Verificando estado del repositorio...
git status -s

echo.
echo 2. Subiendo rama main al repositorio remoto:
echo    https://github.com/Ingsamuel07/poke_movil_escalamiento.git
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===================================================================
    echo ✅ Proyecto subido exitosamente a GitHub!
    echo ===================================================================
) else (
    echo.
    echo ===================================================================
    echo ⚠️ Si GitHub te pide credenciales, inicia sesión en la ventana
    echo emergente que aparece en tu pantalla.
    echo ===================================================================
)

echo.
pause
