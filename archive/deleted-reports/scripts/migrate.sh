#!/bin/bash

# Скрипт для копирования Cabinet Designer в новую папку

echo "======================================"
echo " Cabinet Designer - Migration Script"
echo "======================================"
echo

# Запрашиваем путь назначения
read -p "Введите путь для копирования (например, ~/Projects/Cabinet): " DEST_PATH

# Раскрываем тильду если есть
DEST_PATH="${DEST_PATH/#\~/$HOME}"

# Проверяем, существует ли папка
if [ -d "$DEST_PATH" ]; then
    echo
    echo "[!] Папка $DEST_PATH уже существует!"
    read -p "Продолжить? (y/n): " CONFIRM
    if [ "$CONFIRM" != "y" ]; then
        echo "Отменено."
        exit 1
    fi
fi

echo
echo "[*] Создаем структуру папок..."
mkdir -p "$DEST_PATH"

echo "[*] Копируем ядро (new_core)..."
cp -r new_core "$DEST_PATH/"

echo "[*] Копируем приложение (cabinet-app)..."
cp -r cabinet-app "$DEST_PATH/"

echo "[*] Копируем тесты и документацию..."
cp test-portability.html "$DEST_PATH/"
cp MIGRATION_GUIDE.md "$DEST_PATH/"
cp PROJECT_STRUCTURE_REPORT.md "$DEST_PATH/"

echo
echo "======================================"
echo " ✅ Копирование завершено!"
echo "======================================"
echo
echo "Структура скопирована в: $DEST_PATH"
echo
echo "Следующие шаги:"
echo "1. Перейдите в папку: cd '$DEST_PATH'"
echo "2. Откройте test-portability.html для проверки"
echo "3. Откройте cabinet-app/index.html для запуска"
echo
echo "Если приложение не работает:"
echo "- Проверьте путь в cabinet-app/src/config.js"
echo "- Прочитайте MIGRATION_GUIDE.md"
echo

# Делаем скрипт исполняемым
chmod +x "$0" 2>/dev/null