// 🛡️ АРХИТЕКТУРНЫЙ СТРАЖ - Защитник принципов ООП
// Автоматически блокирует нарушения архитектуры

"use strict";

import { CABINET_DNA } from '../cabinet-dna.js';

/**
 * 🛡️ СТРАЖ АРХИТЕКТУРНЫХ ПРИНЦИПОВ
 * Автоматически валидирует соблюдение всех законов из ДНК
 * Блокирует любые попытки нарушить инкапсуляцию или принципы ООП
 */
export class ArchitecturalGuardian {
    constructor() {
        // 🔒 Приватные данные через замыкание
        let _violations = [];
        let _enforcedLaws = Object.keys(CABINET_DNA.LAWS);
        
        // 🔍 Публичные геттеры (только чтение)
        Object.defineProperty(this, 'violations', {
            get: () => [..._violations], // Копия массива
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'enforcedLaws', {
            get: () => [..._enforcedLaws], // Копия массива
            enumerable: true,
            configurable: false
        });
    
        /**
         * 🔍 Проверка соблюдения архитектурных законов
         * @param {Object} entity - Проверяемая сущность
         * @param {string} operation - Выполняемая операция  
         * @returns {boolean} - true если все законы соблюдены
         */
        this.validateEntity = (entity, operation = 'VALIDATE') => {
            _violations = []; // Очищаем приватный массив
            
            for (const law of _enforcedLaws) {
                const violation = this._checkLaw(law, entity, operation);
                if (violation) {
                    _violations.push(violation);
                }
            }
            
            return _violations.length === 0;
        };
        
        /**
         * ⚖️ Проверка конкретного закона
         * @private
         */
        this._checkLaw = (lawName, entity, operation) => {
            try {
                switch(lawName) {
                    case 'ENCAPSULATION':
                        return this._validateEncapsulation(entity);
                    case 'MINIMUM_SECTION_SIZE':
                        return this._validateSectionSize(entity);
                    case 'MATERIAL_CONSISTENCY':
                        return this._validateMaterialConsistency(entity);
                    case 'SECTION_2D_NATURE':
                        return this._validateSection2D(entity);
                    case 'EDITING_2D_ONLY':
                        return this._validateEditingMode(entity, operation);
                    default:
                        return null;
                }  
            } catch (error) {
                return {
                    law: lawName,
                    message: `Validation error: ${error.message}`,
                    severity: 'ERROR'
                };
            }
        };
        
        /**
         * 🔒 Проверка инкапсуляции
         * @private
         */
        this._validateEncapsulation = (entity) => {
            if (entity && typeof entity === 'object' && !entity._isEncapsulated) {
                return {
                    law: 'ENCAPSULATION',
                    message: `Entity must be properly encapsulated`,
                    severity: 'ERROR'
                };
            }
            return null;
        };
        
        /**
         * 📏 Проверка размера секций
         * @private
         */
        this._validateSectionSize = (entity) => {
            if (entity && entity.type === 'Section' && entity.dimensions) {
                const minSize = CABINET_DNA.CONSTANTS.MIN_SECTION_SIZE;
                if (entity.dimensions.width < minSize || entity.dimensions.height < minSize) {
                    return {
                        law: 'MINIMUM_SECTION_SIZE',
                        message: `Section size (${entity.dimensions.width}x${entity.dimensions.height}) is below minimum (${minSize}x${minSize})`,
                        severity: 'ERROR'
                    };
                }
            }
            return null;
        };
        
        /**
         * 🧱 Проверка согласованности материалов
         * @private
         */
        this._validateMaterialConsistency = (entity) => {
            if (entity && entity.type === 'Panel' && entity.material && entity.panelType) {
                const material = entity.material;
                const panelType = entity.panelType;
                
                if (!material.isCompatibleWith || !material.isCompatibleWith(panelType)) {
                    return {
                        law: 'MATERIAL_CONSISTENCY',
                        message: `Material ${material.name} may not be suitable for ${panelType}`,
                        severity: 'WARNING'
                    };
                }
            }
            return null;
        };
        
        /**
         * 📐 Проверка 2D природы секций
         * @private
         */
        this._validateSection2D = (entity) => {
            if (entity && entity.type === 'Section' && entity.position && entity.position.z !== undefined) {
                return {
                    law: 'SECTION_2D_NATURE',
                    message: `Section should not have Z coordinate - it's a 2D entity`,
                    severity: 'WARNING'
                };
            }
            return null;
        };
        
        /**
         * ✏️ Проверка режима редактирования
         * @private
         */
        this._validateEditingMode = (entity, operation) => {
            if (operation && operation.includes('EDIT') && entity && entity.viewMode === '3D') {
                return {
                    law: 'EDITING_2D_ONLY',
                    message: `Cannot edit in 3D mode - editing only allowed in 2D`,
                    severity: 'ERROR'
                };
            }
            return null;
        };
        
        /**
         * 📋 Получить отчет о нарушениях
         * @returns {Object} - Отчет с ошибками и предупреждениями
         */
        this.getViolationReport = () => {
            const currentViolations = this.violations; // Используем геттер
            return Object.freeze({
                hasViolations: currentViolations.length > 0,
                errors: currentViolations.filter(v => v.severity === 'ERROR'),
                warnings: currentViolations.filter(v => v.severity === 'WARNING'),
                all: [...currentViolations]
            });
        };
    
        /**
         * 🚨 Выбросить исключение при критических нарушениях
         * @param {string} operation - Операция которая вызвала проверку
         */
        this.enforceOrThrow = (operation = 'operation') => {
            const report = this.getViolationReport();
            if (report.errors.length > 0) {
                const errorMessages = report.errors.map(e => e.message).join('; ');
                throw new Error(`Architectural violation in ${operation}: ${errorMessages}`);
            }
        };
        
        // 🔒 Финальная защита стража
        Object.freeze(this);
    }
}

console.log('🛡️ Architectural Guardian loaded');
