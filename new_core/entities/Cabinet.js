// 🏗️ ШКАФ - Корневая сущность системы
// Содержит все панели, секции и управляет их взаимодействием

"use strict";

import { ArchitecturalBase } from '../core/ArchitecturalBase.js';
import { CABINET_DNA } from '../cabinet-dna.js';
import { Panel } from './Panel.js';
import { Section } from './Section.js';
import { Material } from './Material.js';

/**
 * 🏗️ ШКАФ
 * Корневая сущность - готовое изделие
 * Автоматически создает все обязательные панели по формулам из ДНК
 */
export class Cabinet extends ArchitecturalBase {
    constructor(dimensions, options = {}) {
        super('Cabinet', `cabinet_${Date.now()}`);
        
        // Валидация размеров
        if (!dimensions || !dimensions.width || !dimensions.height || !dimensions.depth) {
            throw new Error('Cabinet requires valid dimensions: {width, height, depth}');
        }
        
        // 🔒 Приватные данные шкафа
        let _dimensions = Object.freeze({
            width: dimensions.width,        // xCabinet
            height: dimensions.height,      // yCabinet  
            depth: dimensions.depth,        // zCabinet
            baseHeight: dimensions.baseHeight || 100
        });
        
        let _materialThickness = options.materialThickness || CABINET_DNA.CONSTANTS.DEFAULT_PANEL_THICKNESS;
        let _panels = new Map();
        let _sections = new Map();
        let _materials = new Map();
        let _isGenerated = false;
        
        // ===============================================
        // 🔍 ПУБЛИЧНЫЕ ГЕТТЕРЫ
        // ===============================================
        
        Object.defineProperty(this, 'dimensions', {
            get: () => _dimensions,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'materialThickness', {
            get: () => _materialThickness,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'isGenerated', {
            get: () => _isGenerated,
            enumerable: true,
            configurable: false
        });
        
        // ===============================================
        // 🏭 ГЕНЕРАЦИЯ ШКАФА
        // ===============================================
        
        /**
         * 🏗️ Генерация всех обязательных компонентов шкафа
         * Создает материалы, панели и секции по формулам из ДНК
         */
        this.generate = () => {
            if (_isGenerated) {
                console.warn('Cabinet already generated');
                return;
            }
            
            try {
                // 1. Создаем материалы
                this._createMaterials();
                
                // 2. Создаем все обязательные панели
                this._createRequiredPanels();
                
                // 3. Устанавливаем связи между панелями
                this._establishPanelConnections();
                
                // 4. Создаем базовые секции
                this._createBaseSections();
                
                _isGenerated = true;
                this._emit('cabinet-generated', { 
                    panelsCount: _panels.size,
                    sectionsCount: _sections.size 
                });
                
                console.log(`🏗️ Cabinet generated: ${_panels.size} panels, ${_sections.size} sections`);
                
            } catch (error) {
                console.error('Cabinet generation failed:', error);
                throw error;
            }
        };
        
        /**
         * 🧱 Создание материалов
         * @private
         */
        this._createMaterials = () => {
            _materials.set('LDSP_16', Material.createLDSP16());
            _materials.set('HDF_3', Material.createHDF3());
            _materials.set('MDF_16', Material.createMDF16());
        };
        
        /**
         * 📐 Создание обязательных панелей
         * @private
         */
        this._createRequiredPanels = () => {
            for (const [panelKey, panelSpec] of Object.entries(CABINET_DNA.REQUIRED_PANELS)) {
                const material = _materials.get(panelSpec.material);
                if (!material) {
                    throw new Error(`Material ${panelSpec.material} not found for panel ${panelKey}`);
                }
                
                const panel = new Panel(panelKey, material, this);
                _panels.set(panelKey, panel);
                
                // Добавляем панель как дочерний элемент
                this._addChild(panel);
            }
        };
        
        /**
         * 🔗 Установка связей между панелями
         * @private
         */
        this._establishPanelConnections = () => {
            // Получаем панели
            const leftSide = _panels.get('LEFT_SIDE');
            const rightSide = _panels.get('RIGHT_SIDE');
            const top = _panels.get('TOP');
            const bottom = _panels.get('BOTTOM');
            const frontBase = _panels.get('FRONT_BASE');
            const backBase = _panels.get('BACK_BASE');
            
            // Устанавливаем связи согласно спецификации
            if (leftSide && top) leftSide.connectTo(top);
            if (leftSide && bottom) leftSide.connectTo(bottom);
            if (rightSide && top) rightSide.connectTo(top);
            if (rightSide && bottom) rightSide.connectTo(bottom);
            if (leftSide && frontBase) leftSide.connectTo(frontBase);
            if (rightSide && frontBase) rightSide.connectTo(frontBase);
            if (leftSide && backBase) leftSide.connectTo(backBase);
            if (rightSide && backBase) rightSide.connectTo(backBase);
        };
        
        /**
         * 📐 Создание базовых секций
         * @private
         */
        this._createBaseSections = () => {
            // Создаем главную секцию между боковинами и горизонтальными панелями
            const leftPanel = _panels.get('LEFT_SIDE');
            const rightPanel = _panels.get('RIGHT_SIDE');
            const topPanel = _panels.get('TOP');
            const bottomPanel = _panels.get('BOTTOM');
            
            if (leftPanel && rightPanel && topPanel && bottomPanel) {
                // ИСПРАВЛЕНО для Canvas-координат (Y=0 вверху)
                const mainSectionBounds = {
                    left: leftPanel.position.x + leftPanel.dimensions.width,    // 0 + 16 = 16
                    right: rightPanel.position.x,                               // 784
                    top: topPanel.position.y + topPanel.dimensions.height,      // 0 + 16 = 16 (сверху)
                    bottom: bottomPanel.position.y                              // 1884 (снизу)
                };
                
                // Проверяем размеры ПЕРЕД созданием секции
                const width = mainSectionBounds.right - mainSectionBounds.left;
                const height = mainSectionBounds.bottom - mainSectionBounds.top;
                
                console.log('🔍 Section bounds calculation (Canvas coords):');
                console.log('  LEFT panel:', leftPanel.position, leftPanel.dimensions);
                console.log('  RIGHT panel:', rightPanel.position, rightPanel.dimensions);
                console.log('  TOP panel:', topPanel.position, topPanel.dimensions);
                console.log('  BOTTOM panel:', bottomPanel.position, bottomPanel.dimensions);
                console.log('  Section bounds:', mainSectionBounds);
                console.log('  Section size:', {width, height});
                
                if (width > CABINET_DNA.CONSTANTS.MIN_SECTION_SIZE && height > CABINET_DNA.CONSTANTS.MIN_SECTION_SIZE) {
                    const mainSection = new Section(mainSectionBounds, this);
                    _sections.set('MAIN_SECTION', mainSection);
                    this._addChild(mainSection);
                    console.log('✅ Main section created successfully:', {width, height});
                } else {
                    console.error('❌ Section too small:', {width, height, minRequired: CABINET_DNA.CONSTANTS.MIN_SECTION_SIZE});
                    throw new Error(`Section dimensions ${width}×${height}mm below minimum ${CABINET_DNA.CONSTANTS.MIN_SECTION_SIZE}mm`);
                }
            }
        };
        
        // ===============================================
        // 📋 МЕТОДЫ ДОСТУПА
        // ===============================================
        
        /**
         * 📐 Получить панель по типу
         * @param {string} panelType 
         * @returns {Panel|null}
         */
        this.getPanel = (panelType) => {
            return _panels.get(panelType) || null;
        };
        
        /**
         * 📋 Получить все панели (объекты)
         * @returns {Panel[]}
         */
        this.getPanels = () => {
            return Array.from(_panels.values());
        };
        
        /**
         * 📋 Получить список панелей с размерами (УПРОЩЕНИЕ - МОЗГ считает сам)
         * @returns {Array}
         */
        this.getPanelsWithSizes = () => {
            const panels = [];
            
            // Проходим по всем обязательным панелям
            for (const [panelKey, panelSpec] of Object.entries(CABINET_DNA.REQUIRED_PANELS)) {
                const material = _materials.get(panelSpec.material);
                if (!material) continue;
                
                // Считаем размеры по формулам из ДНК
                let w, h, d;
                
                switch (panelKey) {
                    case 'LEFT_SIDE':
                    case 'RIGHT_SIDE':
                        w = material.thickness;
                        h = _dimensions.height;
                        d = _dimensions.depth;
                        break;
                    case 'TOP':
                        w = _dimensions.width;
                        h = material.thickness;
                        d = _dimensions.depth;
                        break;
                    case 'BOTTOM':
                        w = _dimensions.width - 2 * _materialThickness;
                        h = material.thickness;
                        d = _dimensions.depth;
                        break;
                    case 'FRONT_BASE':
                    case 'BACK_BASE':
                        w = _dimensions.width - 2 * _materialThickness;
                        h = _dimensions.baseHeight; // ПРАВИЛЬНО: высота цоколя
                        d = material.thickness;     // ПРАВИЛЬНО: толщина материала
                        break;
                    case 'BACK_WALL':
                        w = _dimensions.width - 2 * _materialThickness;
                        h = _dimensions.height - _dimensions.baseHeight - _materialThickness;
                        d = material.thickness;
                        break;
                    case 'FACADE':
                        w = _dimensions.width;
                        h = _dimensions.height - _dimensions.baseHeight;
                        d = material.thickness;
                        break;
                    default:
                        w = 100; h = 100; d = material.thickness;
                }
                
                panels.push({
                    name: panelSpec.name,
                    w: Math.round(w),
                    h: Math.round(h),
                    d: Math.round(d),
                    material: material.name,
                    type: panelSpec.type
                });
            }
            
            return panels;
        };
        
        /**
         * 📐 Получить секцию по ID
         * @param {string} sectionId 
         * @returns {Section|null}
         */
        this.getSection = (sectionId) => {
            return _sections.get(sectionId) || null;
        };
        
        /**
         * 📋 Получить все секции
         * @returns {Section[]}
         */
        this.getSections = () => {
            return Array.from(_sections.values());
        };
        
        /**
         * 🧱 Получить материал по типу
         * @param {string} materialType 
         * @returns {Material|null}
         */
        this.getMaterial = (materialType) => {
            return _materials.get(materialType) || null;
        };
        
        // ===============================================
        // 📏 ГЕОМЕТРИЧЕСКИЕ ОПЕРАЦИИ
        // ===============================================
        
        /**
         * 📏 Пересчет всех панелей (при изменении размеров)
         */
        this.recalculateGeometry = () => {
            for (const panel of _panels.values()) {
                if (panel.recalculateDimensions) {
                    panel.recalculateDimensions();
                }
            }
            
            this._emit('geometry-recalculated');
        };
        
        /**
         * 📊 Получить общую статистику шкафа
         * @returns {Object}
         */
        this.getStats = () => {
            return Object.freeze({
                dimensions: _dimensions,
                materialThickness: _materialThickness,
                panelsCount: _panels.size,
                sectionsCount: _sections.size,
                materialsCount: _materials.size,
                isGenerated: _isGenerated,
                volume: _dimensions.width * _dimensions.height * _dimensions.depth
            });
        };
        
        // ===============================================
        // 💾 СЕРИАЛИЗАЦИЯ
        // ===============================================
        
        this.getSpecificData = () => {
            return {
                dimensions: _dimensions,
                materialThickness: _materialThickness,
                isGenerated: _isGenerated,
                panels: Array.from(_panels.entries()).map(([key, panel]) => ({
                    key,
                    panel: panel.serialize()
                })),
                sections: Array.from(_sections.entries()).map(([key, section]) => ({
                    key,
                    section: section.serialize()
                })),
                materials: Array.from(_materials.entries()).map(([key, material]) => ({
                    key,
                    material: material.serialize()
                })),
                stats: this.getStats()
            };
        };
        
        // ===============================================
        // 🔒 ФИНАЛЬНАЯ ЗАЩИТА
        // ===============================================
        
        // Замораживаем методы
        Object.freeze(this.generate);
        Object.freeze(this.getPanel);
        Object.freeze(this.getPanels);
        Object.freeze(this.getSection);
        Object.freeze(this.getSections);
        Object.freeze(this.getMaterial);
        Object.freeze(this.recalculateGeometry);
        Object.freeze(this.getStats);
        
        // Финальная защита
        Object.preventExtensions(this);
    }
    
    // ===============================================
    // 🏭 СТАТИЧЕСКИЕ МЕТОДЫ
    // ===============================================
    
    /**
     * 🚀 Быстрое создание стандартного шкафа
     * @param {number} width 
     * @param {number} height 
     * @param {number} depth 
     * @returns {Cabinet}
     */
    static createStandard(width = 800, height = 2000, depth = 600) {
        const cabinet = new Cabinet({
            width,
            height,
            depth,
            baseHeight: 100
        });
        
        cabinet.generate();
        return cabinet;
    }
}

console.log('🏗️ Cabinet entity loaded');
