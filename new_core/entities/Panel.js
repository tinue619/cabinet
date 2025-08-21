// 📐 ПАНЕЛЬ - Универсальная сущность всех панелей шкафа
// Включает все типы: боковины, крышу, дно, цоколи, заднюю стенку, фасад

"use strict";

import { ArchitecturalBase } from '../core/ArchitecturalBase.js';
import { CABINET_DNA } from '../cabinet-dna.js';

/**
 * 📐 СПЕЦИФИКАЦИИ ПАНЕЛЕЙ
 * Содержит формулы расчета для каждого типа панели из онтологии
 */
const PANEL_SPECIFICATIONS = Object.freeze({
    // Боковины
    LEFT_SIDE: Object.freeze({
        name: 'Боковина левая',
        material: 'LDSP_16',
        orientation: CABINET_DNA.PANEL_TYPES.VERTICAL,
        calculatePosition: (cabinet) => CABINET_DNA.GENERATION.POSITION_FORMULAS.LEFT_SIDE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        calculateSize: (cabinet) => CABINET_DNA.GENERATION.SIZE_FORMULAS.LEFT_SIDE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        connections: ['TOP', 'BOTTOM', 'FRONT_BASE', 'BACK_BASE']
    }),
    
    RIGHT_SIDE: Object.freeze({
        name: 'Боковина правая',
        material: 'LDSP_16',
        orientation: CABINET_DNA.PANEL_TYPES.VERTICAL,
        calculatePosition: (cabinet) => CABINET_DNA.GENERATION.POSITION_FORMULAS.RIGHT_SIDE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        calculateSize: (cabinet) => CABINET_DNA.GENERATION.SIZE_FORMULAS.RIGHT_SIDE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        connections: ['TOP', 'BOTTOM', 'FRONT_BASE', 'BACK_BASE']
    }),
    
    // Горизонтальные панели
    TOP: Object.freeze({
        name: 'Крыша',
        material: 'LDSP_16',
        orientation: CABINET_DNA.PANEL_TYPES.HORIZONTAL,
        calculatePosition: (cabinet) => CABINET_DNA.GENERATION.POSITION_FORMULAS.TOP(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        calculateSize: (cabinet) => CABINET_DNA.GENERATION.SIZE_FORMULAS.TOP(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        connections: ['LEFT_SIDE', 'RIGHT_SIDE', 'BACK_WALL']
    }),
    
    BOTTOM: Object.freeze({
        name: 'Дно',
        material: 'LDSP_16',
        orientation: CABINET_DNA.PANEL_TYPES.HORIZONTAL,
        calculatePosition: (cabinet) => CABINET_DNA.GENERATION.POSITION_FORMULAS.BOTTOM(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        calculateSize: (cabinet) => CABINET_DNA.GENERATION.SIZE_FORMULAS.BOTTOM(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        connections: ['LEFT_SIDE', 'RIGHT_SIDE', 'BACK_WALL']
    }),
    
    // Цоколи
    FRONT_BASE: Object.freeze({
        name: 'Цоколь передний',
        material: 'LDSP_16',
        orientation: CABINET_DNA.PANEL_TYPES.FRONTAL,
        calculatePosition: (cabinet) => CABINET_DNA.GENERATION.POSITION_FORMULAS.FRONT_BASE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        calculateSize: (cabinet) => CABINET_DNA.GENERATION.SIZE_FORMULAS.FRONT_BASE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        connections: ['LEFT_SIDE', 'RIGHT_SIDE']
    }),
    
    BACK_BASE: Object.freeze({
        name: 'Цоколь задний',
        material: 'LDSP_16',
        orientation: CABINET_DNA.PANEL_TYPES.FRONTAL,
        calculatePosition: (cabinet) => CABINET_DNA.GENERATION.POSITION_FORMULAS.BACK_BASE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        calculateSize: (cabinet) => CABINET_DNA.GENERATION.SIZE_FORMULAS.BACK_BASE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        connections: ['LEFT_SIDE', 'RIGHT_SIDE']
    }),
    
    // Задняя стенка (особая логика)
    BACK_WALL: Object.freeze({
        name: 'Задняя стенка',
        material: 'HDF_3',
        orientation: CABINET_DNA.PANEL_TYPES.FRONTAL,
        calculatePosition: (cabinet) => CABINET_DNA.GENERATION.POSITION_FORMULAS.BACK_WALL(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        calculateSize: (cabinet) => CABINET_DNA.GENERATION.SIZE_FORMULAS.BACK_WALL(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        connections: ['TOP', 'BOTTOM'],
        special: 'back_wall' // маркер для особой логики
    }),
    
    // Фасад
    FACADE: Object.freeze({
        name: 'Фасад',
        material: 'MDF_16',
        orientation: CABINET_DNA.PANEL_TYPES.FRONTAL,
        calculatePosition: (cabinet) => CABINET_DNA.GENERATION.POSITION_FORMULAS.FACADE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        calculateSize: (cabinet) => CABINET_DNA.GENERATION.SIZE_FORMULAS.FACADE(
            cabinet.dimensions.width, cabinet.dimensions.height, cabinet.dimensions.depth,
            cabinet.materialThickness, cabinet.dimensions.baseHeight
        ),
        connections: [],
        special: 'facade' // маркер для особой логики
    })
});

/**
 * 📐 ПАНЕЛЬ
 * Универсальный класс для всех типов панелей шкафа
 * Автоматически вычисляет размеры и позиции по формулам из ДНК
 */
export class Panel extends ArchitecturalBase {
    constructor(panelType, material, cabinet) {
        super('Panel', `panel_${panelType}_${Date.now()}`);
        
        // Валидация входных данных
        if (!PANEL_SPECIFICATIONS[panelType]) {
            const available = Object.keys(PANEL_SPECIFICATIONS).join(', ');
            throw new Error(`Unknown panel type: ${panelType}. Available: ${available}`);
        }
        
        if (!material || !material.isCompatibleWith) {
            throw new Error('Panel must have valid Material instance');
        }
        
        if (!cabinet || !cabinet.dimensions) {
            throw new Error('Panel must have valid Cabinet instance');
        }
        
        // 🔒 Приватные данные панели
        let _panelType = panelType;
        let _specification = PANEL_SPECIFICATIONS[panelType];
        let _material = material;
        let _cabinet = cabinet;
        let _connections = new Map(); // связи с другими панелями
        
        // Вычисляем начальные размеры и позицию
        let _dimensions = Object.freeze(_specification.calculateSize(_cabinet));
        let _position = Object.freeze(_specification.calculatePosition(_cabinet));
        
        // Валидация материала с типом панели
        if (!_material.isCompatibleWith(_specification.name.toLowerCase())) {
            console.warn(`Material ${_material.name} may not be suitable for ${_specification.name}`);
        }
        
        // 🔍 Публичные геттеры (только чтение)
        Object.defineProperty(this, 'panelType', {
            get: () => _panelType,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'name', {
            get: () => _specification.name,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'material', {
            get: () => _material,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'orientation', {
            get: () => _specification.orientation,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'dimensions', {
            get: () => _dimensions,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'position', {
            get: () => _position,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'connections', {
            get: () => new Map(_connections), // копия
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'isBackWall', {
            get: () => _specification.special === 'back_wall',
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'isFacade', {
            get: () => _specification.special === 'facade',
            enumerable: true,
            configurable: false
        });
        
        // ===============================================
        // 🔗 УПРАВЛЕНИЕ СВЯЗЯМИ МЕЖДУ ПАНЕЛЯМИ
        // ===============================================
        
        /**
         * 🔗 Соединение с другой панелью
         * @param {Panel} otherPanel 
         * @param {string} connectionType 
         * @returns {boolean}
         */
        this.connectTo = (otherPanel, connectionType = 'edge') => {
            if (!otherPanel || !(otherPanel instanceof Panel)) {
                throw new Error('Can only connect to other Panel instances');
            }
            
            // Проверяем что связь разрешена спецификацией
            if (!_specification.connections.includes(otherPanel.panelType)) {
                console.warn(`Connection ${_panelType} -> ${otherPanel.panelType} not specified in schema`);
            }
            
            // Проверяем что связь еще не существует
            if (_connections.has(otherPanel.id)) {
                return false;
            }
            
            const connection = Object.freeze({
                panel: otherPanel,
                type: connectionType,
                created: Date.now()
            });
            
            _connections.set(otherPanel.id, connection);
            this._emit('panel-connected', { otherPanel, connectionType });
            
            // Создаем обратную связь
            if (!otherPanel.isConnectedTo(this)) {
                otherPanel.connectTo(this, connectionType);
            }
            
            return true;
        };
        
        /**
         * 🔗 Отсоединение от другой панели
         * @param {Panel} otherPanel 
         * @returns {boolean}
         */
        this.disconnectFrom = (otherPanel) => {
            if (!_connections.has(otherPanel.id)) {
                return false;
            }
            
            _connections.delete(otherPanel.id);
            this._emit('panel-disconnected', { otherPanel });
            
            // Удаляем обратную связь
            if (otherPanel.isConnectedTo(this)) {
                otherPanel.disconnectFrom(this);
            }
            
            return true;
        };
        
        /**
         * ❓ Проверка соединения с панелью
         * @param {Panel} otherPanel 
         * @returns {boolean}
         */
        this.isConnectedTo = (otherPanel) => {
            return _connections.has(otherPanel.id);
        };
        
        /**
         * 📋 Получить все соединенные панели
         * @returns {Panel[]}
         */
        this.getConnectedPanels = () => {
            return Array.from(_connections.values()).map(conn => conn.panel);
        };
        
        // ===============================================
        // 📐 ГЕОМЕТРИЧЕСКИЕ ОПЕРАЦИИ
        // ===============================================
        
        /**
         * 📏 Пересчет размеров панели (при изменении шкафа)
         * Автоматически вызывается при изменении габаритов шкафа
         */
        this.recalculateDimensions = () => {
            const newDimensions = _specification.calculateSize(_cabinet);
            const newPosition = _specification.calculatePosition(_cabinet);
            
            const oldDimensions = _dimensions;
            const oldPosition = _position;
            
            _dimensions = Object.freeze(newDimensions);
            _position = Object.freeze(newPosition);
            
            this._emit('dimensions-recalculated', { 
                oldDimensions, 
                newDimensions: _dimensions,
                oldPosition,
                newPosition: _position
            });
            
            this._notifyGeometryChange();
        };
        
        /**
         * 🔄 Уведомление об изменении геометрии
         * @private
         */
        this._notifyGeometryChange = () => {
            this._emit('geometry-changed', { 
                panelType: _panelType,
                dimensions: _dimensions, 
                position: _position 
            });
        };
        
        /**
         * 📏 Получение границ панели (для 2D и 3D)
         * @returns {Object}
         */
        this.getBounds = () => {
            return Object.freeze({
                // 2D границы (для секций)
                left: _position.x,
                right: _position.x + _dimensions.width,
                top: _position.y,
                bottom: _position.y + _dimensions.height,
                
                // 3D границы (для визуализации)
                front: _position.z,
                back: _position.z + _dimensions.depth,
                
                // Размеры
                width: _dimensions.width,
                height: _dimensions.height,
                depth: _dimensions.depth,
                thickness: _material.thickness
            });
        };
        
        /**
         * 🎯 Проверка попадания точки в панель (2D режим)
         * @param {number} x 
         * @param {number} y 
         * @returns {boolean}
         */
        this.containsPoint2D = (x, y) => {
            return x >= _position.x && x <= _position.x + _dimensions.width &&
                   y >= _position.y && y <= _position.y + _dimensions.height;
        };
        
        /**
         * 📐 Получение центра панели
         * @returns {Object}
         */
        this.getCenter = () => {
            return Object.freeze({
                x: _position.x + _dimensions.width / 2,
                y: _position.y + _dimensions.height / 2,
                z: _position.z + _dimensions.depth / 2
            });
        };
        
        // ===============================================
        // 🎨 ОСОБАЯ ЛОГИКА ДЛЯ РАЗНЫХ ТИПОВ ПАНЕЛЕЙ
        // ===============================================
        
        /**
         * 🏗️ Настройка особого поведения панели
         * @private
         */
        this._setupSpecialBehavior = () => {
            if (_specification.special === 'back_wall') {
                this._setupBackWallBehavior();
            } else if (_specification.special === 'facade') {
                this._setupFacadeBehavior();
            }
        };
        
        /**
         * 🔧 Особая логика для задней стенки
         * @private
         */
        this._setupBackWallBehavior = () => {
            // Задняя стенка устанавливается в паз, не торец в торец
            // Может быть съемной для доступа к коммуникациям
            this._setProperty('removable', true);
            this._setProperty('installation_type', 'groove'); // в паз
            this._setProperty('load_bearing', false); // не несущая
        };
        
        /**
         * 🚪 Особая логика для фасада
         * @private
         */
        this._setupFacadeBehavior = () => {
            // Фасад может открываться, иметь ручки
            this._setProperty('openable', true);
            this._setProperty('has_handles', true);
            this._setProperty('opening_angle', 110); // стандартный угол открытия
        };
        
        // Настраиваем особое поведение при создании
        this._setupSpecialBehavior();
        
        // ===============================================
        // 💾 СЕРИАЛИЗАЦИЯ
        // ===============================================
        
        /**
         * 🎯 Специфичные данные панели для сериализации
         * @returns {Object}
         */
        this.getSpecificData = () => {
            return {
                panelType: _panelType,
                specification: {
                    name: _specification.name,
                    material: _specification.material,
                    orientation: _specification.orientation,
                    special: _specification.special
                },
                material: _material.serialize(),
                dimensions: _dimensions,
                position: _position,
                connections: Array.from(_connections.values()).map(conn => ({
                    panelId: conn.panel.id,
                    panelType: conn.panel.panelType,
                    type: conn.type,
                    created: conn.created
                })),
                bounds: this.getBounds(),
                center: this.getCenter()
            };
        };
        
        // ===============================================
        // 🔒 ФИНАЛЬНАЯ ЗАЩИТА
        // ===============================================
        
        // Замораживаем методы
        Object.freeze(this.connectTo);
        Object.freeze(this.disconnectFrom);
        Object.freeze(this.isConnectedTo);
        Object.freeze(this.getConnectedPanels);
        Object.freeze(this.recalculateDimensions);
        Object.freeze(this.getBounds);
        Object.freeze(this.containsPoint2D);
        Object.freeze(this.getCenter);
        
        // Панель готова к использованию
        Object.preventExtensions(this);
    }
    
    // ===============================================
    // 🏭 СТАТИЧЕСКИЕ МЕТОДЫ
    // ===============================================
    
    /**
     * 📋 Получить все доступные типы панелей
     * @returns {string[]}
     */
    static getAvailableTypes() {
        return Object.keys(PANEL_SPECIFICATIONS);
    }
    
    /**
     * 📊 Получить спецификацию панели
     * @param {string} panelType 
     * @returns {Object|null}
     */
    static getSpecification(panelType) {
        return PANEL_SPECIFICATIONS[panelType] || null;
    }
    
    /**
     * 🔍 Найти панели по материалу
     * @param {string} materialType 
     * @returns {string[]}
     */
    static findByMaterial(materialType) {
        const result = [];
        
        for (const [panelType, spec] of Object.entries(PANEL_SPECIFICATIONS)) {
            if (spec.material === materialType) {
                result.push(panelType);
            }
        }
        
        return result;
    }
    
    /**
     * 🔍 Найти панели по ориентации
     * @param {string} orientation 
     * @returns {string[]}
     */
    static findByOrientation(orientation) {
        const result = [];
        
        for (const [panelType, spec] of Object.entries(PANEL_SPECIFICATIONS)) {
            if (spec.orientation === orientation) {
                result.push(panelType);
            }
        }
        
        return result;
    }
}

console.log('📐 Panel entity loaded with all panel types');