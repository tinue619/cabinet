/**
 * Rod Feature
 * Штанги для вешалок в секциях
 */

import { ArchitecturalBase } from '../../../core/ArchitecturalBase.js';

/**
 * Класс для штанг
 * TODO: Реализовать после завершения базовой функциональности
 */
export class Rod extends ArchitecturalBase {
    constructor(section, height) {
        // Временная заглушка - создаем базовый объект
        super('Rod', `rod_placeholder_${Date.now()}`);
        
        console.warn('Rod feature is not implemented yet. Using placeholder.');
        
        // Сохраняем параметры для будущей реализации
        this._setProperty('section', section);
        this._setProperty('height', height || 1800);
        this._setProperty('diameter', 12);
        this._setProperty('isPlaceholder', true);
    }
    
    /**
     * Получить высоту штанги
     */
    getHeight() {
        return this._getProperty('height');
    }
    
    /**
     * Получить диаметр штанги
     */
    getDiameter() {
        return this._getProperty('diameter');
    }
    
    /**
     * Проверка, является ли это заглушкой
     */
    isPlaceholder() {
        return this._getProperty('isPlaceholder');
    }
}

// Экспортируем информацию о статусе фичи
export const RodFeature = {
    implemented: false,
    plannedVersion: '3.2',
    status: 'TODO',
    message: 'Rod feature will be implemented in future version',
    
    /**
     * Создать заглушку штанги
     */
    createPlaceholder: (section, height) => {
        return new Rod(section, height);
    }
};

export default RodFeature;