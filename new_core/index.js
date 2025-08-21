// 🧬 АРХИТЕКТУРНАЯ ЗИГОТА - Точка входа v3.1
// Экспорт всей системы с полной инкапсуляцией

"use strict";

// ===============================================
// 🧬 ИМПОРТ КОМПОНЕНТОВ ЯДРА
// ===============================================

// 🔧 Ядро системы
import { CABINET_DNA } from './cabinet-dna.js';
import { ArchitecturalBase } from './core/ArchitecturalBase.js';
import { ArchitecturalGuardian } from './core/ArchitecturalGuardian.js';
import { EventSystem, GlobalEventSystem } from './core/EventSystem.js';

// 🎨 Системы управления
import { BaseRenderingEngine } from './systems/rendering/BaseRenderingEngine.js';

// 🧱 Базовые сущности
import { Material } from './entities/Material.js';
import { Panel } from './entities/Panel.js';
import { Section } from './entities/Section.js';
import { Cabinet } from './entities/Cabinet.js';

// ===============================================
// 🏭 ФАБРИКА СИСТЕМЫ ШКАФОВ
// ===============================================

/**
 * 🏭 ГЛАВНАЯ ФАБРИКА СИСТЕМЫ
 * Создает и настраивает экземпляры системы управления шкафами
 * Обеспечивает правильную инициализацию всех компонентов
 */
