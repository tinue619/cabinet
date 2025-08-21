/**
 * MICRO-COMPONENT: Dimension Input
 * Single Responsibility: ТОЛЬКО ввод и валидация размеров
 * Domain Layer: UI Component - Dimension Management
 */

"use strict";

/**
 * 📐 КОНТРОЛЛЕР ВВОДА РАЗМЕРОВ
 * Инкапсулированный компонент для ввода габаритов шкафа
 * Соблюдает принципы ООП и Single Responsibility
 */
export class DimensionInput {
    
    constructor(containerElement, initialDimensions = {}) {
        if (!containerElement) {
            throw new Error('DimensionInput requires container element');
        }
        
        // 🔒 Приватные данные - полная инкапсуляция
        let _container = containerElement;
        let _dimensions = Object.freeze({
            width: initialDimensions.width || 800,
            height: initialDimensions.height || 2000,
            depth: initialDimensions.depth || 600,
            baseHeight: initialDimensions.baseHeight || 100
        });
        
        let _constraints = Object.freeze({
            width: { min: 400, max: 2000, step: 10 },
            height: { min: 600, max: 3000, step: 10 },
            depth: { min: 300, max: 800, step: 10 },
            baseHeight: { min: 60, max: 200, step: 5 }
        });
        
        let _callbacks = new Map();
        let _inputs = new Map();
        let _isValid = true;
        
        // ===============================================
        // 🔍 ПУБЛИЧНЫЕ ГЕТТЕРЫ (только чтение)
        // ===============================================
        
        Object.defineProperty(this, 'dimensions', {
            get: () => Object.freeze({..._dimensions}),
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'isValid', {
            get: () => _isValid,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'constraints', {
            get: () => Object.freeze({..._constraints}),
            enumerable: true,
            configurable: false
        });
        
        // ===============================================
        // 🎯 ПУБЛИЧНЫЕ МЕТОДЫ
        // ===============================================
        
        /**
         * 🏗️ Инициализация UI компонента
         */
        this.initialize = () => {
            this._createInputs();
            this._bindEvents();
            this._validateAll();
            
            console.log('📐 DimensionInput initialized with SRP compliance');
        };
        
        /**
         * 📐 Установить новые размеры
         * @param {Object} newDimensions - новые размеры
         * @returns {boolean} успех операции
         */
        this.setDimensions = (newDimensions) => {
            if (!newDimensions || typeof newDimensions !== 'object') {
                throw new Error('Invalid dimensions object');
            }
            
            const validatedDimensions = this._validateDimensions(newDimensions);
            
            if (validatedDimensions) {
                const oldDimensions = _dimensions;
                _dimensions = Object.freeze(validatedDimensions);
                
                this._updateInputValues();
                this._emit('dimensions-changed', {
                    oldDimensions,
                    newDimensions: _dimensions
                });
                
                return true;
            }
            
            return false;
        };
        
        /**
         * 📢 Подписаться на изменения размеров
         * @param {string} eventName - имя события
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
            _inputs.clear();
            if (_container) {
                _container.innerHTML = '';
                _container = null;
            }
        };
        
        // ===============================================
        // 🔒 ПРИВАТНЫЕ МЕТОДЫ
        // ===============================================
        
        /**
         * 🔒 Создание input элементов
         * @private
         */
        this._createInputs = () => {
            const inputsHTML = `
                <div class="dimension-input-group">
                    <h3>Габариты шкафа</h3>
                    
                    <div class="input-row">
                        <label for="dim-width">Ширина (мм)</label>
                        <input type="number" id="dim-width" 
                               min="${_constraints.width.min}" 
                               max="${_constraints.width.max}" 
                               step="${_constraints.width.step}"
                               value="${_dimensions.width}">
                        <span class="validation-message" id="width-error"></span>
                    </div>
                    
                    <div class="input-row">
                        <label for="dim-height">Высота (мм)</label>
                        <input type="number" id="dim-height" 
                               min="${_constraints.height.min}" 
                               max="${_constraints.height.max}" 
                               step="${_constraints.height.step}"
                               value="${_dimensions.height}">
                        <span class="validation-message" id="height-error"></span>
                    </div>
                    
                    <div class="input-row">
                        <label for="dim-depth">Глубина (мм)</label>
                        <input type="number" id="dim-depth" 
                               min="${_constraints.depth.min}" 
                               max="${_constraints.depth.max}" 
                               step="${_constraints.depth.step}"
                               value="${_dimensions.depth}">
                        <span class="validation-message" id="depth-error"></span>
                    </div>
                    
                    <div class="input-row">
                        <label for="dim-base">Цоколь (мм)</label>
                        <input type="number" id="dim-base" 
                               min="${_constraints.baseHeight.min}" 
                               max="${_constraints.baseHeight.max}" 
                               step="${_constraints.baseHeight.step}"
                               value="${_dimensions.baseHeight}">
                        <span class="validation-message" id="baseHeight-error"></span>
                    </div>
                    
                    <button type="button" id="apply-dimensions" class="apply-btn" disabled>
                        Применить изменения
                    </button>
                </div>
            `;
            
            _container.innerHTML = inputsHTML;
            
            // Кэшируем ссылки на элементы
            _inputs.set('width', document.getElementById('dim-width'));
            _inputs.set('height', document.getElementById('dim-height'));
            _inputs.set('depth', document.getElementById('dim-depth'));
            _inputs.set('baseHeight', document.getElementById('dim-base'));
            _inputs.set('applyBtn', document.getElementById('apply-dimensions'));
        };
        
        /**
         * 🔒 Привязка событий
         * @private
         */
        this._bindEvents = () => {
            // События input для валидации в реальном времени
            ['width', 'height', 'depth', 'baseHeight'].forEach(dimension => {
                const input = _inputs.get(dimension);
                if (input) {
                    input.addEventListener('input', () => {
                        this._validateSingle(dimension);
                        this._updateApplyButton();
                    });
                }
            });
            
            // Кнопка применения
            const applyBtn = _inputs.get('applyBtn');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    this._applyChanges();
                });
            }
        };
        
