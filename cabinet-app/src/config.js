/**
 * Configuration file for Cabinet App
 * Централизованная конфигурация путей и настроек
 */

// Путь к ядру - ИСПРАВЛЕН для структуры: корень/cabinet-app/src/
export const CORE_PATH = '../../new_core/index.js';

// Альтернативные варианты настройки:
// 1. Если ядро в той же папке:
// export const CORE_PATH = '../new_core/index.js';

// 2. Если ядро установлено как npm пакет:
// export const CORE_PATH = '@cabinet/core';

// 3. Если используете CDN:
// export const CORE_PATH = 'https://cdn.example.com/cabinet-core/index.js';

// Настройки приложения
export const APP_CONFIG = {
    defaultCabinet: {
        width: 800,
        height: 2000,
        depth: 600,
        baseHeight: 100
    },
    
    limits: {
        minWidth: 400,
        maxWidth: 2000,
        minHeight: 600,
        maxHeight: 3000,
        minDepth: 300,
        maxDepth: 800,
        minBase: 60,
        maxBase: 200
    },
    
    ui: {
        animationDuration: 300,
        notificationDuration: 3000,
        maxHistorySize: 50
    }
};

// Экспорт настроек
export default {
    CORE_PATH,
    APP_CONFIG
};