export class CabinetSystemFactory {
    constructor() {
        // Фабрика должна быть синглтоном
        if (CabinetSystemFactory._instance) {
            return CabinetSystemFactory._instance;
        }
        CabinetSystemFactory._instance = this;
        
        // 🔒 Приватные данные фабрики
        let _instances = new Map(); // созданные системы
        let _defaultConfig = Object.freeze({
            enableEvents: true,
            enableHistory: true,
            enableValidation: true,
            maxHistorySize: 1000,
            debugMode: false
        });
        
        // ===============================================
        // 🏭 МЕТОДЫ СОЗДАНИЯ
        // ===============================================
        
        /**
         * 🎯 Создание новой системы управления шкафами
         * @param {Object} config - конфигурация системы
         * @returns {Object} - настроенная система
         */
        this.create = (config = {}) => {
            const systemConfig = { ..._defaultConfig, ...config };
            const systemId = `cabinet_system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Проверяем ДНК системы
            this._validateDNA();
            
            // Создаем экземпляр системы
            const system = this._createSystemInstance(systemId, systemConfig);
            
            // Регистрируем систему
            _instances.set(systemId, {
                system,
                config: systemConfig,
                created: Date.now()
            });
            
            console.log(`🏭 Created cabinet system: ${systemId}`);
            return system;
        };
        
        /**
         * 🏗️ Создание экземпляра системы
         * @private
         */
        this._createSystemInstance = (systemId, config) => {
            // Создаем событийную систему для этого экземпляра
            const eventSystem = config.enableEvents ? new EventSystem() : null;
            
            // Создаем страж архитектуры
            const guardian = new ArchitecturalGuardian();
            
            // Возвращаем объект системы
            const system = Object.freeze({
                id: systemId,
                config: Object.freeze({ ...config }),
                events: eventSystem,
                guardian: guardian,
                
                // ===============================================
                // 🧱 ФАБРИЧНЫЕ МЕТОДЫ МАТЕРИАЛОВ
                // ===============================================
                
                /**
                 * 🧱 Создать материал ЛДСП 16мм
                 * @returns {Material}
                 */
                createLDSP16: () => {
                    const material = Material.createLDSP16();
                    this._setupMaterialEvents(material, eventSystem);
                    return material;
                },
                
                /**
                 * 🧱 Создать материал ХДФ 3мм  
                 * @returns {Material}
                 */
                createHDF3: () => {
                    const material = Material.createHDF3();
                    this._setupMaterialEvents(material, eventSystem);
                    return material;
                },
                
                /**
                 * 🧱 Создать материал МДФ 16мм
                 * @returns {Material}
                 */
                createMDF16: () => {
                    const material = Material.createMDF16();
                    this._setupMaterialEvents(material, eventSystem);
                    return material;
                },
                
                // ===============================================
                // 📐 ФАБРИЧНЫЕ МЕТОДЫ ПАНЕЛЕЙ
                // ===============================================
                
                /**
                 * 📐 Создать панель
                 * @param {string} panelType - тип панели
                 * @param {Material} material - материал панели
                 * @param {Cabinet} cabinet - шкаф
                 * @returns {Panel}
                 */
                createPanel: (panelType, material, cabinet) => {
                    if (!cabinet) {
                        throw new Error('Panel requires a Cabinet instance');
                    }
                    
                    const panel = new Panel(panelType, material, cabinet);
                    this._setupPanelEvents(panel, eventSystem);
                    return panel;
                },
                
                /**
                 * 🏗️ Создать шкаф
                 * @param {Object} dimensions - размеры {width, height, depth, baseHeight}
                 * @param {Object} options - опции создания
                 * @returns {Cabinet}
                 */
                createCabinet: (dimensions, options = {}) => {
                    const cabinet = new Cabinet(dimensions, options);
                    this._setupCabinetEvents(cabinet, eventSystem);
                    return cabinet;
                },
                
                /**
                 * 📐 Создать секцию
                 * @param {Object} bounds - границы секции
                 * @param {Cabinet} cabinet - родительский шкаф
                 * @returns {Section}
                 */
                createSection: (bounds, cabinet) => {
                    const section = new Section(bounds, cabinet);
                    this._setupSectionEvents(section, eventSystem);
                    return section;
                },
                
                // ===============================================
                // 📊 МЕТОДЫ УПРАВЛЕНИЯ
                // ===============================================
                
                /**
                 * 📊 Получить статистику системы
                 * @returns {Object}
                 */
                getStats: () => {
                    return Object.freeze({
                        systemId,
                        created: _instances.get(systemId)?.created,
                        config: config,
                        events: eventSystem?.getStats() || null,
                        validation: guardian.getViolationReport(),
                        dna: CABINET_DNA.SIGNATURE
                    });
                },
                
                /**
                 * 🔍 Валидация системы
                 * @returns {Object}
                 */
                validate: () => {
                    return {
                        dna: this._validateDNA(),
                        guardian: guardian.getViolationReport(),
                        system: 'OK'
                    };
                },
                
                /**
                 * 🧹 Сброс системы
                 */
                reset: () => {
                    if (eventSystem) {
                        eventSystem.reset();
                    }
                    console.log(`🧹 System ${systemId} reset`);
                }
            });
            
            return system;
        };
        
        /**
         * 🔗 Настройка событий для шкафа
         * @private
         */
        this._setupCabinetEvents = (cabinet, eventSystem) => {
            if (!eventSystem) return;
            
            cabinet.on('cabinet-generated', (event) => {
                eventSystem.emitNamespace('cabinets', 'cabinet-generated', {
                    cabinetId: cabinet.id,
                    ...event.data
                });
            });
            
            cabinet.on('geometry-recalculated', (event) => {
                eventSystem.emitNamespace('cabinets', 'cabinet-geometry-changed', {
                    cabinetId: cabinet.id,
                    ...event.data
                });
            });
        };
        
        /**
         * 🔗 Настройка событий для секции
         * @private
         */
        this._setupSectionEvents = (section, eventSystem) => {
            if (!eventSystem) return;
            
            section.on('content-added', (event) => {
                eventSystem.emitNamespace('sections', 'section-content-added', {
                    sectionId: section.id,
                    ...event.data
                });
            });
        };
        
        /**
         * 🔗 Настройка событий для материала
         * @private
         */
        this._setupMaterialEvents = (material, eventSystem) => {
            if (!eventSystem) return;
            
            // Подписываемся на события материала
            material.on('property-changed', (event) => {
                eventSystem.emitNamespace('materials', 'material-property-changed', {
                    materialId: material.id,
                    ...event.data
                });
            });
        };
        
        /**
         * 🔗 Настройка событий для панели
         * @private
         */
        this._setupPanelEvents = (panel, eventSystem) => {
            if (!eventSystem) return;
            
            // Подписываемся на события панели
            panel.on('dimensions-recalculated', (event) => {
                eventSystem.emitNamespace('panels', 'panel-dimensions-changed', {
                    panelId: panel.id,
                    panelType: panel.panelType,
                    ...event.data
                });
            });
            
            panel.on('panel-connected', (event) => {
                eventSystem.emitNamespace('panels', 'panels-connected', {
                    panelId: panel.id,
                    ...event.data
                });
            });
        };
        
        /**
         * ✅ Валидация ДНК системы
         * @private
         */
        this._validateDNA = () => {
            const signature = CABINET_DNA.SIGNATURE;
            
            if (signature.integrity !== 'VERIFIED') {
                throw new Error('Cabinet DNA integrity check failed');
            }
            
            if (signature.laws !== 9) {
                throw new Error('Cabinet DNA laws count mismatch');
            }
            
            if (!signature.checksum.includes('CABINET_DNA_v3')) {
                throw new Error('Cabinet DNA version mismatch');
            }
            
            return true;
        };
        
        // ===============================================
        // 📋 МЕТОДЫ УПРАВЛЕНИЯ ЭКЗЕМПЛЯРАМИ
        // ===============================================
        
        /**
         * 📋 Получить все созданные системы
         * @returns {Object[]}
         */
        this.getInstances = () => {
            return Array.from(_instances.values()).map(instance => ({
                id: instance.system.id,
                created: instance.created,
                config: instance.config
            }));
        };
        
        /**
         * 🔍 Получить систему по ID
         * @param {string} systemId
         * @returns {Object|null}
         */
        this.getInstance = (systemId) => {
            return _instances.get(systemId)?.system || null;
        };
        
        /**
         * 🗑️ Удалить систему
         * @param {string} systemId
         * @returns {boolean}
         */
        this.destroyInstance = (systemId) => {
            const instance = _instances.get(systemId);
            if (instance) {
                instance.system.reset();
                _instances.delete(systemId);
                console.log(`🗑️ Destroyed system: ${systemId}`);
                return true;
            }
            return false;
        };
        
        // Финальная защита
        Object.freeze(this);
    }
}

// ===============================================
// 🌐 ГЛОБАЛЬНЫЕ ЭКСПОРТЫ
// ===============================================

// Создаем единственный экземпляр фабрики
export const SystemFactory = new CabinetSystemFactory();

// Экспортируем ключевые компоненты для прямого использования
export {
    CABINET_DNA,
    ArchitecturalBase,
    ArchitecturalGuardian,
    EventSystem,
    GlobalEventSystem,
    BaseRenderingEngine,
    Material,
    Panel,
    Section,
    Cabinet
};

// ===============================================
// 🚀 БЫСТРЫЙ СТАРТ
// ===============================================

/**
 * 🚀 Функция быстрого старта для демонстрации
 * @param {Object} config - конфигурация
 * @returns {Object} - готовая к использованию система
 */
export function quickStart(config = {}) {
    console.log('🧬 Starting Architectural Zygote...');
    
    // Создаем систему
    const system = SystemFactory.create({
        enableEvents: true,
        enableValidation: true,
        debugMode: true,
        ...config
    });
    
    // Создаем базовые материалы
    const ldsp16 = system.createLDSP16();
    const hdf3 = system.createHDF3();
    const mdf16 = system.createMDF16();
    
    console.log('🧱 Materials created:', {
        ldsp16: ldsp16.name,
        hdf3: hdf3.name,
        mdf16: mdf16.name
    });
    
    // Создаем тестовый шкаф
    const cabinet = system.createCabinet({
        width: 800,
        height: 2000,
        depth: 600,
        baseHeight: 100
    });
    
    cabinet.generate();
    
    console.log('🏗️ Test cabinet created:', cabinet.getStats());
    
    // Возвращаем готовую систему
    return {
        system,
        materials: { ldsp16, hdf3, mdf16 },
        cabinet,
        stats: system.getStats()
    };
}

// ===============================================
// 🔒 ФИНАЛЬНАЯ ПРОВЕРКА
// ===============================================

console.log('🧬 Architectural Zygote v3.1 loaded');
console.log('📊 DNA Signature:', CABINET_DNA.SIGNATURE);
console.log('🏭 System Factory ready');
console.log('📡 Global Event System ready');

// Проверяем целостность при загрузке
try {
    const testFactory = new CabinetSystemFactory();
    testFactory._validateDNA();
    console.log('✅ System integrity check passed');
} catch (error) {
    console.error('❌ System integrity check failed:', error.message);
}
