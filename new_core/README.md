# 🧬 АРХИТЕКТУРНОЕ ЯДРО - Cabinet Designer Core v3.1

**Чистое архитектурное ядро системы проектирования шкафов**

## 📋 Описание

Это **архитектурное ядро** - содержит только бизнес-логику и доменную модель. Никакого UI кода, никаких зависимостей от браузера, только чистая архитектура.

## 🏗️ Структура ядра

```
new_core/
├── index.js                # Точка входа - фабрика систем
├── cabinet-dna.js          # ДНК предметной области (константы, правила)
├── устав.ini               # Онтология системы
├── core/                   # Базовые архитектурные классы
│   ├── ArchitecturalBase.js    # Базовый класс всех сущностей
│   ├── ArchitecturalGuardian.js # Страж архитектурных принципов
│   └── EventSystem.js           # Система событий
├── entities/               # Бизнес-сущности
│   ├── Material.js         # Материалы
│   ├── Panel.js            # Панели
│   ├── Section.js          # Секции
│   ├── Cabinet.js          # Шкаф
│   └── features/           # Дополнительные фичи
│       ├── dividers/       # Разделители (TODO)
│       └── rods/           # Штанги (TODO)
├── systems/                # Системные модули (не UI!)
│   └── README.md           # Описание папки
└── demo/                   # Примеры использования ядра
    ├── examples.js         # Примеры кода
    └── index.html          # Демонстрация в браузере
```

## 🎯 Архитектурные принципы

### 1. **Полная инкапсуляция**
- Все данные приватные через замыкания
- Доступ только через публичные методы
- Невозможно нарушить инварианты

### 2. **Чистота ядра**
- Никакого UI кода
- Никаких зависимостей от DOM
- Никаких рендереров
- Только бизнес-логика

### 3. **Параметрическое построение**
- Все панели генерируются по формулам
- Формулы определены в ДНК системы
- Автоматический расчет размеров и позиций

### 4. **Архитектурный страж**
- Автоматическая валидация всех операций
- Блокировка архитектурных нарушений
- Отчеты о нарушениях

## 🚀 Использование

### Быстрый старт

```javascript
import { SystemFactory } from './new_core/index.js';

// Создаем систему
const system = SystemFactory.create();

// Создаем шкаф
const cabinet = system.createCabinet({
    width: 800,
    height: 2000,
    depth: 600,
    baseHeight: 100
});

// Генерируем все панели
cabinet.generate();

// Получаем данные
const panels = cabinet.getPanels();
const sections = cabinet.getSections();
const stats = cabinet.getStats();
```

### Работа с материалами

```javascript
// Создаем материалы
const ldsp = system.createLDSP16();
const hdf = system.createHDF3();
const mdf = system.createMDF16();
```

### События системы

```javascript
// Подписка на события
system.events.on('cabinet-generated', (data) => {
    console.log('Cabinet generated:', data);
});
```

## 📦 Использование в приложениях

Ядро предназначено для использования как библиотека:

```javascript
// В вашем приложении
import { SystemFactory } from 'path/to/new_core/index.js';

// Создайте адаптер для вашего UI
class CabinetAdapter {
    constructor() {
        this.system = SystemFactory.create();
    }
    
    // Преобразуйте данные для вашего UI
    getCabinetForUI(params) {
        const cabinet = this.system.createCabinet(params);
        cabinet.generate();
        
        // Преобразуйте в формат вашего UI
        return this.transformForUI(cabinet);
    }
}
```

## 🎨 UI приложения

Для работы с UI используйте отдельное приложение:

- **cabinet-app/** - полнофункциональное приложение с UI
- **new_core_ui_backup/** - архив старого UI кода

## 🧪 Демонстрация и тесты

### Запуск примеров в браузере:
```
new_core/demo/index.html
```

### Запуск примеров в Node.js:
```bash
node new_core/demo/examples.js
```

## 📊 Статус разработки

### ✅ Готово
- Архитектурная база
- Система событий
- Архитектурный страж
- Материалы
- Панели
- Секции
- Шкаф
- Параметрическая генерация

### 🔄 В разработке
- Разделители (dividers)
- Штанги (rods)
- Ящики (drawers)

### 📅 Планируется
- Система оптимизации раскроя
- Экспорт в DXF
- Расчет стоимости

## ⚠️ Важные правила

1. **НЕ добавляйте UI код в ядро!**
2. **НЕ создавайте зависимости от браузера!**
3. **НЕ добавляйте рендереры!**
4. **Следуйте правилам из DEVELOPMENT_RULES.md**

## 📚 Документация

- [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md) - правила разработки
- [устав.ini](./устав.ini) - онтология системы
- [demo/](./demo/) - примеры использования

## 🔒 Лицензия

Proprietary

## 👥 Авторы

Cabinet Designer Team

---

**Версия:** 3.1  
**Последнее обновление:** 2025-01-14  
**Статус:** Production Ready (Core)