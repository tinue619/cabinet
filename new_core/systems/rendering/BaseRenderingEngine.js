/**
 * 🎨 БАЗОВЫЙ ДВИЖОК РЕНДЕРИНГА
 * SYSTEM LAYER: Rendering Infrastructure  
 * ОТВЕТСТВЕННОСТЬ: ЕДИНЫЙ источник логики рендеринга для всех UI компонентов
 * Архитектурная Зигота v3.1
 */

"use strict";

import { CABINET_DNA } from '../../cabinet-dna.js';

/**
 * 🏗️ БАЗОВЫЙ ДВИЖОК РЕНДЕРИНГА
 * Инкапсулирует общую логику отрисовки панелей
 * Используется всеми UI рендерерами для обеспечения консистентности
 */
export class BaseRenderingEngine {
    
    constructor() {
        // 🔒 Приватные константы рендеринга
        this._constants = Object.freeze({
            MIN_STROKE_WIDTH: 0.5,
            MAX_PANEL_THICKNESS_PX: 12,
            MIN_PANEL_THICKNESS_PX: 2,
            DEFAULT_PANEL_THICKNESS: CABINET_DNA.CONSTANTS.DEFAULT_PANEL_THICKNESS,
            LABEL_MIN_WIDTH: 60,
            LABEL_MIN_HEIGHT: 30
        });
        
        // 🎨 Базовая цветовая схема панелей
        this._panelColors = Object.freeze({
            'LEFT_SIDE': '#4a9eff',      // Синий
            'RIGHT_SIDE': '#4a9eff',     // Синий  
            'TOP': '#34d399',            // Зеленый
            'BOTTOM': '#34d399',         // Зеленый
            'FRONT_BASE': '#f59e0b',     // Оранжевый
            'BACK_BASE': '#f59e0b',      // Оранжевый
            'BACK_WALL': '#8b5cf6',      // Фиолетовый
            'FACADE': '#ef4444',         // Красный
            'default': '#6b7280'         // Серый
        });
        
        // Блокируем модификацию
        Object.freeze(this);
    }
    
    // ===============================================
    // 🎯 ПУБЛИЧНЫЕ МЕТОДЫ - ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ
    // ===============================================
    
    /**
     * 🔧 Вычисление пропорциональной толщины панели
     * ЕДИНСТВЕННЫЙ источник этой логики во всей системе
     * @param {number} realThickness - реальная толщина в пикселях (thickness * scale)
     * @param {number} scale - текущий масштаб отображения
     * @returns {number} пропорциональная толщина в пикселях
     */
    calculateProportionalThickness(realThickness, scale = 1) {
        if (typeof realThickness !== 'number' || realThickness < 0) {
            throw new Error('BaseRenderingEngine: realThickness must be a positive number');
        }
        
        // 🎯 КЛЮЧЕВАЯ ФОРМУЛА ИСПРАВЛЕНИЯ ТОРЦОВ:
        // Минимум для читаемости, максимум для красоты, пропорциональность для реализма
        return Math.max(
            this._constants.MIN_PANEL_THICKNESS_PX,
            Math.min(realThickness, this._constants.MAX_PANEL_THICKNESS_PX)
        );
    }
    
    /**
     * 🖊️ Вычисление пропорциональной толщины обводки
     * @param {number} baseWidth - базовая толщина линии
     * @param {number} scale - текущий масштаб отображения  
     * @returns {number} пропорциональная толщина обводки
     */
    calculateProportionalStroke(baseWidth, scale = 1) {
        if (typeof baseWidth !== 'number' || baseWidth <= 0) {
            throw new Error('BaseRenderingEngine: baseWidth must be a positive number');
        }
        
        return Math.max(this._constants.MIN_STROKE_WIDTH, baseWidth / scale);
    }
    
    /**
     * 🎨 Получение цвета панели по типу
     * @param {string} panelType - тип панели (LEFT_SIDE, RIGHT_SIDE, etc.)
     * @returns {string} HEX цвет панели
     */
    getPanelColor(panelType) {
        return this._panelColors[panelType] || this._panelColors.default;
    }
    
