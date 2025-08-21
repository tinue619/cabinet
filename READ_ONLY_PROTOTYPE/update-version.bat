@echo off
echo Обновление версий файлов для предотвращения кеширования...

REM Генерируем новую версию на основе текущего времени
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "version=%dt:~0,14%"

echo Новая версия: %version%

REM Обновляем версии в index.html
powershell -Command "(gc index.html) -replace 'v=\d+', 'v=%version%' | Out-File -encoding UTF8 index.html"

echo Версии обновлены!
echo Теперь можно загружать на хостинг.
pause
