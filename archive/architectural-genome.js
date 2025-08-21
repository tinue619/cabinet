// 🧬 АРХИТЕКТУРНАЯ ЗИГОТА ШКАФНОЙ СИСТЕМЫ
// Генетический код, определяющий все поведение системы
// Версия: 3.0 - Полная инкапсуляция + ООП

"use strict";

// ===============================================
// 🧬 ДНК ПРЕДМЕТНОЙ ОБЛАСТИ - Онтология шкафов
// ===============================================

const CABINET_DNA = Object.freeze({
    // 🏗️ ОСНОВНЫЕ СУЩНОСТИ
    ENTITIES: Object.freeze({
        CABINET: "Шкаф - готовое изделие, корневая сущность",
        MATERIAL: "Материал - то из чего делается панель", 
        PANEL: "Панель - деталь из определенного материала",
        SECTION: "Секция - 2D область между панелями для наполнения",
        DIVIDER: "Разделитель - опциональная панель в секции",
        ROD: "Штанга - планка для вешалок в секции"
    }),
    
    // 📐 МАТЕРИАЛЫ (онтология материалов)
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
    
    // 🔧 ТИПЫ ПАНЕЛЕЙ (онтология панелей)
    PANEL_TYPES: Object.freeze({
        HORIZONTAL: 'горизонтальная',
        VERTICAL: 'вертикальная', 
        FRONTAL: 'фронтальная'
    }),
    
    // 🏛️ ОБЯЗАТЕЛЬНЫЕ ПАНЕЛИ (архитектурные требования)
    REQUIRED_PANELS: Object.freeze({
        LEFT_SIDE: Object.freeze({ name: 'Боковина левая', material: 'LDSP_16', type: 'VERTICAL', required: true }),
        RIGHT_SIDE: Object.freeze({ name: 'Боковина правая', material: 'LDSP_16', type: 'VERTICAL', required: true }),
        TOP: Object.freeze({ name: 'Крыша', material: 'LDSP_16', type: 'HORIZONTAL', required: true }),
        BOTTOM: Object.freeze({ name: 'Дно', material: 'LDSP_16', type: 'HORIZONTAL', required: true }),
        FRONT_BASE: Object.freeze({ name: 'Цоколь передний', material: 'LDSP_16', type: 'FRONTAL', required: true }),
        BACK_BASE: Object.freeze({ name: 'Цоколь задний', material: 'LDSP_16', type: 'FRONTAL', required: true }),
        BACK_WALL: Object.freeze({ name: 'Задняя стенка', material: 'HDF_3', type: 'FRONTAL', required: true }),
        FACADE: Object.freeze({ name: 'Фасад', material: 'MDF_16', type: 'FRONTAL', required: true })
    }),
    
    // ⚖️ АРХИТЕКТУРНЫЕ ЗАКОНЫ (неизменяемые правила)
    LAWS: Object.freeze({
        ENCAPSULATION: "Все сущности должны быть полностью инкапсулированы",
        PANEL_CONNECTIVITY: "Панели обязаны знать о своих соседях",
        MINIMUM_SECTION_SIZE: "Секция не может быть меньше 100мм",
        MATERIAL_CONSISTENCY: "Панель не может существовать без валидного материала",
        SECTION_AUTO_CALCULATION: "Секции автоматически вычисляются из панелей",
        SECTION_2D_NATURE: "Секции - 2D сущности, работающие в плоскости XY",
        EDITING_2D_ONLY: "Редактирование только в 2D режиме, 3D только для просмотра",
        HIERARCHICAL_VALIDATION: "Изменения валидируются на всех уровнях иерархии",