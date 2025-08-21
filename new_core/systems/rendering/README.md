# 🎨 СИСТЕМЫ РЕНДЕРИНГА

Эта папка содержит базовые системы для рендеринга компонентов шкафа.

## Компоненты:

### BaseRenderingEngine.js
- **Назначение:** Единый источник логики рендеринга для всех UI компонентов
- **Ответственность:** Вычисление пропорциональных размеров, цветов, констант
- **Паттерн:** Singleton для обеспечения консистентности
- **Соответствие:** Cabinet DNA v3.0 + Architectural Zygote v3.1

## Принципы:

1. **DRY (Don't Repeat Yourself)** - единственный источник логики рендеринга
2. **Single Responsibility** - каждый метод отвечает за одну функцию
3. **Immutability** - все настройки неизменяемы после создания
4. **Consistency** - все UI компоненты используют одинаковую логику

## Использование:

```javascript
import { BaseRenderingEngine } from './BaseRenderingEngine.js';

const engine = BaseRenderingEngine.getInstance();
const thickness = engine.calculateProportionalThickness(realThickness, scale);
const strokeWidth = engine.calculateProportionalStroke(baseWidth, scale);
```

## Архитектурное решение:

До рефакторинга логика рендеринга была продублирована в 4+ файлах.
Теперь все UI компоненты используют единый BaseRenderingEngine.

**Результат:** Один багфикс = одно изменение в системе.
