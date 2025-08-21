# 📦 ИНСТРУКЦИЯ ПО ПЕРЕНОСУ ПРОЕКТА

## ✅ Что можно переносить

Проект состоит из двух независимых частей:

1. **new_core/** - архитектурное ядро (можно использовать отдельно)
2. **cabinet-app/** - UI приложение (требует ядро)

## 🚀 Варианты переноса

### Вариант 1: Перенос всей структуры (РЕКОМЕНДУЕТСЯ)

```bash
# Копируете обе папки вместе
your-project/
├── new_core/      # Ядро
└── cabinet-app/   # UI приложение
```

**Статус:** ✅ Будет работать без изменений

### Вариант 2: Раздельное размещение

```bash
# Ядро в одном месте
libs/cabinet-core/
└── new_core/

# Приложение в другом месте  
apps/cabinet-designer/
└── cabinet-app/
```

**Требует настройки:**

1. Откройте `cabinet-app/src/config.js`
2. Измените путь к ядру:
```javascript
// Было:
export const CORE_PATH = '../../new_core/index.js';

// Стало (пример):
export const CORE_PATH = '../../../libs/cabinet-core/new_core/index.js';
```

### Вариант 3: Только ядро (для создания своего UI)

```bash
# Копируете только ядро
your-project/
└── new_core/
```

Использование в вашем коде:
```javascript
import { SystemFactory } from './new_core/index.js';

const system = SystemFactory.create();
const cabinet = system.createCabinet({
    width: 800,
    height: 2000,
    depth: 600,
    baseHeight: 100
});
```

**Статус:** ✅ Ядро полностью автономно

### Вариант 4: NPM пакеты (продвинутый)

```bash
# Публикуете ядро как npm пакет
npm publish ./new_core --name @your-company/cabinet-core

# В приложении устанавливаете
npm install @your-company/cabinet-core
```

Настройка в `cabinet-app/src/config.js`:
```javascript
export const CORE_PATH = '@your-company/cabinet-core';
```

## 📋 Чек-лист переноса

### Для полного переноса (new_core + cabinet-app):

- [ ] Скопировать папку `new_core/`
- [ ] Скопировать папку `cabinet-app/`
- [ ] Проверить путь в `cabinet-app/src/config.js`
- [ ] Открыть `cabinet-app/index.html` в браузере
- [ ] Проверить работоспособность

### Для переноса только ядра:

- [ ] Скопировать папку `new_core/`
- [ ] Проверить наличие всех файлов
- [ ] Запустить тесты: открыть `new_core/demo/index.html`
- [ ] Интегрировать в свой проект

## 🔧 Возможные проблемы и решения

### Проблема 1: Ошибка импорта ядра

**Симптом:**
```
Failed to load module: ../../new_core/index.js
```

**Решение:**
1. Проверьте путь в `cabinet-app/src/config.js`
2. Убедитесь, что путь относительно файла `config.js`

### Проблема 2: CORS ошибки при открытии HTML

**Симптом:**
```
CORS policy: Cross origin requests are only supported for protocol schemes
```

**Решение:**
Используйте локальный сервер:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# VS Code
Используйте расширение Live Server
```

### Проблема 3: Пути к CSS/JS не работают

**Симптом:**
Стили не применяются, скрипты не загружаются

**Решение:**
Проверьте относительные пути в `index.html`:
```html
<!-- Должны быть относительными -->
<link rel="stylesheet" href="styles/main.css">
<script type="module" src="src/app.js"></script>
```

## 📁 Минимальная структура для работы

### Для UI приложения:
```
cabinet-project/
├── new_core/           # Обязательно
│   ├── index.js       # Точка входа
│   ├── cabinet-dna.js # ДНК системы
│   ├── core/          # Базовые классы
│   ├── entities/      # Сущности
│   └── устав.ini      # Онтология
└── cabinet-app/        # UI
    ├── index.html     # Главная страница
    ├── styles/        # Стили
    └── src/           # Исходный код
        ├── app.js     # Главный модуль
        ├── config.js  # НАСТРОЙТЕ ПУТЬ ЗДЕСЬ!
        └── ...        # Остальные модули
```

### Для использования только ядра:
```
your-project/
├── new_core/          # Только ядро
└── your-app.js        # Ваше приложение
```

## 🎯 Рекомендации

1. **Начните с полного копирования** - проще настроить потом
2. **Проверьте работу локально** - перед деплоем
3. **Используйте config.js** - для настройки путей
4. **Не изменяйте ядро** - только через форк

## ✅ Проверка работоспособности

### Тест ядра:
```bash
# Откройте в браузере
new_core/demo/index.html
# Должны работать все примеры
```

### Тест приложения:
```bash
# Откройте в браузере
cabinet-app/index.html
# Должен появиться интерфейс
```

## 💡 Совет

Если что-то не работает:
1. Откройте консоль браузера (F12)
2. Проверьте ошибки
3. Обычно проблема в путях - проверьте `config.js`

---

**Удачного переноса!** 🚀