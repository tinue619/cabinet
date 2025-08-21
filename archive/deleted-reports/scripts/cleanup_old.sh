#!/bin/bash
# Скрипт очистки ядра new_core от UI кода

echo "🧹 Начинаем очистку ядра new_core..."

# 1. Создаем папку для архивации UI кода
echo "📦 Создаем архив для UI кода..."
mkdir -p ../new_core_ui_backup

# 2. Перемещаем всю папку web в архив
echo "📁 Перемещаем папку web/ в архив..."
mv web/ ../new_core_ui_backup/

# 3. Удаляем пустую папку demo
echo "🗑️ Удаляем пустую папку demo/..."
rmdir demo/

# 4. Перемещаем Renderer2D.js из systems (он относится к UI)
echo "📁 Перемещаем Renderer2D.js в архив..."
mv systems/Renderer2D.js ../new_core_ui_backup/

# 5. Удаляем пустой файл
echo "🗑️ Удаляем пустой файл 'ПРОЧТИ МЕНЯ ПЕРВЫМ.md'..."
rm "ПРОЧТИ МЕНЯ ПЕРВЫМ.md"

# 6. Проверяем, остались ли файлы в systems/
if [ -z "$(ls -A systems/)" ]; then
    echo "🗑️ Удаляем пустую папку systems/..."
    rmdir systems/
fi

echo "✅ Очистка завершена!"
echo ""
echo "📊 Текущая структура ядра:"
tree -I 'node_modules|.git' -L 2

echo ""
echo "💡 UI код сохранен в ../new_core_ui_backup/"
echo "💡 Используйте cabinet-app/ для работы с UI"