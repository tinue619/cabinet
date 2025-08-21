// 🧱 МАТЕРИАЛ - Сущность материалов шкафа
// Полностью инкапсулированная сущность с валидацией

"use strict";

import { ArchitecturalBase } from '../core/ArchitecturalBase.js';
import { CABINET_DNA } from '../cabinet-dna.js';

/**
 * 🧱 МАТЕРИАЛ
 * Инкапсулированная сущность представляющая материал для панелей
 * (ЛДСП 16мм, ХДФ 3мм, МДФ 16мм)
 */
export class Material extends ArchitecturalBase {
    constructor(materialType) {
        super('Material', `material_${materialType}`);
        
        // Проверяем что материал существует в ДНК
        if (!CABINET_DNA.MATERIALS[materialType]) {
            const available = Object.keys(CABINET_DNA.MATERIALS).join(', ');
            throw new Error(`Unknown material type: ${materialType}. Available: ${available}`);
        }
        
        // 🔒 Приватные данные материала
        let _materialType = materialType;
        let _specification = CABINET_DNA.MATERIALS[materialType];
        
        // 🔍 Публичные геттеры (только чтение)
        Object.defineProperty(this, 'materialType', {
            get: () => _materialType,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'name', {
            get: () => _specification.name,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'thickness', {
            get: () => _specification.thickness,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'materialKind', {
            get: () => _specification.type,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'specification', {
            get: () => Object.freeze({ ..._specification }),
            enumerable: true,
            configurable: false
        });
        
        // ===============================================
        // 🎯 МЕТОДЫ МАТЕРИАЛА
        // ===============================================
        
        /**
         * 🔗 Проверка совместимости с типом панели
         * @param {string} panelType - тип панели (например, 'боковины', 'фасады')
         * @returns {boolean}
         */
        this.isCompatibleWith = (panelType) => {
            return _specification.usage.includes(panelType);
        };
        
        /**
         * 📋 Получить список совместимых панелей
         * @returns {string[]}
         */
        this.getCompatiblePanels = () => {
            return [..._specification.usage];
        };
        
        /**
         * 📊 Получить характеристики материала
         * @returns {Object}
         */
        this.getCharacteristics = () => {
            return Object.freeze({
                name: _specification.name,
                thickness: _specification.thickness,
                materialKind: _specification.type,  // Исправлено: materialKind вместо type
                suitable_for: _specification.usage,
                material_code: _materialType
            });
        };
        
        // ===============================================
        // 💾 СЕРИАЛИЗАЦИЯ
        // ===============================================
        
        /**
         * 🎯 Специфичные данные материала для сериализации
         * @returns {Object}
         */
        this.getSpecificData = () => {
            return {
                materialType: _materialType,
                specification: _specification,
                characteristics: this.getCharacteristics()
            };
        };
        
        // ===============================================
        // 🔒 ФИНАЛЬНАЯ ЗАЩИТА
        // ===============================================
        
        // Замораживаем методы
        Object.freeze(this.isCompatibleWith);
        Object.freeze(this.getCompatiblePanels);
        Object.freeze(this.getCharacteristics);
        
        // Материал неизменяемый после создания
        this._finalizeEntity(); // Используем метод из ArchitecturalBase
    }
    
    // ===============================================
    // 🏭 СТАТИЧЕСКИЕ МЕТОДЫ (ФАБРИЧНЫЕ)
    // ===============================================
    
    /**
     * 🏭 Создать материал ЛДСП 16мм
     * @returns {Material}
     */
    static createLDSP16() {
        return new Material('LDSP_16');
    }
    
    /**
     * 🏭 Создать материал ХДФ 3мм
     * @returns {Material}
     */
    static createHDF3() {
        return new Material('HDF_3');
    }
    
    /**
     * 🏭 Создать материал МДФ 16мм
     * @returns {Material}
     */
    static createMDF16() {
        return new Material('MDF_16');
    }
    
    /**
     * 📋 Получить все доступные типы материалов
     * @returns {string[]}
     */
    static getAvailableTypes() {
        return Object.keys(CABINET_DNA.MATERIALS);
    }
    
    /**
     * 🔍 Найти материал по назначению панели
     * @param {string} panelType - тип панели
     * @returns {string[]} - массив подходящих материалов
     */
    static findSuitableFor(panelType) {
        const suitable = [];
        
        for (const [materialType, spec] of Object.entries(CABINET_DNA.MATERIALS)) {
            if (spec.usage.includes(panelType)) {
                suitable.push(materialType);
            }
        }
        
        return suitable;
    }
}

console.log('🧱 Material entity loaded');