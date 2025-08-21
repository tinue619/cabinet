// 📐 СЕКЦИЯ - 2D область между панелями для наполнения
// Полностью инкапсулированная сущность с валидацией

"use strict";

import { ArchitecturalBase } from '../core/ArchitecturalBase.js';
import { CABINET_DNA } from '../cabinet-dna.js';

/**
 * 📐 СЕКЦИЯ
 * 2D прямоугольная область между панелями, может содержать наполнение
 * Работает только в плоскости XY (вид сверху)
 */
export class Section extends ArchitecturalBase {
    constructor(bounds, parentCabinet) {
        super('Section', `section_${Date.now()}`);
        
        // Валидация входных данных
        if (!bounds || typeof bounds !== 'object') {
            throw new Error('Section requires valid bounds object');
        }
        
        if (!parentCabinet) {
            throw new Error('Section must belong to a cabinet');
        }
        
        // Проверяем минимальные размеры
        const width = bounds.right - bounds.left;
        const height = bounds.bottom - bounds.top;
        const minSize = CABINET_DNA.CONSTANTS.MIN_SECTION_SIZE;
        
        if (width < minSize || height < minSize) {
            throw new Error(`Section too small: ${width}x${height}mm. Minimum: ${minSize}mm`);
        }
        
        // 🔒 Приватные данные секции
        let _bounds = Object.freeze({
            left: bounds.left,
            right: bounds.right,
            top: bounds.top,
            bottom: bounds.bottom,
            width: width,
            height: height
        });
        
        let _parentCabinet = parentCabinet;
        let _boundingPanels = {
            left: null,
            right: null,
            top: null,
            bottom: null
        };
        
        let _content = new Map();
        let _subdivisions = new Map();
        let _isActive = true;
        
        // ===============================================
        // 🔍 ПУБЛИЧНЫЕ ГЕТТЕРЫ
        // ===============================================
        
        Object.defineProperty(this, 'bounds', {
            get: () => _bounds,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'width', {
            get: () => _bounds.width,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'height', {
            get: () => _bounds.height,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'isEmpty', {
            get: () => _content.size === 0 && _subdivisions.size === 0,
            enumerable: true,
            configurable: false
        });
        
        // ===============================================
        // 📦 УПРАВЛЕНИЕ СОДЕРЖИМЫМ
        // ===============================================
        
        /**
         * ➕ Добавление содержимого в секцию
         * @param {string} contentType - тип содержимого
         * @param {Object} item - объект содержимого
         * @returns {boolean}
         */
        this.addContent = (contentType, item) => {
            if (!_isActive) {
                throw new Error('Cannot add content to inactive section');
            }
            
            const contentId = item.id || `${contentType}_${Date.now()}`;
            _content.set(contentId, { type: contentType, item, added: Date.now() });
            
            this._emit('content-added', { contentType, contentId });
            return true;
        };
        
        /**
         * 📋 Получить всё содержимое
         * @returns {Array}
         */
        this.getContent = () => {
            return Array.from(_content.values());
        };
        
        /**
         * 🎯 Проверка попадания точки в секцию
         * @param {number} x 
         * @param {number} y 
         * @returns {boolean}
         */
        this.containsPoint = (x, y) => {
            return x >= _bounds.left && x <= _bounds.right &&
                   y >= _bounds.top && y <= _bounds.bottom;
        };
        
        // ===============================================
        // 💾 СЕРИАЛИЗАЦИЯ
        // ===============================================
        
        this.getSpecificData = () => {
            return {
                bounds: _bounds,
                content: Array.from(_content.values()),
                subdivisions: Array.from(_subdivisions.keys()),
                isActive: _isActive
            };
        };
        
        // Финальная защита
        Object.freeze(this.addContent);
        Object.freeze(this.getContent);
        Object.freeze(this.containsPoint);
        Object.preventExtensions(this);
    }
}

console.log('📐 Section entity loaded');
