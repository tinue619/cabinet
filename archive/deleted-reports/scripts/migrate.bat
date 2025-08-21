@echo off
REM Скрипт для копирования Cabinet Designer в новую папку

echo ======================================
echo  Cabinet Designer - Migration Script
echo ======================================
echo.

REM Запрашиваем путь назначения
set /p DEST_PATH="Введите путь для копирования (например, D:\MyProjects\Cabinet): "

REM Проверяем, существует ли папка
if exist "%DEST_PATH%" (
    echo.
    echo [!] Папка %DEST_PATH% уже существует!
    set /p CONFIRM="Продолжить? (y/n): "
    if /i not "%CONFIRM%"=="y" (
        echo Отменено.
        pause
        exit /b
    )
)

echo.
echo [*] Создаем структуру папок...
mkdir "%DEST_PATH%" 2>nul
mkdir "%DEST_PATH%\new_core" 2>nul
mkdir "%DEST_PATH%\cabinet-app" 2>nul

echo [*] Копируем ядро (new_core)...
xcopy /E /I /Y "new_core" "%DEST_PATH%\new_core" >nul

echo [*] Копируем приложение (cabinet-app)...
xcopy /E /I /Y "cabinet-app" "%DEST_PATH%\cabinet-app" >nul

echo [*] Копируем тесты и документацию...
copy "test-portability.html" "%DEST_PATH%\" >nul
copy "MIGRATION_GUIDE.md" "%DEST_PATH%\" >nul
copy "PROJECT_STRUCTURE_REPORT.md" "%DEST_PATH%\" >nul

echo.
echo ======================================
echo  ✅ Копирование завершено!
echo ======================================
echo.
echo Структура скопирована в: %DEST_PATH%
echo.
echo Следующие шаги:
echo 1. Перейдите в папку: cd "%DEST_PATH%"
echo 2. Откройте test-portability.html для проверки
echo 3. Откройте cabinet-app\index.html для запуска
echo.
echo Если приложение не работает:
echo - Проверьте путь в cabinet-app\src\config.js
echo - Прочитайте MIGRATION_GUIDE.md
echo.

pause