        /**
         * 🔒 Валидация одного поля
         * @private
         */
        this._validateSingle = (dimension) => {
            const input = _inputs.get(dimension);
            const errorElement = document.getElementById(`${dimension}-error`);
            
            if (!input || !errorElement) return false;
            
            const value = parseInt(input.value);
            const constraint = _constraints[dimension];
            
            let isValid = true;
            let errorMessage = '';
            
            if (isNaN(value)) {
                isValid = false;
                errorMessage = 'Введите число';
            } else if (value < constraint.min) {
                isValid = false;
                errorMessage = `Минимум ${constraint.min}мм`;
            } else if (value > constraint.max) {
                isValid = false;
                errorMessage = `Максимум ${constraint.max}мм`;
            }
            
            // Обновляем UI
            input.classList.toggle('invalid', !isValid);
            errorElement.textContent = errorMessage;
            errorElement.style.display = errorMessage ? 'block' : 'none';
            
            return isValid;
        };
        
        /**
         * 🔒 Валидация всех полей
         * @private
         */
        this._validateAll = () => {
            const validations = ['width', 'height', 'depth', 'baseHeight']
                .map(dim => this._validateSingle(dim));
            
            _isValid = validations.every(v => v);
            this._updateApplyButton();
            
            return _isValid;
        };
        
        /**
         * 🔒 Обновление состояния кнопки применения
         * @private
         */
        this._updateApplyButton = () => {
            const applyBtn = _inputs.get('applyBtn');
            if (applyBtn) {
                applyBtn.disabled = !_isValid;
                applyBtn.textContent = _isValid ? 'Применить изменения' : 'Исправьте ошибки';
            }
        };
        
        /**
         * 🔒 Применение изменений
         * @private
         */
        this._applyChanges = () => {
            if (!_isValid) return;
            
            const newDimensions = {
                width: parseInt(_inputs.get('width').value),
                height: parseInt(_inputs.get('height').value),
                depth: parseInt(_inputs.get('depth').value),
                baseHeight: parseInt(_inputs.get('baseHeight').value)
            };
            
            this.setDimensions(newDimensions);
        };
        
        /**
         * 🔒 Валидация объекта размеров
         * @private
         */
        this._validateDimensions = (dims) => {
            const validated = {};
            
            for (const [key, constraint] of Object.entries(_constraints)) {
                const value = dims[key];
                
                if (typeof value !== 'number' || isNaN(value)) {
                    console.error(`Invalid ${key}: must be a number`);
                    return null;
                }
                
                if (value < constraint.min || value > constraint.max) {
                    console.error(`Invalid ${key}: must be between ${constraint.min} and ${constraint.max}`);
                    return null;
                }
                
                validated[key] = value;
            }
            
            return validated;
        };
        
        /**
         * 🔒 Обновление значений в inputs
         * @private
         */
        this._updateInputValues = () => {
            for (const [dimension, value] of Object.entries(_dimensions)) {
                const input = _inputs.get(dimension);
                if (input) {
                    input.value = value;
                }
            }
        };
        
        /**
         * 🔒 Генерация событий
         * @private
         */
        this._emit = (eventName, data) => {
            if (_callbacks.has(eventName)) {
                _callbacks.get(eventName).forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`DimensionInput event handler error:`, error);
                    }
                });
            }
        };
        
        // Блокируем добавление новых свойств
        Object.preventExtensions(this);
    }
    
    // ===============================================
    // 🏭 СТАТИЧЕСКИЕ МЕТОДЫ
    // ===============================================
    
    /**
     * 🏭 Фабричный метод
     */
    static createForContainer(containerId, initialDimensions) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with ID '${containerId}' not found`);
        }
        
        const component = new DimensionInput(container, initialDimensions);
        component.initialize();
        return component;
    }
    
    /**
     * 📊 Информация о компоненте
     */
    static getInfo() {
        return Object.freeze({
            name: 'DimensionInput',
            version: '1.0.0',
            responsibility: 'Dimension input and validation only',
            compliance: 'SRP + OOP + Encapsulation',
            dependencies: 'None (standalone)'
        });
    }
}

// Финальная защита класса
Object.freeze(DimensionInput);
Object.freeze(DimensionInput.prototype);

console.log('📐 DimensionInput micro-component loaded - SRP compliant');
