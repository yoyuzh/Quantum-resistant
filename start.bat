@echo off
setlocal
chcp 65001 >nul
title 抗量子迁移风险扫描平台

echo 正在启动，请保持此窗口打开。
echo 启动后请在浏览器打开下方 Open 后的地址；按 Ctrl+C 停止服务。
echo.
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start.ps1" %*
set "LaunchExitCode=%ERRORLEVEL%"
echo.
if not "%LaunchExitCode%"=="0" (
    echo 启动未成功，请查看上方错误信息。
    echo 如果缺少 Python 依赖，请使用启动所用的 Python 安装 requirements.txt 中的依赖。
    echo 首次安装步骤见 README.md 的“安装与运行”。
)
pause
exit /b %LaunchExitCode%
