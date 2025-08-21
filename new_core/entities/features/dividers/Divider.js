/**
 * Divider Feature
 * Вертикальные разделители (стойки) в секциях
 */

import { Panel } from '../../Panel.js';

/**
 * Класс для вертикальных разделителей
 * TODO: Реализовать после завершения базовой функциональности
 */
export class Divider extends Panel {
    constructor(section, position) {
        // Временная заглушка - возвращаем базовую панель
        super('VERTICAL', null, null);
        
        console.warn('Divider feature is not implemented yet. Using basic Panel instead.');
        
        // Сохраняем параметры для будущей реализации
        this._section = section;
        this._position = position;
        this._isPlaceholder = true;
    }
    
    /**
     * Проверка, является ли это заглушкой
     */
    isPlaceholder() {
        return this._isPlaceholder;
    }
}

// Экспортируем информацию о статусе фичи
export const DividerFeature = {
    implemented: false,
    plannedVersion: '3.2',
    status: 'TODO',
    message: 'Divider feature will be implemented in future version',
    
    /**
     * Создать заглушку разделителя
     */
    createPlaceholder: (section, position) => {
        return new Divider(section, position);
    }
};

export default DividerFeature;