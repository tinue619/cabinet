// 🧬 ДНК ПРЕДМЕТНОЙ ОБЛАСТИ - Онтология шкафов
// Основано на файле в папке "суть"

"use strict";

/**
 * 🧬 ГЕНЕТИЧЕСКИЙ КОД ШКАФНОЙ СИСТЕМЫ
 * Содержит все константы, правила и формулы из онтологии
 * Неизменяемый набор принципов системы
 */
export const CABINET_DNA = Object.freeze({
    
    // 🏗️ ОСНОВНЫЕ СУЩНОСТИ
    ENTITIES: Object.freeze({
        CABINET: "Шкаф - готовое изделие, корневая сущность",
        MATERIAL: "Материал - то из чего делается панель", 
        PANEL: "Панель - деталь из определенного материала",
        SECTION: "Секция - 2D область между панелями для наполнения",
        DIVIDER: "Разделитель - опциональная панель в секции",
        ROD: "Штанга - планка для вешалок в секции"
    }),
    
    // 📐 МАТЕРИАЛЫ (из онтологии)
    MATERIALS: Object.freeze({
        LDSP_16: Object.freeze({ 
            name: 'ЛДСП 16мм', 
            thickness: 16, 
            type: 'structural',
            usage: ['боковины', 'крыша', 'дно', 'цоколи', 'стойки', 'полки']
        }),
        HDF_3: Object.freeze({ 
            name: 'ХДФ 3мм', 
            thickness: 3, 
            type: 'backing',
            usage: ['задняя_стенка']
        }),
        MDF_16: Object.freeze({ 
            name: 'МДФ 16мм', 
            thickness: 16, 
            type: 'facade',
            usage: ['фасады']
        })
    }),
    
    // 🔧 ТИПЫ ПАНЕЛЕЙ
    PANEL_TYPES: Object.freeze({
        HORIZONTAL: 'горизонтальная',
        VERTICAL: 'вертикальная', 
        FRONTAL: 'фронтальная'
    }),
    
    // 🏛️ ОБЯЗАТЕЛЬНЫЕ ПАНЕЛИ
    REQUIRED_PANELS: Object.freeze({
        LEFT_SIDE: Object.freeze({ name: 'Боковина левая', material: 'LDSP_16', type: 'VERTICAL', required: true }),
        RIGHT_SIDE: Object.freeze({ name: 'Боковина правая', material: 'LDSP_16', type: 'VERTICAL', required: true }),
        TOP: Object.freeze({ name: 'Крыша', material: 'LDSP_16', type: 'HORIZONTAL', required: true }),
        BOTTOM: Object.freeze({ name: 'Дно', material: 'LDSP_16', type: 'HORIZONTAL', required: true }),
        FRONT_BASE: Object.freeze({ name: 'Цоколь передний', material: 'LDSP_16', type: 'FRONTAL', required: true }),
        BACK_BASE: Object.freeze({ name: 'Цоколь задний', material: 'LDSP_16', type: 'FRONTAL', required: true }),
        BACK_WALL: Object.freeze({ name: 'Задняя стенка', material: 'HDF_3', type: 'FRONTAL', required: true })
        // ❌ ФАСАД УДАЛЕН - будет добавляться потом отдельно
    }),
    
    // ⚖️ АРХИТЕКТУРНЫЕ ЗАКОНЫ (из папки "суть")
    LAWS: Object.freeze({
        ENCAPSULATION: "Все сущности должны быть полностью инкапсулированы",
        PANEL_CONNECTIVITY: "Панели обязаны знать о своих соседях",
        MINIMUM_SECTION_SIZE: "Секция не может быть меньше 100мм",
        MATERIAL_CONSISTENCY: "Панель не может существовать без валидного материала",
        SECTION_AUTO_CALCULATION: "Секции автоматически вычисляются из панелей",
        SECTION_2D_NATURE: "Секции - 2D сущности, работающие в плоскости XY",
        EDITING_2D_ONLY: "Редактирование только в 2D режиме, 3D только для просмотра",
        HIERARCHICAL_VALIDATION: "Изменения валидируются на всех уровнях иерархии",
        PARAMETRIC_GENERATION: "Шкаф генерируется параметрически по габаритам XYZ"
    }),
    
    // 📏 КОНСТАНТЫ СИСТЕМЫ
    CONSTANTS: Object.freeze({
        MIN_SECTION_SIZE: 100,          // мм - минимальный размер секции
        MIN_GAP_TO_PANEL: 100,          // мм - минимальное расстояние до панели  
        DEFAULT_PANEL_THICKNESS: 16,    // мм - стандартная толщина
        EDITING_MODE: '2D',             // режим редактирования (только 2D)
        VIEW_MODES: Object.freeze(['2D', '3D']), // доступные режимы просмотра
        SECTION_PLANE: 'XY',            // плоскость работы секций
        ROD_DIAMETER: 12,               // диаметр штанги
        ROD_HEIGHT_FROM_BOTTOM: 1800,   // стандартная высота штанги
        MIN_ROD_LENGTH: 300,            // минимальная длина штанги
        PADDING: 60,                    // отступы при отрисовке
        COORDINATE_SYSTEM: 'CANVAS'     // система координат: Y=0 верх, Y=height низ
    }),
    
    // 🏗️ ФОРМУЛЫ ПАРАМЕТРИЧЕСКОГО ПОСТРОЕНИЯ (из онтологии)
    GENERATION: Object.freeze({
        
        // Входные параметры: xCabinet, yCabinet, zCabinet, materialThickness, baseHeight
        
        POSITION_FORMULAS: Object.freeze({
            LEFT_SIDE: (x, y, z, t, b) => Object.freeze({ x: 0, y: 0, z: 0 }),
            RIGHT_SIDE: (x, y, z, t, b) => Object.freeze({ x: x - t, y: 0, z: 0 }),
            TOP: (x, y, z, t, b) => Object.freeze({ x: t, y: 0, z: 0 }),
            BOTTOM: (x, y, z, t, b) => Object.freeze({ x: t, y: y - b - t, z: 0 }),
            FRONT_BASE: (x, y, z, t, b) => Object.freeze({ x: t, y: y - b, z: z - t }),
            BACK_BASE: (x, y, z, t, b) => Object.freeze({ x: t, y: y - b, z: 30 }),
            BACK_WALL: (x, y, z, t, b) => Object.freeze({ x: t, y: t, z: 0 }),
            FACADE: (x, y, z, t, b) => Object.freeze({ x: 0, y: b, z: z - t })
        }),
        
        SIZE_FORMULAS: Object.freeze({
            LEFT_SIDE: (x, y, z, t, b) => Object.freeze({ width: t, height: y, depth: z }),
            RIGHT_SIDE: (x, y, z, t, b) => Object.freeze({ width: t, height: y, depth: z }),
            TOP: (x, y, z, t, b) => Object.freeze({ width: x - 2*t, height: t, depth: z }),
            BOTTOM: (x, y, z, t, b) => Object.freeze({ width: x - 2*t, height: t, depth: z }),
            FRONT_BASE: (x, y, z, t, b) => Object.freeze({ width: x - 2*t, height: b, depth: t }),
            BACK_BASE: (x, y, z, t, b) => Object.freeze({ width: x - 2*t, height: b, depth: t }),
            BACK_WALL: (x, y, z, t, b) => Object.freeze({ width: x - 2*t, height: y - b - t, depth: 3 })
            // ❌ ФАСАД УДАЛЕН
        })
    }),
    
    // 🔒 ГЕНЕТИЧЕСКАЯ ПОДПИСЬ
    SIGNATURE: Object.freeze({
        version: '3.3.4',
        created: '2025-01-13',
        updated: '2025-01-20',
        fix: 'Bottom panel ABOVE base panels (y-b-t) - correct formula',
        coordinates: 'Canvas-style (Y=0 top)',
        panels: 'Bottom ABOVE base, not ON base', 
        source: 'Онтология из папки "суть"',
        checksum: 'CABINET_DNA_v3_BOTTOM_ABOVE_BASE',
        laws: 9,
        entities: 6,
        materials: 3,
        integrity: 'VERIFIED'
    })
});

console.log('🧬 Cabinet DNA loaded successfully');
console.log('📊 Signature:', CABINET_DNA.SIGNATURE);