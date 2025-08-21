/**
 * Примеры использования архитектурного ядра
 * Демонстрация работы с чистым ядром без UI
 */

import { SystemFactory } from '../index.js';

// ===============================================
// Пример 1: Создание простого шкафа
// ===============================================

function example1_SimpleСabinet() {
    console.log('\n=== Пример 1: Простой шкаф ===\n');
    
    // Создаем систему
    const system = SystemFactory.create();
    
    // Создаем шкаф
    const cabinet = system.createCabinet({
        width: 800,
        height: 2000,
        depth: 600,
        baseHeight: 100
    });
    
    // Генерируем панели
    cabinet.generate();
    
    // Получаем информацию
    const stats = cabinet.getStats();
    console.log('Статистика шкафа:', stats);
    
    // Получаем панели
    const panels = cabinet.getPanels();
    console.log(`Создано панелей: ${panels.length}`);
    
    panels.forEach(panel => {
        console.log(`- ${panel.name}: ${panel.dimensions.width}x${panel.dimensions.height}x${panel.dimensions.thickness}`);
    });
}

// ===============================================
// Пример 2: Работа с материалами
// ===============================================

function example2_Materials() {
    console.log('\n=== Пример 2: Материалы ===\n');
    
    const system = SystemFactory.create();
    
    // Создаем материалы
    const ldsp = system.createLDSP16();
    const hdf = system.createHDF3();
    const mdf = system.createMDF16();
    
    console.log('Материалы:');
    console.log(`- ${ldsp.name}: ${ldsp.thickness}мм`);
    console.log(`- ${hdf.name}: ${hdf.thickness}мм`);
    console.log(`- ${mdf.name}: ${mdf.thickness}мм`);
}

// ===============================================
// Пример 3: События системы
// ===============================================

function example3_Events() {
    console.log('\n=== Пример 3: События ===\n');
    
    const system = SystemFactory.create({
        enableEvents: true
    });
    
    // Подписываемся на события
    system.events.on('cabinet-generated', (data) => {
        console.log('Событие: Шкаф сгенерирован', data);
    });
    
    // Создаем шкаф
    const cabinet = system.createCabinet({
        width: 600,
        height: 1800,
        depth: 500,
        baseHeight: 80
    });
    
    cabinet.generate();
}

// ===============================================
// Пример 4: Валидация
// ===============================================

function example4_Validation() {
    console.log('\n=== Пример 4: Валидация ===\n');
    
    const system = SystemFactory.create({
        enableValidation: true
    });
    
    try {
        // Попытка создать шкаф с неверными параметрами
        const cabinet = system.createCabinet({
            width: 50, // Слишком маленькая ширина
            height: 2000,
            depth: 600
        });
    } catch (error) {
        console.log('Ошибка валидации:', error.message);
    }
    
    // Проверка системы
    const validation = system.validate();
    console.log('Результат валидации системы:', validation);
}

// ===============================================
// Пример 5: Секции
// ===============================================

function example5_Sections() {
    console.log('\n=== Пример 5: Секции ===\n');
    
    const system = SystemFactory.create();
    
    const cabinet = system.createCabinet({
        width: 1200,
        height: 2400,
        depth: 600,
        baseHeight: 100
    });
    
    cabinet.generate();
    
    // Получаем секции
    const sections = cabinet.getSections();
    console.log(`Количество секций: ${sections.length}`);
    
    sections.forEach((section, index) => {
        console.log(`Секция ${index + 1}:`);
        console.log(`  - Границы: ${section.bounds.x}, ${section.bounds.y}`);
        console.log(`  - Размер: ${section.bounds.width}x${section.bounds.height}`);
        console.log(`  - Пустая: ${section.isEmpty}`);
    });
}

// ===============================================
// Запуск примеров
// ===============================================

if (typeof window === 'undefined') {
    // Запускаем только в Node.js
    console.log('🧬 Демонстрация архитектурного ядра Cabinet Designer\n');
    
    example1_SimpleСabinet();
    example2_Materials();
    example3_Events();
    example4_Validation();
    example5_Sections();
    
    console.log('\n✅ Все примеры выполнены успешно!');
}

// Экспортируем для использования в браузере
export {
    example1_SimpleСabinet,
    example2_Materials,
    example3_Events,
    example4_Validation,
    example5_Sections
};