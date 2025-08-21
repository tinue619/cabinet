/**
 * MICRO-COMPONENT: Zoom Control
 * Single Responsibility: ТОЛЬКО управление масштабом
 * Domain Layer: UI Component - Zoom Management
 */

"use strict";

/**
 * 🔍 КОНТРОЛЛЕР МАСШТАБИРОВАНИЯ
 * Инкапсулированный компонент для управления zoom
 * Соблюдает принципы ООП и Single Responsibility
 */
export class ZoomControl {
    
    constructor(canvasElement) {
        if (!canvasElement) {
            throw new Error('ZoomControl requires canvas element');
        }
        
        // 🔒 Приватные данные - полная инкапсуляция
        let _currentZoom = 1.0;
        let _minZoom = 0.1;
        let _maxZoom = 5.0;
        let _zoomStep = 1.2;
        let _canvas = canvasElement;
        let _callbacks = new Map();
        
        // ===============================================
        // 🔍 ПУБЛИЧНЫЕ ГЕТТЕРЫ (только чтение)
        // ===============================================
        
        Object.defineProperty(this, 'currentZoom', {
            get: () => _currentZoom,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'minZoom', {
            get: () => _minZoom,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'maxZoom', {
            get: () => _maxZoom,
            enumerable: true,
            configurable: false
        });
        
        // ===============================================
        // 🎯 ПУБЛИЧНЫЕ МЕТОДЫ
        // ===============================================
        
        /**
         * 🔍 Увеличить масштаб
         * @returns {number} новый уровень масштаба
         */
        this.zoomIn = () => {
            const newZoom = Math.min(_currentZoom * _zoomStep, _maxZoom);
            return this._setZoom(newZoom);
        };
        
        /**
         * 🔍 Уменьшить масштаб
         * @returns {number} новый уровень масштаба
         */
        this.zoomOut = () => {
            const newZoom = Math.max(_currentZoom / _zoomStep, _minZoom);
            return this._setZoom(newZoom);
        };
        
        /**
         * 🔍 Установить конкретный масштаб
         * @param {number} zoom - желаемый масштаб
         * @returns {number} установленный масштаб
         */
        this.setZoom = (zoom) => {
            if (typeof zoom !== 'number' || zoom <= 0) {
                throw new Error('Zoom must be a positive number');
            }
            
            const clampedZoom = Math.max(_minZoom, Math.min(zoom, _maxZoom));
            return this._setZoom(clampedZoom);
        };
        
        /**
         * 🔍 Масштаб "по размеру" (fit to view)
         * @param {Object} contentBounds - границы контента {width, height}
         * @returns {number} установленный масштаб
         */
        this.fitToView = (contentBounds) => {
            if (!contentBounds || !contentBounds.width || !contentBounds.height) {
                console.warn('ZoomControl.fitToView: invalid contentBounds');
                return _currentZoom;
            }
            
            const canvasRect = _canvas.getBoundingClientRect();
            const padding = 50; // отступы
            
            const scaleX = (canvasRect.width - padding) / contentBounds.width;
            const scaleY = (canvasRect.height - padding) / contentBounds.height;
            
            const fitZoom = Math.min(scaleX, scaleY);
            return this.setZoom(fitZoom);
        };
        
        /**
         * 📢 Подписаться на изменения масштаба
         * @param {string} eventName - имя события ('zoom-changed')
         * @param {Function} callback - функция обратного вызова
         */
        this.on = (eventName, callback) => {
            if (typeof callback !== 'function') {
                throw new Error('Callback must be a function');
            }
            
            if (!_callbacks.has(eventName)) {
                _callbacks.set(eventName, []);
            }
            
            _callbacks.get(eventName).push(callback);
        };
        
        /**
         * 📢 Отписаться от изменений
         * @param {string} eventName
         * @param {Function} callback
         */
        this.off = (eventName, callback) => {
            if (_callbacks.has(eventName)) {
                const callbacks = _callbacks.get(eventName);
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
        
        /**
         * 🧹 Уничтожение компонента
         */
        this.destroy = () => {
            _callbacks.clear();
            _canvas = null;
        };
        
        // ===============================================
        // 🔒 ПРИВАТНЫЕ МЕТОДЫ
        // ===============================================
        
        /**
         * 🔒 Внутренний метод установки масштаба
         * @private
         */
        this._setZoom = (newZoom) => {
            const oldZoom = _currentZoom;
            _currentZoom = newZoom;
            
            // Уведомляем подписчиков
            this._emit('zoom-changed', {
                oldZoom,
                newZoom: _currentZoom,
                zoomFactor: _currentZoom / oldZoom
            });
            
            return _currentZoom;
        };
        
        /**
         * 🔒 Внутренний метод генерации событий
         * @private
         */
        this._emit = (eventName, data) => {
            if (_callbacks.has(eventName)) {
                _callbacks.get(eventName).forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`ZoomControl event handler error:`, error);
                    }
                });
            }
        };
        
        // ===============================================
        // 🔒 ФИНАЛЬНАЯ ЗАЩИТА
        // ===============================================
        
        // Замораживаем публичные методы
        Object.freeze(this.zoomIn);
        Object.freeze(this.zoomOut);
        Object.freeze(this.setZoom);
        Object.freeze(this.fitToView);
        Object.freeze(this.on);
        Object.freeze(this.off);
        Object.freeze(this.destroy);
        
        // Блокируем добавление новых свойств
        Object.preventExtensions(this);
        
        console.log('🔍 ZoomControl initialized with SRP compliance');
    }
    
    // ===============================================
    // 🏭 СТАТИЧЕСКИЕ МЕТОДЫ
    // ===============================================
    
    /**
     * 🏭 Фабричный метод для создания ZoomControl с привязкой к DOM
     * @param {string} canvasId - ID canvas элемента
     * @returns {ZoomControl}
     */
    static createForCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error(`Canvas element with ID '${canvasId}' not found`);
        }
        
        return new ZoomControl(canvas);
    }
    
    /**
     * 📊 Получить информацию о классе
     * @returns {Object}
     */
    static getInfo() {
        return Object.freeze({
            name: 'ZoomControl',
            version: '1.0.0',
            responsibility: 'Zoom management only',
            compliance: 'SRP + OOP + Encapsulation',
            dependencies: 'None (standalone)'
        });
    }
}

// Финальная защита класса
Object.freeze(ZoomControl);
Object.freeze(ZoomControl.prototype);

console.log('🔍 ZoomControl micro-component loaded - SRP compliant');
