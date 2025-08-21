# 🔄 ИНСТРУКЦИЯ ПО ОБНОВЛЕНИЮ КОДА

## 🎯 **ПРОБЛЕМА: КОД НЕ ОБНОВЛЯЕТСЯ В БРАУЗЕРЕ**

**Возможные причины:**
1. Кэш браузера держит старую версию
2. ES6 модули кэшируются агрессивно
3. Нужно принудительное обновление

## 🔧 **ШАГ 1: ОТКРОЙТЕ index.html В БРАУЗЕРЕ**

1. Откройте `index.html` в браузере
2. Откройте Developer Tools (F12)
3. Перейдите в Console

## 🔍 **ШАГ 2: ПРОВЕРЬТЕ КОНСОЛЬ**

**Должны увидеть:**
```
🚀 LightweightCabinetAdapter v3.5-DEBUG loaded - FINAL FIX
🚀 LightweightCabinetAdapter v3.4 loaded - FIXED VERSION
✅ Rendering panel: LEFT_SIDE dimensions: {width: 16, height: 2000}
✅ Rendering panel: RIGHT_SIDE dimensions: {width: 16, height: 2000}
✅ Rendering panel: TOP dimensions: {width: 768, height: 16}
✅ Rendering panel: BOTTOM dimensions: {width: 768, height: 16}
✅ Rendering panel: FRONT_BASE dimensions: {width: 768, height: 100}
🚫 Skipping panel: BACK_WALL (filtered out)
```

## ❌ **ЕСЛИ НЕ ВИДИТЕ НОВЫХ СООБЩЕНИЙ:**

### **МЕТОД 1: Жесткое обновление**
- Windows/Linux: **Ctrl + Shift + R**
- Mac: **Cmd + Shift + R**

### **МЕТОД 2: Очистить кэш**
1. F12 → Network табе
2. Правый клик → Clear browser cache
3. Обновить страницу (F5)

### **МЕТОД 3: Отключить кэш в Dev Tools**
1. F12 → Network
2. Поставить галочку "Disable cache"
3. Обновить страницу

### **МЕТОД 4: Incognito/Private режим**
- Откройте index.html в режиме инкогнито

## ✅ **ЧТО ДОЛЖНО ИЗМЕНИТЬСЯ:**

### **1. В консоли должно быть:**
```
🚀 LightweightCabinetAdapter v3.5-DEBUG loaded - FINAL FIX
```

### **2. При отрисовке должны видеть:**
- Сообщения о рендеринге каждой панели
- `🚫 Skipping panel: BACK_WALL (filtered out)`
- Дно с правильными размерами и окантовкой

### **3. На экране должно быть:**
- ✅ Дно с красной окантовкой как крыша
- ❌ Нет задней стенки (она скрыта)
- ✅ Все панели с четкими контурами

## 🚨 **ЕСЛИ ВСЕ ЕЩЕ НЕ РАБОТАЕТ:**

### **Сообщите:**
1. Какую версию видите в консоли?
2. Какие сообщения о панелях появляются?
3. Скриншот того что видите

**Скорее всего это проблема кэширования ES6 модулей!**

## 🎯 **БЫСТРЫЙ ТЕСТ:**

Откройте консоль и введите:
```javascript
console.log(window.location.href);
location.reload(true); // Принудительная перезагрузка
```

**Файлы точно обновлены, проблема в кэше браузера!** 🔄