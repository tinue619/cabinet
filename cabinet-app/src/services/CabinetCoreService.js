/**
 * Cabinet Core Service
 * Адаптер для работы с архитектурным ядром
 * Изолирует приложение от деталей реализации ядра
 */

import { CORE_PATH } from '../config.js';

// Динамический импорт ядра
let SystemFactory;

// Загрузка ядра
async function loadCore() {
    try {
        console.log('🚀 Loading core from:', CORE_PATH);
        const module = await import(CORE_PATH);
        console.log('✅ Core loaded successfully:', module);
        SystemFactory = module.SystemFactory;
        return SystemFactory;
    } catch (error) {
        console.error('❌ Failed to load core:', error);
        throw new Error(`Failed to load Cabinet Core from "${CORE_PATH}": ${error.message}`);
    }
}

export class CabinetCoreService {
    constructor() {
        this.system = null;
        this.cabinet = null;
        this.materials = {};
    }
    
    /**
     * Инициализация сервиса
     */
    async initialize() {
        try {
            // Загружаем ядро если еще не загружено
            if (!SystemFactory) {
                await loadCore();
            }
            
            // Создаем систему через фабрику
            this.system = SystemFactory.create({
                enableEvents: true,
                enableValidation: true,
                debugMode: false
            });
            
            // Создаем базовые материалы
            this.materials = {
                ldsp16: this.system.createLDSP16(),
                hdf3: this.system.createHDF3(),
                mdf16: this.system.createMDF16()
            };
            
            console.log('Cabinet Core Service initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize Cabinet Core Service:', error);
            throw error;
        }
    }
    
    /**
     * Создать новый шкаф
     * @param {Object} params - параметры шкафа из UI
     */
    createCabinet(params) {
        // Валидация параметров на уровне сервиса
        this.validateCabinetParams(params);
        
        // Создаем шкаф через систему
        this.cabinet = this.system.createCabinet({
            width: params.width,
            height: params.height,
            depth: params.depth,
            baseHeight: params.baseHeight || 100
        });
        
        // Генерируем панели
        this.cabinet.generate();
        
        return this.getCabinetData();
    }
    
    /**
     * Получить данные текущего шкафа в формате для UI
     */
    getCabinetData() {
        if (!this.cabinet) return null;
        
        return {
            id: this.cabinet.id,
            dimensions: this.extractDimensions(),
            panels: this.extractPanels(),
            sections: this.extractSections(),
            stats: this.extractStats()
        };
    }
    
    /**
     * Извлечь размеры (безопасно)
     */
    extractDimensions() {
        if (!this.cabinet || !this.cabinet.dimensions) return null;
        
        const dims = this.cabinet.dimensions;
        return {
            width: dims.width,
            height: dims.height,
            depth: dims.depth,
            baseHeight: dims.baseHeight
        };
    }
    
    /**
     * Извлечь панели (безопасно)
     */
    extractPanels() {
        if (!this.cabinet || !this.cabinet.getPanels) return [];
        
        try {
            const panels = this.cabinet.getPanels();
            return panels.map(panel => ({
                id: panel.id,
                name: panel.name,
                type: panel.panelType,
                material: panel.material ? panel.material.name : 'Unknown',
                dimensions: panel.dimensions ? {
                    width: panel.dimensions.width,
                    height: panel.dimensions.height,
                    thickness: panel.dimensions.thickness
                } : null,
                position: panel.position ? {
                    x: panel.position.x,
                    y: panel.position.y,
                    z: panel.position.z
                } : null
            }));
        } catch (error) {
            console.error('Error extracting panels:', error);
            return [];
        }
    }
    
    /**
     * Извлечь секции (безопасно)
     */
    extractSections() {
        if (!this.cabinet || !this.cabinet.getSections) return [];
        
        try {
            const sections = this.cabinet.getSections();
            return sections.map(section => ({
                id: section.id,
                bounds: section.bounds ? {
                    x: section.bounds.x,
                    y: section.bounds.y,
                    width: section.bounds.width,
                    height: section.bounds.height
                } : null,
                isEmpty: section.isEmpty
            }));
        } catch (error) {
            console.error('Error extracting sections:', error);
            return [];
        }
    }
    
    /**
     * Извлечь статистику
     */
    extractStats() {
        if (!this.cabinet || !this.cabinet.getStats) {
            return {
                panelsCount: 0,
                sectionsCount: 0,
                volume: 0
            };
        }
        
        try {
            const stats = this.cabinet.getStats();
            const dims = this.extractDimensions();
            
            return {
                panelsCount: stats.panelsCount || 0,
                sectionsCount: stats.sectionsCount || 0,
                volume: dims ? (dims.width * dims.height * dims.depth) / 1000000000 : 0
            };
        } catch (error) {
            console.error('Error extracting stats:', error);
            return {
                panelsCount: 0,
                sectionsCount: 0,
                volume: 0
            };
        }
    }
    
    /**
     * Добавить полку в секцию
     * @param {string} sectionId - ID секции
     * @param {number} position - позиция полки
     */
    addShelf(sectionId, position) {
        // TODO: Реализовать через ядро
        throw new Error('Not implemented yet');
    }
    
    /**
     * Добавить стойку в секцию
     * @param {string} sectionId - ID секции
     * @param {number} position - позиция стойки
     */
    addDivider(sectionId, position) {
        // TODO: Реализовать через ядро
        throw new Error('Not implemented yet');
    }
    
    /**
     * Валидация параметров шкафа
     */
    validateCabinetParams(params) {
        const errors = [];
        
        if (!params.width || params.width < 400 || params.width > 2000) {
            errors.push('Ширина должна быть от 400 до 2000 мм');
        }
        
        if (!params.height || params.height < 600 || params.height > 3000) {
            errors.push('Высота должна быть от 600 до 3000 мм');
        }
        
        if (!params.depth || params.depth < 300 || params.depth > 800) {
            errors.push('Глубина должна быть от 300 до 800 мм');
        }
        
        if (params.baseHeight && (params.baseHeight < 60 || params.baseHeight > 200)) {
            errors.push('Высота цоколя должна быть от 60 до 200 мм');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('; '));
        }
    }
    
    /**
     * Экспорт данных шкафа
     */
    exportToJSON() {
        const data = this.getCabinetData();
        if (!data) {
            throw new Error('No cabinet to export');
        }
        
        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            cabinet: data
        };
    }
    
    /**
     * Получить информацию о системе
     */
    getSystemInfo() {
        if (!this.system) return null;
        
        return this.system.getStats();
    }
}