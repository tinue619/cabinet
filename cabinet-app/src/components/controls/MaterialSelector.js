/**
 * MICRO-COMPONENT: Material Selector
 * Single Responsibility: ТОЛЬКО выбор и отображение материалов
 * Domain Layer: UI Component - Material Management
 */

"use strict";

/**
 * 🧱 СЕЛЕКТОР МАТЕРИАЛОВ
 * Инкапсулированный компонент для выбора и отображения материалов
 * Соблюдает принципы ООП и Single Responsibility
 */
export class MaterialSelector {
    
    constructor(containerElement, availableMaterials = {}) {
        if (!containerElement) {
            throw new Error('MaterialSelector requires container element');
        }
        
        // 🔒 Приватные данные - полная инкапсуляция
        let _container = containerElement;
        let _materials = new Map();
        let _selectedMaterial = null;
        let _callbacks = new Map();
        let _isInitialized = false;
        
        // Инициализируем материалы
        for (const [key, material] of Object.entries(availableMaterials)) {
            _materials.set(key, material);
        }
        
        // ===============================================
        // 🔍 ПУБЛИЧНЫЕ ГЕТТЕРЫ (только чтение)
        // ===============================================
        
        Object.defineProperty(this, 'selectedMaterial', {
            get: () => _selectedMaterial,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'materialsCount', {
            get: () => _materials.size,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'isInitialized', {
            get: () => _isInitialized,
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
            this._createMaterialsUI();
            this._bindEvents();
            _isInitialized = true;
            
            console.log(`🧱 MaterialSelector initialized with ${_materials.size} materials`);
        };
        
        /**
         * 🧱 Добавить материал
         * @param {string} key - ключ материала
         * @param {Object} material - объект материала
         */
        this.addMaterial = (key, material) => {
            if (!material || !material.name) {
                throw new Error('Invalid material object');
            }
            
            _materials.set(key, material);
            
            if (_isInitialized) {
                this._updateMaterialsUI();
            }
            
            this._emit('material-added', { key, material });
        };
        
        /**
         * 🎯 Выбрать материал
         * @param {string} materialKey - ключ материала
         * @returns {boolean} успех операции
         */
        this.selectMaterial = (materialKey) => {
            if (!_materials.has(materialKey)) {
                console.warn(`Material ${materialKey} not found`);
                return false;
            }
            
            const oldMaterial = _selectedMaterial;
            _selectedMaterial = _materials.get(materialKey);
            
            this._updateSelectedUI();
            this._emit('material-selected', {
                oldMaterial,
                newMaterial: _selectedMaterial,
                materialKey
            });
            
            return true;
        };
        
        /**
         * 📋 Получить все материалы
         * @returns {Array} массив материалов
         */
        this.getAllMaterials = () => {
            return Array.from(_materials.entries()).map(([key, material]) => ({
                key,
                material
            }));
        };
        
        /**
         * 🔍 Найти материалы по типу
         * @param {string} materialType - тип материала (structural, backing, facade)
         * @returns {Array} массив подходящих материалов
         */
        this.findByType = (materialType) => {
            const result = [];
            
            for (const [key, material] of _materials.entries()) {
                if (material.materialKind === materialType || material.type === materialType) {
                    result.push({ key, material });
                }
            }
            
            return result;
        };
        
        /**
         * 📢 Подписаться на события
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
         * 📢 Отписаться от событий
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
            _materials.clear();
            if (_container) {
                _container.innerHTML = '';
                _container = null;
            }
            _selectedMaterial = null;
            _isInitialized = false;
        };
        
        // ===============================================
        // 🔒 ПРИВАТНЫЕ МЕТОДЫ
        // ===============================================
        
        /**
         * 🔒 Создание UI материалов
         * @private
         */
        this._createMaterialsUI = () => {
            const materialsHTML = `
                <div class="material-selector-group">
                    <h3>Материалы</h3>
                    <div class="materials-list" id="materials-list">
                        ${this._generateMaterialsHTML()}
                    </div>
                    <div class="material-info" id="material-info">
                        <div class="no-selection">Выберите материал</div>
                    </div>
                </div>
            `;
            
            _container.innerHTML = materialsHTML;
        };
        
        /**
         * 🔒 Генерация HTML для материалов
         * @private
         */
        this._generateMaterialsHTML = () => {
            let html = '';
            
            for (const [key, material] of _materials.entries()) {
                const usage = Array.isArray(material.usage) 
                    ? material.usage.join(', ') 
                    : (material.usage || 'Универсальный');
                
                html += `
                    <div class="material-item" data-material-key="${key}">
                        <div class="material-header">
                            <span class="material-name">${material.name}</span>
                            <span class="material-thickness">${material.thickness}мм</span>
                        </div>
                        <div class="material-usage">${usage}</div>
                        <div class="material-type">${this._formatMaterialType(material.materialKind || material.type)}</div>
                    </div>
                `;
            }
            
            return html || '<div class="empty-materials">Нет доступных материалов</div>';
        };
        
        /**
         * 🔒 Форматирование типа материала
         * @private
         */
        this._formatMaterialType = (type) => {
            const typeMap = {
                'structural': 'Конструкционный',
                'backing': 'Задняя стенка',
                'facade': 'Фасадный'
            };
            
            return typeMap[type] || type || 'Неизвестный';
        };
        
        /**
         * 🔒 Обновление UI материалов
         * @private
         */
        this._updateMaterialsUI = () => {
            const materialsList = document.getElementById('materials-list');
            if (materialsList) {
                materialsList.innerHTML = this._generateMaterialsHTML();
                this._bindMaterialEvents();
            }
        };
        
        /**
         * 🔒 Обновление UI выбранного материала
         * @private
         */
        this._updateSelectedUI = () => {
            // Убираем выделение со всех элементов
            const allItems = _container.querySelectorAll('.material-item');
            allItems.forEach(item => item.classList.remove('selected'));
            
            // Выделяем выбранный материал
            if (_selectedMaterial) {
                const selectedKey = this._findMaterialKey(_selectedMaterial);
                if (selectedKey) {
                    const selectedItem = _container.querySelector(`[data-material-key="${selectedKey}"]`);
                    if (selectedItem) {
                        selectedItem.classList.add('selected');
                    }
                }
                
                // Обновляем информационную панель
                this._updateMaterialInfo();
            }
        };
        
        /**
         * 🔒 Обновление информации о материале
         * @private
         */
        this._updateMaterialInfo = () => {
            const infoContainer = document.getElementById('material-info');
            if (!infoContainer || !_selectedMaterial) return;
            
            const usage = Array.isArray(_selectedMaterial.usage) 
                ? _selectedMaterial.usage.join(', ') 
                : (_selectedMaterial.usage || 'Универсальный');
            
            infoContainer.innerHTML = `
                <div class="selected-material-info">
                    <h4>${_selectedMaterial.name}</h4>
                    <div class="material-details">
                        <div class="detail-row">
                            <span class="label">Толщина:</span>
                            <span class="value">${_selectedMaterial.thickness}мм</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Тип:</span>
                            <span class="value">${this._formatMaterialType(_selectedMaterial.materialKind || _selectedMaterial.type)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Применение:</span>
                            <span class="value">${usage}</span>
                        </div>
                    </div>
                </div>
            `;
        };
        
        /**
         * 🔒 Поиск ключа материала
         * @private
         */
        this._findMaterialKey = (material) => {
            for (const [key, mat] of _materials.entries()) {
                if (mat === material || mat.name === material.name) {
                    return key;
                }
            }
            return null;
        };
        
        /**
         * 🔒 Привязка событий
         * @private
         */
        this._bindEvents = () => {
            this._bindMaterialEvents();
        };
        
        /**
         * 🔒 Привязка событий материалов
         * @private
         */
        this._bindMaterialEvents = () => {
            const materialItems = _container.querySelectorAll('.material-item');
            
            materialItems.forEach(item => {
                item.addEventListener('click', () => {
                    const materialKey = item.dataset.materialKey;
                    if (materialKey) {
                        this.selectMaterial(materialKey);
                    }
                });
                
                // Добавляем hover эффекты
                item.addEventListener('mouseenter', () => {
                    item.classList.add('hovered');
                });
                
                item.addEventListener('mouseleave', () => {
                    item.classList.remove('hovered');
                });
            });
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
                        console.error(`MaterialSelector event handler error:`, error);
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
     * @param {string} containerId - ID контейнера
     * @param {Object} materials - объект материалов
     * @returns {MaterialSelector}
     */
    static createForContainer(containerId, materials = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with ID '${containerId}' not found`);
        }
        
        const component = new MaterialSelector(container, materials);
        component.initialize();
        return component;
    }
    
    /**
     * 📊 Информация о компоненте
     * @returns {Object}
     */
    static getInfo() {
        return Object.freeze({
            name: 'MaterialSelector',
            version: '1.0.0',
            responsibility: 'Material selection and display only',
            compliance: 'SRP + OOP + Encapsulation',
            dependencies: 'None (standalone)'
        });
    }
}

// Финальная защита класса
Object.freeze(MaterialSelector);
Object.freeze(MaterialSelector.prototype);

console.log('🧱 MaterialSelector micro-component loaded - SRP compliant');