    /**
     * 📏 Проверка минимальных размеров для отображения подписи
     * @param {number} width - ширина элемента в пикселях
     * @param {number} height - высота элемента в пикселях
     * @returns {boolean} можно ли показывать подпись
     */
    shouldShowLabel(width, height) {
        return width >= this._constants.LABEL_MIN_WIDTH && 
               height >= this._constants.LABEL_MIN_HEIGHT;
    }
    
    /**
     * 🔍 Вычисление автоматического масштабирования
     * @param {Object} containerSize - {width, height} размер контейнера
     * @param {Object} contentSize - {width, height} размер содержимого
     * @param {number} padding - отступы в пикселях
     * @param {number} maxScale - максимальный масштаб
     * @returns {Object} {scale, offsetX, offsetY}
     */
    calculateAutoScale(containerSize, contentSize, padding = 60, maxScale = 2.0) {
        const availableWidth = containerSize.width - (padding * 2);
        const availableHeight = containerSize.height - (padding * 2);
        
        const scaleX = availableWidth / contentSize.width;
        const scaleY = availableHeight / contentSize.height;
        const scale = Math.min(scaleX, scaleY, maxScale);
        
        const scaledWidth = contentSize.width * scale;
        const scaledHeight = contentSize.height * scale;
        
        const offsetX = (containerSize.width - scaledWidth) / 2;
        const offsetY = (containerSize.height - scaledHeight) / 2;
        
        return { scale, offsetX, offsetY };
    }
    
    /**
     * 🎨 Стандартный рендеринг прямоугольной панели
     * Базовый метод для всех типов панелей
     * @param {CanvasRenderingContext2D} ctx - контекст canvas
     * @param {Object} panelData - данные панели {x, y, width, height, type}
     * @param {number} scale - масштаб отображения
     * @param {Object} options - опции рендеринга
     */
    renderStandardPanel(ctx, panelData, scale, options = {}) {
        if (!ctx || !panelData) {
            throw new Error('BaseRenderingEngine: ctx and panelData are required');
        }
        
        const { x, y, width, height, type } = panelData;
        const {
            fillColor = null,
            strokeWidth = 2,
            showFill = false,
            showStroke = true,
            showLabel = false,
            labelText = type
        } = options;
        
        // Вычисляем пропорциональные размеры
        const proportionalStroke = this.calculateProportionalStroke(strokeWidth, scale);
        const color = fillColor || this.getPanelColor(type);
        
        ctx.save();
        
        // Заливка (если нужна)
        if (showFill) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }
        
        // Обводка (если нужна)
        if (showStroke) {
            ctx.strokeStyle = color;
            ctx.lineWidth = proportionalStroke;
            ctx.strokeRect(x, y, width, height);
        }
        
        // Подпись (если нужна и помещается)
        if (showLabel && this.shouldShowLabel(width, height)) {
            const fontSize = Math.max(10, 12 / scale);
            ctx.fillStyle = '#333';
            ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, x + width/2, y + height/2);
        }
        
        ctx.restore();
    }
    
    /**
     * 📊 Информация о движке
     * @returns {Object} метаданные движка
     */
    getEngineInfo() {
        return Object.freeze({
            name: 'BaseRenderingEngine',
            version: '3.1.0',
            responsibility: 'Unified rendering logic for all UI components',
            compliance: 'Cabinet DNA v3.0 + Architectural Zygote v3.1',
            constants: this._constants,
            supportedPanelTypes: Object.keys(this._panelColors)
        });
    }
    
    // ===============================================
    // 🔒 ГЕТТЕРЫ (только чтение)
    // ===============================================
    
    get constants() {
        return Object.freeze({ ...this._constants });
    }
    
    get panelColors() {
        return Object.freeze({ ...this._panelColors });
    }
}

// ===============================================
// 🏭 СТАТИЧЕСКИЕ УТИЛИТЫ
// ===============================================

/**
 * 🏭 Фабрика для создания единого экземпляра движка
 * Реализует паттерн Singleton для обеспечения консистентности
 */
BaseRenderingEngine.instance = null;

BaseRenderingEngine.getInstance = () => {
    if (!BaseRenderingEngine.instance) {
        BaseRenderingEngine.instance = new BaseRenderingEngine();
    }
    return BaseRenderingEngine.instance;
};

// Финальная защита
Object.freeze(BaseRenderingEngine);
Object.freeze(BaseRenderingEngine.prototype);

console.log('🎨 BaseRenderingEngine loaded - unified rendering logic established');
